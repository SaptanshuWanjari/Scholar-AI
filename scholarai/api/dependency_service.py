"""Concept Dependency Engine — a directed prerequisite graph.

Runs an LLM over indexed document chunks to extract concepts and the
*learning order* between them (which concept must be understood before
another), then persists them as DepConcept + DependencyEdge rows.

Unlike ``knowledge_service.build_graph`` (which wipes and rebuilds the
knowledge graph), this engine **upserts concepts by (name, course)** so their
ids stay stable — performance rows (TopicStat, Deck, ...) reference those ids
for exact mastery rollup and would break if the ids churned.
"""

from __future__ import annotations

import heapq
from langchain_core.messages import HumanMessage, SystemMessage

from scholarai.llm import get_llm
from scholarai.rag.prompts import DEPENDENCY_EXTRACTION_SYSTEM
from scholarai.storage import get_session
from scholarai.storage.models import (
    DepConcept,
    DependencyEdge,
    Document,
    PYQQuestion,
)
from scholarai.storage.vectors import get_document_chunks

from . import mastery_service, parsers

# Prerequisite is "unmet" when its mastery is in one of these states.
_UNMET = {"Weak", "Unknown", "Needs Revision"}


def _extract_for_text(sample: str) -> list[dict]:
    llm = get_llm("deep_analysis")
    resp = llm.invoke(
        [SystemMessage(content=DEPENDENCY_EXTRACTION_SYSTEM), HumanMessage(content=sample)]
    )
    return parsers.parse_dependencies(getattr(resp, "content", str(resp)))


def _norm(name: str) -> str:
    return name.strip().lower()


def build(course: str | None = None, max_documents: int = 8) -> dict:
    """Extract concepts + prerequisites from up to ``max_documents`` and persist.

    Concepts are upserted by (name, course); prerequisite edges for the course
    are rebuilt. Cycles are broken and topological depth recomputed. Returns
    ``{"concepts": N, "edges": E}``.
    """
    session = get_session()
    try:
        from scholarai.storage.models import Course
        q = session.query(Document)
        if course:
            q = q.join(Course).filter(Course.name == course)
        docs = q.all()
        docs = docs[:max_documents]

        # Aggregate concepts across documents.
        # norm(name) -> {name, definition, difficulty, importance, est, prereqs:set(norm)}
        agg: dict[str, dict] = {}
        for doc in docs:
            chunks = get_document_chunks(doc.id)
            if not chunks:
                continue
            sample = "\n\n".join(ch.get("text", "") for ch in chunks)[:6000]
            for c in _extract_for_text(sample):
                key = _norm(c["name"])
                entry = agg.setdefault(
                    key,
                    {
                        "name": c["name"],
                        "definition": c["definition"],
                        "difficulty": c["difficulty"],
                        "importance": c["importance"],
                        "est": c["estStudyTimeMin"],
                        "prereqs": set(),
                    },
                )
                if not entry["definition"] and c["definition"]:
                    entry["definition"] = c["definition"]
                entry["importance"] = max(entry["importance"], c["importance"])
                entry["est"] = entry["est"] or c["estStudyTimeMin"]
                for p in c["prerequisites"]:
                    if _norm(p) != key:
                        entry["prereqs"].add(_norm(p))

        if not agg:
            return {"concepts": 0, "edges": 0}

        # Ensure every referenced prerequisite exists as a concept too.
        for entry in list(agg.values()):
            for pk in entry["prereqs"]:
                agg.setdefault(
                    pk,
                    {
                        "name": pk.title(),
                        "definition": "",
                        "difficulty": "Medium",
                        "importance": 0.5,
                        "est": 0,
                        "prereqs": set(),
                    },
                )

        course_val = course or ""

        # Upsert concepts by (name, course); keep stable ids.
        existing = {
            _norm(c.name): c
            for c in session.query(DepConcept).filter(DepConcept.course == course_val).all()
        }
        key_to_id: dict[str, int] = {}
        for key, entry in agg.items():
            concept = existing.get(key)
            if concept is None:
                concept = DepConcept(name=entry["name"], course=course_val)
                session.add(concept)
            concept.definition = entry["definition"] or concept.definition
            concept.difficulty = entry["difficulty"]
            concept.importance = entry["importance"]
            concept.est_study_time_min = entry["est"] or concept.est_study_time_min
            session.flush()
            key_to_id[key] = concept.id

        # Rebuild this course's prerequisite edges from scratch.
        ids = list(key_to_id.values())
        if ids:
            session.query(DependencyEdge).filter(
                DependencyEdge.concept_id.in_(ids)
            ).delete(synchronize_session=False)

        importances: dict[int, float] = {}
        edge_rows: list[tuple[int, int]] = []
        for key, entry in agg.items():
            cid = key_to_id[key]
            importances[cid] = entry["importance"]
            for pk in entry["prereqs"]:
                pid = key_to_id.get(pk)
                if pid is None or pid == cid:
                    continue
                edge_rows.append((pid, cid))

        edge_rows = list(set(edge_rows))  # deduplicate
        edge_rows = _break_cycles(edge_rows, importances)

        for pid, cid in edge_rows:
            session.add(DependencyEdge(prereq_id=pid, concept_id=cid))

        # Topological depth = longest prerequisite chain length.
        depth = _compute_depth(ids, edge_rows)
        for key, cid in key_to_id.items():
            concept = session.get(DepConcept, cid)
            if concept:
                concept.depth = depth.get(cid, 0)

        session.commit()
        return {"concepts": len(key_to_id), "edges": len(edge_rows)}
    finally:
        session.close()


def _break_cycles(edges: list[tuple[int, int]], importances: dict[int, float]) -> list[tuple[int, int]]:
    """Detects and breaks cycles by dropping the edge with the lowest combined importance."""
    adj: dict[int, set[int]] = {}
    for u, v in edges:
        adj.setdefault(u, set()).add(v)

    def find_cycle() -> list[tuple[int, int]] | None:
        visited = set()
        stack = []
        in_stack = set()
        parent = {}

        def dfs(node: int) -> list[tuple[int, int]] | None:
            visited.add(node)
            stack.append(node)
            in_stack.add(node)

            for neighbor in adj.get(node, []):
                if neighbor not in visited:
                    parent[neighbor] = node
                    cycle = dfs(neighbor)
                    if cycle:
                        return cycle
                elif neighbor in in_stack:
                    cycle_edges = [(node, neighbor)]
                    curr = node
                    while curr != neighbor:
                        p = parent[curr]
                        cycle_edges.append((p, curr))
                        curr = p
                    return cycle_edges

            stack.pop()
            in_stack.remove(node)
            return None

        for node in list(adj.keys()):
            if node not in visited:
                cycle = dfs(node)
                if cycle:
                    return cycle
        return None

    while True:
        cycle = find_cycle()
        if not cycle:
            break
        
        def edge_weight(e: tuple[int, int]) -> float:
            return importances.get(e[0], 0.5) + importances.get(e[1], 0.5)

        weakest = min(cycle, key=edge_weight)
        adj[weakest[0]].remove(weakest[1])

    valid_edges = []
    for u, neighbors in adj.items():
        for v in neighbors:
            valid_edges.append((u, v))
    return valid_edges


def _compute_depth(ids: list[int], edges: list[tuple[int, int]]) -> dict[int, int]:
    """Longest path (in edges) from any root to each node = learning depth."""
    preds: dict[int, list[int]] = {i: [] for i in ids}
    for pid, cid in edges:
        preds[cid].append(pid)

    depth: dict[int, int] = {}

    def resolve(node: int, path: set[int]) -> int:
        if node in depth:
            return depth[node]
        if node in path:  # safety: cycles already broken, but never loop
            return 0
        path.add(node)
        d = 0 if not preds[node] else 1 + max(resolve(p, path) for p in preds[node])
        path.discard(node)
        depth[node] = d
        return d

    for i in ids:
        resolve(i, set())
    return depth


# ---------------------------------------------------------------------------
# Lookups used by the API + mastery service + write-path stamping.
# ---------------------------------------------------------------------------

def resolve_concept(name: str, course: str | None = None) -> int | None:
    """Case-insensitive (name, course) lookup. Used to stamp concept_id on
    performance rows. Returns the DepConcept id, or None if not found."""
    if not name or not name.strip():
        return None
    session = get_session()
    try:
        q = session.query(DepConcept)
        if course:
            q = q.filter(DepConcept.course == course)
        target = _norm(name)
        for c in q.all():
            if _norm(c.name) == target:
                return c.id
        return None
    finally:
        session.close()


def prerequisites(concept_id: int) -> list[DepConcept]:
    session = get_session()
    try:
        rows = (
            session.query(DependencyEdge)
            .filter(DependencyEdge.concept_id == concept_id)
            .all()
        )
        return [c for c in (session.get(DepConcept, e.prereq_id) for e in rows) if c]
    finally:
        session.close()


def dependents(concept_id: int) -> list[DepConcept]:
    session = get_session()
    try:
        rows = (
            session.query(DependencyEdge)
            .filter(DependencyEdge.prereq_id == concept_id)
            .all()
        )
        return [c for c in (session.get(DepConcept, e.concept_id) for e in rows) if c]
    finally:
        session.close()


def graph(course: str | None = None) -> dict:
    """Prerequisite graph as nodes + edges (for future visualization)."""
    session = get_session()
    try:
        cq = session.query(DepConcept)
        if course:
            cq = cq.filter(DepConcept.course == course)
        concepts = cq.all()
        ids = {c.id for c in concepts}
        nodes = [
            {
                "id": str(c.id),
                "label": c.name,
                "difficulty": c.difficulty,
                "importance": c.importance,
                "depth": c.depth,
            }
            for c in concepts
        ]
        edges = [
            {
                "id": f"d{e.prereq_id}-{e.concept_id}",
                "source": str(e.prereq_id),
                "target": str(e.concept_id),
                "label": "prerequisite",
            }
            for e in session.query(DependencyEdge).all()
            if e.prereq_id in ids and e.concept_id in ids
        ]
        return {"nodes": nodes, "edges": edges}
    finally:
        session.close()


def _pyq_frequency(name: str, course: str) -> int:
    """How often this concept appears as a PYQ topic (reuses existing PYQ data)."""
    session = get_session()
    try:
        target = _norm(name)
        q = session.query(PYQQuestion)
        if course:
            q = q.filter(PYQQuestion.course == course)
        return sum(1 for row in q.all() if _norm(row.topic) == target)
    finally:
        session.close()


def _link(concept: DepConcept) -> dict:
    return {
        "id": str(concept.id),
        "name": concept.name,
        "difficulty": concept.difficulty,
        "masteryStatus": mastery_service.mastery(concept.id)["status"],
    }


def inspector(concept_id: int) -> dict | None:
    """Full dependency inspector: metadata + mastery + prereqs + dependents."""
    session = get_session()
    try:
        c = session.get(DepConcept, concept_id)
        if not c:
            return None
        fields = {
            "name": c.name,
            "course": c.course,
            "definition": c.definition,
            "difficulty": c.difficulty,
            "importance": c.importance,
            "estStudyTimeMin": c.est_study_time_min,
            "depth": c.depth,
        }
    finally:
        session.close()

    m = mastery_service.mastery(concept_id)
    return {
        "id": str(concept_id),
        "name": fields["name"],
        "definition": fields["definition"],
        "difficulty": fields["difficulty"],
        "importance": fields["importance"],
        "estStudyTimeMin": fields["estStudyTimeMin"],
        "depth": fields["depth"],
        "pyqFrequency": _pyq_frequency(fields["name"], fields["course"]),
        "masteryStatus": m["status"],
        "masteryScore": m["score"],
        "prerequisites": [_link(p) for p in prerequisites(concept_id)],
        "dependents": [_link(d) for d in dependents(concept_id)],
    }


def readiness(topic: str, course: str | None = None) -> dict:
    """Check whether a topic's prerequisites are mastered enough to study it.

    Returns ``{concept, ready, missing[]}``. Unknown concept (graph not built or
    no match) is treated as ready=True with no prerequisites — generation should
    proceed normally.
    """
    cid = resolve_concept(topic, course)
    if cid is None:
        return {"concept": None, "ready": True, "missing": []}

    missing = []
    for p in prerequisites(cid):
        status = mastery_service.mastery(p.id)["status"]
        if status in _UNMET:
            missing.append(
                {
                    "id": str(p.id),
                    "name": p.name,
                    "masteryStatus": status,
                    "reason": f"{p.name} is a prerequisite ({status}).",
                }
            )
    session = get_session()
    try:
        c = session.get(DepConcept, cid)
        name = c.name if c else topic
    finally:
        session.close()
    return {"concept": name, "ready": len(missing) == 0, "missing": missing}


def learning_path(concept_id: int) -> list[dict]:
    """Find the optimal learning path to a target concept using Dijkstra's algorithm.
    
    Cost function prioritizes high importance, then low difficulty/time.
    Returns a sequence of concepts from a root down to the target concept.
    """
    session = get_session()
    try:
        target = session.get(DepConcept, concept_id)
        if not target:
            return []
            
        course = target.course
        concepts = {c.id: c for c in session.query(DepConcept).filter(DepConcept.course == course).all()}
        
        edges = session.query(DependencyEdge).all()
        # Create adjacency list for backwards traversal (target -> sources)
        adj: dict[int, list[int]] = {c_id: [] for c_id in concepts}
        in_degree: dict[int, int] = {c_id: 0 for c_id in concepts}
        
        for e in edges:
            if e.concept_id in adj and e.prereq_id in adj:
                adj[e.concept_id].append(e.prereq_id)
                in_degree[e.concept_id] += 1
                
        def node_cost(cid: int) -> float:
            c = concepts[cid]
            diff_w = 1.0 if c.difficulty == "Easy" else 2.0 if c.difficulty == "Medium" else 3.0
            time_w = (c.est_study_time_min or 0) / 30.0
            imp_w = (c.importance or 0) * 2.0
            return max(0.1, diff_w + time_w - imp_w)

        distances = {c_id: float('inf') for c_id in concepts}
        distances[concept_id] = node_cost(concept_id)
        previous = {c_id: None for c_id in concepts}
        
        pq = [(distances[concept_id], concept_id)]
        
        best_root = None
        min_root_dist = float('inf')
        
        while pq:
            curr_dist, u = heapq.heappop(pq)
            
            if curr_dist > distances[u]:
                continue
                
            if in_degree[u] == 0:
                if curr_dist < min_root_dist:
                    min_root_dist = curr_dist
                    best_root = u
            
            for v in adj[u]:
                alt = curr_dist + node_cost(v)
                if alt < distances[v]:
                    distances[v] = alt
                    previous[v] = u
                    heapq.heappush(pq, (alt, v))
                    
        if best_root is None:
            best_root = concept_id
            
        path = []
        curr = best_root
        while curr is not None:
            path.append(curr)
            curr = previous.get(curr)
            
        return [_link(concepts[cid]) for cid in path]
        
    finally:
        session.close()
