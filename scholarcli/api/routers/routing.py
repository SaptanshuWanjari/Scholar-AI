"""Routing configuration endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from scholarcli.storage import get_session
from scholarcli.storage.models import PluginState

router = APIRouter(prefix="/api/routing", tags=["routing"])


def _require_plugin() -> None:
    db = get_session()
    try:
        row = db.get(PluginState, "cloud-model-providers")
        if not (row and row.installed and row.enabled):
            raise HTTPException(status_code=403, detail="cloud-model-providers plugin is not enabled")
    finally:
        db.close()


class RoutingConfig(BaseModel):
    mode: str  # "manual" | "auto"
    per_task: dict[str, dict]
    fallback_chain: list[str]
    budget: dict
    embedding_provider: str = "ollama"  # "ollama" | "gemini" | "openrouter"
    embedding_model: str | None = None  # None = provider default


@router.get("", response_model=RoutingConfig)
def get_routing() -> RoutingConfig:
    """Return current routing configuration."""
    _require_plugin()
    from scholarcli.llm.routing import get_routing_config
    config = get_routing_config()
    return RoutingConfig(
        mode=config.get("mode", "manual"),
        per_task=config.get("per_task", {}),
        fallback_chain=config.get("fallback_chain", ["ollama"]),
        budget=config.get("budget", {"monthly_usd": 0.0, "warn_at_pct": 80}),
        embedding_provider=config.get("embedding_provider", "ollama"),
        embedding_model=config.get("embedding_model"),
    )


@router.put("", response_model=RoutingConfig)
def update_routing(payload: RoutingConfig) -> RoutingConfig:
    """Patch routing configuration and clear the LLM cache."""
    _require_plugin()
    from scholarcli.llm.routing import update_routing_config
    import scholarcli.llm as llm_module

    patch = payload.model_dump()
    config = update_routing_config(patch)

    # Invalidate plugin state cache so next get_llm() sees the update immediately
    llm_module._plugin_cache = None

    return RoutingConfig(
        mode=config.get("mode", "manual"),
        per_task=config.get("per_task", {}),
        fallback_chain=config.get("fallback_chain", ["ollama"]),
        budget=config.get("budget", {}),
        embedding_provider=config.get("embedding_provider", "ollama"),
        embedding_model=config.get("embedding_model"),
    )
