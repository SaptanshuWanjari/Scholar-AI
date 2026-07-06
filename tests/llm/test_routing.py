"""Tests for LLM routing and factory functions."""

import pytest
from langchain_ollama import ChatOllama, OllamaEmbeddings

from scholarai.llm import get_embeddings, get_llm


def test_get_llm_returns_chat_ollama():
    llm = get_llm("quick_qa")
    assert isinstance(llm, ChatOllama)


def test_get_llm_reasoning_task_uses_reasoning_model(monkeypatch):
    from scholarai.api.routers.settings import _load
    from scholarai.config import get_settings

    s = get_settings()
    original = s.models.routing.get("deep_analysis")
    try:
        s.models.routing["deep_analysis"] = "reasoning-model"
        _load.cache_clear()
        llm = get_llm("deep_analysis")
        assert llm.model == "reasoning-model"
    finally:
        s.models.routing["deep_analysis"] = original
        _load.cache_clear()


def test_get_embeddings_returns_ollama_embeddings():
    emb = get_embeddings()
    assert isinstance(emb, OllamaEmbeddings)


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_get_llm_can_invoke():
    llm = get_llm("quick_qa")
    msg = llm.invoke("Say 'ok' and nothing else.")
    assert "ok" in msg.content.lower()


@pytest.mark.ollama
@pytest.mark.usefixtures("required_embed_skip_if_missing")
def test_get_embeddings_can_embed():
    emb = get_embeddings()
    vectors = emb.embed_documents(["hello", "world"])
    assert len(vectors) == 2
    assert len(vectors[0]) > 0
