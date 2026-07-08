"""Ingestion pipeline: load → chunk → embed → store.

Handles hash-based re-index: if a file's content hash has changed,
the old chunks are deleted and re-embedded. If unchanged, ingestion is
skipped.
"""

from __future__ import annotations

import hashlib
import uuid
from pathlib import Path

from langchain_core.embeddings import Embeddings

from sqlalchemy.orm import Session

from scholarai.config import get_settings
from scholarai.ingest.chunker import chunk_pages
from scholarai.ingest.loaders import load_document
from scholarai.storage import get_session, init_db
from scholarai.storage.models import Course, Document
from scholarai.storage.vectors import add_chunks, delete_document, has_document_chunks
from scholarai.llm import get_embeddings, _active_embedding_model


def _hash_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _ensure_course(name: str, session: Session) -> Course:
    """Get or create a ``Course`` by name within *session*."""
    from scholarai.storage.models import get_course
    c = get_course(session, name)
    if not c:
        raise ValueError(f"Course '{name}' does not exist.")
    return c


def ingest_file(
    path: Path, course_name: str | None, *, embeddings: Embeddings | None = None, rebuild_fts: bool = True,
) -> str:
    """Ingest a single file. Returns a status string (e.g. 'indexed', 'up-to-date')."""
    init_db()
    session = get_session()
    try:
        return _ingest_file_inner(path, course_name, session, embeddings=embeddings, rebuild_fts=rebuild_fts)
    finally:
        session.close()

def _ingest_file_inner(
    path: Path, course_name: str | None, session: Session, *, embeddings: Embeddings | None = None, rebuild_fts: bool = True,
) -> str:
    if embeddings is None:
        embeddings = get_embeddings()

    content_hash = _hash_file(path)
    
    course_id = None
    if course_name:
        course = _ensure_course(course_name, session)
        course_id = course.id

    # Check for existing document.
    if course_id:
        existing = (
            session.query(Document)
            .filter(Document.path == str(path.resolve()), Document.course_id == course_id)
            .first()
        )
    else:
        existing = (
            session.query(Document)
            .filter(Document.path == str(path.resolve()), Document.course_id.is_(None))
            .first()
        )
    if existing and existing.content_hash == content_hash:
        if has_document_chunks(existing.id):
            return "up-to-date"
        # Vector store data was lost (e.g. lancedb directory deleted).
        # Fall through to re-embed, reusing the existing document record.

    pages, file_type = load_document(path, content_hash)
    if not pages:
        return "no-content"

    title = pages[0].title
    chunks = chunk_pages(pages)
    size_kb = max(1, round(path.stat().st_size / 1024))
    page_count = max((p.page_number for p in pages), default=0)

    # If the file was previously indexed with different content, clear old.
    if existing:
        delete_document(existing.id)
        if existing.content_hash:
            existing.version += 1
        existing.content_hash = content_hash
        existing.title = title
        existing.file_type = file_type
        existing.size_kb = size_kb
        existing.pages = page_count
        existing.status = "indexed"
        session.commit()
        doc_id = existing.id
    else:
        doc = Document(
            path=str(path.resolve()),
            title=title,
            file_type=file_type,
            content_hash=content_hash,
            size_kb=size_kb,
            pages=page_count,
            status="indexed",
        )
        if course_id:
            doc.course_id = course_id

        session.add(doc)
        session.commit()
        doc_id = doc.id

    # Embed all chunk texts in one batch.
    chunk_texts = [ch["text"] for ch in chunks]
    # OllamaEmbeddings.embed_documents() accepts list[str]; returns list[list[float]].
    vectors: list[list[float]] = embeddings.embed_documents(chunk_texts)
    vec_dim = len(vectors[0]) if vectors else 0

    # Detect duplicate/overlapping document.
    settings = get_settings()
    if settings.duplicate_detection.enabled and course_name:
        from scholarai.storage.vectors import detect_overlapping_document
        dup_doc_id = detect_overlapping_document(
            vectors, [ch["text"] for ch in chunks], [doc_id] * len(chunks),
            course=course_name, threshold=settings.duplicate_detection.overlap_threshold,
            exclude_doc_id=doc_id,
        )
        if dup_doc_id is not None:
            dup_doc = session.get(Document, dup_doc_id)
            dup_title = dup_doc.title if dup_doc else str(dup_doc_id)
            logger.warning("Skipping '%s' — overlaps with '%s'", title, dup_title)
            return "duplicate"

    rows: list[dict] = []
    for ch, vec in zip(chunks, vectors):
        rows.append(
            {
                "id": str(uuid.uuid4()),
                "document_id": doc_id,
                "course": course_name or "unassigned",
                "title": title,
                "page": ch["page"],
                "heading": ch["heading"],
                "chunk_index": ch["chunk_index"],
                "text": ch["text"],
                "source_type": ch.get("source_type", "text"),
                "image_url": ch.get("image_url", ""),
                "original_payload": ch.get("original_payload"),
                "vector": vec,
            }
        )

    add_chunks(rows, rebuild_fts=rebuild_fts)

    # Optional LLM metadata extraction (summary, tags, topics).
    cfg = get_settings().ingest
    if cfg.metadata_extraction and chunks:
        from scholarai.ingest.metadata_extractor import extract as extract_metadata
        sample = "\n\n".join(ch["text"] for ch in chunks[:20])
        meta = extract_metadata(sample)
        if meta["summary"] or meta["tags"] or meta["topics"]:
            doc_row = session.get(Document, doc_id)
            if doc_row:
                doc_row.summary = meta["summary"] or None
                doc_row.tags = meta["tags"] or None
                doc_row.topics = meta["topics"] or None
                session.commit()


    # Record embedding metadata + clear error.
    doc_row = session.get(Document, doc_id)
    if doc_row:
        doc_row.embedding_model = _active_embedding_model()
        doc_row.embedding_dimension = vec_dim
        if doc_row.error is not None:
            doc_row.error = None
        session.commit()

    return "indexed"


def reindex_all() -> list[str]:
    """Re-ingest every known document (rebuilds the vector store)."""
    init_db()
    session = get_session()
    try:
        embeddings = get_embeddings()
        results: list[str] = []
        docs = session.query(Document).all()
        for doc in docs:
            course = session.get(Course, doc.course_id)
            course_name = course.name if course else ""
            src = Path(doc.path)
            if not src.exists():
                results.append(f"{doc.title}: missing-file")
                continue
            delete_document(doc.id)  # clear stale vectors before re-embedding
            try:
                status = ingest_file(src, course_name, embeddings=embeddings, rebuild_fts=False)
            except Exception as exc:  # noqa: BLE001
                status = f"failed ({exc})"
            results.append(f"{doc.title}: {status}")
        from scholarai.storage.vectors import rebuild_fts_index
        rebuild_fts_index()
        return results
    finally:
        session.close()


def ingest_path(path: Path, course_name: str) -> list[str]:
    """Ingest a file or all supported files in a directory.

    Returns a list of ``"path: status"`` strings suitable for CLI output.
    """
    files: list[Path] = []
    if path.is_file():
        files.append(path)
    elif path.is_dir():
        for p in sorted(path.rglob("*")):
            if p.is_file() and p.suffix.lower() in (".pdf", ".md", ".markdown"):
                files.append(p)
    else:
        raise FileNotFoundError(f"Path not found: {path}")

    results: list[str] = []
    for fp in files:
        st = ingest_file(fp, course_name, rebuild_fts=False)
        results.append(f"{fp}: {st}")
    from scholarai.storage.vectors import rebuild_fts_index
    rebuild_fts_index()
    return results
