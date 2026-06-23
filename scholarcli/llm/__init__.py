"""Ollama model factory.

Single entry point: ``get_llm(task)`` returns a ``ChatOllama`` bound to the model
tag that ``config/models.toml`` maps the task label to. ``get_embeddings()``
returns ``OllamaEmbeddings`` with the configured embedding model.
"""

from __future__ import annotations

import json

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
    s = get_settings()
    ui_path = s.paths.resolved_data_dir() / "ui_settings.json"
    if ui_path.exists():
        try:
            ui = json.loads(ui_path.read_text())
            if task in _REASONING_TASKS:
                tag = ui.get("reasoningModel") or ui.get("fastModel")
            else:
                tag = ui.get("fastModel")
            if tag:
                return tag
        except (json.JSONDecodeError, OSError):
            pass
    # Fall back to TOML routing.
    return s.models.model_for(task)


def get_llm(task: str = "quick_qa", *, temperature: float = 0.0) -> ChatOllama:
    """Return a ``ChatOllama`` for the given task label."""
    s = get_settings()
    tag = _active_model(task)
    return ChatOllama(model=tag, temperature=temperature, base_url=s.ollama.base_url)


def get_embeddings() -> OllamaEmbeddings:
    s = get_settings()
    return OllamaEmbeddings(model=s.models.embedding, base_url=s.ollama.base_url)
