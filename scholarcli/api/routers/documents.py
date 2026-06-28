"""Document + source-search endpoints."""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, File, Form, HTTPException, UploadFile

import scholarcli.llm
from scholarcli.api import job_service
from scholarcli.api.activity_service import record_activity
from scholarcli.api.rag_service import serialize_chunks
from scholarcli.api.schemas import DocumentOut, DocumentPatch, DocumentUploadOut, SourceOut
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
        q = session.query(Document).outerjoin(Course, Document.course_id == Course.id)
        if course and course != "all":
            if course == "unassigned":
                q = q.filter(Document.course_id.is_(None))
            else:
                q = q.filter(Course.name == course)
        if search:
            q = q.filter(Document.title.ilike(f"%{search}%"))
        rows = q.order_by(Document.indexed_at.desc()).all()
        return [_serialize(doc, doc.course.name if doc.course else "") for doc in rows]
    finally:
        session.close()


@router.post("/documents/upload", response_model=DocumentUploadOut, status_code=201)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    course: str | None = Form(None),
) -> DocumentOut:
    course_name = course.strip() if course else None

    filename = Path(file.filename or "upload").name
    suffix = Path(filename).suffix.lower()
    if suffix not in _SUPPORTED_SUFFIXES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{suffix}'. Supported: PDF, Markdown, TXT.",
        )

    uploads_dir = get_settings().paths.resolved_data_dir() / "uploads"
    uploads_dir.mkdir(parents=True, exist_ok=True)
    import uuid
    unique_prefix = uuid.uuid4().hex[:8]
    dest = uploads_dir / f"{unique_prefix}_{filename}"
    dest.write_bytes(await file.read())

    # Create a stub Document row immediately so the frontend can show status.
    session = get_session()
    try:
        from scholarcli.storage.models import get_course
        course_obj = get_course(session, course_name)
        if not course_obj and course_name:
            raise HTTPException(status_code=400, detail=f"Course '{course_name}' not found")

        if course_obj:
            existing = (
                session.query(Document)
                .filter(Document.path == str(dest.resolve()), Document.course_id == course_obj.id)
                .first()
            )
        else:
            existing = (
                session.query(Document)
                .filter(Document.path == str(dest.resolve()), Document.course_id.is_(None))
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
            )
            if course_name:
                doc.course_id = course_obj.id
            session.add(doc)
            session.commit()
            session.refresh(doc)
            doc_id = doc.id
            stub_out = _serialize(doc, course_name or "")
    finally:
        session.close()

    job_id = job_service.create_job(
        "ingest", label=f"Ingesting {filename}", payload={"documentId": doc_id, "course": course_name}
    )
    background_tasks.add_task(_ingest_bg, dest, course_name, doc_id, job_id)
    return DocumentUploadOut(**stub_out.model_dump(), jobId=job_id)


def _ingest_bg(path: Path, course_name: str, doc_id: int, job_id: str) -> None:
    """Background ingestion task — updates Document + Job status on completion."""
    job_service.mark_running(job_id)
    try:
        status = ingest_file(path, course_name)
        if status == "no-content":
            _set_doc_status(doc_id, "failed", "No extractable text in document")
            job_service.mark_failed(job_id, "No extractable text in document")
        else:
            _set_doc_status(doc_id, "indexed")
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
        
        if doc.content_hash:
            import shutil
            images_dir = get_settings().paths.resolved_data_dir() / "images" / doc.content_hash
            shutil.rmtree(images_dir, ignore_errors=True)
            
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
            from scholarcli.storage.vectors import update_document_course
            if not course_name or course_name == "unassigned":
                doc.course_id = None
                update_document_course(doc.id, "unassigned")
            else:
                current_course_name = doc.course.name if doc.course else ""
                if course_name != current_course_name:
                    from scholarcli.storage.models import get_course
                    course = get_course(session, course_name)
                    if not course:
                        raise HTTPException(status_code=400, detail=f"Course '{course_name}' not found")
                    doc.course_id = course.id
                    update_document_course(doc.id, course.name)
                
        session.commit()
        return _serialize(doc, doc.course.name if doc.course else "")
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
    image_path = (images_dir / filename).resolve()
    if not image_path.is_relative_to(images_dir.resolve()):
        raise HTTPException(status_code=400, detail="Invalid path")
    if not image_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(image_path)



@router.get("/documents/{document_id}/raw")
def get_document_raw(document_id: int) -> FileResponse:
    session = get_session()
    try:
        doc = session.get(Document, document_id)
        if not doc or not doc.path:
            raise HTTPException(status_code=404, detail="Document not found")
        
        path = Path(doc.path)
        if not path.exists():
            raise HTTPException(status_code=404, detail="File missing from disk")
            
        media_type = "application/pdf" if doc.file_type == "pdf" else "text/plain"
        
        # We can pass inline disposition to allow browsers to view pdfs directly
        return FileResponse(path, media_type=media_type, headers={"Content-Disposition": f'inline; filename="{doc.title}.{doc.file_type}"'})
    finally:
        session.close()
