"""Per-page document analysis — cheap heuristics that drive ingest branching.

Not persisted: the flags only decide which extractors run for a page
(native text vs. OCR, whether to look for images). Tables are handled
separately by ``tables.extract_tables`` which self-guards.
"""

from __future__ import annotations

from typing import NamedTuple

from scholarai.config import get_settings


class PageInfo(NamedTuple):
    page_number: int
    has_text: bool  # enough native text to use directly
    has_images: bool  # at least one foreground image block
    is_scanned: bool  # little/no native text but rendered content present


def _has_foreground_image(page_dict: dict) -> bool:
    blocks = page_dict.get("blocks", [])
    return any(b.get("type") == 1 for b in blocks)


def analyze_page(page, page_number: int, page_dict: dict) -> PageInfo:
    """Classify a PyMuPDF page for the ingest orchestrator."""
    min_chars = get_settings().ingest.scanned_min_chars
    
    text_parts = []
    for b in page_dict.get("blocks", []):
        if b.get("type") == 0:
            for line in b.get("lines", []):
                text_parts.append("".join(s.get("text", "") for s in line.get("spans", [])))
    text = "\n".join(text_parts).strip()
    
    has_text = len(text) >= min_chars
    has_images = _has_foreground_image(page_dict)

    try:
        has_drawings = bool(page.get_drawings())
    except Exception:  # noqa: BLE001 — older PyMuPDF / odd pages
        has_drawings = False

    is_scanned = (not has_text) and (has_images or has_drawings)
    return PageInfo(
        page_number=page_number,
        has_text=has_text,
        has_images=has_images,
        is_scanned=is_scanned,
    )
