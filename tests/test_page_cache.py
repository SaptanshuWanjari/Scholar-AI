"""Tests for PageOcrCache model and page_cache module."""
import pytest
from scholarai.storage import init_db


@pytest.fixture
def db(clean_config):  # clean_config is autouse but naming it makes dep explicit
    init_db()


def test_page_ocr_cache_table_created(db):
    """Table exists after init_db."""
    from sqlalchemy import inspect
    from scholarai.storage import get_engine
    inspector = inspect(get_engine())
    assert "page_ocr_cache" in inspector.get_table_names()


def test_cache_miss_returns_none(db):
    from scholarai.ingest.page_cache import get_cached_ocr
    assert get_cached_ocr("nonexistent_hash") is None


def test_store_then_get_returns_text(db):
    from scholarai.ingest.page_cache import store_ocr, get_cached_ocr
    store_ocr("abc123", "hello world")
    assert get_cached_ocr("abc123") == "hello world"


def test_store_idempotent(db):
    from scholarai.ingest.page_cache import store_ocr, get_cached_ocr
    store_ocr("xyz", "first")
    store_ocr("xyz", "second")  # should not raise or overwrite
    assert get_cached_ocr("xyz") == "first"


def test_image_hash_is_deterministic():
    from scholarai.ingest.page_cache import image_hash
    data = b"fake png bytes"
    assert image_hash(data) == image_hash(data)
    assert len(image_hash(data)) == 64  # sha256 hex


def test_image_hash_differs_for_different_bytes():
    from scholarai.ingest.page_cache import image_hash
    assert image_hash(b"page1") != image_hash(b"page2")
