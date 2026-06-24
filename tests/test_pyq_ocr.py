"""Tests for pyq_service._read_text OCR fallback."""
from __future__ import annotations

from unittest.mock import MagicMock, patch


def _make_mock_doc(pages_text: list[str]):
    """Return a mock fitz document whose pages yield the given texts."""
    mock_pages = []
    for text in pages_text:
        p = MagicMock()
        p.get_text.return_value = text
        mock_pages.append(p)

    doc = MagicMock()
    doc.__iter__ = MagicMock(return_value=iter(mock_pages))
    doc.close = MagicMock()
    return doc, mock_pages


def test_read_text_uses_ocr_for_sparse_page(tmp_path):
    """A page with < scanned_min_chars native text triggers ocr_page."""
    pdf = tmp_path / "scanned.pdf"
    pdf.write_bytes(b"%PDF-1.4 fake")

    doc, pages = _make_mock_doc(["   "])  # page has no text

    with patch("fitz.open", return_value=doc):
        with patch("scholarcli.ingest.ocr.ocr_page", return_value=("Q1. What is an OS?", None)) as mock_ocr:
            from scholarcli.api import pyq_service
            result = pyq_service._read_text(pdf)

    mock_ocr.assert_called_once_with(pages[0])
    assert "Q1. What is an OS?" in result


def test_read_text_skips_ocr_for_rich_page(tmp_path):
    """A page with enough native text does NOT call ocr_page."""
    pdf = tmp_path / "native.pdf"
    pdf.write_bytes(b"%PDF-1.4 fake")
    rich_text = "x" * 100  # well above scanned_min_chars default of 40

    doc, _ = _make_mock_doc([rich_text])

    with patch("fitz.open", return_value=doc):
        with patch("scholarcli.ingest.ocr.ocr_page") as mock_ocr:
            from scholarcli.api import pyq_service
            result = pyq_service._read_text(pdf)

    mock_ocr.assert_not_called()
    assert rich_text in result


def test_read_text_mixes_native_and_ocr(tmp_path):
    """Multi-page PDF: sparse pages OCR'd, rich pages use native text."""
    pdf = tmp_path / "mixed.pdf"
    pdf.write_bytes(b"%PDF-1.4 fake")

    doc, pages = _make_mock_doc(["x" * 100, "  "])  # page1 rich, page2 sparse

    with patch("fitz.open", return_value=doc):
        with patch("scholarcli.ingest.ocr.ocr_page", return_value=("OCR content", None)) as mock_ocr:
            from scholarcli.api import pyq_service
            result = pyq_service._read_text(pdf)

    mock_ocr.assert_called_once_with(pages[1])
    assert "x" * 100 in result
    assert "OCR content" in result


def test_read_text_non_pdf_unchanged(tmp_path):
    """Markdown files go through load_document, not fitz."""
    md = tmp_path / "paper.md"
    md.write_text("# Q1\nDefine deadlock.")

    with patch("scholarcli.ingest.ocr.ocr_page") as mock_ocr:
        from scholarcli.api import pyq_service
        result = pyq_service._read_text(md)

    mock_ocr.assert_not_called()
    assert "deadlock" in result
