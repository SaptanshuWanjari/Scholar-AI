"""PYQ (previous-year question) analysis endpoints.

Upload a paper → ingest it (so its content is searchable like any document) →
extract structured questions via the LLM and persist them. All analytics are
then computed deterministically from the stored rows (see ``pyq_service``).
"""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

from scholarcli.api import pyq_service
from scholarcli.api.activity_service import record_activity
from scholarcli.api.schemas import (
    PyqAnalysisOut,
    PyqPaperOut,
    PyqQuestionOut,
    PyqUploadResponse,
)
from scholarcli.config import get_settings
from scholarcli.ingest.pipeline import ingest_file
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

    uploads_dir = get_settings().paths.resolved_data_dir() / "uploads"
    uploads_dir.mkdir(parents=True, exist_ok=True)
    dest = uploads_dir / filename
    dest.write_bytes(await file.read())

    # Ingest so the paper is also a searchable Document (reuses the pipeline).
    try:
        status = await run_in_threadpool(ingest_file, dest, course_name)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {exc}") from exc
    if status == "no-content":
        raise HTTPException(status_code=422, detail="No extractable text in paper")

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
                difficulty=r.difficulty,
                type=r.qtype,
                marks=r.marks,
                year=r.year,
            )
            for r in rows
        ]
    finally:
        session.close()
