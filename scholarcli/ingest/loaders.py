"""Document loaders. PDF via PyMuPDF, Markdown via heading-aware splitting.

Each loader returns a list of ``Page`` namedtuples: (page_number, title, heading, text).
"""

from __future__ import annotations

from pathlib import Path
from typing import NamedTuple

import fitz  # pymupdf


class Page(NamedTuple):
    """A page (or section) extracted from a document."""

    page_number: int  # 1-based
    title: str  # document title (same across pages)
    heading: str  # nearest heading on this page, or ""
    text: str


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
    from scholarcli.config import get_settings
    images_dir = get_settings().paths.resolved_data_dir() / "images" / content_hash

    doc = fitz.open(path)
    title = _pdf_title(doc, path)
    pages: list[Page] = []
    for i, page in enumerate(doc):
        page_area = page.rect.width * page.rect.height
        blocks = page.get_text("dict", sort=True).get("blocks", [])
        text_parts = []
        for b_idx, b in enumerate(blocks):
            if b.get("type") == 0:
                lines = []
                for line in b.get("lines", []):
                    spans = [span.get("text", "") for span in line.get("spans", [])]
                    lines.append("".join(spans))
                block_text = "\n".join(lines).strip()
                if block_text:
                    text_parts.append(block_text)
            elif b.get("type") == 1:
                bbox = b.get("bbox")
                if bbox:
                    w = bbox[2] - bbox[0]
                    h = bbox[3] - bbox[1]
                    if w * h > 0.8 * page_area:
                        continue  # Skip background images

                image_bytes = b.get("image")
                ext = b.get("ext", "png")
                if image_bytes:
                    images_dir.mkdir(parents=True, exist_ok=True)
                    filename = f"{i + 1}_{b_idx}.{ext}"
                    dest = images_dir / filename
                    dest.write_bytes(image_bytes)
                    text_parts.append(f"![Image](/api/documents/images/{content_hash}/{filename})")
        
        text = "\n\n".join(text_parts).strip()
        if not text:
            continue
        heading = _pdf_page_heading(page)
        pages.append(Page(page_number=i + 1, title=title, heading=heading, text=text))
    doc.close()
    return pages


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
