"""Shared test fixtures and utilities."""

from pathlib import Path

import pytest

FIXTURES_DIR = Path(__file__).parent / "fixtures"


@pytest.fixture
def sample_pdf() -> Path:
    return FIXTURES_DIR / "sample.pdf"


@pytest.fixture
def sample_md() -> Path:
    return FIXTURES_DIR / "sample.md"


@pytest.fixture(autouse=True)
def clean_config(monkeypatch):
    """Use a temp data dir so tests don't clobber real data. Also reset
    the cached DB engine since it points at the old temp dir."""
    import tempfile

    from scholarcli.config import get_settings
    from scholarcli.storage import reset_engine

    with tempfile.TemporaryDirectory() as td:
        get_settings.cache_clear()
        reset_engine()
        # Patch the data dir to the temp location.
        s = get_settings()
        monkeypatch.setattr(s.paths, "data_dir", td)
        yield
        reset_engine()
        get_settings.cache_clear()
