"""LanceDB helper — create/get table, add vectors, search, delete by document.

Includes ``detect_overlapping_document()`` for ingest-time duplicate detection.


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
  - image_url        : str        (served URL for image/diagram artifacts, else "")
  - original_payload : str | null (raw markdown table for table chunks; null for all others)
  - vector           : list[float]  (dimension inferred from first real embedding)
"""

from __future__ import annotations

import logging
from collections import Counter

import lancedb

from scholarai.config import get_settings

logger = logging.getLogger(__name__)

TABLE_NAME = "chunks"


def _quote(value: str) -> str:
    """Wrap value in single quotes, escaping internal single quotes per SQL convention."""
    return f"'{value.replace("'", "''")}'"

NOTEB_TABLE_NAME = "notebook_chunks"

# Columns that an up-to-date chunks table must carry. A pre-multimodal table
# lacks these, so the first insert recreates it (chunks are rebuildable from
# the source files under data/uploads via reindex_all()).
_REQUIRED_COLUMNS = {"source_type", "image_url", "original_payload", "csv_path"}


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
        count = tbl.count_rows(f"document_id = {str(document_id)}")
    except Exception:
        return False
    return count > 0


def count_source_type(source_type: str) -> int:
    """Return the total number of chunks with the given source_type."""
    if not _has_table():
        return 0
    tbl = _open_table()
    try:
        return tbl.count_rows(f"source_type = {_quote(source_type)}")
    except Exception:
        return 0


def _schema_is_current(tbl) -> bool:
    """True if the table already has the multimodal columns."""
    try:
        names = set(tbl.schema.names)
    except Exception:  # noqa: BLE001
        return False
    return _REQUIRED_COLUMNS.issubset(names)


def rebuild_fts_index() -> None:
    if not _has_table():
        return
    try:
        _open_table().create_fts_index("text", replace=True)
    except Exception as exc:  # noqa: BLE001
        logger.warning("FTS index creation failed: %s", exc)

def add_chunks(rows: list[dict], rebuild_fts: bool = True) -> None:
    """Insert chunk rows. Creates the table from the first batch's schema.

    Required keys: id, document_id, course, title, page, heading,
    chunk_index, text, source_type, image_url, vector.

    If an existing table lacks required columns, raises RuntimeError
    instructing the user to run reindex_all().
    """
    if not rows:
        return
    db = _db()
    if _has_table():
        tbl = db.open_table(TABLE_NAME)
        if not _schema_is_current(tbl):
            raise RuntimeError(
                "chunks table predates multimodal columns. "
                "Run reindex_all() to migrate, then retry."
            )
        else:
            tbl.add(rows)
    else:
        # First batch — create the table so the vector dimension is correct.
        tbl = db.create_table(TABLE_NAME, data=rows)

    if rebuild_fts:
        try:
            tbl.create_fts_index("text", replace=True)
        except Exception as exc:  # noqa: BLE001
            logger.warning("FTS index creation failed (hybrid search disabled): %s", exc)

    s = get_settings()
    if s.retrieval.pq_enabled:
        try:
            try:
                count = len(tbl)
            except Exception:
                count = tbl.count_rows()
            
            if count > s.retrieval.pq_training_threshold:
                dim = len(rows[0]["vector"])
                num_sub_vectors = dim // 16
                if num_sub_vectors < 1:
                    num_sub_vectors = 1
                tbl.create_index(
                    metric="cosine",
                    vector_column_name="vector",
                    num_partitions=256,
                    num_sub_vectors=num_sub_vectors
                )
        except Exception as exc:
            logger.warning("PQ index creation failed: %s", exc)


def search(query_vector: list[float], top_k: int = 5, offset: int = 0, course: str | None = None, document_id: int | None = None, return_count: bool = False):
    """Return nearest chunks as dicts, closest first.

    Result includes ``_distance`` key (LanceDB cosine; lower = closer).
    Returns [] if no chunks have been indexed yet.
    """
    if not _has_table():
        return ([], 0) if return_count else []
    tbl = _open_table()
    q = tbl.search(query_vector, vector_column_name="vector").metric("cosine")
    
    filters = []
    if course:
        filters.append(f"course = {_quote(course)}")
    if document_id is not None:
        filters.append(f"document_id = {document_id}")
        
    where_clause = " AND ".join(filters) if filters else None
    if where_clause:
        q = q.where(where_clause, prefilter=True)
        
    results = q.limit(offset + top_k).to_list()[offset:]
    
    if return_count:
        try:
            total = tbl.count_rows(where_clause) if where_clause else tbl.count_rows()
        except Exception:
            total = len(results)
        return results, total
        
    return results


def get_document_chunks(document_id: int, limit: int = 10_000, offset: int = 0, return_count: bool = False):
    """Return chunks for a document, ordered by chunk_index. [] if absent."""
    if not _has_table():
        return ([], 0) if return_count else []
    tbl = _open_table()
    where_clause = f"document_id = {document_id}"
    try:
        q = tbl.search().where(where_clause).limit(limit)
        if offset > 0:
            q = q.offset(offset)
        rows = q.to_list()
        results = sorted(rows, key=lambda r: r.get("chunk_index", 0))
        if return_count:
            total = tbl.count_rows(where_clause)
            return results, total
        return results
    except Exception:
        return ([], 0) if return_count else []


def all_chunks(course: str | None = None, limit: int = 5000, offset: int = 0, return_count: bool = False):
    """Return chunks across all documents (optionally filtered by course)."""
    if not _has_table():
        return ([], 0) if return_count else []
    tbl = _open_table()
    try:
        q = tbl.search().limit(limit)
        if offset > 0:
            q = q.offset(offset)
        where_clause = None
        if course:
            where_clause = f"course = {_quote(course)}"
            q = q.where(where_clause)
        results = q.to_list()
        if return_count:
            total = tbl.count_rows(where_clause) if where_clause else tbl.count_rows()
            return results, total
        return results
    except Exception:
        return ([], 0) if return_count else []


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


def hybrid_search(
    query_text: str,
    query_vector: list[float],
    top_k: int = 5,
    offset: int = 0,
    course: str | None = None,
    document_id: int | None = None,
    return_count: bool = False,
):
    """Blend BM25 keyword and vector similarity via Reciprocal Rank Fusion.

    Falls back to pure vector search if the FTS index is unavailable.
    """
    if not _has_table():
        return []

    tbl = _open_table()
    filters = []
    if course:
        filters.append(f"course = {_quote(course)}")
    if document_id is not None:
        filters.append(f"document_id = {document_id}")
    where_clause = " AND ".join(filters) if filters else None

    fetch_n = (offset + top_k) * 3

    # Vector search.
    vq = tbl.search(query_vector, vector_column_name="vector").metric("cosine").limit(fetch_n)
    if where_clause:
        vq = vq.where(where_clause, prefilter=True)
    try:
        vector_results = vq.to_list()
    except Exception:
        vector_results = []

    # BM25 / FTS search.
    try:
        fq = tbl.search(query_text, query_type="fts").limit(fetch_n)
        if where_clause:
            fq = fq.where(where_clause)
        bm25_results = fq.to_list()
    except Exception:
        return search(query_vector, top_k=top_k, offset=offset, course=course, document_id=document_id, return_count=return_count)

    # Reciprocal Rank Fusion (k=60 is a standard default).
    K = 60
    scores: dict[str, float] = {}
    id_to_row: dict[str, dict] = {}

    for rank, row in enumerate(vector_results):
        rid = str(row.get("id", ""))
        scores[rid] = scores.get(rid, 0.0) + 1.0 / (K + rank + 1)
        id_to_row[rid] = row

    for rank, row in enumerate(bm25_results):
        rid = str(row.get("id", ""))
        scores[rid] = scores.get(rid, 0.0) + 1.0 / (K + rank + 1)
        if rid not in id_to_row:
            row["_distance"] = None  # ponytail: BM25 has no distance
            id_to_row[rid] = row

    ranked = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
    results = [id_to_row[rid] for rid, _ in ranked[offset:offset+top_k] if rid in id_to_row]
    
    if return_count:
        try:
            total = tbl.count_rows(where_clause) if where_clause else tbl.count_rows()
        except Exception:
            total = len(ranked)
        return results, total
        
    return results


# ---------------------------------------------------------------------------
# Notebook chunks (separate table, non-polluting)
# ---------------------------------------------------------------------------

def _noteb_table() -> lancedb.table.LanceTable | None:
    """Open the notebook_chunks table, or None if it doesn't exist."""
    try:
        db = _db()
        if NOTEB_TABLE_NAME not in db.list_tables():
            return None
        return db.open_table(NOTEB_TABLE_NAME)
    except Exception:
        return None


def add_notebook_chunks(
    notebook_id: int,
    course: str,
    title: str,
    blocks: list[dict],
    vectors: list[list[float]],
) -> None:
    """Index notebook blocks as searchable chunks.

    Each text-bearing block becomes one chunk with its embedding vector.
    Deletes any existing chunks for this notebook_id first.
    """
    if not blocks or not vectors:
        delete_notebook_chunks(notebook_id)
        return
    if len(blocks) != len(vectors):
        logger.warning("notebook_chunks: blocks/vectors length mismatch (%d vs %d)", len(blocks), len(vectors))
        return

    delete_notebook_chunks(notebook_id)

    rows = []
    for i, (block, vec) in enumerate(zip(blocks, vectors)):
        block_type = block.get("type", "")
        text = notebook_block_text(block)
        if not text.strip():
            continue
        # heading = nearest preceding heading block
        heading = ""
        for j in range(i - 1, -1, -1):
            if blocks[j].get("type") == "heading":
                heading = blocks[j].get("text", "")
                break
        rows.append({
            "id": f"nb-{notebook_id}-{i}",
            "notebook_id": notebook_id,
            "course": course or "",
            "title": title,
            "block_index": i,
            "block_type": block_type,
            "text": text,
            "heading": heading,
            "vector": vec,
        })

    if not rows:
        return

    db = _db()
    try:
        if NOTEB_TABLE_NAME in db.list_tables():
            db.open_table(NOTEB_TABLE_NAME).add(rows)
        else:
            db.create_table(NOTEB_TABLE_NAME, data=rows)
    except Exception as exc:
        logger.warning("Failed to add notebook chunks: %s", exc)


def notebook_block_text(block: dict) -> str:
    """Extract searchable text from a notebook block."""
    b_type = block.get("type")
    if b_type in ("text", "callout", "heading"):
        return block.get("text", "")
    if b_type == "ai-answer":
        return f"{block.get('question', '')}\n{block.get('answer', '')}"
    if b_type in ("code", "mermaid"):
        return block.get("code", "")
    if b_type == "table":
        headers = block.get("headers", [])
        rows = block.get("rows", [])
        lines = [" | ".join(headers)]
        for r in rows:
            lines.append(" | ".join(r))
        return "\n".join(lines)
    return ""


def delete_notebook_chunks(notebook_id: int) -> None:
    """Remove all indexed chunks for a notebook."""
    tbl = _noteb_table()
    if tbl is not None:
        try:
            tbl.delete(f"notebook_id = {str(notebook_id)}")
        except Exception:
            pass


def search_notebook_chunks(
    query_vector: list[float],
    top_k: int = 5,
    offset: int = 0,
    course: str | None = None,
) -> list[dict]:
    """Search notebook chunks by vector similarity."""
    tbl = _noteb_table()
    if tbl is None:
        return []
    q = tbl.search(query_vector, vector_column_name="vector").metric("cosine")
    if course:
        q = q.where(f"course = {_quote(course)}", prefilter=True)
    return q.limit(offset + top_k).to_list()[offset:]


def detect_overlapping_document(
    embeddings: list[list[float]],
    chunk_ids: list[str],
    document_ids: list[int],
    course: str | None = None,
    *,
    threshold: float = 0.30,
    exclude_doc_id: int | None = None,
) -> int | None:
    """Check if a set of chunk embeddings overlaps significantly with any
    existing document in the same course.

    For each chunk embedding, finds the nearest existing chunk.
    Groups matches by their document_id. If any existing document accounts
    for more than *threshold* of the new chunks, returns its document_id.

    Returns None if no significant overlap is found.
    """
    if not _has_table() or not embeddings:
        return None

    tbl = _open_table()
    matched_docs: list[int] = []

    for vec in embeddings:
        q = tbl.search(vec, vector_column_name="vector").metric("cosine").limit(1)
        if course:
            q = q.where(f"course = {_quote(course)}", prefilter=True)
        try:
            results = q.to_list()
        except Exception:
            continue
        if results:
            doc_id = results[0].get("document_id")
            if doc_id is not None and doc_id != exclude_doc_id:
                matched_docs.append(doc_id)

    if not matched_docs:
        return None

    counts = Counter(matched_docs)
    top_doc, top_count = counts.most_common(1)[0]
    overlap_pct = top_count / len(embeddings)
    if overlap_pct >= threshold:
        return top_doc
    return None


def get_stats(session, course: str | None = None) -> dict:
    """Return basic DB and vector store statistics."""
    from scholarai.storage.models import Course, Document

    q_course = session.query(Course)
    q_doc = session.query(Document)
    if course:
        q_course = q_course.filter(Course.name == course)
        course_obj = q_course.first()
        if course_obj:
            q_doc = q_doc.filter(Document.course_id == course_obj.id)
        else:
            q_doc = q_doc.filter(False)

    total_courses = q_course.count() if not course else (1 if q_course.first() else 0)
    total_docs = q_doc.count()
    total_chunks = 0
    if _has_table():
        tbl = _open_table()
        if course:
            total_chunks = tbl.count_rows(f"course = {_quote(course)}")
        else:
            total_chunks = tbl.count_rows()

    return {
        "courses": total_courses,
        "documents": total_docs,
        "chunks": total_chunks,
        "lancedb_path": str(_db().uri),
    }
