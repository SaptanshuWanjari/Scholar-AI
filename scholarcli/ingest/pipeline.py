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

from scholarcli.ingest.chunker import chunk_pages
from scholarcli.ingest.loaders import load_document
from scholarcli.storage import get_session, init_db
from scholarcli.storage.models import Course, Document
from scholarcli.storage.vectors import add_chunks, delete_document, has_document_chunks
from scholarcli.llm import get_embeddings


def _hash_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _ensure_course(name: str, session: Session) -> Course:
    """Get or create a ``Course`` by name within *session*."""
    course = session.query(Course).filter(Course.name == name).first()
    if course is None:
        course = Course(name=name)
        session.add(course)
        session.commit()
    return course


def ingest_file(
    path: Path,
    course_name: str,
    *,
    embeddings: Embeddings | None = None,
) -> str:
    """Ingest a single file. Returns a status string (e.g. 'indexed', 'up-to-date')."""
    init_db()
    session = get_session()
    if embeddings is None:
        embeddings = get_embeddings()

    content_hash = _hash_file(path)
    course = _ensure_course(course_name, session)

    # Check for existing document.
    existing = (
        session.query(Document)
        .filter(Document.path == str(path.resolve()), Document.course_id == course.id)
        .first()
    )
    if existing and existing.content_hash == content_hash:
        if has_document_chunks(existing.id):
            return "up-to-date"
        # Vector store data was lost (e.g. lancedb directory deleted).
        # Fall through to re-embed, reusing the existing document record.

    pages, file_type = load_document(path)
    if not pages:
        return "no-content"

    title = pages[0].title
    chunks = chunk_pages(pages)
    size_kb = max(1, round(path.stat().st_size / 1024))
    page_count = max((p.page_number for p in pages), default=0)

    # If the file was previously indexed with different content, clear old.
    if existing:
        delete_document(existing.id)
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
            course_id=course.id,
        )
        session.add(doc)
        session.commit()
        doc_id = doc.id

    # Embed all chunk texts in one batch.
    chunk_texts = [ch["text"] for ch in chunks]
    # OllamaEmbeddings.embed_documents() accepts list[str]; returns list[list[float]].
    vectors: list[list[float]] = embeddings.embed_documents(chunk_texts)

    rows: list[dict] = []
    for ch, vec in zip(chunks, vectors):
        rows.append(
            {
                "id": str(uuid.uuid4()),
                "document_id": doc_id,
                "course": course_name,
                "title": title,
                "page": ch["page"],
                "heading": ch["heading"],
                "chunk_index": ch["chunk_index"],
                "text": ch["text"],
                "vector": vec,
            }
        )

    add_chunks(rows)
    return "indexed"


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
        st = ingest_file(fp, course_name)
        results.append(f"{fp}: {st}")
    return results
