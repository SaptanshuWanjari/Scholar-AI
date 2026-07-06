"""Shared test fixtures and utilities."""

import json
import os
import urllib.error
import urllib.request
from pathlib import Path

import pytest

FIXTURES_DIR = Path(__file__).parent / "fixtures"

OLLAMA_URL = os.getenv("OLLAMA_HOST", "http://localhost:11434")
REQUIRED_LLM = os.getenv("SCHOLAR_TEST_LLM", "qwen3:8b")
REQUIRED_EMBED = os.getenv("SCHOLAR_TEST_EMBED", "qwen3-embedding:0.6b")


def _ollama_tags() -> dict:
    try:
        with urllib.request.urlopen(f"{OLLAMA_URL}/api/tags", timeout=2) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
        return {}


def ollama_available() -> bool:
    return bool(_ollama_tags().get("models"))


def model_available(name: str) -> bool:
    tags = _ollama_tags()
    models = [m.get("name", "") for m in tags.get("models", [])]
    return name in models or any(m.startswith(name + ":") for m in models)


@pytest.fixture
def sample_pdf() -> Path:
    return FIXTURES_DIR / "sample.pdf"


@pytest.fixture
def sample_md() -> Path:
    return FIXTURES_DIR / "sample.md"


@pytest.fixture
def ollama_skip_if_missing():
    """Skip the current test if Ollama is not reachable."""
    if not ollama_available():
        pytest.skip("Ollama server is not available")


@pytest.fixture
def required_llm_skip_if_missing():
    """Skip the current test if the required LLM is not pulled."""
    if not ollama_available():
        pytest.skip("Ollama server is not available")
    if not model_available(REQUIRED_LLM):
        pytest.skip(f"Ollama model {REQUIRED_LLM!r} is not available")


@pytest.fixture
def required_embed_skip_if_missing():
    """Skip the current test if the required embedding model is not pulled."""
    if not ollama_available():
        pytest.skip("Ollama server is not available")
    if not model_available(REQUIRED_EMBED):
        pytest.skip(f"Ollama model {REQUIRED_EMBED!r} is not available")


@pytest.fixture(autouse=True)
def clean_config(monkeypatch):
    """Use a temp data dir so tests don't clobber real data. Also reset
    the cached DB engine since it points at the old temp dir."""
    import tempfile

    from scholarai.config import get_settings
    from scholarai.storage import init_db, reset_engine

    with tempfile.TemporaryDirectory() as td:
        get_settings.cache_clear()
        reset_engine()
        # Patch the data dir to the temp location.
        s = get_settings()
        monkeypatch.setattr(s.paths, "data_dir", td)
        init_db()
        yield
        reset_engine()
        get_settings.cache_clear()
