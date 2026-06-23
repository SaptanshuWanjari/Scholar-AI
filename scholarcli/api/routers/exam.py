"""Exam mode — generate a timed question set and grade submissions.

Sessions live in memory (keyed by sessionId) for the life of the process —
enough to support generate → take → submit without a new persistence table.
"""

from __future__ import annotations

from collections import defaultdict

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from scholarcli.api import parsers
from scholarcli.api.activity_service import record_activity
from scholarcli.api.rag_service import run_ask
from scholarcli.api.schemas import (
    ExamGenerateRequest,
    ExamQuestionOut,
    ExamResultOut,
    ExamSessionOut,
    ExamSubmitRequest,
)

router = APIRouter(prefix="/api/exams", tags=["exam"])

# sessionId -> {"questions": [dict], "topic": str}
_sessions: dict[str, dict] = {}


@router.post("/generate", response_model=ExamSessionOut)
async def generate_exam(req: ExamGenerateRequest) -> ExamSessionOut:
    subject = (req.topic or req.course or "").strip()
    if not subject:
        raise HTTPException(status_code=400, detail="topic or course is required")

    query = f"Generate a {req.difficulty} difficulty {req.count}-question exam about: {subject}"
    result = await run_in_threadpool(run_ask, query, req.course, "quiz")
    parsed = parsers.parse_quiz(result["content"])

    questions: list[ExamQuestionOut] = []
    stored: list[dict] = []
    for i, q in enumerate(parsed):
        eq = {
            "id": f"e{i + 1}",
            "type": "mcq",
            "topic": subject,
            "difficulty": req.difficulty,
            "prompt": q["prompt"],
            "options": q.get("options"),
            "answer": q.get("answer"),
        }
        stored.append(eq)
        questions.append(ExamQuestionOut(**eq))

    session_id = f"exam-{abs(hash(subject + result['content'])) % 10_000_000}"
    _sessions[session_id] = {"questions": stored, "topic": subject}

    return ExamSessionOut(
        sessionId=session_id,
        questions=questions,
        grounded=result["grounded"] and bool(questions),
    )


@router.post("/{session_id}/submit", response_model=ExamResultOut)
def submit_exam(session_id: str, payload: ExamSubmitRequest) -> ExamResultOut:
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Exam session not found or expired")

    questions = session["questions"]
    total = len(questions)
    correct = 0
    by_topic: dict[str, list[int]] = defaultdict(lambda: [0, 0])  # topic -> [correct, total]
    by_diff: dict[str, list[int]] = defaultdict(lambda: [0, 0])

    for q in questions:
        given = (payload.answers.get(q["id"]) or "").strip()
        expected = (q.get("answer") or "").strip()
        ok = bool(expected) and given.lower() == expected.lower()
        if ok:
            correct += 1
        by_topic[q["topic"]][0] += int(ok)
        by_topic[q["topic"]][1] += 1
        by_diff[q["difficulty"]][0] += int(ok)
        by_diff[q["difficulty"]][1] += 1

    score = round(100 * correct / total) if total else 0
    record_activity("exam", f"Exam: {session['topic']} — {score}%", "", minutes=payload.timeSpent // 60 if payload.timeSpent else None)
    topic_perf = [
        {"topic": t, "score": round(100 * c / n) if n else 0} for t, (c, n) in by_topic.items()
    ]
    diff_analysis = [
        {"level": lvl, "correct": c, "total": n} for lvl, (c, n) in by_diff.items()
    ]

    return ExamResultOut(
        score=score,
        correct=correct,
        total=total,
        topicPerformance=topic_perf,
        difficultyAnalysis=diff_analysis,
    )
