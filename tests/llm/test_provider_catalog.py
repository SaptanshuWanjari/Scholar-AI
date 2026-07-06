"""Tests for the provider capability catalog."""

from scholarai.llm.provider_catalog import (
    PROVIDER_CAPABILITIES,
    REASONING_TASKS,
    TASK_CAPABILITY_REQUIREMENTS,
    VISION_TASKS,
)
from scholarai.llm.providers.base import ProviderCapability


def test_ollama_has_chat_and_embeddings():
    caps = PROVIDER_CAPABILITIES.get("ollama", [])
    assert ProviderCapability.CHAT in caps
    assert ProviderCapability.EMBEDDINGS in caps
    assert ProviderCapability.STREAMING in caps


def test_reasoning_tasks_defined():
    assert "deep_analysis" in REASONING_TASKS


def test_vision_tasks_defined():
    assert "ocr" in VISION_TASKS
    assert "image_qa" in VISION_TASKS


def test_all_tasks_have_capability_requirements():
    for task in [
        "quick_qa",
        "flashcards",
        "quiz",
        "mermaid",
        "mindmap",
        "study_notes",
        "deep_analysis",
        "differences",
        "learning_path",
        "data_qa",
        "plantuml",
    ]:
        assert task in TASK_CAPABILITY_REQUIREMENTS
