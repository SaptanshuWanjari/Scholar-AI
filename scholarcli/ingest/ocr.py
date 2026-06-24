"""OCR for scanned / handwritten pages — vision-model only (no torch).

Kept deliberately lightweight: the page is rendered to an image and handed to
the configured vision model (``qwen2.5vl``) for transcription. No heavyweight
OCR engine is bundled, so a low-spec machine only needs Ollama.
"""

from __future__ import annotations

import logging

from scholarcli.config import get_settings

logger = logging.getLogger(__name__)


def _page_image_png(page, dpi: int = 200) -> bytes:
    """Render a PyMuPDF page to PNG bytes."""
    pix = page.get_pixmap(dpi=dpi)
    return pix.tobytes("png")


def ocr_page(page) -> tuple[str, float | None]:
    """Transcribe a scanned page via the vision model.

    Returns ``(text, None)`` — confidence is always ``None`` since the vision
    model gives no per-token score. Returns ``("", None)`` when vision is
    disabled or transcription fails.
    """
    if not get_settings().ingest.vision_enabled:
        return "", None

    from scholarcli.ingest import vision

    try:
        png = _page_image_png(page)
    except Exception as exc:  # noqa: BLE001
        logger.warning("page render failed for OCR: %s", exc)
        return "", None

    return vision.transcribe(png), None
