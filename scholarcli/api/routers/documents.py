"""Document + source-search endpoints."""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

import scholarcli.llm
from scholarcli.api.activity_service import record_activity
from scholarcli.api.rag_service import serialize_chunks
from scholarcli.api.schemas import DocumentOut, DocumentPatch, SourceOut
from scholarcli.config import get_settings
from scholarcli.ingest.pipeline import ingest_file
from scholarcli.storage import get_session
from scholarcli.storage.models import Course, Document
from scholarcli.storage.vectors import delete_document, search

router = APIRouter(prefix="/api", tags=["documents"])

# Stored file_type -> frontend DocType.
_TYPE_MAP = {"pdf": "pdf", "md": "markdown", "txt": "text", "docx": "docx"}
_SUPPORTED_SUFFIXES = {".pdf", ".md", ".markdown", ".txt", ".text"}


def _serialize(doc: Document, course_name: str) -> DocumentOut:
    return DocumentOut(
        id=str(doc.id),
        title=doc.title,
        type=_TYPE_MAP.get(doc.file_type, "text"),
        course=course_name,
        sizeKb=doc.size_kb,
        pages=doc.pages,
        addedAt=doc.indexed_at.strftime("%Y-%m-%d") if doc.indexed_at else "",
        status=doc.status,
    )


@router.get("/documents", response_model=list[DocumentOut])
def list_documents(course: str | None = None, search: str | None = None) -> list[DocumentOut]:
    session = get_session()
    try:
        q = session.query(Document, Course).join(Course, Document.course_id == Course.id)
        if course and course != "all":
            q = q.filter(Course.name == course)
        if search:
            q = q.filter(Document.title.ilike(f"%{search}%"))
        rows = q.order_by(Document.indexed_at.desc()).all()
        return [_serialize(doc, c.name) for doc, c in rows]
    finally:
        session.close()


@router.post("/documents/upload", response_model=DocumentOut, status_code=201)
async def upload_document(
    file: UploadFile = File(...), course: str = Form(...)
) -> DocumentOut:
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

    try:
        status = await run_in_threadpool(ingest_file, dest, course_name)
    except Exception as exc:  # noqa: BLE001 — surface ingest failures to the client
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {exc}") from exc

    if status == "no-content":
        raise HTTPException(status_code=422, detail="No extractable text in document")

    session = get_session()
    try:
        row = (
            session.query(Document, Course)
            .join(Course, Document.course_id == Course.id)
            .filter(Document.path == str(dest.resolve()), Course.name == course_name)
            .first()
        )
        if not row:
            raise HTTPException(status_code=500, detail="Document not found after ingest")
        doc, c = row
        record_activity("document", f"Indexed {doc.title}", c.name)
        return _serialize(doc, c.name)
    finally:
        session.close()


@router.delete("/documents/{document_id}", status_code=204)
def delete_document_endpoint(document_id: int) -> None:
    session = get_session()
    try:
        doc = session.get(Document, document_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        delete_document(doc.id)
        session.delete(doc)
        session.commit()
    finally:
        session.close()


@router.patch("/documents/{document_id}", response_model=DocumentOut)
def update_document_endpoint(document_id: int, patch: DocumentPatch) -> DocumentOut:
    session = get_session()
    try:
        doc = session.get(Document, document_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        
        if patch.course is not None:
            course_name = patch.course.strip()
            if course_name and course_name != doc.course.name:
                course = session.query(Course).filter(Course.name == course_name).first()
                if not course:
                    course = Course(name=course_name)
                    session.add(course)
                    session.flush()
                
                doc.course_id = course.id
                from scholarcli.storage.vectors import update_document_course
                update_document_course(doc.id, course.name)
                
        session.commit()
        return _serialize(doc, doc.course.name)
    finally:
        session.close()


@router.get("/sources/search", response_model=list[SourceOut])
def search_sources(q: str, course: str | None = None, limit: int = 5) -> list[SourceOut]:
    query = q.strip()
    if not query:
        return []
    emb = scholarcli.llm.get_embeddings()
    vector = emb.embed_query(query)
    results = search(vector, top_k=max(1, min(limit, 20)), course=course)
    return [SourceOut(**s) for s in serialize_chunks(results)]


from fastapi.responses import FileResponse

@router.get("/documents/images/{content_hash}/{filename}")
def get_document_image(content_hash: str, filename: str) -> FileResponse:
    images_dir = get_settings().paths.resolved_data_dir() / "images" / content_hash
    image_path = images_dir / filename
    if not image_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(image_path)

