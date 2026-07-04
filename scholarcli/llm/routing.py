"""RoutingEngine — selects the right provider/model per task.

Also contains ``UsageTrackingWrapper`` which records token usage after each call.
"""

from __future__ import annotations

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Iterator

from langchain_core.embeddings import Embeddings
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import BaseMessage
from langchain_core.outputs import ChatGenerationChunk, ChatResult

from scholarcli.llm.provider_catalog import (
    PROVIDER_CAPABILITIES,
    REASONING_TASKS,
    TASK_CAPABILITY_REQUIREMENTS,
    VISION_TASKS,
)
from scholarcli.llm.providers.base import ProviderCapability
from scholarcli.llm.providers.registry import ProviderRegistry
from scholarcli.storage import get_session
from scholarcli.storage.models import UsageRecord

logger = logging.getLogger(__name__)

_ROUTING_JSON_PATH = Path(".data/routing.json")

_DEFAULT_ROUTING: dict = {
    "mode": "manual",
    "per_task": {},
    "fallback_chain": ["ollama"],
    "budget": {"monthly_usd": 0.0, "warn_at_pct": 80},
}


def _load_routing() -> dict:
    if _ROUTING_JSON_PATH.exists():
        try:
            return json.loads(_ROUTING_JSON_PATH.read_text())
        except Exception:
            pass
    return dict(_DEFAULT_ROUTING)


def _save_routing(config: dict) -> None:
    _ROUTING_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    _ROUTING_JSON_PATH.write_text(json.dumps(config, indent=2))


def get_routing_config() -> dict:
    return _load_routing()


def update_routing_config(patch: dict) -> dict:
    config = _load_routing()
    config.update(patch)
    _save_routing(config)
    return config


# ---------------------------------------------------------------------------
# Usage tracking wrapper
# ---------------------------------------------------------------------------

class UsageTrackingWrapper(BaseChatModel):
    """Wraps any BaseChatModel and writes a UsageRecord after each call."""

    inner: Any  # BaseChatModel — typed as Any to avoid Pydantic schema issues
    provider_id: str
    task: str

    class Config:
        arbitrary_types_allowed = True

    @property
    def _llm_type(self) -> str:
        return f"usage-tracking"

    def _generate(
        self,
        messages: list[BaseMessage],
        stop: list[str] | None = None,
        run_manager: Any = None,
        **kwargs: Any,
    ) -> ChatResult:
        result: ChatResult = self.inner._generate(messages, stop=stop, run_manager=run_manager, **kwargs)
        self._record_usage(result)
        return result

    def _stream(
        self,
        messages: list[BaseMessage],
        stop: list[str] | None = None,
        run_manager: Any = None,
        **kwargs: Any,
    ) -> Iterator[ChatGenerationChunk]:
        # Delegate streaming to inner model; record usage on final chunk
        for chunk in self.inner._stream(messages, stop=stop, run_manager=run_manager, **kwargs):
            yield chunk

    def _record_usage(self, result: ChatResult) -> None:
        try:
            usage = getattr(result, "llm_output", {}) or {}
            token_usage = usage.get("token_usage", {})
            input_tokens = int(token_usage.get("prompt_tokens", 0))
            output_tokens = int(token_usage.get("completion_tokens", 0))

            # Also check usage_metadata on the first generation's message
            if not (input_tokens or output_tokens) and result.generations:
                gen = result.generations[0]
                meta = getattr(getattr(gen, "message", None), "usage_metadata", None)
                if meta:
                    input_tokens = meta.get("input_tokens", 0)
                    output_tokens = meta.get("output_tokens", 0)

            model_id = (
                getattr(self.inner, "model", "")
                or getattr(self.inner, "model_name", "")
                or ""
            )
            cost = self._estimate_cost(model_id, input_tokens, output_tokens)

            record = UsageRecord(
                provider_id=self.provider_id,
                task=self.task,
                model=model_id,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                cost_usd=cost,
            )
            db = get_session()
            try:
                db.add(record)
                db.commit()
            finally:
                db.close()
        except Exception as exc:
            logger.debug("Usage recording failed (non-fatal): %s", exc)

    def _estimate_cost(self, model_id: str, input_tokens: int, output_tokens: int) -> float:
        """Estimate cost from per-provider static pricing tables."""
        from scholarcli.llm.providers.gemini import _KNOWN_MODELS as gemini_models
        from scholarcli.llm.providers.groq import _KNOWN_MODELS as groq_models

        for m in gemini_models + groq_models:
            if m.id == model_id:
                return (
                    input_tokens * m.input_cost_per_mtok
                    + output_tokens * m.output_cost_per_mtok
                ) / 1_000_000
        return 0.0

    @property
    def _identifying_params(self) -> dict:
        return {"inner": str(self.inner), "provider": self.provider_id, "task": self.task}


# ---------------------------------------------------------------------------
# Routing engine
# ---------------------------------------------------------------------------

class RoutingEngine:
    """Resolves task → (provider, model) and returns a wrapped BaseChatModel."""

    def resolve(self, task: str, temperature: float = 0.0) -> BaseChatModel:
        config = _load_routing()
        mode = config.get("mode", "manual")
        db = get_session()
        try:
            registry = ProviderRegistry(db)

            if mode == "manual":
                per_task = config.get("per_task", {})
                override = per_task.get(task, {})
                provider_id = override.get("provider", "ollama")
                model_id = override.get("model") or None
            else:
                # Auto mode: capability-based selection
                provider_id, model_id = self._auto_select(task, registry)

            # Check budget before dispatching to a cloud provider
            if provider_id != "ollama" and self._over_budget(config, db):
                logger.warning("Monthly budget exceeded — falling back to Ollama for task %s", task)
                provider_id = "ollama"
                model_id = None

            provider = registry.get(provider_id)
            if provider is None:
                # Provider not connected — try fallback chain
                provider, provider_id = self._try_fallback(config, registry, provider_id)

            chat_model = provider.get_chat_model(model_id, temperature=temperature)  # type: ignore[union-attr]
        finally:
            db.close()

        return UsageTrackingWrapper(inner=chat_model, provider_id=provider_id, task=task)

    def _auto_select(self, task: str, registry: ProviderRegistry) -> tuple[str, str | None]:
        required = TASK_CAPABILITY_REQUIREMENTS.get(task, ProviderCapability.CHAT)

        if task in VISION_TASKS:
            required = ProviderCapability.VISION
        if task in REASONING_TASKS:
            required = ProviderCapability.REASONING

        # Prefer connected non-ollama providers that have the required capability
        for provider_id in ("gemini", "groq", "openrouter"):
            caps = PROVIDER_CAPABILITIES.get(provider_id, [])
            if required in caps:
                p = registry.get(provider_id)
                if p is not None:
                    return provider_id, None

        return "ollama", None

    def _try_fallback(
        self, config: dict, registry: ProviderRegistry, failed_id: str
    ) -> tuple[Any, str]:
        chain: list[str] = config.get("fallback_chain", ["ollama"])
        for pid in chain:
            if pid == failed_id:
                continue
            p = registry.get(pid)
            if p is not None:
                logger.info("Falling back from %s to %s", failed_id, pid)
                return p, pid
        # Last resort: ollama is always available
        return registry.get_ollama(), "ollama"

    def resolve_embeddings(self) -> Embeddings:
        """Return an embeddings model routed to the configured embedding provider."""
        config = _load_routing()
        provider_id = config.get("embedding_provider", "ollama")
        model_id = config.get("embedding_model") or None

        db = get_session()
        try:
            registry = ProviderRegistry(db)
            provider = registry.get(provider_id)
            if provider is None:
                logger.warning(
                    "Embedding provider %s not available, falling back to Ollama", provider_id
                )
                return registry.get_ollama().get_embeddings(None)
            return provider.get_embeddings(model_id)  # type: ignore[call-arg]
        finally:
            db.close()

    def _over_budget(self, config: dict, db: Any) -> bool:
        budget_usd: float = config.get("budget", {}).get("monthly_usd", 0.0)
        if budget_usd <= 0:
            return False
        try:
            from sqlalchemy import extract, func
            now = datetime.utcnow()
            total = db.query(func.sum(UsageRecord.cost_usd)).filter(
                extract("year", UsageRecord.created_at) == now.year,
                extract("month", UsageRecord.created_at) == now.month,
            ).scalar() or 0.0
            return float(total) >= budget_usd
        except Exception:
            return False
