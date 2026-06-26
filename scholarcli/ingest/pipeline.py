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

from scholarcli.config import get_settings
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
    from scholarcli.storage.models import get_or_create_course
    return get_or_create_course(session, name)


def ingest_file(
    path: Path, course_name: str, *, embeddings: Embeddings | None = None, rebuild_fts: bool = True,
) -> str:
    """Ingest a single file. Returns a status string (e.g. 'indexed', 'up-to-date')."""
    init_db()
    session = get_session()
    try:
        return _ingest_file_inner(path, course_name, session, embeddings=embeddings, rebuild_fts=rebuild_fts)
    finally:
        session.close()

def _ingest_file_inner(
    path: Path, course_name: str, session: Session, *, embeddings: Embeddings | None = None, rebuild_fts: bool = True,
) -> str:
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
                "source_type": ch.get("source_type", "text"),
                "image_url": ch.get("image_url", ""),
                "vector": vec,
            }
        )

    add_chunks(rows, rebuild_fts=rebuild_fts)

    # Optional LLM metadata extraction (summary, tags, topics).
    cfg = get_settings().ingest
    if cfg.metadata_extraction and chunks:
        from scholarcli.ingest.metadata_extractor import extract as extract_metadata
        sample = "\n\n".join(ch["text"] for ch in chunks[:20])
        meta = extract_metadata(sample)
        if meta["summary"] or meta["tags"] or meta["topics"]:
            doc_row = session.get(Document, doc_id)
            if doc_row:
                doc_row.summary = meta["summary"] or None
                doc_row.tags = meta["tags"] or None
                doc_row.topics = meta["topics"] or None
                session.commit()

    if cfg.code_extraction_enabled and chunks:
        from scholarcli.ingest.code_extractor import extract_code_examples
        from scholarcli.storage.models import CodeExample
        
        extracted_rows = []
        for ch in chunks:
            examples = extract_code_examples(ch["text"], course_name)
            for ex in examples:
                if not ex.get("code"):
                    continue
                new_example = CodeExample(
                    document_id=doc_id,
                    course=course_name,
                    title=ex.get("title", "Untitled Example"),
                    language=ex.get("language", "Unknown"),
                    topic=ex.get("topic", "General"),
                    difficulty=ex.get("difficulty", "Intermediate"),
                    example_type=ex.get("example_type", "code"),
                    page_number=ch["page"],
                    code=ex.get("code", ""),
                    explanation=ex.get("explanation", ""),
                    purpose=ex.get("purpose", ""),
                    inputs=ex.get("inputs", ""),
                    outputs=ex.get("outputs", ""),
                    time_complexity=ex.get("time_complexity", ""),
                    space_complexity=ex.get("space_complexity", ""),
                    common_mistakes=ex.get("common_mistakes", ""),
                    important_notes=ex.get("important_notes", "")
                )
                session.add(new_example)
                
                # Prepare vector chunk
                chunk_text = f"Title: {ex.get('title', '')}\nCode:\n{ex.get('code', '')}\nExplanation: {ex.get('explanation', '')}"
                extracted_rows.append({
                    "id": str(uuid.uuid4()),
                    "document_id": doc_id,
                    "course": course_name,
                    "title": ex.get("title", "Code Example"),
                    "page": ch["page"],
                    "heading": ex.get("topic", "Code Example"),
                    "chunk_index": ch["chunk_index"],
                    "text": chunk_text,
                    "source_type": "code_example",
                    "image_url": "",
                })
        
        if extracted_rows:
            session.commit()
            # Embed all code examples in a single batch
            code_texts = [r["text"] for r in extracted_rows]
            code_vecs = embeddings.embed_documents(code_texts)
            for r, vec in zip(extracted_rows, code_vecs):
                r["vector"] = vec
            add_chunks(extracted_rows, rebuild_fts=rebuild_fts)

    # Clear any previous error on successful re-index.
    doc_row = session.get(Document, doc_id)
    if doc_row and doc_row.error is not None:
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
        from scholarcli.storage.vectors import rebuild_fts_index
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
    from scholarcli.storage.vectors import rebuild_fts_index
    rebuild_fts_index()
    return results
