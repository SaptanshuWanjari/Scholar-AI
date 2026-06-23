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

    types_str = ", ".join(req.types) if req.types else "multiple choice"
    query = f"""Generate a {req.difficulty} difficulty {req.count}-question exam about: {subject}.
Include these question types: {types_str}.
Output the exam strictly as a markdown JSON array block ```json [...] ```.
Each object must have: 'type' (mcq, truefalse, short, or long), 'prompt', 'options' (array of strings, for mcq/truefalse), 'answer' (the exact correct answer string), and 'explanation'.
"""
    result = await run_in_threadpool(run_ask, query, req.course, req.document, "quiz")
    parsed = parsers.parse_quiz(result["content"])

    questions: list[ExamQuestionOut] = []
    stored: list[dict] = []
    for i, q in enumerate(parsed):
        eq = {
            "id": f"e{i + 1}",
            "type": q.get("type", "mcq"),
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
async def submit_exam(session_id: str, payload: ExamSubmitRequest) -> ExamResultOut:
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Exam session not found or expired")

    questions = session["questions"]
    total = len(questions)

    # Pre-grade short/long questions with LLM
    needs_grading = [q for q in questions if q.get("type") in ("short", "long")]
    graded_results = {}
    if needs_grading:
        prompt = "Grade the following user answers against the expected answers. Respond strictly with a JSON object mapping question ID to a boolean (true if the given answer is conceptually correct or very close, false otherwise). Be lenient for minor typos or phrasing differences.\n\n"
        for q in needs_grading:
            given = (payload.answers.get(q["id"]) or "").strip()
            expected = (q.get("answer") or "").strip()
            prompt += f'ID: {q["id"]}\nQuestion: {q["prompt"]}\nExpected: {expected}\nGiven: {given}\n\n'
        prompt += 'Output ONLY the JSON object, e.g. `{"e1": true, "e2": false}`'
        try:
            import re, json
            res = await run_in_threadpool(run_ask, prompt, None, None, "study")
            match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', res["content"], re.DOTALL | re.IGNORECASE)
            json_str = match.group(1) if match else res["content"]
            if "{" in json_str and "}" in json_str:
                json_str = json_str[json_str.find("{"):json_str.rfind("}")+1]
                graded_results = json.loads(json_str)
        except Exception:
            pass

    correct = 0
    by_topic: dict[str, list[int]] = defaultdict(lambda: [0, 0])  # topic -> [correct, total]
    by_diff: dict[str, list[int]] = defaultdict(lambda: [0, 0])

    review_list = []
    incorrect_questions = []

    for q in questions:
        given = (payload.answers.get(q["id"]) or "").strip()
        expected = (q.get("answer") or "").strip()
        
        if q.get("type") in ("short", "long"):
            ok = graded_results.get(q["id"], False)
        else:
            import re
            g_clean = re.sub(r'^[a-d][\)\.\:]\s*', '', given.lower()).strip()
            e_clean = re.sub(r'^[a-d][\)\.\:]\s*', '', expected.lower()).strip()
            ok = bool(e_clean) and g_clean == e_clean
            
        if ok:
            correct += 1
        else:
            incorrect_questions.append({"prompt": q["prompt"], "topic": q["topic"], "given": given, "expected": expected})
            
        by_topic[q["topic"]][0] += int(ok)
        by_topic[q["topic"]][1] += 1
        by_diff[q["difficulty"]][0] += int(ok)
        by_diff[q["difficulty"]][1] += 1
        
        review_list.append({
            "id": q["id"],
            "prompt": q["prompt"],
            "given": given,
            "expected": expected,
            "correct": ok,
            "topic": q["topic"]
        })

    score = round(100 * correct / total) if total else 0
    record_activity("exam", f"Exam: {session['topic']} — {score}%", "", minutes=payload.timeSpent // 60 if payload.timeSpent else None)
    topic_perf = [
        {"topic": t, "score": round(100 * c / n) if n else 0} for t, (c, n) in by_topic.items()
    ]
    diff_analysis = [
        {"level": lvl, "correct": c, "total": n} for lvl, (c, n) in by_diff.items()
    ]

    recommended_revisions = []
    if incorrect_questions:
        prompt = f"The user answered these exam questions incorrectly:\n"
        for iq in incorrect_questions:
            prompt += f"- Q: {iq['prompt']} (Topic: {iq['topic']})\n"
        prompt += "\nBased on these mistakes, identify the specific weak topics. Return ONLY a bulleted list of 2-3 short, highly actionable recommended revision topics. Do not include introductory text."
        
        try:
            result = await run_in_threadpool(run_ask, prompt, None, None, "study")
            content = result["content"]
            lines = [line.strip() for line in content.split("\n")]
            for line in lines:
                if line.startswith("- "):
                    recommended_revisions.append(line[2:].strip())
                elif line.startswith("* "):
                    recommended_revisions.append(line[2:].strip())
                elif len(line) > 2 and line[0].isdigit() and line[1] in [".", ")"]:
                    recommended_revisions.append(line[2:].strip())
            if not recommended_revisions:
                recommended_revisions = [line for line in lines if line]
        except Exception:
            pass

    return ExamResultOut(
        score=score,
        correct=correct,
        total=total,
        topicPerformance=topic_perf,
        difficultyAnalysis=diff_analysis,
        review=review_list,
        recommendedRevisions=recommended_revisions[:3]
    )
