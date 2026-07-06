"""Tests for the OllamaProvider wrapper."""

import pytest
from langchain_ollama import ChatOllama

from scholarai.llm.providers.ollama import OllamaProvider


def test_provider_chat_model_returns_chat_ollama():
    provider = OllamaProvider()
    model = provider.get_chat_model("qwen3:8b")
    assert isinstance(model, ChatOllama)
    assert model.model == "qwen3:8b"


def test_provider_default_model_uses_config():
    from scholarai.config import get_settings

    provider = OllamaProvider()
    model = provider.get_chat_model(None)
    assert model.model == get_settings().models.model_for("quick_qa")


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_provider_list_models_not_empty():
    provider = OllamaProvider()
    models = provider.list_models()
    assert len(models) > 0
    names = [m.id for m in models]
    assert any("qwen3" in n for n in names) or any("nomic" in n for n in names)


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_provider_health_check_online():
    provider = OllamaProvider()
    health = provider.health_check()
    assert health["status"] in ("online", "slow")
    assert health["latency_ms"] >= 0


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_provider_chat_model_invoke():
    provider = OllamaProvider()
    model = provider.get_chat_model("qwen3:8b")
    msg = model.invoke("Say 'ok'.")
    assert "ok" in msg.content.lower()
