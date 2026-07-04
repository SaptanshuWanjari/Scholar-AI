"""Document relationship inference tests — detect duplicate/overlap at ingest."""

from unittest.mock import patch

from scholarai.storage import get_session, init_db
from scholarai.storage.models import Course, Document
from scholarai.storage.vectors import detect_overlapping_document
from scholarai.ingest.pipeline import ingest_file


def _ensure_course(name: str) -> None:
    init_db()
    from scholarai.storage.models import get_course
    session = get_session()
    try:
        if not get_course(session, name):
            session.add(Course(name=name))
            session.commit()
    finally:
        session.close()


def _get_doc_id(title: str) -> int | None:
    session = get_session()
    try:
        doc = session.query(Document).filter(Document.title == title).first()
        return doc.id if doc else None
    finally:
        session.close()


def test_detect_overlapping_no_match(sample_pdf):
    """When new chunks don't overlap any existing doc, returns None."""
    from tests.test_retrieval import _MockEmbeddings
    m = _MockEmbeddings()
    _ensure_course("Networks")
    with patch("scholarai.ingest.pipeline.get_embeddings", return_value=m):
        ingest_file(sample_pdf, "Networks", embeddings=m)

    new_vecs = [[0.0] * 384 for _ in range(5)]
    result = detect_overlapping_document(
        new_vecs, ["a"] * 5, [999] * 5, course="Networks", threshold=0.3
    )
    assert result is None


def test_detect_overlapping_self_excluded(sample_pdf):
    """New doc's own chunks are excluded from match (exclude_doc_id)."""
    from tests.test_retrieval import _MockEmbeddings
    m = _MockEmbeddings()
    _ensure_course("Networks")
    with patch("scholarai.ingest.pipeline.get_embeddings", return_value=m):
        result = ingest_file(sample_pdf, "Networks", embeddings=m)
    assert result == "indexed"

    ingested_doc_id = _get_doc_id("Introduction to TCP Congestion Control")
    assert ingested_doc_id is not None

    new_vecs = [[0.0] * 384 for _ in range(3)]
    result = detect_overlapping_document(
        new_vecs, ["a"] * 3, [ingested_doc_id] * 3, course="Networks",
        threshold=0.3, exclude_doc_id=ingested_doc_id,
    )
    assert result is None


def test_detect_overlapping_empty_embeddings(sample_pdf):
    """Empty embeddings list returns None without error."""
    result = detect_overlapping_document([], [], [], course="Networks")
    assert result is None
