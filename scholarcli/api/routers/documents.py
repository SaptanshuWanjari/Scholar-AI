"""Document + source-search endpoints."""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, File, Form, HTTPException, UploadFile

import scholarcli.llm
from scholarcli.api import job_service
from scholarcli.api.activity_service import record_activity
from scholarcli.api.rag_service import serialize_chunks
from scholarcli.api.schemas import DocumentOut, DocumentPatch, SourceOut
from scholarcli.config import get_settings
from scholarcli.ingest.pipeline import ingest_file
from scholarcli.storage import get_session
from scholarcli.storage.models import Course, Document
from scholarcli.storage.vectors import delete_document, hybrid_search, search

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
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    course: str = Form(...),
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

    # Create a stub Document row immediately so the frontend can show status.
    session = get_session()
    try:
        from scholarcli.storage.models import get_or_create_course
        course_obj = get_or_create_course(session, course_name)

        existing = (
            session.query(Document)
            .filter(Document.path == str(dest.resolve()), Document.course_id == course_obj.id)
            .first()
        )
        if existing:
            existing.status = "processing"
            existing.error = None
            session.commit()
            doc_id = existing.id
            stub_out = _serialize(existing, course_name)
        else:
            size_kb = max(1, round(dest.stat().st_size / 1024))
            doc = Document(
                path=str(dest.resolve()),
                title=Path(filename).stem,
                file_type=suffix.lstrip("."),
                content_hash="",
                size_kb=size_kb,
                pages=0,
                status="processing",
                course_id=course_obj.id,
            )
            session.add(doc)
            session.commit()
            session.refresh(doc)
            doc_id = doc.id
            stub_out = _serialize(doc, course_name)
    finally:
        session.close()

    job_id = job_service.create_job(
        "ingest", label=f"Ingesting {filename}", payload={"documentId": doc_id, "course": course_name}
    )
    background_tasks.add_task(_ingest_bg, dest, course_name, doc_id, job_id)
    return stub_out


def _ingest_bg(path: Path, course_name: str, doc_id: int, job_id: str) -> None:
    """Background ingestion task — updates Document + Job status on completion."""
    job_service.mark_running(job_id)
    try:
        status = ingest_file(path, course_name)
        if status == "no-content":
            _set_doc_status(doc_id, "failed", "No extractable text in document")
            job_service.mark_failed(job_id, "No extractable text in document")
        else:
            record_activity("document", f"Indexed {path.name}", course_name)
            job_service.mark_done(job_id, {"documentId": doc_id, "status": status})
    except Exception as exc:  # noqa: BLE001
        _set_doc_status(doc_id, "failed", str(exc)[:500])
        job_service.mark_failed(job_id, str(exc))


def _set_doc_status(doc_id: int, status: str, error: str | None = None) -> None:
    session = get_session()
    try:
        doc = session.get(Document, doc_id)
        if doc:
            doc.status = status
            doc.error = error
            session.commit()
    except Exception:  # noqa: BLE001
        pass
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
                from scholarcli.storage.models import get_or_create_course
                course = get_or_create_course(session, course_name)
                
                doc.course_id = course.id
                from scholarcli.storage.vectors import update_document_course
                update_document_course(doc.id, course.name)
                
        session.commit()
        return _serialize(doc, doc.course.name)
    finally:
        session.close()


@router.get("/sources/search", response_model=list[SourceOut])
def search_sources(q: str, course: str | None = None, limit: int = 5) -> list[SourceOut]:
    from scholarcli.config import get_settings
    query = q.strip()
    if not query:
        return []
    emb = scholarcli.llm.get_embeddings()
    vector = emb.embed_query(query)
    top_k = max(1, min(limit, 20))
    cfg = get_settings()
    if cfg.retrieval.hybrid_search:
        results = hybrid_search(query_text=query, query_vector=vector, top_k=top_k, course=course)
    else:
        results = search(vector, top_k=top_k, course=course)
    return [SourceOut(**src) for src in serialize_chunks(results)]


from fastapi.responses import FileResponse

@router.get("/documents/images/{content_hash}/{filename}")
def get_document_image(content_hash: str, filename: str) -> FileResponse:
    images_dir = get_settings().paths.resolved_data_dir() / "images" / content_hash
    image_path = images_dir / filename
    if not image_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(image_path)

