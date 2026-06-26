"""Knowledge-graph extraction.

Runs an LLM over indexed document chunks to extract concepts and their
relationships, then persists them as Concept + ConceptEdge rows. The graph is
fully rebuilt on each ``build`` so it stays consistent with the LLM output.
"""

from __future__ import annotations

import json
import re

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.llm import get_llm
from scholarcli.storage import get_session
from scholarcli.storage.models import Concept, ConceptEdge, Document, Notebook, Card, SavedQuiz, Diagram
from sqlalchemy import func
from scholarcli.storage.vectors import get_document_chunks, search

_CLUSTERS = ["rag", "agent", "infra", "eval"]

_EXTRACT_SYSTEM = """\
You are a knowledge-graph extractor for student study material. Read the text
and extract the key concepts and how they relate. Output ONLY a JSON array,
no prose. Each element must be:
  {"name": "Concept Name", "description": "one concise sentence", "related": ["Other Concept", ...]}
Rules:
- Extract 5 to 12 of the most important concepts.
- Keep names short (1-4 words), Title Case.
- "related" lists other concept names (ideally also in this array) it connects to.
- Output valid JSON only.\
"""


def _cluster_for(name: str) -> str:
    return _CLUSTERS[abs(hash(name)) % len(_CLUSTERS)]


def _size_for(ref_count: int) -> str:
    if ref_count >= 6:
        return "large"
    if ref_count >= 3:
        return "medium"
    return "small"


def _parse_concepts(text: str) -> list[dict]:
    """Extract a JSON array of concepts from the LLM output, defensively."""
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if not match:
        return []
    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError:
        return []
    out: list[dict] = []
    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict) and item.get("name"):
                out.append(
                    {
                        "name": str(item["name"]).strip()[:120],
                        "description": str(item.get("description", "")).strip(),
                        "related": [str(r).strip()[:120] for r in item.get("related", []) if r],
                    }
                )
    return out


def _extract_for_text(sample: str) -> list[dict]:
    llm = get_llm("deep_analysis")
    resp = llm.invoke(
        [SystemMessage(content=_EXTRACT_SYSTEM), HumanMessage(content=sample)]
    )
    return _parse_concepts(getattr(resp, "content", str(resp)))


def build_graph(course: str | None = None, max_documents: int = 8) -> dict:
    """Extract concepts from up to ``max_documents`` and persist the graph."""
    session = get_session()
    try:
        docs = session.query(Document).all()
        if course:
            docs = [d for d in docs if d.course and d.course.name == course]
        docs = docs[:max_documents]

        # Aggregate concepts across documents.
        # name -> {description, sources:set(doc_id), related:set(names)}
        agg: dict[str, dict] = {}
        for doc in docs:
            chunks = get_document_chunks(doc.id)
            if not chunks:
                continue
            sample = "\n\n".join(ch.get("text", "") for ch in chunks)[:6000]
            for c in _extract_for_text(sample):
                name = c["name"]
                entry = agg.setdefault(
                    name, {"description": c["description"], "sources": set(), "related": set()}
                )
                entry["sources"].add(doc.id)
                if not entry["description"] and c["description"]:
                    entry["description"] = c["description"]
                entry["related"].update(r for r in c["related"] if r != name)

        if not agg:
            return {"concepts": 0, "edges": 0}

        # Wipe the previous graph and rebuild.
        session.query(ConceptEdge).delete()
        session.query(Concept).delete()
        session.commit()

        # Ensure every referenced concept exists (related targets may be new).
        all_names = set(agg)
        for entry in agg.values():
            all_names.update(entry["related"])

        name_to_id: dict[str, int] = {}
        for name in all_names:
            entry = agg.get(name, {"description": "", "sources": set(), "related": set()})
            ref_count = len(entry["related"]) + len(entry["sources"]) + 1
            concept = Concept(
                name=name,
                description=entry["description"],
                definition=entry["description"],
                summary="",
                cluster=_cluster_for(name),
                course=course or "",
                ref_count=ref_count,
                source_count=max(1, len(entry["sources"])),
            )
            session.add(concept)
            session.flush()
            name_to_id[name] = concept.id

        edges = 0
        seen_pairs: set[tuple[int, int]] = set()
        for name, entry in agg.items():
            src = name_to_id[name]
            for rel in entry["related"]:
                tgt = name_to_id.get(rel)
                if tgt is None or tgt == src:
                    continue
                pair = (src, tgt)
                if pair in seen_pairs or (tgt, src) in seen_pairs:
                    continue
                seen_pairs.add(pair)
                session.add(ConceptEdge(source_id=src, target_id=tgt, relation="related"))
                edges += 1

        session.commit()
        return {"concepts": len(name_to_id), "edges": edges}
    finally:
        session.close()


def graph(course: str | None = None) -> dict:
    """Return the persisted graph as nodes + edges."""
    session = get_session()
    try:
        cq = session.query(Concept)
        if course:
            cq = cq.filter(Concept.course == course)
        concepts = cq.all()
        ids = {c.id for c in concepts}
        nodes = [
            {
                "id": str(c.id),
                "label": c.name,
                "description": c.description,
                "size": _size_for(c.ref_count),
                "refCount": c.ref_count,
                "sourceCount": c.source_count,
                "cluster": c.cluster,
            }
            for c in concepts
        ]
        edges = [
            {
                "id": f"e{e.source_id}-{e.target_id}",
                "source": str(e.source_id),
                "target": str(e.target_id),
                "label": e.relation,
            }
            for e in session.query(ConceptEdge).all()
            if e.source_id in ids and e.target_id in ids
        ]
        return {"nodes": nodes, "edges": edges}
    finally:
        session.close()


def inspector(concept_id: int) -> dict | None:
    session = get_session()
    try:
        c = session.get(Concept, concept_id)
        if not c:
            return None
        # Related concept names via edges in either direction.
        related: list[str] = []
        edges = session.query(ConceptEdge).filter(
            (ConceptEdge.source_id == c.id) | (ConceptEdge.target_id == c.id)
        ).all()
        for e in edges:
            peer = None
            if e.source_id == c.id:
                peer = e.target_id
            elif e.target_id == c.id:
                peer = e.source_id
            if peer is not None:
                pc = session.get(Concept, peer)
                if pc:
                    related.append(pc.name)
        confidence = round(min(0.99, 0.7 + c.ref_count * 0.03), 2)
        from sqlalchemy import cast, String
        notes_count = session.query(func.count(Notebook.id)).filter(cast(Notebook.blocks, String).ilike(f"%{c.name}%")).scalar() or 0
        flashcards_count = session.query(func.count(Card.id)).filter((Card.front.ilike(f"%{c.name}%")) | (Card.back.ilike(f"%{c.name}%"))).scalar() or 0
        quizzes_count = session.query(func.count(SavedQuiz.id)).filter(SavedQuiz.title.ilike(f"%{c.name}%")).scalar() or 0
        diagrams_count = session.query(func.count(Diagram.id)).filter((Diagram.title.ilike(f"%{c.name}%")) | (Diagram.mermaid.ilike(f"%{c.name}%"))).scalar() or 0

        import scholarcli.llm
        emb = scholarcli.llm.get_embeddings()
        vec = emb.embed_query(c.name)
        raw_cites = search(vec, top_k=5, course=c.course)
        citations = [
            {"id": str(i), "title": r.get("title", "Source"), "snippet": r.get("text", "")[:150]}
            for i, r in enumerate(raw_cites)
        ]

        return {
            "id": str(c.id),
            "name": c.name,
            "confidence": confidence,
            "refCount": c.ref_count,
            "sourceCount": c.source_count,
            "description": c.description,
            "definition": c.definition or c.description,
            "aiSummary": c.summary
            or f"{c.name} is referenced across {c.ref_count} artifacts in "
            f"{c.source_count} source documents.",
            "relatedConcepts": related[:8],
            "referencedIn": {
                "documents": c.source_count,
                "notes": notes_count,
                "flashcards": flashcards_count,
                "quizzes": quizzes_count,
                "answers": 0,
                "diagrams": diagrams_count,
            },
            "citations": citations,
        }
    finally:
        session.close()


def discover(concept_id: int) -> list[str]:
    data = inspector(concept_id)
    return data["relatedConcepts"] if data else []


def sidebar(course: str | None = None) -> dict:
    """Explorer side-panel data derived from the concept graph."""
    session = get_session()
    try:
        cq = session.query(Concept)
        if course:
            cq = cq.filter(Concept.course == course)
        concepts = cq.all()

        # Collections = concepts grouped by cluster.
        counts: dict[str, int] = {}
        for c in concepts:
            counts[c.cluster] = counts.get(c.cluster, 0) + 1
        collections = [
            {"id": f"col-{cl}", "label": cl.upper(), "count": n}
            for cl, n in sorted(counts.items(), key=lambda kv: -kv[1])
        ]

        # Recent concepts = highest-id (most recently extracted) names.
        recent = [c.name for c in sorted(concepts, key=lambda c: c.id, reverse=True)[:6]]

        return {
            "collections": collections,
            "recentConcepts": recent,
            "sourceFilters": ["Documents", "Notes", "Answers", "Flashcards", "Quizzes", "Diagrams"],
        }
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Manual curation — prune (delete) and merge synonymous concepts.
# ---------------------------------------------------------------------------

def delete_concept(concept_id: int) -> bool:
    """Remove a concept and any edges touching it."""
    session = get_session()
    try:
        concept = session.get(Concept, concept_id)
        if not concept:
            return False
        session.query(ConceptEdge).filter(
            (ConceptEdge.source_id == concept_id) | (ConceptEdge.target_id == concept_id)
        ).delete(synchronize_session=False)
        session.delete(concept)
        session.commit()
        return True
    finally:
        session.close()


def merge_concepts(keep_id: int, drop_id: int) -> dict | None:
    """Merge ``drop_id`` into ``keep_id``: repoint its edges, fold in its refs,
    then delete it. Returns the kept concept's inspector dict, or None if either
    id is missing / they're the same.
    """
    if keep_id == drop_id:
        return None
    session = get_session()
    try:
        keep = session.get(Concept, keep_id)
        drop = session.get(Concept, drop_id)
        if not keep or not drop:
            return None

        # Fold descriptive fields + reference counts into the survivor.
        if not keep.description and drop.description:
            keep.description = drop.description
        if not keep.definition and drop.definition:
            keep.definition = drop.definition
        keep.ref_count = keep.ref_count + drop.ref_count
        keep.source_count = max(keep.source_count, drop.source_count)

        # Repoint edges from drop → keep, dropping self-loops and duplicates.
        existing: set[tuple[int, int]] = {
            (e.source_id, e.target_id) for e in session.query(ConceptEdge).filter(
                ConceptEdge.source_id.in_([keep_id, drop_id]) |
                ConceptEdge.target_id.in_([keep_id, drop_id])
            ).all()
        }
        for edge in session.query(ConceptEdge).filter(
            (ConceptEdge.source_id == drop_id) | (ConceptEdge.target_id == drop_id)
        ).all():
            new_src = keep_id if edge.source_id == drop_id else edge.source_id
            new_tgt = keep_id if edge.target_id == drop_id else edge.target_id
            if new_src == new_tgt or (new_src, new_tgt) in existing or (new_tgt, new_src) in existing:
                session.delete(edge)
            else:
                edge.source_id = new_src
                edge.target_id = new_tgt
                existing.add((new_src, new_tgt))

        session.delete(drop)
        session.commit()
    finally:
        session.close()
    return inspector(keep_id)
