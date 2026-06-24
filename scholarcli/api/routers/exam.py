"""Exam mode — generate a timed question set and grade submissions.

Sessions live in memory (keyed by sessionId) for the life of the process —
enough to support generate → take → submit without a new persistence table.
"""

from __future__ import annotations

from collections import defaultdict

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
    ExamSubmitRequest,
)
from scholarcli.llm import get_llm
from scholarcli.rag.prompts import QUIZ_SYSTEM
from scholarcli.storage import get_session
from scholarcli.storage.models import PYQQuestion

router = APIRouter(prefix="/api/exams", tags=["exam"])

# sessionId -> {"questions": [dict], "topic": str}
_sessions: dict[str, dict] = {}


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

    Used for PYQ-driven exams: the source of truth is the user's uploaded
    question papers, not the document vector index (which may be empty for a
    course that only has PYQs).
    """
    system = active_body("quiz") or QUIZ_SYSTEM
    llm = get_llm("quiz")
    resp = llm.invoke([SystemMessage(content=system), HumanMessage(content=query)])
    return resp.content if hasattr(resp, "content") else str(resp)


@router.post("/generate", response_model=ExamSessionOut)
async def generate_exam(req: ExamGenerateRequest) -> ExamSessionOut:
    subject = (req.topic or req.course or "").strip()
    if not subject:
        raise HTTPException(status_code=400, detail="topic or course is required")

    types_str = ", ".join(req.types) if req.types else "multiple choice"

    # PYQ-aware generation: mirror the real paper's topic/difficulty/style mix
    # and force each question to be tagged with one of the PYQ topics, so the
    # submit step can accumulate per-topic accuracy.
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

    # Ground PYQ-driven exams in the user's actual uploaded papers (a sample of
    # real past questions) so generation works even when the course has no
    # indexed notes in the document vector store.
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

    session_id = f"exam-{abs(hash(subject + content)) % 10_000_000}"
    _sessions[session_id] = {"questions": stored, "topic": subject, "course": req.pyqCourse}

    return ExamSessionOut(
        sessionId=session_id,
        questions=questions,
        grounded=grounded and bool(questions),
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
    # Feed the PYQ accuracy loop when this exam was generated from a course's PYQs.
    if session.get("course"):
        pyq_service.record_topic_results(session["course"], dict(by_topic))
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
