"""Tests for PageOcrCache model and page_cache module."""
import pytest
from scholarcli.storage import init_db


@pytest.fixture
def db(clean_config):  # clean_config is autouse but naming it makes dep explicit
    init_db()


def test_page_ocr_cache_table_created(db):
    """Table exists after init_db."""
    from sqlalchemy import inspect
    from scholarcli.storage import get_engine
    inspector = inspect(get_engine())
    assert "page_ocr_cache" in inspector.get_table_names()
