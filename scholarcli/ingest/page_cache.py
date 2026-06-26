"""Per-page OCR cache backed by the project SQLite database.

Cache key: sha256 hex of rendered PNG bytes.
On a cache hit, the stored OCR text is returned immediately — no LLM call.
"""

from __future__ import annotations

import hashlib
import logging

from scholarcli.storage import get_session
from scholarcli.storage.models import PageOcrCache

logger = logging.getLogger(__name__)


def image_hash(png_bytes: bytes) -> str:
    """sha256 hex of PNG bytes. Used as cache key."""
    return hashlib.sha256(png_bytes).hexdigest()


def get_cached_ocr(img_hash: str) -> str | None:
    """Return cached OCR text or None if not cached."""
    session = get_session()
    try:
        row = session.get(PageOcrCache, img_hash)
        return row.ocr_text if row else None
    finally:
        session.close()


def store_ocr(img_hash: str, text: str) -> None:
    """Store OCR text. No-op if the hash already exists."""
    session = get_session()
    try:
        if session.get(PageOcrCache, img_hash) is None:
            session.add(PageOcrCache(image_hash=img_hash, ocr_text=text))
            session.commit()
    except Exception:
        session.rollback()
        logger.warning("Failed to store OCR cache for hash %s", img_hash)
    finally:
        session.close()
