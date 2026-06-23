"""Pipeline tests — hash-based re-index logic.

Uses mock embeddings (list of zeros) so no Ollama server is needed.
"""

import uuid
from unittest.mock import patch

from scholarcli.ingest.pipeline import ingest_file
from scholarcli.storage.models import Document
from scholarcli.storage import get_session, init_db


class _MockEmbeddings:
    """Return zero-vectors of a fixed dimension for every input."""

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return [[0.0] * 384 for _ in texts]

    def embed_query(self, text: str) -> list[float]:
        return [0.0] * 384


def test_ingest_pdf(sample_pdf):
    """First ingest: creates course + document, returns 'indexed'."""
    mock = _MockEmbeddings()
    status = ingest_file(sample_pdf, "TestOS", embeddings=mock)
    assert status == "indexed"

    # Verify DB rows.
    session = get_session()
    doc = session.query(Document).filter(Document.title == "Introduction to TCP Congestion Control").first()
    assert doc is not None
    assert doc.file_type == "pdf"
    assert doc.version == 1


def test_ingest_unchanged_skips(sample_pdf):
    """Second ingest with unchanged file: returns 'up-to-date', no duplication."""
    mock = _MockEmbeddings()
    # First run.
    assert ingest_file(sample_pdf, "TestOS", embeddings=mock) == "indexed"

    # Second run — same hash.
    assert ingest_file(sample_pdf, "TestOS", embeddings=mock) == "up-to-date"


def test_reindex_on_change(sample_pdf, tmp_path):
    """Modify the file → version bumps, old vectors replaced."""
    mock = _MockEmbeddings()

    # Copy the fixture into tmp so we can modify it.
    from shutil import copy
    dest = tmp_path / "sample_change.pdf"
    copy(str(sample_pdf), str(dest))

    assert ingest_file(dest, "TestOS", embeddings=mock) == "indexed"

    # Modify the file by creating a new valid PDF with different content.
    import fitz
    doc2 = fitz.open()
    page2 = doc2.new_page()
    page2.insert_text((72, 72), "Completely different content", fontsize=12)
    doc2.save(str(dest))
    doc2.close()

    assert ingest_file(dest, "TestOS", embeddings=mock) == "indexed"

    session = get_session()
    docs = (
        session.query(Document)
        .filter(Document.path == str(dest.resolve()))
        .all()
    )
    assert len(docs) == 1
    assert docs[0].version == 2


def test_ingest_markdown(sample_md):
    """Markdown ingestion: heading-aware splitting."""
    mock = _MockEmbeddings()
    status = ingest_file(sample_md, "TestOS", embeddings=mock)
    assert status == "indexed"

    session = get_session()
    doc = session.query(Document).filter(Document.title == "Operating Systems — Memory Management").first()
    assert doc is not None
    assert doc.file_type == "md"
