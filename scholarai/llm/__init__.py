"""Ollama model factory — with optional cloud provider routing.

Single entry point: ``get_llm(task)`` returns a ``BaseChatModel`` bound to the
model tag that ``config/models.toml`` maps the task label to, OR routes through
``RoutingEngine`` when the cloud-model-providers plugin is enabled.

``get_embeddings()`` always returns ``OllamaEmbeddings`` (embeddings are local-only).
"""

from __future__ import annotations

import functools
import time

from langchain_core.embeddings import Embeddings
from langchain_core.language_models import BaseChatModel
from langchain_ollama import ChatOllama, OllamaEmbeddings

from scholarai.config import get_settings

# Tasks that prefer the more capable "reasoning" model when the user has
# configured a separate one. Everything else uses the fast model.
_REASONING_TASKS = {"deep_analysis"}

# Cache for cloud plugin enabled state (TTL: 30s) to avoid per-call DB reads
_plugin_cache: tuple[bool, float] | None = None
_PLUGIN_CACHE_TTL = 30.0


def _cloud_plugin_enabled() -> bool:
    """Return True if cloud-model-providers plugin is installed and enabled."""
    global _plugin_cache
    now = time.monotonic()
    if _plugin_cache is not None and (now - _plugin_cache[1]) < _PLUGIN_CACHE_TTL:
        return _plugin_cache[0]
    try:
        from scholarai.storage import get_session
        from scholarai.storage.models import PluginState
        db = get_session()
        try:
            row = db.get(PluginState, "cloud-model-providers")
            enabled = bool(row and row.installed and row.enabled)
        finally:
            db.close()
    except Exception:
        enabled = False
    _plugin_cache = (enabled, now)
    return enabled


def _active_model(task: str) -> str:
    """Resolve task → model tag, honouring live ui_settings.json overrides.

    Priority:
    1. ui_settings.json  (fastModel / reasoningModel written by the Settings UI)
    2. config/default.toml  [models.routing] table  (static TOML config)
    """
    from scholarai.api.routers.settings import _load as load_settings
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
    return ChatOllama(model=tag, temperature=temperature, base_url=base_url, keep_alive="5m", num_ctx=8192)

def get_llm(task: str = "quick_qa", *, temperature: float = 0.0) -> BaseChatModel:
    """Return a chat model for the given task label.

    When the cloud-model-providers plugin is enabled, routes through
    ``RoutingEngine`` which may select Gemini, Groq, or OpenRouter.
    When disabled (default), behaves exactly as before — returns ChatOllama.
    """
    if _cloud_plugin_enabled():
        from scholarai.llm.routing import RoutingEngine
        return RoutingEngine().resolve(task, temperature)
    # Fast path: plugin disabled — zero overhead, exact same behaviour as before
    s = get_settings()
    tag = _active_model(task)
    return _get_llm_cached(tag, temperature, s.ollama.base_url)


@functools.lru_cache(maxsize=4)
def _get_embeddings_cached(model: str, base_url: str) -> OllamaEmbeddings:
    return OllamaEmbeddings(model=model, base_url=base_url)

def _active_embedding_model() -> str:
    from scholarai.api.routers.settings import _load as load_settings
    ui = load_settings()
    return ui.get("embeddingModel") or get_settings().models.embedding

def get_embeddings() -> Embeddings:
    if _cloud_plugin_enabled():
        from scholarai.llm.routing import RoutingEngine
        return RoutingEngine().resolve_embeddings()
    s = get_settings()
    return _get_embeddings_cached(_active_embedding_model(), s.ollama.base_url)


def _active_vision_model() -> str:
    """Resolve the vision model tag, honouring ui_settings.json overrides.

    Priority: ui_settings.json ``visionModel`` → config ``models.vision``.
    """
    from scholarai.api.routers.settings import _load as load_settings
    ui = load_settings()
    return ui.get("visionModel") or get_settings().models.vision


def get_vision_llm(*, temperature: float = 0.0) -> ChatOllama:
    """Return a ``ChatOllama`` bound to the vision-capable model (not cached)."""
    s = get_settings()
    return ChatOllama(model=_active_vision_model(), temperature=temperature, base_url=s.ollama.base_url, num_ctx=8192)
