"""Unit tests for the structural chunker."""

from scholarai.ingest.chunker import chunk_pages
from scholarai.ingest.loaders import Page


def test_empty_pages():
    assert chunk_pages([]) == []


def test_single_page_single_chunk():
    pages = [Page(page_number=1, title="Test", heading="Intro", text="Hello world.")]
    chunks = chunk_pages(pages)
    assert len(chunks) == 1
    ch = chunks[0]
    assert ch["page"] == 1
    assert ch["heading"] == "Intro"
    assert ch["chunk_index"] == 0
    assert ch["text"] == "Hello world."


def test_multi_page_metadata_flow():
    pages = [
        Page(page_number=1, title="OS", heading="Paging", text="Paging is a memory management scheme."),
        Page(page_number=2, title="OS", heading="Segmentation", text="Segmentation uses variable-sized segments."),
    ]
    chunks = chunk_pages(pages)
    # Two small texts become two chunks.
    assert len(chunks) == 2
    assert chunks[0]["page"] == 1
    assert chunks[0]["heading"] == "Paging"
    assert chunks[1]["page"] == 2
    assert chunks[1]["heading"] == "Segmentation"
    # chunk_index is global across a document.
    assert chunks[0]["chunk_index"] == 0
    assert chunks[1]["chunk_index"] == 1


def test_text_preservation():
    """Chunker should preserve all text content across chunks."""
    pages = [
        Page(page_number=1, title="T", heading="H", text="AAA BBB CCC DDD EEE"),
    ]
    chunks = chunk_pages(pages)
    combined = " ".join(ch["text"] for ch in chunks)
    # All words should be present (order may vary at boundaries, but no loss).
    for word in ["AAA", "BBB", "CCC", "DDD", "EEE"]:
        assert word in combined
