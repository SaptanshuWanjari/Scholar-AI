"""Ollama model factory.

Single entry point: ``get_llm(task)`` returns a ``ChatOllama`` bound to the model
tag that ``config/models.toml`` maps the task label to. ``get_embeddings()``
returns ``OllamaEmbeddings`` with the configured embedding model.
"""

from __future__ import annotations

import json

import functools

from langchain_ollama import ChatOllama, OllamaEmbeddings

from scholarcli.config import get_settings

# Tasks that prefer the more capable "reasoning" model when the user has
# configured a separate one. Everything else uses the fast model.
_REASONING_TASKS = {"deep_analysis"}


def _active_model(task: str) -> str:
    """Resolve task → model tag, honouring live ui_settings.json overrides.

    Priority:
    1. ui_settings.json  (fastModel / reasoningModel written by the Settings UI)
    2. config/default.toml  [models.routing] table  (static TOML config)
    """
    from scholarcli.api.routers.settings import _load as load_settings
    ui = load_settings()
    if task in _REASONING_TASKS:
        tag = ui.get("reasoningModel") or ui.get("fastModel")
    else:
        tag = ui.get("fastModel")
    if tag:
        return tag
    # Fall back to TOML routing.
    return get_settings().models.model_for(task)


@functools.lru_cache(maxsize=16)
def _get_llm_cached(tag: str, temperature: float, base_url: str) -> ChatOllama:
    return ChatOllama(model=tag, temperature=temperature, base_url=base_url)

def get_llm(task: str = "quick_qa", *, temperature: float = 0.0) -> ChatOllama:
    """Return a ``ChatOllama`` for the given task label."""
    s = get_settings()
    tag = _active_model(task)
    return _get_llm_cached(tag, temperature, s.ollama.base_url)


@functools.lru_cache(maxsize=4)
def _get_embeddings_cached(model: str, base_url: str) -> OllamaEmbeddings:
    return OllamaEmbeddings(model=model, base_url=base_url)

def get_embeddings() -> OllamaEmbeddings:
    s = get_settings()
    return _get_embeddings_cached(s.models.embedding, s.ollama.base_url)


def _active_vision_model() -> str:
    """Resolve the vision model tag, honouring ui_settings.json overrides.

    Priority: ui_settings.json ``visionModel`` → config ``models.vision``.
    """
    from scholarcli.api.routers.settings import _load as load_settings
    ui = load_settings()
    return ui.get("visionModel") or get_settings().models.vision


def get_vision_llm(*, temperature: float = 0.0) -> ChatOllama:
    """Return a ``ChatOllama`` bound to the vision-capable model."""
    s = get_settings()
    return _get_llm_cached(_active_vision_model(), temperature, s.ollama.base_url)
