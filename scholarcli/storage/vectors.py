"""LanceDB helper — create/get table, add vectors, search, delete by document.

Table schema (inferred from first batch):
  - id          : str (uuid)
  - document_id : int
  - course      : str
  - title       : str
  - page        : int | null
  - heading     : str
  - chunk_index : int
  - text        : str
  - source_type : str   (text | ocr | table | image | diagram)
  - image_url   : str   (served URL for image/diagram artifacts, else "")
  - vector      : list[float]  (dimension inferred from first real embedding)
"""

from __future__ import annotations

import logging

import lancedb

from scholarcli.config import get_settings

logger = logging.getLogger(__name__)

TABLE_NAME = "chunks"

# Columns that an up-to-date chunks table must carry. A pre-multimodal table
# lacks these, so the first insert recreates it (chunks are rebuildable from
# the source files under data/uploads via reindex_all()).
_REQUIRED_COLUMNS = {"source_type", "image_url"}


def _db():
    s = get_settings()
    return lancedb.connect(str(s.lancedb_path))


def _has_table() -> bool:
    return TABLE_NAME in _db().table_names()


def _open_table():
    """Return an open table handle. Raises if table doesn't exist yet."""
    return _db().open_table(TABLE_NAME)


def has_document_chunks(document_id: int) -> bool:
    """Return True if the chunks table exists and has at least one row for *document_id*."""
    if not _has_table():
        return False
    tbl = _open_table()
    try:
        count = tbl.count_rows(f"document_id = {document_id}")
    except Exception:
        return False
    return count > 0


def _schema_is_current(tbl) -> bool:
    """True if the table already has the multimodal columns."""
    try:
        names = set(tbl.schema.names)
    except Exception:  # noqa: BLE001
        return False
    return _REQUIRED_COLUMNS.issubset(names)


def add_chunks(rows: list[dict]) -> None:
    """Insert chunk rows. Creates the table from the first batch's schema.

    Required keys: id, document_id, course, title, page, heading,
    chunk_index, text, source_type, image_url, vector.

    A pre-multimodal table (missing ``source_type``/``image_url``) is dropped
    and recreated from this batch — LanceDB schemas are fixed at creation, so
    re-indexing is the migration path (see ``pipeline.reindex_all``).
    """
    if not rows:
        return
    db = _db()
    if _has_table():
        tbl = db.open_table(TABLE_NAME)
        if not _schema_is_current(tbl):
            logger.warning(
                "chunks table predates multimodal columns — recreating it; "
                "run reindex_all() (or re-upload) to restore all documents."
            )
            db.drop_table(TABLE_NAME)
            db.create_table(TABLE_NAME, data=rows)
        else:
            tbl.add(rows)
    else:
        # First batch — create the table so the vector dimension is correct.
        db.create_table(TABLE_NAME, data=rows)


def search(query_vector: list[float], top_k: int = 5, course: str | None = None, document: str | None = None) -> list[dict]:
    """Return nearest chunks as dicts, closest first.

    Result includes ``_distance`` key (LanceDB cosine; lower = closer).
    Returns [] if no chunks have been indexed yet.
    """
    if not _has_table():
        return []
    tbl = _open_table()
    q = tbl.search(query_vector).metric("cosine").limit(top_k)
    
    filters = []
    if course:
        filters.append(f"course = '{course}'")
    if document:
        filters.append(f"document_id = {document}")
        
    if filters:
        q = q.where(" AND ".join(filters), prefilter=True)
        
    return q.to_list()


def get_document_chunks(document_id: int) -> list[dict]:
    """Return all chunks for a document, ordered by chunk_index. [] if absent."""
    if not _has_table():
        return []
    tbl = _open_table()
    try:
        rows = tbl.search().where(f"document_id = {document_id}").limit(10_000).to_list()
    except Exception:
        return []
    return sorted(rows, key=lambda r: r.get("chunk_index", 0))


def all_chunks(course: str | None = None, limit: int = 5000) -> list[dict]:
    """Return chunks across all documents (optionally filtered by course)."""
    if not _has_table():
        return []
    tbl = _open_table()
    try:
        q = tbl.search().limit(limit)
        if course:
            q = q.where(f"course = '{course}'")
        return q.to_list()
    except Exception:
        return []


def delete_document(document_id: int) -> None:
    """Remove all chunks belonging to a document.  No-op if table absent."""
    if not _has_table():
        return
    _open_table().delete(f"document_id = {document_id}")


def update_document_course(document_id: int, course: str) -> None:
    """Update the course associated with all chunks for a document."""
    if not _has_table():
        return
    _open_table().update(where=f"document_id = {document_id}", values={"course": course})
