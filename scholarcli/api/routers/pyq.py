"""PYQ (previous-year question) analysis endpoints.

These power a dedicated **Assessment Library** (question papers, mock tests)
kept *separate* from the Knowledge Library (the RAG-indexed documents). PYQs are
deliberately NOT ingested into the vector store — mixing exam papers into RAG
retrieval pollutes answer quality. The ``QuestionPaper`` / ``PYQQuestion`` tables
are the source of truth here; analytics are computed deterministically from them
(see ``pyq_service``).
"""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

from scholarcli.api import pyq_service
from scholarcli.api.activity_service import record_activity
from scholarcli.api.schemas import (
    PyqAnalysisOut,
    PyqDifferenceSuggestion,
    PyqPaperOut,
    PyqQuestionOut,
    PyqQuestionPatch,
    PyqUploadResponse,
)
from scholarcli.config import get_settings
from scholarcli.storage import get_session
from scholarcli.storage.models import PYQQuestion, QuestionPaper

router = APIRouter(prefix="/api/pyq", tags=["pyq"])

_SUPPORTED_SUFFIXES = {".pdf", ".md", ".markdown", ".txt", ".text"}


def _serialize_paper(p: QuestionPaper) -> PyqPaperOut:
    return PyqPaperOut(
        id=p.id,
        course=p.course,
        title=p.title,
        year=p.year,
        questionCount=p.question_count,
        createdAt=p.created_at.strftime("%Y-%m-%d") if p.created_at else "",
    )


@router.post("/papers/upload", response_model=PyqUploadResponse, status_code=201)
async def upload_paper(
    file: UploadFile = File(...),
    course: str = Form(...),
    year: int | None = Form(None),
) -> PyqUploadResponse:
    course_name = course.strip()
    if not course_name:
        raise HTTPException(status_code=400, detail="course is required")

    filename = Path(file.filename or "upload").name
    suffix = Path(filename).suffix.lower()
    if suffix not in _SUPPORTED_SUFFIXES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{suffix}'. Supported: PDF, Markdown, TXT.",
        )

    # Assessment Library lives apart from the RAG-indexed uploads, so PYQ files
    # never enter the knowledge base / vector store.
    pyq_dir = get_settings().paths.resolved_data_dir() / "pyq"
    pyq_dir.mkdir(parents=True, exist_ok=True)
    dest = pyq_dir / filename
    dest.write_bytes(await file.read())

    title = Path(filename).stem
    try:
        paper = await run_in_threadpool(
            pyq_service.extract_and_store,
            course=course_name,
            title=title,
            year=year,
            source_document=filename,
            path=dest,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001 — surface LLM/extraction failures
        raise HTTPException(status_code=500, detail=f"Extraction failed: {exc}") from exc

    record_activity("exam", f"Analyzed PYQ: {title} ({paper.question_count} questions)", course_name)
    return PyqUploadResponse(paper=_serialize_paper(paper), extracted=paper.question_count)


@router.get("/papers", response_model=list[PyqPaperOut])
def list_papers(course: str | None = None) -> list[PyqPaperOut]:
    session = get_session()
    try:
        q = session.query(QuestionPaper)
        if course and course != "all":
            q = q.filter(QuestionPaper.course == course)
        rows = q.order_by(QuestionPaper.created_at.desc()).all()
        return [_serialize_paper(p) for p in rows]
    finally:
        session.close()


@router.delete("/papers/{paper_id}", status_code=204)
def delete_paper(paper_id: int) -> None:
    session = get_session()
    try:
        paper = session.get(QuestionPaper, paper_id)
        if not paper:
            raise HTTPException(status_code=404, detail="Paper not found")
        session.delete(paper)  # cascade removes its questions
        session.commit()
    finally:
        session.close()


@router.get("/analysis", response_model=PyqAnalysisOut)
async def analysis(course: str) -> PyqAnalysisOut:
    course = course.strip()
    if not course:
        raise HTTPException(status_code=400, detail="course is required")
    data = await run_in_threadpool(pyq_service.build_analysis, course)
    return PyqAnalysisOut(**data)


@router.get("/difference-suggestions", response_model=list[PyqDifferenceSuggestion])
async def difference_suggestions(course: str) -> list[PyqDifferenceSuggestion]:
    course = course.strip()
    if not course:
        raise HTTPException(status_code=400, detail="course is required")
    pairs = await run_in_threadpool(pyq_service.difference_suggestions, course)
    return [PyqDifferenceSuggestion(**p) for p in pairs]


@router.get("/questions", response_model=list[PyqQuestionOut])
def list_questions(
    course: str,
    year: int | None = None,
    topic: str | None = None,
    difficulty: str | None = None,
    type: str | None = None,
    q: str | None = None,
) -> list[PyqQuestionOut]:
    session = get_session()
    try:
        query = session.query(PYQQuestion).filter(PYQQuestion.course == course)
        if year is not None:
            query = query.filter(PYQQuestion.year == year)
        if topic:
            query = query.filter(PYQQuestion.topic == topic)
        if difficulty:
            query = query.filter(PYQQuestion.difficulty == difficulty)
        if type:
            query = query.filter(PYQQuestion.qtype == type)
        if q:
            query = query.filter(PYQQuestion.text.ilike(f"%{q}%"))
        rows = query.order_by(PYQQuestion.year.desc().nullslast(), PYQQuestion.id).all()
        return [
            PyqQuestionOut(
                id=r.id,
                text=r.text,
                topic=r.topic,
                subtopics=r.subtopics or [],
                difficulty=r.difficulty,
                type=r.qtype,
                marks=r.marks,
                year=r.year,
            )
            for r in rows
        ]
    finally:
        session.close()


_QUESTION_FIELD_MAP = {"type": "qtype"}


@router.patch("/questions/{question_id}", response_model=PyqQuestionOut)
def patch_question(question_id: int, body: PyqQuestionPatch) -> PyqQuestionOut:
    session = get_session()
    try:
        q = session.get(PYQQuestion, question_id)
        if not q:
            raise HTTPException(status_code=404, detail="Question not found")
        for field, value in body.model_dump(exclude_unset=True).items():
            setattr(q, _QUESTION_FIELD_MAP.get(field, field), value)
        session.commit()
        session.refresh(q)
        return PyqQuestionOut(
            id=q.id,
            text=q.text,
            topic=q.topic,
            subtopics=q.subtopics or [],
            difficulty=q.difficulty,
            type=q.qtype,
            marks=q.marks,
            year=q.year,
        )
    finally:
        session.close()


@router.delete("/questions/{question_id}", status_code=204)
def delete_question(question_id: int) -> None:
    session = get_session()
    try:
        q = session.get(PYQQuestion, question_id)
        if not q:
            raise HTTPException(status_code=404, detail="Question not found")
        paper = session.get(QuestionPaper, q.paper_id)
        session.delete(q)
        if paper and paper.question_count > 0:
            paper.question_count -= 1
        session.commit()
    finally:
        session.close()
