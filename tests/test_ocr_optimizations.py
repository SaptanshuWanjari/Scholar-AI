"""Tests for OCR pipeline optimizations."""
from unittest.mock import MagicMock, patch
import pytest
from scholarcli.storage import init_db


@pytest.fixture
def db():
    init_db()


# --- tables ---

def test_extract_table_markdowns_returns_strings():
    from scholarcli.ingest.tables import extract_table_markdowns

    mock_tbl = MagicMock()
    mock_tbl.to_markdown.return_value = "| A | B |\n|---|---|\n| 1 | 2 |"
    mock_finder = MagicMock()
    mock_finder.tables = [mock_tbl]

    mock_page = MagicMock()
    mock_page.find_tables.return_value = mock_finder

    result = extract_table_markdowns(mock_page)
    assert result == ["| A | B |\n|---|---|\n| 1 | 2 |"]


def test_extract_table_markdowns_skips_trivial():
    from scholarcli.ingest.tables import extract_table_markdowns

    mock_tbl = MagicMock()
    mock_tbl.to_markdown.return_value = "| A |\n|---|"  # only 1 newline → skip
    mock_finder = MagicMock()
    mock_finder.tables = [mock_tbl]

    mock_page = MagicMock()
    mock_page.find_tables.return_value = mock_finder

    result = extract_table_markdowns(mock_page)
    assert result == []


# --- ocr_page_bytes ---

def test_ocr_page_bytes_calls_vision_on_miss(db):
    from scholarcli.ingest import ocr

    fake_png = b"fake png data"
    with patch("scholarcli.ingest.vision.transcribe", return_value="extracted text") as mock_t:
        text, conf = ocr.ocr_page_bytes(fake_png, cache_enabled=True)

    assert text == "extracted text"
    assert conf is None
    mock_t.assert_called_once_with(fake_png)


def test_ocr_page_bytes_cache_hit_skips_vision(db):
    from scholarcli.ingest import ocr
    from scholarcli.ingest.page_cache import image_hash, store_ocr

    fake_png = b"cached png bytes"
    h = image_hash(fake_png)
    store_ocr(h, "cached result")

    with patch("scholarcli.ingest.vision.transcribe") as mock_t:
        text, conf = ocr.ocr_page_bytes(fake_png, cache_enabled=True)

    assert text == "cached result"
    mock_t.assert_not_called()


def test_ocr_page_bytes_stores_result_in_cache(db):
    from scholarcli.ingest import ocr
    from scholarcli.ingest.page_cache import image_hash, get_cached_ocr

    fake_png = b"new png bytes"
    with patch("scholarcli.ingest.vision.transcribe", return_value="fresh text"):
        ocr.ocr_page_bytes(fake_png, cache_enabled=True)

    h = image_hash(fake_png)
    assert get_cached_ocr(h) == "fresh text"


def test_ocr_page_tesseract_bytes_raises_when_unavailable():
    import unittest.mock
    from scholarcli.ingest import ocr

    with unittest.mock.patch.object(ocr, "_TESSERACT_AVAILABLE", False):
        with pytest.raises(RuntimeError, match="pytesseract not installed"):
            ocr.ocr_page_tesseract_bytes(b"some png")


# --- loaders ---

def test_page_has_bbox_field():
    from scholarcli.ingest.loaders import Page
    p = Page(page_number=1, title="T", heading="", text="hello")
    assert p.bbox is None  # default


def test_load_pdf_pages_in_order(sample_pdf, db):
    """load_pdf returns pages sorted by page_number even with parallel processing."""
    from scholarcli.ingest.loaders import load_pdf

    with patch("scholarcli.ingest.vision.transcribe", return_value="text"), \
         patch("scholarcli.ingest.vision.describe_image",
               return_value={"type": "image", "description": "img"}):
        pages = load_pdf(sample_pdf, "testhash")

    page_nums = [p.page_number for p in pages]
    assert page_nums == sorted(page_nums)
