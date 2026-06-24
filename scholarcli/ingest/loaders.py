"""Document loaders. PDF via PyMuPDF, Markdown via heading-aware splitting.

Each loader returns a list of ``Page`` namedtuples. A ``Page`` may be native
text, OCR output, a table, or an image/diagram description — distinguished by
``source_type``. The orchestrator in :func:`load_pdf` decides which extractors
run per page based on :func:`scholarcli.ingest.analyze.analyze_page`.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import NamedTuple

import fitz  # pymupdf

logger = logging.getLogger(__name__)


class Page(NamedTuple):
    """A page (or section/artifact) extracted from a document."""

    page_number: int  # 1-based
    title: str  # document title (same across pages)
    heading: str  # nearest heading on this page, or ""
    text: str
    source_type: str = "text"  # text | ocr | table | image | diagram
    image_url: str = ""  # served URL for image/diagram artifacts


# ---------------------------------------------------------------------------
# public entry point
# ---------------------------------------------------------------------------

def load_document(path: Path, content_hash: str) -> tuple[list[Page], str]:
    """Load a PDF or Markdown file. Returns (pages, file_type)."""
    suffix = path.suffix.lower()
    if suffix == ".pdf":
        return load_pdf(path, content_hash), "pdf"
    if suffix in (".md", ".markdown"):
        return load_markdown(path, content_hash), "md"
    if suffix in (".txt", ".text"):
        return load_markdown(path, content_hash), "txt"
    raise ValueError(f"Unsupported file type: {suffix}")


# ---------------------------------------------------------------------------
# PDF
# ---------------------------------------------------------------------------

def load_pdf(path: Path, content_hash: str) -> list[Page]:
    """Orchestrate multimodal extraction for a PDF.

    Per page: scanned pages go through OCR; otherwise native text is extracted
    (with images described inline + as separate retrievable chunks) and tables
    are pulled out as their own markdown chunks. Every optional stage degrades
    gracefully so a failure never aborts ingestion.
    """
    from scholarcli.config import get_settings
    from scholarcli.ingest.analyze import analyze_page

    cfg = get_settings().ingest
    images_dir = get_settings().paths.resolved_data_dir() / "images" / content_hash

    doc = fitz.open(path)
    title = _pdf_title(doc, path)
    pages: list[Page] = []
    for i, page in enumerate(doc):
        page_num = i + 1
        info = analyze_page(page, page_num)
        heading = _pdf_page_heading(page)

        # --- Scanned / image-only page → OCR ---------------------------------
        if cfg.ocr_enabled and info.is_scanned:
            from scholarcli.ingest.ocr import ocr_page

            try:
                ocr_text, _conf = ocr_page(page)
            except Exception as exc:  # noqa: BLE001
                logger.warning("OCR failed on page %d: %s", page_num, exc)
                ocr_text = ""
            if ocr_text.strip():
                pages.append(
                    Page(page_num, title, heading, ocr_text.strip(), source_type="ocr")
                )
            continue  # OCR covers the whole page; skip native/image passes

        # --- Native text + inline/embedded images ----------------------------
        text_parts: list[str] = []
        for b_idx, b in enumerate(page.get_text("dict", sort=True).get("blocks", [])):
            if b.get("type") == 0:
                lines = [
                    "".join(span.get("text", "") for span in line.get("spans", []))
                    for line in b.get("lines", [])
                ]
                block_text = "\n".join(lines).strip()
                if block_text:
                    text_parts.append(block_text)
            elif b.get("type") == 1:
                seg = _handle_image_block(
                    b, i, b_idx, page, content_hash, images_dir, title, heading, cfg, pages
                )
                if seg:
                    text_parts.append(seg)

        text = "\n\n".join(text_parts).strip()
        if text:
            pages.append(Page(page_num, title, heading, text, source_type="text"))

        # --- Tables (structured markdown chunks) -----------------------------
        if cfg.tables_enabled:
            from scholarcli.ingest.tables import extract_tables

            for t in extract_tables(page):
                pages.append(
                    Page(page_num, title, heading, t.chunk_text, source_type="table")
                )

    doc.close()
    return pages


def _handle_image_block(
    b, page_idx, b_idx, page, content_hash, images_dir, title, heading, cfg, pages
) -> str | None:
    """Save an image block, describe it (if enabled), and append an image chunk.

    Returns the inline markdown to embed in the page's text (so it renders in
    Reading mode), or ``None`` for background/unsaveable images.
    """
    page_area = page.rect.width * page.rect.height
    bbox = b.get("bbox")
    if bbox:
        w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
        if w * h > 0.8 * page_area:
            return None  # full-page background image

    image_bytes = b.get("image")
    if not image_bytes:
        return None
    ext = b.get("ext", "png")
    images_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{page_idx + 1}_{b_idx}.{ext}"
    (images_dir / filename).write_bytes(image_bytes)
    url = f"/api/documents/images/{content_hash}/{filename}"

    description = ""
    source_type = "image"
    if cfg.vision_enabled:
        from scholarcli.ingest import vision

        result = vision.describe_image(image_bytes, ext)
        description = result.get("description", "")
        source_type = "diagram" if result.get("type") == "diagram" else "image"

    # Separate retrievable chunk carrying the description + a thumbnail URL.
    if description:
        pages.append(
            Page(
                page_idx + 1,
                title,
                heading,
                description,
                source_type=source_type,
                image_url=url,
            )
        )

    # Inline markdown for Reading mode; alt text doubles as a caption.
    alt = description.replace("]", " ").replace("\n", " ")[:200] if description else "Image"
    return f"![{alt}]({url})"


def _pdf_title(doc, path: Path) -> str:
    meta = doc.metadata
    if meta and meta.get("title"):
        return meta["title"]
    # Fall back to the first line of the first page.
    if doc.page_count:
        first_text = doc[0].get_text(sort=True).strip()
        if first_text:
            return first_text.split("\n")[0].strip()[:200]
    return path.stem


def _pdf_page_heading(page) -> str:
    """Heuristic: largest font-size text block on page (its first line)."""
    blocks = page.get_text("dict", sort=True).get("blocks", [])
    best = ""
    best_size = 0.0
    for b in blocks:
        if b.get("type") != 0:
            continue
        for line in b.get("lines", []):
            for span in line.get("spans", []):
                sz = span.get("size", 0)
                if sz > best_size and span.get("text", "").strip():
                    best_size = sz
                    best = span["text"].strip()
    return best


# ---------------------------------------------------------------------------
# Markdown
# ---------------------------------------------------------------------------

def load_markdown(path: Path, content_hash: str) -> list[Page]:
    text = path.read_text(encoding="utf-8")
    title = path.stem
    pages: list[Page] = []

    # Split on top-level headings (## and ### in the spec, but we also
    # treat # as a major boundary).  We use a simple line-by-line scanner
    # so we can track the heading stack.
    heading = ""
    page_text: list[str] = []
    page_num = 1

    for line in text.splitlines():
        if line.startswith("# "):
            title = line[2:].strip()
            continue
        if line.startswith("## "):
            _flush_section(pages, page_num, title, heading, page_text)
            heading = line[3:].strip()
            page_text = []
            page_num += 1
            continue
        if line.startswith("### "):
            _flush_section(pages, page_num, title, heading, page_text)
            heading = line[4:].strip()
            page_text = []
            page_num += 1
            continue
        page_text.append(line)

    _flush_section(pages, page_num, title, heading, page_text)
    return pages


def _flush_section(pages, page_num, title, heading, lines):
    joined = "\n".join(lines).strip()
    if joined:
        pages.append(Page(page_number=page_num, title=title, heading=heading, text=joined))
