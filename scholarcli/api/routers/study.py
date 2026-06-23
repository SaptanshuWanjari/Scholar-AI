"""Generative study endpoints — flashcards, quizzes, diagrams, mind maps,
revision notes. Each reuses the RAG pipeline with an explicit route (which
selects the matching system prompt) and parses the text result into the
structured shapes the frontend expects.
"""

from __future__ import annotations

import json

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import StreamingResponse

from scholarcli.api import parsers
from scholarcli.api.activity_service import record_activity
from scholarcli.api.rag_service import run_ask, stream_ask
from scholarcli.api.schemas import (
    DiagramOut,
    FlashcardOut,
    FlashcardSet,
    GenerateDiagramRequest,
    GenerateFlashcardsRequest,
    GenerateMindmapRequest,
    GenerateQuizRequest,
    GenerateRevisionRequest,
    MindmapOut,
    QuizOut,
    QuizQuestionOut,
    RevisionOut,
)

router = APIRouter(prefix="/api", tags=["study"])


def _stable_id(prefix: str, *parts: str) -> str:
    return f"{prefix}-{abs(hash('|'.join(parts))) % 10_000_000}"


@router.post("/flashcards/generate", response_model=FlashcardSet)
async def generate_flashcards(req: GenerateFlashcardsRequest) -> FlashcardSet:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    query = f"Generate {req.count} flashcards covering: {topic}"
    result = await run_in_threadpool(run_ask, query, req.course, "flashcards")
    cards = parsers.parse_flashcards(result["content"], deck=topic)
    record_activity("flashcard", f"Generated flashcards: {topic}", req.course or "")
    return FlashcardSet(
        deck=topic,
        course=req.course,
        grounded=result["grounded"],
        cards=[FlashcardOut(**c) for c in cards],
    )


@router.post("/quizzes/generate", response_model=QuizOut)
async def generate_quiz(req: GenerateQuizRequest) -> QuizOut:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    query = f"Generate a {req.difficulty} difficulty quiz about: {topic}"
    result = await run_in_threadpool(run_ask, query, req.course, "quiz")
    questions = parsers.parse_quiz(result["content"])
    record_activity("quiz", f"Generated quiz: {topic}", req.course or "")
    return QuizOut(
        id=_stable_id("quiz", topic, req.difficulty),
        title=topic,
        course=req.course or "All courses",
        difficulty=req.difficulty,
        grounded=result["grounded"],
        questions=[QuizQuestionOut(**q) for q in questions],
    )


@router.post("/diagrams/generate", response_model=DiagramOut)
async def generate_diagram(req: GenerateDiagramRequest) -> DiagramOut:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    kind = (req.type or "flowchart").replace("_", " ")
    query = f"Generate a {kind} diagram about: {topic}"
    result = await run_in_threadpool(run_ask, query, req.course, "mermaid")
    mermaid = parsers.strip_mermaid_fences(result["content"])
    course_name = req.course or "All courses"
    kind_label = kind.title()
    diagram_id = _stable_id("dg", topic, kind)

    # Persist grounded diagrams so the library survives reloads.
    if result["grounded"] and mermaid.strip():
        from scholarcli.storage import get_session
        from scholarcli.storage.models import Diagram

        session = get_session()
        try:
            row = Diagram(title=topic, course=course_name, kind=kind_label, mermaid=mermaid)
            session.add(row)
            session.commit()
            session.refresh(row)
            diagram_id = str(row.id)
        finally:
            session.close()

    record_activity("diagram", f"Generated diagram: {topic}", req.course or "")
    return DiagramOut(
        id=diagram_id,
        title=topic,
        course=course_name,
        kind=kind_label,
        mermaid=mermaid,
        grounded=result["grounded"],
    )


@router.post("/mindmaps/generate", response_model=MindmapOut)
async def generate_mindmap(req: GenerateMindmapRequest) -> MindmapOut:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    query = f"Generate a mind map about: {topic}"
    result = await run_in_threadpool(run_ask, query, req.course, "mindmap")
    return MindmapOut(
        id=_stable_id("mm", topic),
        title=topic,
        course=req.course or "All courses",
        text=result["content"],
        grounded=result["grounded"],
    )


@router.post("/revision/generate", response_model=RevisionOut)
async def generate_revision(req: GenerateRevisionRequest) -> RevisionOut:
    subject = (req.topic or req.course or "").strip()
    if not subject:
        raise HTTPException(status_code=400, detail="topic or course is required")
    format_hint = {
        "notes": "concise revision notes",
        "concepts": "a list of key concepts with short explanations",
        "formulas": "a formula sheet with each formula explained",
        "summary": "a high-level summary",
    }[req.format]
    query = f"Create {format_hint} for: {subject}"
    result = await run_in_threadpool(run_ask, query, req.course, "study_notes")
    return RevisionOut(
        title=subject,
        markdown=result["content"],
        grounded=result["grounded"],
    )


@router.post("/revision/generate/stream")
async def generate_revision_stream(req: GenerateRevisionRequest) -> StreamingResponse:
    subject = (req.topic or req.course or "").strip()
    if not subject:
        raise HTTPException(status_code=400, detail="topic or course is required")
    format_hint = {
        "notes": "concise revision notes",
        "concepts": "a list of key concepts with short explanations",
        "formulas": "a formula sheet with each formula explained",
        "summary": "a high-level summary",
    }[req.format]
    query = f"Create {format_hint} for: {subject}"
    record_activity("revision", f"Generated revision: {subject}", req.course or "")

    def event_stream():
        try:
            for event in stream_ask(query, req.course, "study_notes"):
                # Attach title on the done event so the frontend can label the result
                if event.get("type") == "done":
                    event["title"] = subject
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as exc:  # noqa: BLE001
            yield f"data: {json.dumps({'type': 'error', 'value': str(exc)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
