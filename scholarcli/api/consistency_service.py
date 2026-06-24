"""Cross-artifact consistency analysis.

Detects when learning artifacts generated from the same source material
silently diverge in concept coverage. Pipeline:

    source material -> canonical concept set (1 LLM call)
                    -> per-artifact coverage scoring (1 LLM call each)
                    -> coverage comparison + consistency report

ANALYZE-ONLY. Nothing here regenerates or mutates any artifact. Mirrors the
defensive LLM+JSON pattern in ``knowledge_service``.
"""

from __future__ import annotations

import json
import re

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.llm import get_llm
from scholarcli.storage import get_session
from scholarcli.storage.models import (
    Concept,
    Course,
    Deck,
    DifferenceTable,
    Diagram,
    Document,
    LearningPackage,
    Mindmap,
    Notebook,
    SavedQuiz,
)
from scholarcli.storage.vectors import all_chunks, get_document_chunks

# Artifact keys shared with the frontend Teach store / LearningPackage.artifacts.
ARTIFACT_KEYS = ["notes", "flashcards", "quiz", "mindmap", "diagram", "difference"]

_ARTIFACT_LABELS = {
    "notes": "Notes",
    "flashcards": "Flashcards",
    "quiz": "Quiz",
    "mindmap": "Mind Map",
    "diagram": "Diagram",
    "difference": "Difference Table",
}

_STATUS_SCORE = {"covered": 1.0, "weak": 0.5, "missing": 0.0}
_VALID_STATUS = set(_STATUS_SCORE)

_MAX_SOURCE_CHARS = 8000
_MAX_ARTIFACT_CHARS = 6000


# ---------------------------------------------------------------------------
# Canonical concept extraction
# ---------------------------------------------------------------------------

_CANONICAL_SYSTEM = """\
You are analyzing study source material to build a canonical concept checklist.
Read the text and list the KEY concepts that a complete set of study materials
should cover. Output ONLY a JSON array of strings, no prose. Rules:
- 8 to 15 concepts, the most important ones only.
- Each is a short noun phrase (1-4 words), Title Case.
- Canonical names only — no synonyms or duplicates.
- Do not include examples, asides or trivia, only core concepts.
- Output valid JSON only, e.g. ["Concept One", "Concept Two"].\
"""


def _parse_concept_names(text: str) -> list[str]:
    """Extract a JSON array of concept-name strings from LLM output, defensively."""
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if not match:
        return []
    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError:
        return []
    out: list[str] = []
    seen: set[str] = set()
    if isinstance(data, list):
        for item in data:
            # Tolerate objects like {"name": "..."} as well as bare strings.
            if isinstance(item, dict):
                item = item.get("name", "")
            name = str(item).strip()[:120]
            key = name.lower()
            if name and key not in seen:
                seen.add(key)
                out.append(name)
    return out


def extract_canonical_concepts(source_text: str, max_concepts: int = 15) -> list[str]:
    """Extract the canonical concept set from source material via the LLM."""
    sample = (source_text or "").strip()[:_MAX_SOURCE_CHARS]
    if not sample:
        return []
    llm = get_llm("deep_analysis")
    try:
        resp = llm.invoke(
            [SystemMessage(content=_CANONICAL_SYSTEM), HumanMessage(content=sample)]
        )
    except Exception:
        return []
    return _parse_concept_names(getattr(resp, "content", str(resp)))[:max_concepts]


# ---------------------------------------------------------------------------
# Per-artifact coverage scoring
# ---------------------------------------------------------------------------

_SCORE_SYSTEM = """\
You are checking whether a study artifact covers a fixed checklist of concepts.
For EACH concept in the provided list, classify how well the artifact covers it:
- "covered": clearly and adequately explained or tested.
- "weak": mentioned or touched but shallow, incomplete, or only in passing.
- "missing": not present at all.
Judge by meaning, not exact wording — paraphrase still counts as coverage.
Output ONLY a JSON object mapping each concept (exactly as given) to one of
"covered" / "weak" / "missing". Include every concept. No prose.\
"""


def _parse_status_map(text: str, concepts: list[str]) -> dict[str, str]:
    """Parse the LLM status object into ``{canonical_concept: status}``.

    This is the single normalization point: lookups are done against the
    *canonical* concept list (case-insensitive), so artifact-to-artifact
    counting downstream is always keyed by canonical names. Anything unknown,
    unparseable, or absent defaults to ``"missing"``.
    """
    result = {c: "missing" for c in concepts}
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return result
    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError:
        return result
    if not isinstance(data, dict):
        return result
    # Normalize the LLM's keys for case-insensitive matching.
    norm = {str(k).strip().lower(): str(v).strip().lower() for k, v in data.items()}
    for c in concepts:
        status = norm.get(c.lower())
        if status in _VALID_STATUS:
            result[c] = status
    return result


def score_artifact_coverage(artifact_text: str, concepts: list[str]) -> dict[str, str]:
    """Classify each canonical concept as covered/weak/missing in the artifact."""
    if not concepts:
        return {}
    text = (artifact_text or "").strip()[:_MAX_ARTIFACT_CHARS]
    if not text:
        return {c: "missing" for c in concepts}
    llm = get_llm("deep_analysis")
    human = f"CONCEPTS:\n{json.dumps(concepts)}\n\nARTIFACT:\n{text}"
    try:
        resp = llm.invoke(
            [SystemMessage(content=_SCORE_SYSTEM), HumanMessage(content=human)]
        )
    except Exception:
        return {c: "missing" for c in concepts}
    return _parse_status_map(getattr(resp, "content", str(resp)), concepts)


# ---------------------------------------------------------------------------
# Artifact payload -> plain text
# ---------------------------------------------------------------------------

def _coerce(payload) -> dict:
    """Normalize a payload (Pydantic model or dict) into a plain dict."""
    if payload is None:
        return {}
    if isinstance(payload, dict):
        return payload
    if hasattr(payload, "model_dump"):
        return payload.model_dump()
    return {}


def artifact_to_text(key: str, payload) -> str:
    """Flatten an artifact payload into a plain-text blob for concept scoring.

    Payloads use the same shapes the generative endpoints return (see
    ``schemas.py``). Everything is defensive ``.get`` so partial/old payloads
    never raise. Returns ``""`` when there is no usable text.
    """
    data = _coerce(payload)
    if not data:
        return ""

    if key == "notes":
        return str(data.get("markdown", "")).strip()

    if key == "difference":
        return str(data.get("content", "")).strip()

    if key == "mindmap":
        return str(data.get("text", "")).strip()

    if key == "diagram":
        return str(data.get("mermaid", "")).strip()

    if key == "flashcards":
        cards = data.get("cards", []) or []
        parts = []
        for c in cards:
            c = _coerce(c)
            front = str(c.get("front", "")).strip()
            back = str(c.get("back", "")).strip()
            if front or back:
                parts.append(f"{front} — {back}".strip(" —"))
        return "\n".join(parts).strip()

    if key == "quiz":
        questions = data.get("questions", []) or []
        parts = []
        for q in questions:
            q = _coerce(q)
            chunk = [str(q.get("prompt", "")).strip()]
            opts = q.get("options") or []
            if opts:
                chunk.append(" ".join(str(o) for o in opts))
            for fld in ("answer", "explanation"):
                val = str(q.get(fld, "")).strip()
                if val:
                    chunk.append(val)
            line = " ".join(p for p in chunk if p).strip()
            if line:
                parts.append(line)
        return "\n".join(parts).strip()

    return ""


# ---------------------------------------------------------------------------
# Report assembly
# ---------------------------------------------------------------------------

def _build_recommendations(
    per_artifact: list[dict], underrepresented: list[str], overall: float
) -> list[str]:
    recs: list[str] = []
    for a in per_artifact:
        missing = a["missing"]
        if missing:
            label = _ARTIFACT_LABELS.get(a["artifact"], a["artifact"].title())
            shown = ", ".join(missing[:4])
            more = "" if len(missing) <= 4 else f" (+{len(missing) - 4} more)"
            recs.append(
                f"Regenerate {label} with concept-coverage focus — missing: {shown}{more}."
            )
    if underrepresented:
        shown = ", ".join(underrepresented[:4])
        recs.append(
            f"These concepts appear in few artifacts — consider adding them: {shown}."
        )
    if per_artifact and overall < 0.6:
        recs.append(
            "Overall coverage is low — generated materials diverge significantly "
            "from the source. Review and regenerate the weakest artifacts."
        )
    if not recs and per_artifact:
        recs.append("Coverage looks consistent across artifacts. No action needed.")
    return recs


def build_report(source_text: str, artifacts: dict) -> dict:
    """Run the full pipeline and return a consistency report dict.

    ``artifacts`` maps artifact key -> payload (dict). Artifacts whose text is
    empty are skipped. Concept counting is keyed by canonical concept names.
    """
    concepts = extract_canonical_concepts(source_text)
    artifacts = artifacts or {}

    if not concepts:
        return {
            "canonicalConcepts": [],
            "overallCoverage": 0.0,
            "artifacts": [],
            "underrepresented": [],
            "overrepresented": [],
            "recommendations": [
                "Could not extract concepts from the source material. Ensure the "
                "source has enough content and the LLM is available, then retry."
            ],
        }

    per_artifact: list[dict] = []
    # canonical concept -> list of coverage scores across present artifacts
    coverage_matrix: dict[str, list[float]] = {c: [] for c in concepts}

    for key in ARTIFACT_KEYS:
        if key not in artifacts:
            continue
        text = artifact_to_text(key, artifacts[key])
        if not text.strip():
            continue
        status_map = score_artifact_coverage(text, concepts)
        covered = [c for c in concepts if status_map.get(c) == "covered"]
        weak = [c for c in concepts if status_map.get(c) == "weak"]
        missing = [c for c in concepts if status_map.get(c) == "missing"]
        if concepts:
            coverage = round(
                sum(_STATUS_SCORE[status_map.get(c, "missing")] for c in concepts)
                / len(concepts)
                * 100,
                1,
            )
        else:
            coverage = 0.0
        for c in concepts:
            coverage_matrix[c].append(_STATUS_SCORE[status_map.get(c, "missing")])
        per_artifact.append(
            {
                "artifact": key,
                "coverage": coverage,
                "covered": covered,
                "weak": weak,
                "missing": missing,
            }
        )

    n = len(per_artifact)
    overall = (
        round(sum(a["coverage"] for a in per_artifact) / n, 1) if n else 0.0
    )

    # Under-represented = strongly covered (score 1.0) by only a small minority.
    underrepresented = [
        c
        for c, scores in coverage_matrix.items()
        if n and sum(1 for s in scores if s >= 1.0) <= max(1, n // 3)
    ]
    # Over-represented = strongly covered by every present artifact (redundant emphasis).
    overrepresented = [
        c for c, scores in coverage_matrix.items() if n and all(s >= 1.0 for s in scores)
    ]

    recommendations = _build_recommendations(per_artifact, underrepresented, overall)
    suggestions = _build_suggestions(per_artifact)

    return {
        "canonicalConcepts": concepts,
        "overallCoverage": overall,
        "artifacts": per_artifact,
        "underrepresented": underrepresented,
        "overrepresented": overrepresented,
        "recommendations": recommendations,
        "suggestions": suggestions,
    }


# ---------------------------------------------------------------------------
# Auto-correct: suggest + apply revised artifact text covering missing concepts.
# ---------------------------------------------------------------------------

# Only text-shaped artifacts can be auto-corrected in place. Flashcards/quizzes
# are structured and excluded.
_APPLYABLE = {"notes", "mindmap", "diagram", "difference"}


def _build_suggestions(per_artifact: list[dict]) -> list[dict]:
    """Deterministic list of fixable gaps the UI can offer an 'Apply' button for."""
    out: list[dict] = []
    for a in per_artifact:
        key = a["artifact"]
        if key not in _APPLYABLE:
            continue
        gap = a["missing"] + a["weak"]
        if not gap:
            continue
        label = _ARTIFACT_LABELS.get(key, key.title())
        out.append(
            {
                "artifactType": key,
                "label": label,
                "issue": f"{label} under-covers {len(gap)} concept(s).",
                "concepts": gap[:8],
            }
        )
    return out


_REVISE_SYSTEM = """\
You revise study artifacts so they fully cover a set of concepts that are
currently missing or weak, WITHOUT removing existing correct content. Keep the
artifact's existing format exactly:
- notes / difference: Markdown.
- mindmap: an indented text tree using ├──/└── connectors.
- diagram: valid Mermaid syntax only (no fences, no prose).
Output ONLY the revised artifact, no commentary.\
"""


def apply_correction(course: str, artifact_type: str, concepts: list[str]) -> dict:
    """Regenerate a saved artifact so it covers ``concepts``, then persist it.

    Returns {applied, artifactType, preview, message}.
    """
    if artifact_type not in _APPLYABLE:
        return {"applied": False, "artifactType": artifact_type, "preview": "",
                "message": f"{artifact_type} cannot be auto-corrected."}

    session = get_session()
    try:
        row, current = _load_applyable(session, course, artifact_type)
        if row is None:
            return {"applied": False, "artifactType": artifact_type, "preview": "",
                    "message": f"No saved {artifact_type} found for course '{course}'."}

        concept_list = ", ".join(concepts) or "the source's key concepts"
        human = (
            f"Concepts to ensure are covered: {concept_list}\n\n"
            f"Current {artifact_type} to revise:\n{current}"
        )
        try:
            llm = get_llm("study_notes")
            resp = llm.invoke(
                [SystemMessage(content=_REVISE_SYSTEM), HumanMessage(content=human)]
            )
            revised = (getattr(resp, "content", "") or "").strip()
        except Exception as exc:  # noqa: BLE001
            return {"applied": False, "artifactType": artifact_type, "preview": "",
                    "message": f"Revision failed: {exc}"}
        if not revised:
            return {"applied": False, "artifactType": artifact_type, "preview": "",
                    "message": "Model returned no revision."}

        _write_applyable(row, artifact_type, revised)
        session.commit()
        return {"applied": True, "artifactType": artifact_type,
                "preview": revised[:600], "message": "Applied to saved artifact."}
    finally:
        session.close()


def _load_applyable(session, course: str, artifact_type: str):
    """Return (row, current_text) for the most-recent applyable artifact."""
    if artifact_type == "notes":
        row = (
            session.query(Notebook)
            .filter(Notebook.course == course)
            .order_by(Notebook.updated_at.desc())
            .first()
        )
        return row, (_notebook_to_markdown(row.blocks) if row else "")
    if artifact_type == "mindmap":
        row = (
            session.query(Mindmap)
            .filter(Mindmap.course == course)
            .order_by(Mindmap.created_at.desc())
            .first()
        )
        return row, (row.text if row else "")
    if artifact_type == "diagram":
        row = (
            session.query(Diagram)
            .filter(Diagram.course == course)
            .order_by(Diagram.created_at.desc())
            .first()
        )
        return row, (row.mermaid if row else "")
    # difference
    row = (
        session.query(DifferenceTable)
        .filter(DifferenceTable.course == course)
        .order_by(DifferenceTable.created_at.desc())
        .first()
    )
    return row, (row.content if row else "")


def _write_applyable(row, artifact_type: str, revised: str) -> None:
    if artifact_type == "notes":
        # Replace blocks with a single markdown block holding the revised notes.
        row.blocks = [{"type": "markdown", "text": revised}]
    elif artifact_type == "mindmap":
        row.text = revised
    elif artifact_type == "diagram":
        row.mermaid = revised
    else:  # difference
        row.content = revised


# ---------------------------------------------------------------------------
# Library (DB-backed) path
# ---------------------------------------------------------------------------

def _notebook_to_markdown(blocks: list) -> str:
    """Flatten notebook ``blocks`` JSON into text, defensively."""
    parts: list[str] = []
    for b in blocks or []:
        if isinstance(b, str):
            parts.append(b)
        elif isinstance(b, dict):
            for fld in ("text", "content", "markdown", "value"):
                val = b.get(fld)
                if isinstance(val, str) and val.strip():
                    parts.append(val.strip())
                    break
    return "\n\n".join(parts).strip()


def _library_source_text(session, course: str, document_title: str | None) -> str:
    """Build canonical source text for a course, optionally scoped to a document.

    NOTE: ``document_title`` only sharpens the *source* concept set — saved
    artifact rows carry no document_id, so artifact gathering stays course-wide.
    """
    chunks: list[dict] = []
    if document_title:
        doc = (
            session.query(Document)
            .join(Course)
            .filter(Document.title == document_title, Course.name == course)
            .first()
        )
        if doc is not None:
            chunks = get_document_chunks(doc.id)
    if not chunks:
        chunks = all_chunks(course=course)
    text = "\n\n".join(ch.get("text", "") for ch in chunks)[:_MAX_SOURCE_CHARS]
    if text.strip():
        return text
    # Fallback: synthesize from a previously-built knowledge graph (may be stale).
    concepts = session.query(Concept).filter(Concept.course == course).all()
    return "\n".join(f"{c.name}: {c.description}" for c in concepts).strip()


def _gather_saved_artifacts(session, course: str) -> dict:
    """Aggregate saved artifacts for a course into per-key payloads.

    Linkage is course-only (saved rows store ``course``, not document_id).
    Multiple rows of a type are merged into one payload.
    """
    artifacts: dict = {}

    # Flashcards — all decks' cards for the course.
    decks = session.query(Deck).filter(Deck.course == course).all()
    cards = [
        {"front": c.front, "back": c.back}
        for d in decks
        for c in d.cards
    ]
    if cards:
        artifacts["flashcards"] = {"cards": cards}

    # Quiz — merge all saved quizzes' questions.
    quizzes = session.query(SavedQuiz).filter(SavedQuiz.course == course).all()
    questions = [q for quiz in quizzes for q in (quiz.questions or [])]
    if questions:
        artifacts["quiz"] = {"questions": questions}

    # Notes — most-recent notebook for the course.
    nb = (
        session.query(Notebook)
        .filter(Notebook.course == course)
        .order_by(Notebook.updated_at.desc())
        .first()
    )
    if nb is not None:
        md = _notebook_to_markdown(nb.blocks)
        if md:
            artifacts["notes"] = {"markdown": md}

    # Mind map — most-recent.
    mm = (
        session.query(Mindmap)
        .filter(Mindmap.course == course)
        .order_by(Mindmap.created_at.desc())
        .first()
    )
    if mm is not None and (mm.text or "").strip():
        artifacts["mindmap"] = {"text": mm.text}

    # Diagram — most-recent.
    dg = (
        session.query(Diagram)
        .filter(Diagram.course == course)
        .order_by(Diagram.created_at.desc())
        .first()
    )
    if dg is not None and (dg.mermaid or "").strip():
        artifacts["diagram"] = {"mermaid": dg.mermaid}

    # Difference table — most-recent.
    dt = (
        session.query(DifferenceTable)
        .filter(DifferenceTable.course == course)
        .order_by(DifferenceTable.created_at.desc())
        .first()
    )
    if dt is not None and (dt.content or "").strip():
        artifacts["difference"] = {"content": dt.content}

    # Fallback: merge a learning package's artifacts for keys still missing.
    if len(artifacts) < len(ARTIFACT_KEYS):
        pkg = (
            session.query(LearningPackage)
            .filter(LearningPackage.course == course)
            .order_by(LearningPackage.updated_at.desc())
            .first()
        )
        if pkg is not None and isinstance(pkg.artifacts, dict):
            for key in ARTIFACT_KEYS:
                if key not in artifacts and pkg.artifacts.get(key):
                    artifacts[key] = pkg.artifacts[key]

    return artifacts


def build_library_report(course: str, document_title: str | None = None) -> dict:
    """Consistency report over saved artifacts for a course (DB-backed)."""
    session = get_session()
    try:
        source_text = _library_source_text(session, course, document_title)
        artifacts = _gather_saved_artifacts(session, course)
    finally:
        session.close()

    if not artifacts:
        return {
            "canonicalConcepts": [],
            "overallCoverage": 0.0,
            "artifacts": [],
            "underrepresented": [],
            "overrepresented": [],
            "recommendations": [
                f"No saved artifacts found for course '{course}'. Generate and save "
                "some artifacts (flashcards, quiz, notes, etc.) first."
            ],
        }
    return build_report(source_text, artifacts)
