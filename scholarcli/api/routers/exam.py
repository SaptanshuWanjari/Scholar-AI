"""Exam mode — generate a timed question set and grade submissions.

Sessions are persisted in the ExamSession table so they survive process
restarts. Subjective answers (short/long) are scored 0-100 by the LLM for
partial credit. Timing is measured server-side from started_at.
"""

from __future__ import annotations

import json
import re
import secrets
from collections import defaultdict
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.api import parsers, pyq_service
from scholarcli.api.activity_service import record_activity
from scholarcli.api.prompt_service import active_body
from scholarcli.api.rag_service import run_ask
from scholarcli.api.schemas import (
    ExamGenerateRequest,
    ExamQuestionOut,
    ExamResultOut,
    ExamSessionOut,
    ExamStatusOut,
    ExamSubmitRequest,
)

# Grace window: server accepts a late submission within this many seconds past
# expiry (clock skew / in-flight request) but still flags it as timed out.
_GRACE_SECONDS = 10


def _aware(dt: datetime | None) -> datetime | None:
    if dt is not None and dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def _remaining_seconds(exam, now: datetime) -> int | None:
    """Seconds left before expiry, or None for an untimed exam."""
    expires = _aware(getattr(exam, "expires_at", None))
    if not exam.duration_minutes or expires is None:
        return None
    return max(0, int((expires - now).total_seconds()))
from scholarcli.llm import get_llm
from scholarcli.rag.prompts import QUIZ_SYSTEM
from scholarcli.storage import get_session
from scholarcli.storage.models import ExamSession, PYQQuestion

router = APIRouter(prefix="/api/exams", tags=["exam"])


def _sample_pyq_questions(course: str, limit: int = 16) -> list[dict]:
    """Pull real past questions for a course to ground PYQ-based generation."""
    session = get_session()
    try:
        rows = (
            session.query(PYQQuestion)
            .filter(PYQQuestion.course == course)
            .order_by(PYQQuestion.year.desc())
            .limit(limit)
            .all()
        )
        return [
            {"text": r.text, "topic": r.topic, "marks": r.marks}
            for r in rows
        ]
    finally:
        session.close()


def _direct_quiz_generate(query: str) -> str:
    """Generate quiz/exam content via a direct LLM call (no RAG grounding gate).

    Used for PYQ-driven exams where the vector index may be empty.
    """
    system = active_body("quiz") or QUIZ_SYSTEM
    llm = get_llm("quiz")
    resp = llm.invoke([SystemMessage(content=system), HumanMessage(content=query)])
    content = resp.content if hasattr(resp, "content") else str(resp)
    return content if isinstance(content, str) else str(content)


@router.post("/generate", response_model=ExamSessionOut)
async def generate_exam(req: ExamGenerateRequest) -> ExamSessionOut:
    subject = (req.topic or req.course or "").strip()
    if not subject:
        raise HTTPException(status_code=400, detail="topic or course is required")

    types_str = ", ".join(req.types) if req.types else "multiple choice"

    pyq_block = ""
    pyq_topics: list[str] = []
    if req.pyqCourse:
        analysis = await run_in_threadpool(pyq_service.build_analysis, req.pyqCourse)
        topics = analysis.get("topicFrequency", [])[:10]
        pyq_topics = [t["topic"] for t in topics]
        if pyq_topics:
            topic_lines = "\n".join(
                f"- {t['topic']} ({t['frequency']} frequency, {t['occurrences']} past questions)"
                for t in topics
            )
            diff_lines = ", ".join(
                f"{d['level']}: {d['count']}" for d in analysis.get("difficulty", [])
            )
            style_lines = ", ".join(
                f"{p['label']} {p['pct']}%" for p in analysis.get("patterns", [])[:6]
            )
            marks_lines = ", ".join(
                f"{m['marks']}-mark ×{m['count']}" for m in analysis.get("marksDistribution", [])
            )
            pyq_block = f"""
Base this exam on the real previous-year-question trends for this subject — do NOT invent a random mix.
Weight questions toward the most frequent topics below; mirror the historical difficulty, question-style, and marks mix.
Topics (most → least frequent):
{topic_lines}
Historical difficulty distribution: {diff_lines}.
Question-style distribution to mirror: {style_lines or "n/a"}.
Marks distribution seen in past papers: {marks_lines or "n/a"}.
Set each question's 'topic' field to the single best-matching topic from the list above.
"""

    use_pyq = bool(req.pyqCourse and pyq_topics)
    sample_block = ""
    if use_pyq:
        samples = _sample_pyq_questions(req.pyqCourse or "")
        if samples:
            sample_lines = "\n".join(
                f"- {s['text'][:300]}"
                + (f" [topic: {s['topic']}" + (f", {s['marks']} marks]" if s['marks'] else "]") if s['topic'] else "")
                for s in samples
            )
            sample_block = f"""
Real previous-year questions from this subject's uploaded papers — match their style, scope and difficulty, and generate NEW questions in the same spirit (do NOT copy verbatim):
{sample_lines}
"""

    query = f"""Generate a {req.difficulty} difficulty {req.count}-question exam about: {subject}.
Include these question types: {types_str}.
{pyq_block}
{sample_block}
Output the exam strictly as a markdown JSON array block ```json [...] ```.
Each object must have: 'type' (mcq, truefalse, short, or long), 'prompt', 'options' (array of strings, for mcq/truefalse), 'answer' (the exact correct answer string), 'explanation', and 'topic' (a short topic label).
"""
    if use_pyq:
        content = await run_in_threadpool(_direct_quiz_generate, query)
        grounded = True
    else:
        result = await run_in_threadpool(run_ask, query, req.course, req.document, "quiz")
        content = result["content"]
        grounded = result["grounded"]
    parsed = parsers.parse_quiz(content)

    questions: list[ExamQuestionOut] = []
    stored: list[dict] = []
    for i, q in enumerate(parsed):
        eq = {
            "id": f"e{i + 1}",
            "type": q.get("type", "mcq"),
            "topic": (q.get("topic") or "").strip() or subject,
            "difficulty": req.difficulty,
            "prompt": q["prompt"],
            "options": q.get("options"),
            "answer": q.get("answer"),
        }
        stored.append(eq)
        questions.append(ExamQuestionOut(**eq))

    session_id = secrets.token_hex(8)
    now = datetime.now(timezone.utc)
    duration = max(0, int(req.durationMinutes or 0))
    expires_at = now + timedelta(minutes=duration) if duration else None
    db = get_session()
    try:
        db.add(ExamSession(
            id=session_id,
            topic=subject,
            course=req.course or req.pyqCourse,
            questions=stored,
            started_at=now,
            duration_minutes=duration,
            expires_at=expires_at,
        ))
        db.commit()
    finally:
        db.close()

    return ExamSessionOut(
        sessionId=session_id,
        questions=questions,
        grounded=grounded and bool(questions),
        durationMinutes=duration,
        remainingSeconds=(duration * 60 if duration else None),
    )


@router.get("/{session_id}/status", response_model=ExamStatusOut)
def exam_status(session_id: str) -> ExamStatusOut:
    db = get_session()
    try:
        exam = db.get(ExamSession, session_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Exam session not found")
        now = datetime.now(timezone.utc)
        remaining = _remaining_seconds(exam, now)
        return ExamStatusOut(
            sessionId=session_id,
            submitted=exam.submitted_at is not None,
            expired=remaining == 0,
            durationMinutes=exam.duration_minutes,
            remainingSeconds=remaining,
        )
    finally:
        db.close()


@router.post("/{session_id}/submit", response_model=ExamResultOut)
async def submit_exam(session_id: str, payload: ExamSubmitRequest) -> ExamResultOut:
    db = get_session()
    try:
        exam = db.get(ExamSession, session_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Exam session not found or expired")
        if exam.submitted_at is not None:
            raise HTTPException(status_code=409, detail="Exam already submitted")

        questions = exam.questions
        now = datetime.now(timezone.utc)
        started = exam.started_at
        if started.tzinfo is None:
            started = started.replace(tzinfo=timezone.utc)
        elapsed_seconds = int((now - started).total_seconds())

        # Server-side time enforcement: if a duration was set and the window has
        # elapsed (beyond a small grace), the submission is flagged timed-out.
        # We still grade whatever was answered rather than discarding the attempt.
        expires = _aware(exam.expires_at)
        timed_out = bool(
            exam.duration_minutes
            and expires is not None
            and now > expires + timedelta(seconds=_GRACE_SECONDS)
        )

        # Grade short/long answers with LLM (0-100 per question for partial credit)
        needs_grading = [q for q in questions if q.get("type") in ("short", "long")]
        graded_scores: dict[str, int] = {}
        if needs_grading:
            prompt = (
                "Grade the following student answers against the expected answers. "
                "Respond ONLY with a JSON object mapping question ID to an integer score 0-100. "
                "100 = fully correct, 0 = completely wrong; award partial credit proportionally. "
                'Example: {"e1": 100, "e2": 45, "e3": 0}\n\n'
            )
            for q in needs_grading:
                given = (payload.answers.get(q["id"]) or "").strip()
                expected = (q.get("answer") or "").strip()
                prompt += f'ID: {q["id"]}\nQuestion: {q["prompt"]}\nExpected: {expected}\nGiven: {given}\n\n'
            try:
                res = await run_in_threadpool(run_ask, prompt, None, None, "quick_qa")
                json_str = res["content"]
                fence = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', json_str, re.DOTALL | re.IGNORECASE)
                if fence:
                    json_str = fence.group(1)
                elif "{" in json_str and "}" in json_str:
                    json_str = json_str[json_str.find("{"):json_str.rfind("}") + 1]
                raw = json.loads(json_str)
                # Normalise: accept booleans (legacy) and convert to 0/100
                for k, v in raw.items():
                    if isinstance(v, bool):
                        graded_scores[k] = 100 if v else 0
                    else:
                        graded_scores[k] = max(0, min(100, int(v)))
            except Exception:
                pass

        correct: float = 0.0
        by_topic: dict[str, list[int]] = defaultdict(lambda: [0, 0])
        by_diff: dict[str, list[int]] = defaultdict(lambda: [0, 0])
        review_list = []
        incorrect_questions = []

        for q in questions:
            given = (payload.answers.get(q["id"]) or "").strip()
            expected = (q.get("answer") or "").strip()

            if q.get("type") in ("short", "long"):
                q_score = graded_scores.get(q["id"], 0)
                contribution = q_score / 100.0
            else:
                g_clean = re.sub(r'^[a-d][\)\.\:]\s*', '', given.lower()).strip()
                e_clean = re.sub(r'^[a-d][\)\.\:]\s*', '', expected.lower()).strip()
                match = bool(e_clean) and g_clean == e_clean
                q_score = 100 if match else 0
                contribution = float(match)

            correct += contribution
            if contribution < 1.0:
                incorrect_questions.append({
                    "prompt": q["prompt"],
                    "topic": q["topic"],
                    "given": given,
                    "expected": expected,
                })

            by_topic[q["topic"]][0] += round(contribution * 100)
            by_topic[q["topic"]][1] += 100
            by_diff[q["difficulty"]][0] += round(contribution * 100)
            by_diff[q["difficulty"]][1] += 100

            review_list.append({
                "id": q["id"],
                "prompt": q["prompt"],
                "given": given,
                "expected": expected,
                "correct": contribution >= 1.0,
                "score": q_score,
                "topic": q["topic"],
            })

        total = len(questions)
        score = round(100 * correct / total) if total else 0

        record_activity(
            "exam",
            f"Exam: {exam.topic} — {score}%",
            exam.course or "",
            minutes=elapsed_seconds // 60 or None,
        )

        if exam.course:
            # Convert back to [correct_count, total_count] for the existing API
            topic_for_stat = {
                t: [vals[0] // 100, vals[1] // 100]
                for t, vals in by_topic.items()
            }
            pyq_service.record_topic_results(exam.course, topic_for_stat)

        exam.submitted_at = now
        db.commit()
    finally:
        db.close()

    topic_perf = [
        {"topic": t, "score": round(100 * c / n) if n else 0}
        for t, (c, n) in by_topic.items()
    ]
    diff_analysis = [
        {"level": lvl, "correct": c, "total": n}
        for lvl, (c, n) in by_diff.items()
    ]

    recommended_revisions: list[str] = []
    if incorrect_questions:
        rev_prompt = "The user answered these exam questions incorrectly:\n"
        for iq in incorrect_questions:
            rev_prompt += f"- Q: {iq['prompt']} (Topic: {iq['topic']})\n"
        rev_prompt += (
            "\nBased on these mistakes, identify the specific weak topics. "
            "Return ONLY a bulleted list of 2-3 short, highly actionable recommended revision topics. "
            "Do not include introductory text."
        )
        try:
            result = await run_in_threadpool(run_ask, rev_prompt, None, None, "quick_qa")
            lines = [line.strip() for line in result["content"].split("\n")]
            for line in lines:
                if line.startswith(("- ", "* ")):
                    recommended_revisions.append(line[2:].strip())
                elif len(line) > 2 and line[0].isdigit() and line[1] in [".", ")"]:
                    recommended_revisions.append(line[2:].strip())
            if not recommended_revisions:
                recommended_revisions = [l for l in lines if l]
        except Exception:
            pass

    return ExamResultOut(
        score=score,
        correct=round(correct, 2),
        total=total,
        topicPerformance=topic_perf,
        difficultyAnalysis=diff_analysis,
        review=review_list,
        recommendedRevisions=recommended_revisions[:3],
        elapsedSeconds=elapsed_seconds,
        timedOut=timed_out,
    )
