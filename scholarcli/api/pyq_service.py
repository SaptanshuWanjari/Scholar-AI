"""PYQ (previous-year question) analysis service.

Extraction feeds the *full paper text* straight to the LLM (no RAG retrieval —
we already have the exact text and want every question, not a grounded
summary). Everything the page displays is then computed deterministically from
the stored rows, honouring the spec's "evidence over prediction" principle:
accuracy/readiness are derived from real ``TopicStat`` data, and topics with no
attempts report ``None`` rather than a fabricated number.
"""

from __future__ import annotations

import hashlib
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from datetime import date

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.api import dependency_service, parsers
from scholarcli.config import get_settings
from scholarcli.ingest.loaders import load_document
from scholarcli.llm import get_llm
from scholarcli.storage import get_session
from scholarcli.storage.models import PYQQuestion, QuestionPaper, TopicStat, Deck, Card

# Cap paper text fed to the model — a question paper is a few pages; this guards
# against a stray huge upload blowing the context window.
_MAX_CHARS = 16000

_EXTRACT_SYSTEM = (
    "You extract exam questions from a previous-year question paper. "
    "Return ONLY a JSON array, no prose. Each element is an object with: "
    "'text' (the full question, verbatim), "
    "'topic' (a short canonical topic name, e.g. 'Deadlocks'), "
    "'subtopics' (array of 0-4 short subtopic names, e.g. ['Prevention','Avoidance']), "
    "'difficulty' (one of Easy, Medium, Hard), "
    "'type' (one of: definition, explanation, comparison, advantages, architecture, "
    "case_study, numerical, problem_solving, short_answer, long_answer, other), "
    "'marks' (integer or null). "
    "Use consistent topic/subtopic names across similar questions so they group cleanly. "
    "Skip instructions, headers, and marks tables — only real questions."
)

_PATTERN_LABELS = {
    "definition": "Definitions",
    "explanation": "Explanations",
    "comparison": "Comparisons",
    "advantages": "Advantages / Disadvantages",
    "architecture": "Architecture",
    "case_study": "Case Studies",
    "numerical": "Numericals",
    "problem_solving": "Problem Solving",
    "short_answer": "Short Answers",
    "long_answer": "Long Answers",
    "other": "Other",
}


# ---------------------------------------------------------------------------
# Extraction + persistence
# ---------------------------------------------------------------------------

def _read_text(path: Path) -> str:
    """Load a document's plain text for extraction.

    PDFs use a direct fitz pass with per-page OCR fallback for sparse pages,
    bypassing the full ingest pipeline (which filters full-page background
    images and would miss typical scanned exam papers).
    """
    if path.suffix.lower() == ".pdf":
        return _read_pdf_text(path)
    content_hash = hashlib.sha256(path.read_bytes()).hexdigest()
    pages, _ = load_document(path, content_hash)
    return "\n\n".join(p.text for p in pages).strip()[:_MAX_CHARS]


def _read_pdf_text(path: Path) -> str:
    """Extract text from a PDF with per-page OCR for sparse pages."""
    import fitz
    from scholarcli.ingest import ocr as ocr_mod

    min_chars = get_settings().ingest.scanned_min_chars
    parts: list[str] = []
    doc = fitz.open(str(path))
    try:
        for page in doc:
            text = page.get_text("text").strip()
            if len(text) < min_chars:
                ocr_text, _ = ocr_mod.ocr_page(page)
                if ocr_text.strip():
                    parts.append(ocr_text.strip())
            else:
                parts.append(text)
    finally:
        doc.close()
    return "\n\n".join(parts)[:_MAX_CHARS]


def extract_and_store(
    *, course: str, title: str, year: int | None, source_document: str, path: Path
) -> QuestionPaper:
    """Extract questions from *path* via the LLM and persist a paper + its rows."""
    doc_text = _read_text(path)
    if not doc_text:
        raise ValueError("No extractable text in paper")

    user = f"Question paper text:\n\n{doc_text[:_MAX_CHARS]}"
    llm = get_llm("quiz")
    resp = llm.invoke([SystemMessage(content=_EXTRACT_SYSTEM), HumanMessage(content=user)])
    questions = parsers.parse_pyq(getattr(resp, "content", "") or "")
    if not questions:
        raise ValueError("Could not extract any questions from the paper")

    session = get_session()
    try:
        paper = QuestionPaper(
            course=course,
            title=title,
            year=year,
            source_document=source_document,
            question_count=len(questions),
        )
        session.add(paper)
        session.flush()  # assign paper.id
        for q in questions:
            session.add(
                PYQQuestion(
                    paper_id=paper.id,
                    course=course,
                    year=q["year"] if q["year"] is not None else year,
                    text=q["text"],
                    topic=q["topic"],
                    subtopics=q.get("subtopics") or [],
                    difficulty=q["difficulty"],
                    qtype=q["type"],
                    marks=q["marks"],
                )
            )
        session.commit()
        session.refresh(paper)
        return paper
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Accuracy feedback loop
# ---------------------------------------------------------------------------

def record_topic_results(course: str, by_topic: dict[str, list[int]]) -> None:
    """Upsert per-topic ``[correct, total]`` increments into ``TopicStat``."""
    if not course or not by_topic:
        return
    session = get_session()
    try:
        now = datetime.now(timezone.utc)
        for topic, (correct, total) in by_topic.items():
            if not total:
                continue
            stat = (
                session.query(TopicStat)
                .filter(TopicStat.course == course, TopicStat.topic == topic)
                .first()
            )
            if stat is None:
                stat = TopicStat(course=course, topic=topic, correct=0, total=0)
                session.add(stat)
            # Link to a dependency concept for exact mastery rollup (best-effort).
            if stat.concept_id is None:
                stat.concept_id = dependency_service.resolve_concept(topic, course)
            stat.correct += int(correct)
            stat.total += int(total)
            stat.last_attempt = now
        session.commit()
    finally:
        session.close()


_WEAK_ACCURACY = 0.5


def prioritize_weak_topic_cards(course: str) -> None:
    """Mark all cards in weak topics as due today.

    A topic is weak when ``correct / total < 0.5``. The function finds every
    ``Deck`` whose ``concept_id`` matches a weak ``TopicStat`` and overrides
    the SM-2 schedule so those cards appear at the front of the review queue.
    """
    session = get_session()
    try:
        weak = (
            session.query(TopicStat)
            .filter(
                TopicStat.course == course,
                TopicStat.total > 0,
                TopicStat.correct * 1.0 / TopicStat.total < _WEAK_ACCURACY,
                TopicStat.concept_id.isnot(None),
            )
            .all()
        )
        if not weak:
            return

        concept_ids = {s.concept_id for s in weak}
        deck_ids = [
            d.id
            for d in session.query(Deck).filter(Deck.concept_id.in_(concept_ids)).all()
        ]
        if not deck_ids:
            return

        today = date.today().isoformat()
        session.query(Card).filter(Card.deck_id.in_(deck_ids)).update(
            {Card.due: today}, synchronize_session=False
        )
        session.commit()
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Deterministic aggregation
# ---------------------------------------------------------------------------

def _stars(rank_ratio: float) -> int:
    """Map a 0..1 occurrence-rank ratio to 1..5 importance stars."""
    return max(1, min(5, round(rank_ratio * 5)))


def _freq_label(occurrences: int, mx: int) -> str:
    if mx <= 0:
        return "Low"
    r = occurrences / mx
    return "High" if r >= 0.66 else "Medium" if r >= 0.33 else "Low"


def _trend(year_counts: dict[int, int]) -> str:
    """Compare the recent half of years to the earlier half."""
    years = sorted(year_counts)
    if len(years) < 2:
        return "Stable"
    mid = len(years) // 2
    early = sum(year_counts[y] for y in years[:mid])
    late = sum(year_counts[y] for y in years[mid:])
    if late > early:
        return "Increasing"
    if late < early:
        return "Decreasing"
    return "Stable"


_DIFF_PATTERNS = [
    re.compile(r"\bbetween\s+(.+?)\s+and\s+(.+?)(?:[.?\n]|$)", re.IGNORECASE),
    re.compile(r"\b(.+?)\s+(?:vs\.?|versus)\s+(.+?)(?:[.?\n]|$)", re.IGNORECASE),
    re.compile(r"\b(?:compare|differentiate|distinguish)\s+(.+?)\s+(?:and|with|from)\s+(.+?)(?:[.?\n]|$)", re.IGNORECASE),
]


def _clean_term(t: str) -> str:
    t = re.sub(r"\s+", " ", t).strip(" .,:;\"'()").strip()
    # Drop trailing instructional fragments the regex may capture.
    t = re.split(
        r"\b(?:with\s+respect|in\s+terms|in\s+detail|in\s+brief|briefly|using|give|"
        r"explain|state|with\s+(?:an?\s+)?(?:example|diagram)s?)\b",
        t,
        flags=re.IGNORECASE,
    )[0].strip(" .,:;\"'()").strip()
    return t[:60]


def difference_suggestions(course: str) -> list[dict]:
    """Mine comparison-style PYQ questions for recurring 'X vs Y' pairs."""
    session = get_session()
    try:
        rows = (
            session.query(PYQQuestion)
            .filter(PYQQuestion.course == course, PYQQuestion.qtype == "comparison")
            .all()
        )
        items = [(q.text, q.topic) for q in rows]
    finally:
        session.close()

    pairs: dict[tuple, dict] = {}
    for text, topic in items:
        for pat in _DIFF_PATTERNS:
            m = pat.search(text)
            if not m:
                continue
            a, b = _clean_term(m.group(1)), _clean_term(m.group(2))
            if not a or not b or len(a) < 2 or len(b) < 2 or a.lower() == b.lower():
                continue
            key = tuple(sorted([a.lower(), b.lower()]))
            entry = pairs.setdefault(key, {"a": a, "b": b, "topic": topic, "count": 0, "example": text})
            entry["count"] += 1
            break
    return sorted(pairs.values(), key=lambda e: e["count"], reverse=True)


def build_analysis(course: str) -> dict:
    """Aggregate stored PYQ questions + topic stats into the page payload."""
    session = get_session()
    try:
        questions = (
            session.query(PYQQuestion).filter(PYQQuestion.course == course).all()
        )
        papers = (
            session.query(QuestionPaper)
            .filter(QuestionPaper.course == course)
            .all()
        )
        stats = {
            s.topic: s
            for s in session.query(TopicStat).filter(TopicStat.course == course).all()
        }
    finally:
        session.close()

    total_questions = len(questions)
    if total_questions == 0:
        return {
            "course": course,
            "papers": 0,
            "totalQuestions": 0,
            "yearsLabel": "",
            "summary": {},
            "topicFrequency": [],
            "patterns": [],
            "difficulty": [],
            "marksDistribution": [],
            "yearTrends": [],
            "revisionRisk": [],
            "readiness": {},
        }

    years = sorted({q.year for q in questions if q.year is not None})
    years_label = f"{years[0]}-{years[-1]}" if len(years) > 1 else (str(years[0]) if years else "")

    # --- per-topic aggregation ---
    topic_count: dict[str, int] = defaultdict(int)
    topic_years: dict[str, dict[int, int]] = defaultdict(lambda: defaultdict(int))
    topic_styles: dict[str, set[str]] = defaultdict(set)
    topic_subs: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for q in questions:
        topic_count[q.topic] += 1
        if q.year is not None:
            topic_years[q.topic][q.year] += 1
        topic_styles[q.topic].add(q.qtype)
        for sub in (q.subtopics or []):
            topic_subs[q.topic][sub] += 1

    mx = max(topic_count.values())
    ranked = sorted(topic_count.items(), key=lambda kv: kv[1], reverse=True)

    def topic_accuracy(topic: str) -> int | None:
        s = stats.get(topic)
        if not s or s.total == 0:
            return None
        return round(100 * s.correct / s.total)

    topic_freq = []
    for i, (topic, occ) in enumerate(ranked):
        topic_freq.append(
            {
                "topic": topic,
                "occurrences": occ,
                "frequency": _freq_label(occ, mx),
                "trend": _trend(topic_years[topic]),
                "importance": _stars((len(ranked) - i) / len(ranked)),
                "accuracy": topic_accuracy(topic),
                "styles": sorted(topic_styles[topic]),
                "subtopics": [
                    s for s, _ in sorted(topic_subs[topic].items(), key=lambda kv: kv[1], reverse=True)
                ][:6],
            }
        )

    recurring = sum(1 for _, occ in ranked if occ >= 2)

    # --- question patterns ---
    type_count: dict[str, int] = defaultdict(int)
    type_examples: dict[str, list[str]] = defaultdict(list)
    for q in questions:
        type_count[q.qtype] += 1
        if len(type_examples[q.qtype]) < 3:
            type_examples[q.qtype].append(q.text)
    patterns = [
        {
            "type": t,
            "label": _PATTERN_LABELS.get(t, t.title()),
            "pct": round(100 * c / total_questions),
            "count": c,
            "examples": type_examples[t],
        }
        for t, c in sorted(type_count.items(), key=lambda kv: kv[1], reverse=True)
    ]

    # --- difficulty distribution ---
    diff_count: dict[str, int] = defaultdict(int)
    for q in questions:
        diff_count[q.difficulty] += 1
    difficulty = [
        {"level": lvl, "count": diff_count.get(lvl, 0)}
        for lvl in ("Easy", "Medium", "Hard")
    ]
    diff_weight = {"Easy": 1, "Medium": 2, "Hard": 3}
    avg_diff_num = sum(diff_weight.get(q.difficulty, 2) for q in questions) / total_questions
    avg_difficulty = "Easy" if avg_diff_num < 1.66 else "Medium" if avg_diff_num < 2.33 else "Hard"

    # --- marks distribution ---
    marks_count: dict[int, int] = defaultdict(int)
    for q in questions:
        if q.marks is not None:
            marks_count[q.marks] += 1
    marks_distribution = [
        {"marks": m, "count": c} for m, c in sorted(marks_count.items())
    ]

    # --- year trends (per topic, top 8 by frequency) ---
    year_trends = [
        {
            "topic": topic,
            "years": [
                {"year": y, "count": topic_years[topic][y]}
                for y in sorted(topic_years[topic])
            ],
        }
        for topic, _ in ranked[:8]
        if topic_years[topic]
    ]

    # --- readiness + revision risk (attempted topics only) ---
    attempted = [t for t in topic_count if t in stats and stats[t].total > 0]
    coverage = round(100 * len(attempted) / len(topic_count)) if topic_count else 0

    weighted_num = 0.0
    weighted_den = 0
    weak, strong = [], []
    for topic in attempted:
        acc = topic_accuracy(topic) or 0
        weighted_num += acc * topic_count[topic]
        weighted_den += topic_count[topic]
        (weak if acc < 60 else strong).append(topic)
    readiness_pct = round(weighted_num / weighted_den) if weighted_den else 0

    revision_risk = []
    for topic in attempted:
        acc = topic_accuracy(topic) or 0
        occ = topic_count[topic]
        score = (occ / mx) * (1 - acc / 100)  # high frequency + low accuracy
        risk = "High" if score >= 0.4 else "Medium" if score >= 0.2 else "Low"
        revision_risk.append(
            {"topic": topic, "occurrences": occ, "accuracy": acc, "risk": risk, "score": round(score, 3)}
        )
    revision_risk.sort(key=lambda r: r["score"], reverse=True)

    summary = {
        "topicsIdentified": len(topic_count),
        "recurringTopics": recurring,
        "questionTypes": len(type_count),
        "avgDifficulty": avg_difficulty,
        "coverage": coverage,
        "readiness": readiness_pct,
    }

    return {
        "course": course,
        "papers": len(papers),
        "totalQuestions": total_questions,
        "yearsLabel": years_label,
        "summary": summary,
        "topicFrequency": topic_freq,
        "patterns": patterns,
        "difficulty": difficulty,
        "marksDistribution": marks_distribution,
        "yearTrends": year_trends,
        "revisionRisk": revision_risk,
        "readiness": {
            "coverage": coverage,
            "readiness": readiness_pct,
            "weakTopics": weak,
            "strongTopics": strong,
        },
    }
