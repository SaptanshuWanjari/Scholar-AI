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
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.api import parsers
from scholarcli.ingest.loaders import load_document
from scholarcli.llm import get_llm
from scholarcli.storage import get_session
from scholarcli.storage.models import PYQQuestion, QuestionPaper, TopicStat

# Cap paper text fed to the model — a question paper is a few pages; this guards
# against a stray huge upload blowing the context window.
_MAX_CHARS = 16000

_EXTRACT_SYSTEM = (
    "You extract exam questions from a previous-year question paper. "
    "Return ONLY a JSON array, no prose. Each element is an object with: "
    "'text' (the full question, verbatim), "
    "'topic' (a short canonical topic name, e.g. 'Deadlocks'), "
    "'difficulty' (one of Easy, Medium, Hard), "
    "'type' (one of compare, explain, short, case, numerical, other), "
    "'marks' (integer or null). "
    "Use consistent topic names across similar questions so they group cleanly. "
    "Skip instructions, headers, and marks tables — only real questions."
)

_PATTERN_LABELS = {
    "compare": "Compare Questions",
    "explain": "Explain Questions",
    "short": "Short Notes",
    "case": "Case Studies",
    "numerical": "Numericals",
    "other": "Other",
}


# ---------------------------------------------------------------------------
# Extraction + persistence
# ---------------------------------------------------------------------------

def _read_text(path: Path) -> str:
    """Load a document's plain text (joined pages) for extraction."""
    content_hash = hashlib.sha256(path.read_bytes()).hexdigest()
    pages, _ = load_document(path, content_hash)
    return "\n\n".join(p.text for p in pages).strip()


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
            stat.correct += int(correct)
            stat.total += int(total)
            stat.last_attempt = now
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
    for q in questions:
        topic_count[q.topic] += 1
        if q.year is not None:
            topic_years[q.topic][q.year] += 1
        topic_styles[q.topic].add(q.qtype)

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
        "yearTrends": year_trends,
        "revisionRisk": revision_risk,
        "readiness": {
            "coverage": coverage,
            "readiness": readiness_pct,
            "weakTopics": weak,
            "strongTopics": strong,
        },
    }
