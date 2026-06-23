"""Ollama model factory.

Single entry point: ``get_llm(task)`` returns a ``ChatOllama`` bound to the model
tag that ``config/models.toml`` maps the task label to. ``get_embeddings()``
returns ``OllamaEmbeddings`` with the configured embedding model.
"""

from __future__ import annotations

from langchain_ollama import ChatOllama, OllamaEmbeddings

from scholarcli.config import get_settings


def get_llm(task: str = "quick_qa", *, temperature: float = 0.0) -> ChatOllama:
    """Return a ``ChatOllama`` for the given task label.

    The task → tag mapping lives in ``config/default.toml`` under
    ``[models.routing]``. Falls back to the ``quick_qa`` tag if the requested
    task isn't in the routing table.
    """
    s = get_settings()
    tag = s.models.model_for(task)
    return ChatOllama(model=tag, temperature=temperature, base_url=s.ollama.base_url)


def get_embeddings() -> OllamaEmbeddings:
    s = get_settings()
    return OllamaEmbeddings(model=s.models.embedding, base_url=s.ollama.base_url)
