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
  - vector      : list[float]  (dimension inferred from first real embedding)
"""

from __future__ import annotations

import lancedb

from scholarcli.config import get_settings

TABLE_NAME = "chunks"


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


def add_chunks(rows: list[dict]) -> None:
    """Insert chunk rows. Creates the table from the first batch's schema.

    Required keys: id, document_id, course, title, page, heading,
    chunk_index, text, vector.
    """
    if not rows:
        return
    db = _db()
    if _has_table():
        db.open_table(TABLE_NAME).add(rows)
    else:
        # First batch — create the table so the vector dimension is correct.
        db.create_table(TABLE_NAME, data=rows)


def search(query_vector: list[float], top_k: int = 5, course: str | None = None) -> list[dict]:
    """Return nearest chunks as dicts, closest first.

    Result includes ``_distance`` key (LanceDB cosine; lower = closer).
    Returns [] if no chunks have been indexed yet.
    """
    if not _has_table():
        return []
    tbl = _open_table()
    q = tbl.search(query_vector).metric("cosine").limit(top_k)
    if course:
        q = q.where(f"course = '{course}'", prefilter=True)
    return q.to_list()


def delete_document(document_id: int) -> None:
    """Remove all chunks belonging to a document.  No-op if table absent."""
    if not _has_table():
        return
    _open_table().delete(f"document_id = {document_id}")
