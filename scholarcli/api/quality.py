"""Objective artifact quality scoring.

Estimates how complete, grounded, balanced and well-structured a generated
artifact is using *measurable* signals only — no LLM self-grading. Each artifact
is scored against the source chunks that grounded it (``retrieved``) plus the
artifact's own structure.

The public entry point is :func:`score_artifact`, which dispatches on the RAG
route and returns a :class:`~scholarcli.api.schemas.QualityScore`.
"""

from __future__ import annotations

import math
import re
from collections import Counter

from scholarcli.api.schemas import QualityScore

# A small stopword set — enough to keep keyphrase/coverage signals on content
# words rather than glue words. Deliberately tiny (no NLTK dependency).
_STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "if", "then", "else", "of", "to", "in",
    "on", "for", "with", "as", "by", "at", "from", "into", "is", "are", "was",
    "were", "be", "been", "being", "this", "that", "these", "those", "it", "its",
    "they", "them", "their", "we", "you", "he", "she", "his", "her", "which",
    "who", "whom", "what", "when", "where", "how", "why", "can", "could", "will",
    "would", "should", "may", "might", "must", "do", "does", "did", "not", "no",
    "yes", "so", "than", "such", "also", "more", "most", "some", "any", "each",
    "all", "both", "between", "about", "over", "under", "up", "down", "out",
    "have", "has", "had", "use", "used", "using", "via", "per", "etc",
}

_WORD_RE = re.compile(r"[a-z0-9]+")


def _words(text: str) -> list[str]:
    """Content words: lowercased, len>2, not a stopword."""
    return [
        w for w in _WORD_RE.findall((text or "").lower())
        if len(w) > 2 and w not in _STOPWORDS
    ]


def _token_set(text: str) -> set[str]:
    return set(_words(text))


def _pct(x: float) -> int:
    """Clamp a 0..1 ratio to an integer percentage."""
    return int(round(max(0.0, min(1.0, x)) * 100))


def keyphrases(texts: list[str], k: int = 40) -> list[str]:
    """Top-``k`` content words across ``texts`` by frequency."""
    counter: Counter[str] = Counter()
    for t in texts:
        counter.update(_words(t))
    return [w for w, _ in counter.most_common(k)]


def lexical_coverage(artifact_text: str, source_keyphrases: list[str]) -> float:
    """Fraction of source keyphrases that appear in the artifact (0..1)."""
    if not source_keyphrases:
        return 0.0
    present = _token_set(artifact_text)
    hits = sum(1 for kp in source_keyphrases if kp in present)
    return hits / len(source_keyphrases)


def _jaccard(a: set[str], b: set[str]) -> float:
    if not a and not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union else 0.0


def redundancy(token_sets: list[set[str]], threshold: float = 0.6) -> float:
    """Share of item pairs that are near-duplicates (Jaccard >= threshold)."""
    n = len(token_sets)
    if n < 2:
        return 0.0
    dup = 0
    total = 0
    for i in range(n):
        for j in range(i + 1, n):
            total += 1
            if _jaccard(token_sets[i], token_sets[j]) >= threshold:
                dup += 1
    return dup / total if total else 0.0


def balance_entropy(counts: list[int]) -> float:
    """Normalised Shannon entropy of a distribution (1.0 = perfectly even)."""
    counts = [c for c in counts if c > 0]
    n = len(counts)
    if n <= 1:
        return 0.0
    total = sum(counts)
    h = -sum((c / total) * math.log(c / total) for c in counts)
    return h / math.log(n)


def grounding(retrieved: list[dict], artifact_text: str) -> tuple[float, int, int]:
    """Blend retrieval similarity, source diversity and lexical overlap.

    Returns ``(score 0..1, chunk_count, document_count)``.
    """
    if not retrieved:
        return 0.0, 0, 0
    sims = [max(0.0, min(1.0, 1.0 - (ch.get("_distance") or 1.0))) for ch in retrieved]
    avg_sim = sum(sims) / len(sims)
    docs = len({ch.get("document_id") for ch in retrieved if ch.get("document_id") is not None})
    diversity = min(1.0, docs / 3.0)
    source_tokens = _token_set(" ".join(ch.get("text", "") for ch in retrieved))
    art_tokens = _token_set(artifact_text)
    overlap = (len(art_tokens & source_tokens) / len(art_tokens)) if art_tokens else 0.0
    score = 0.45 * avg_sim + 0.15 * diversity + 0.40 * overlap
    return score, len(retrieved), docs


def _weighted(parts: list[tuple[int | None, float]]) -> int:
    """Weighted mean over the present (non-None) sub-scores."""
    num = sum(v * w for v, w in parts if v is not None)
    den = sum(w for v, w in parts if v is not None)
    return int(round(num / den)) if den else 0


# ---------------------------------------------------------------------------
# Per-artifact scorers
# ---------------------------------------------------------------------------

def score_notes(markdown: str, retrieved: list[dict], source_kps: list[str]) -> QualityScore:
    coverage = _pct(lexical_coverage(markdown, source_kps))
    g, chunks, docs = grounding(retrieved, markdown)
    grounding_pct = _pct(g)

    has_headings = bool(re.search(r"(?m)^#{1,6}\s+\S", markdown))
    bullets = len(re.findall(r"(?m)^\s*[-*]\s+\S", markdown))
    bold = len(re.findall(r"\*\*[^*]+\*\*", markdown))
    has_examples = bool(re.search(r"\b(example|e\.g\.|for instance)\b", markdown, re.I))
    length_ok = len(_words(markdown)) >= 80
    checks = [has_headings, bullets >= 3, bold >= 1, has_examples, length_ok]
    structure = _pct(sum(checks) / len(checks))

    notes: list[str] = []
    if not has_headings:
        notes.append("No section headings")
    if bold < 1:
        notes.append("No bolded definitions")
    if not has_examples:
        notes.append("No examples")
    if not length_ok:
        notes.append("Very short for revision notes")

    overall = _weighted([(coverage, 0.35), (grounding_pct, 0.35), (structure, 0.30)])
    return QualityScore(
        overall=overall, coverage=coverage, grounding=grounding_pct,
        structure=structure, sourceChunks=chunks, documents=docs, notes=notes,
    )


def _concept_buckets(items: list[str], source_kps: list[str]) -> Counter[str]:
    """Bucket each item by the first source keyphrase it mentions."""
    buckets: Counter[str] = Counter()
    for it in items:
        toks = _token_set(it)
        label = next((kp for kp in source_kps if kp in toks), "(other)")
        buckets[label] += 1
    return buckets


def score_flashcards(cards: list[dict], retrieved: list[dict], source_kps: list[str]) -> QualityScore:
    texts = [f"{c.get('front', '')} {c.get('back', '')}" for c in cards]
    joined = " ".join(texts)
    coverage = _pct(lexical_coverage(joined, source_kps))

    buckets = _concept_buckets(texts, source_kps)
    balance = _pct(balance_entropy(list(buckets.values())))
    red = redundancy([_token_set(c.get("front", "")) for c in cards])
    redundancy_pct = _pct(red)

    valid = sum(1 for c in cards if c.get("front", "").strip() and c.get("back", "").strip())
    structure = _pct(valid / len(cards)) if cards else 0

    notes: list[str] = []
    if cards:
        top_share = max(buckets.values()) / len(cards)
        if top_share > 0.5 and len(buckets) > 1:
            notes.append("Too many cards on one concept")
    covered = set(buckets)
    missing = [kp for kp in source_kps[:8] if kp not in covered]
    if len(missing) >= 4:
        notes.append("Missing major concepts")
    if red >= 0.2:
        notes.append("Redundant cards")

    overall = _weighted([
        (coverage, 0.40), (balance, 0.30), (structure, 0.20), (100 - redundancy_pct, 0.10),
    ])
    return QualityScore(
        overall=overall, coverage=coverage, balance=balance, redundancy=redundancy_pct,
        structure=structure, sourceChunks=len(retrieved),
        documents=len({ch.get("document_id") for ch in retrieved}), notes=notes,
    )


def score_quiz(questions: list[dict], retrieved: list[dict], source_kps: list[str]) -> QualityScore:
    prompts = [q.get("prompt", "") for q in questions]
    joined = " ".join(f"{q.get('prompt', '')} {' '.join(q.get('options') or [])}" for q in questions)
    concept_cov = lexical_coverage(joined, source_kps)

    # Topic coverage: distinct concept buckets vs the source's top concepts.
    buckets = _concept_buckets(prompts, source_kps)
    top_concepts = max(1, min(len(source_kps[:8]), len(questions)))
    topic_cov = len([b for b in buckets if b != "(other)"]) / top_concepts
    coverage = _pct((concept_cov + min(1.0, topic_cov)) / 2)

    types = Counter(q.get("type", "mcq") for q in questions)
    balance = _pct(balance_entropy(list(types.values())))
    red = redundancy([_token_set(p) for p in prompts])
    diversity = _pct(1.0 - red)

    g, chunks, docs = grounding(retrieved, joined)
    grounding_pct = _pct(g)

    def _ok(q: dict) -> bool:
        if q.get("type", "mcq") == "mcq":
            opts = q.get("options") or []
            return len(opts) >= 2 and bool(q.get("answer"))
        return bool(q.get("prompt"))
    structure = _pct(sum(_ok(q) for q in questions) / len(questions)) if questions else 0

    notes: list[str] = []
    if len(types) == 1 and "mcq" in types and len(questions) > 1:
        notes.append("Only MCQs")
    if len(buckets) <= 1 and len(questions) > 2:
        notes.append("Over-focused on one topic")
    if red >= 0.2:
        notes.append("Redundant questions")

    overall = _weighted([
        (coverage, 0.30), (balance, 0.20), (grounding_pct, 0.20),
        (diversity, 0.15), (structure, 0.15),
    ])
    return QualityScore(
        overall=overall, coverage=coverage, balance=balance, grounding=grounding_pct,
        diversity=diversity, redundancy=_pct(red), structure=structure,
        sourceChunks=chunks, documents=docs, notes=notes,
    )


def _parse_mindmap(text: str) -> tuple[list[tuple[int, str]], int, int]:
    """Return ``(nodes[(level,label)], max_depth, branch_count)``.

    Depth = indentation groups (4 chars each) plus one extra level for the
    branch connector (``├──``/``└──``), so top-level branches sit below the root.
    """
    nodes: list[tuple[int, str]] = []
    for raw in text.splitlines():
        if not raw.strip():
            continue
        stripped = raw.replace("│", " ")  # vertical guides count as indent
        has_branch = bool(re.search(r"[├└]|^\s*[-*]", stripped))
        label = re.sub(r"^[\s├└─|`+\-*]*", "", stripped).strip()
        if not label:
            continue
        indent = len(stripped) - len(stripped.lstrip(" "))
        level = indent // 4 + (1 if has_branch else 0)
        nodes.append((level, label))
    if nodes:
        # Normalise so the root is level 0.
        base = min(lvl for lvl, _ in nodes)
        nodes = [(lvl - base, lbl) for lvl, lbl in nodes]
    max_depth = max((lvl for lvl, _ in nodes), default=0)
    branch_count = sum(1 for lvl, _ in nodes if lvl == 1)
    return nodes, max_depth, branch_count


def score_mindmap(text: str, retrieved: list[dict], source_kps: list[str]) -> QualityScore:
    nodes, max_depth, branch_count = _parse_mindmap(text)
    labels = " ".join(lbl for _, lbl in nodes)
    coverage = _pct(lexical_coverage(labels, source_kps))
    g, chunks, docs = grounding(retrieved, labels)
    grounding_pct = _pct(g)

    # Branch balance: distribution of descendants across top-level branches.
    branch_sizes: list[int] = []
    current = 0
    for lvl, _ in nodes:
        if lvl == 1:
            branch_sizes.append(current)
            current = 0
        elif lvl > 1:
            current += 1
    branch_sizes.append(current)
    balance = balance_entropy([s + 1 for s in branch_sizes]) if branch_count > 1 else 0.0

    depth_score = min(1.0, max_depth / 3.0)
    branch_score = min(1.0, branch_count / 4.0)
    structure = _pct((depth_score + branch_score + balance) / 3)

    notes: list[str] = []
    if max_depth <= 1:
        notes.append("Flat map")
    if branch_count < 2:
        notes.append("Missing major branches")
    if len(nodes) <= 1:
        notes.append("Disconnected concepts")

    overall = _weighted([(coverage, 0.35), (structure, 0.35), (grounding_pct, 0.30)])
    return QualityScore(
        overall=overall, coverage=coverage, structure=structure, balance=_pct(balance),
        grounding=grounding_pct, sourceChunks=chunks, documents=docs, notes=notes,
    )


# Node id, an optional [..]/(..)/{..} label, an arrow, an optional |edge label|,
# then the next node id. Handles the common ``A[Process] --> B[Thread]`` form.
_EDGE_RE = re.compile(
    r"(\w[\w]*)(?:[\[\(\{][^\]\)\}]*[\]\)\}])?\s*"
    r"(?:--+>|==+>|-\.->|---|-->|->|--)\s*"
    r"(?:\|[^|]*\|\s*)?(\w[\w]*)"
)
_LABEL_RE = re.compile(r"[\[\(\{]+([^\]\)\}]+)[\]\)\}]+")
_DECL_RE = re.compile(r"(\w[\w]*)\s*[\[\(\{]")  # any id that declares a label
_HEADER_RE = re.compile(
    r"^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|mindmap)",
    re.I,
)


def score_diagram(mermaid: str, retrieved: list[dict], source_kps: list[str]) -> QualityScore:
    lines = mermaid.splitlines()
    valid_header = bool(lines) and bool(_HEADER_RE.match(lines[0]))

    edges = _EDGE_RE.findall(mermaid)
    edge_nodes: set[str] = set()
    for a, b in edges:
        edge_nodes.add(a)
        edge_nodes.add(b)
    declared = set(_DECL_RE.findall(mermaid))
    all_nodes = edge_nodes | declared
    labels = " ".join(_LABEL_RE.findall(mermaid))

    coverage = _pct(lexical_coverage(labels, source_kps))
    g, chunks, docs = grounding(retrieved, labels)
    grounding_pct = _pct(g)

    edges_present = len(edges) > 0
    connectivity = (len(edge_nodes) / len(all_nodes)) if all_nodes else 0.0
    density_ok = min(1.0, len(edges) / max(1, len(all_nodes)))
    signals = [float(valid_header), float(edges_present), connectivity, density_ok]
    structure = _pct(sum(signals) / len(signals))

    notes: list[str] = []
    if not valid_header:
        notes.append("Invalid diagram syntax")
    if not edges_present:
        notes.append("No logical flow")
    if all_nodes and connectivity < 1.0:
        notes.append("Disconnected nodes")

    overall = _weighted([(coverage, 0.35), (structure, 0.35), (grounding_pct, 0.30)])
    return QualityScore(
        overall=overall, coverage=coverage, structure=structure, grounding=grounding_pct,
        sourceChunks=chunks, documents=docs, notes=notes,
    )


def _parse_table_rows(content: str) -> list[list[str]]:
    rows: list[list[str]] = []
    for line in content.splitlines():
        line = line.strip()
        if not line.startswith("|") or line.count("|") < 2:
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if all(re.fullmatch(r":?-{2,}:?", c or "-") for c in cells):
            continue  # separator row
        rows.append(cells)
    return rows


def score_difference(content: str, retrieved: list[dict], source_kps: list[str]) -> QualityScore:
    rows = _parse_table_rows(content)
    header = rows[0] if rows else []
    data = rows[1:] if len(rows) > 1 else []
    dimensions = len(data)

    cell_text = " ".join(" ".join(r) for r in data)
    coverage = _pct(lexical_coverage(cell_text, source_kps))
    g, chunks, docs = grounding(retrieved, cell_text)
    grounding_pct = _pct(g)

    has_table = dimensions > 0
    filled = (
        sum(1 for r in data if len(r) >= 3 and r[1].strip() and r[2].strip()) / dimensions
        if dimensions else 0.0
    )
    has_exam = bool(re.search(r"exam perspective", content, re.I))
    depth = min(1.0, dimensions / 6.0)
    structure = _pct((float(has_table) + filled + float(has_exam) + depth) / 4)

    notes: list[str] = []
    if dimensions < 4:
        notes.append("Missing key contrasts")
    if not has_exam:
        notes.append("No exam perspective")
    if len(header) < 3:
        notes.append("Comparison not two-sided")

    overall = _weighted([(coverage, 0.35), (structure, 0.35), (grounding_pct, 0.30)])
    return QualityScore(
        overall=overall, coverage=coverage, structure=structure, grounding=grounding_pct,
        sourceChunks=chunks, documents=docs, notes=notes,
    )


# ---------------------------------------------------------------------------
# Dispatcher
# ---------------------------------------------------------------------------

def score_artifact(route: str, parsed, retrieved: list[dict], grounded: bool) -> QualityScore:
    """Score a parsed artifact. ``parsed`` shape depends on ``route``:

    flashcards/quiz -> list[dict]; mermaid/mindmap/study_notes/differences -> str.
    """
    retrieved = retrieved or []
    source_kps = keyphrases([ch.get("text", "") for ch in retrieved]) if retrieved else []

    if route == "flashcards":
        return score_flashcards(parsed, retrieved, source_kps)
    if route == "quiz":
        return score_quiz(parsed, retrieved, source_kps)
    if route == "mermaid":
        return score_diagram(parsed, retrieved, source_kps)
    if route == "mindmap":
        return score_mindmap(parsed, retrieved, source_kps)
    if route == "differences":
        return score_difference(parsed, retrieved, source_kps)
    # study_notes / quick_qa / fallback
    return score_notes(parsed, retrieved, source_kps)
