"""OCR for scanned / handwritten pages.

Two paths:
  - Vision model (qwen2.5vl via Ollama): handles pages with images/diagrams.
  - Tesseract (optional): faster path for pure-text scanned pages.

Both bytes-based APIs accept raw PNG so they can be called from worker threads
without touching PyMuPDF objects (which are not thread-safe).
"""

from __future__ import annotations

import logging
import os
import tempfile

from scholarcli.config import get_settings

logger = logging.getLogger(__name__)

try:
    import pytesseract as _pytesseract
    _TESSERACT_AVAILABLE = True
except ImportError:
    _pytesseract = None  # type: ignore[assignment]
    _TESSERACT_AVAILABLE = False
    logger.debug("pytesseract not installed; Tesseract OCR fallback disabled")


def _page_image_png(page, dpi: int = 200) -> bytes:
    """Render a PyMuPDF page to PNG bytes. Call from main thread only."""
    pix = page.get_pixmap(dpi=dpi)
    return pix.tobytes("png")


def ocr_page_bytes(png: bytes, *, cache_enabled: bool = True) -> str:
    """Transcribe a scanned page from raw PNG bytes via the vision model.

    Checks the per-page cache first when cache_enabled is True. Stores the
    result to cache on a miss.
    Returns "" when vision is disabled or transcription fails.
    """
    if not get_settings().ingest.vision_enabled:
        return ""

    h: str | None = None
    if cache_enabled:
        from scholarcli.ingest.page_cache import image_hash, get_cached_ocr
        h = image_hash(png)
        cached = get_cached_ocr(h)
        if cached is not None:
            logger.debug("OCR cache hit for hash %s", h[:12])
            return cached

    from scholarcli.ingest import vision
    try:
        text = vision.transcribe(png)
    except Exception as exc:  # noqa: BLE001
        logger.warning("vision transcribe failed: %s", exc)
        return ""

    if cache_enabled and h is not None:
        from scholarcli.ingest.page_cache import store_ocr
        store_ocr(h, text)

    return text


def ocr_page_tesseract_bytes(png: bytes) -> str:
    """Transcribe a scanned page from raw PNG bytes via Tesseract.

    Raises RuntimeError if pytesseract is not installed.
    Writes a temp PNG file (avoids Pillow dependency) and deletes it after.
    """
    if not _TESSERACT_AVAILABLE or _pytesseract is None:
        raise RuntimeError("pytesseract not installed")

    tmp_path: str | None = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
            tmp_path = f.name
            f.write(png)
        text = _pytesseract.image_to_string(tmp_path, config="--psm 6")
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)

    return text.strip()


def ocr_page(page) -> str:
    """Transcribe a scanned page via the vision model.

    Legacy wrapper: renders page to PNG then calls ocr_page_bytes.
    """
    if not get_settings().ingest.vision_enabled:
        return ""
    try:
        png = _page_image_png(page)
    except Exception as exc:  # noqa: BLE001
        logger.warning("page render failed for OCR: %s", exc)
        return ""
    return ocr_page_bytes(png, cache_enabled=get_settings().ingest.ocr_cache_enabled)
