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
from pydantic import Field

from scholarai.llm.provider_catalog import (
    PROVIDER_CAPABILITIES,
    REASONING_TASKS,
    TASK_CAPABILITY_REQUIREMENTS,
    VISION_TASKS,
)
from scholarai.llm.providers.base import ProviderCapability
from scholarai.llm.providers.registry import ProviderRegistry
from scholarai.storage import get_session
from scholarai.storage.models import UsageRecord

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
# Cloud error classification
# ---------------------------------------------------------------------------

# HTTP status codes that indicate permanent config problems — don't retry these.
_PERMANENT_STATUS_CODES: frozenset[int] = frozenset({401, 403, 429})

# Status codes that are transient — fall back to the next provider.
_TRANSIENT_STATUS_CODES: frozenset[int] = frozenset({500, 502, 503, 504})


def _status_code(exc: Exception) -> int | None:
    """Extract HTTP status code from openai/groq/google SDK exceptions."""
    return getattr(exc, "status_code", None) or getattr(exc, "code", None)


def _is_permanent(exc: Exception) -> bool:
    """Auth / permission errors — retrying a different model won't help."""
    code = _status_code(exc)
    if code in _PERMANENT_STATUS_CODES:
        return True
    # Also catch network-level errors where status is unavailable but the
    # exception type name makes the intent clear.
    name = type(exc).__name__
    return any(k in name for k in ("AuthenticationError", "PermissionDenied", "Forbidden"))


def _user_message(exc: Exception, provider_id: str) -> str:
    """Return a human-readable description of a cloud API error."""
    code = _status_code(exc)
    if code == 429:
        return (
            f"[{provider_id}] Rate limit / quota exceeded. "
            "Add credits or wait for the limit to reset."
        )
    if code == 401:
        return (
            f"[{provider_id}] Authentication failed — API key is invalid or revoked. "
            "Update it in Settings → Models → Providers."
        )
    if code == 403:
        return (
            f"[{provider_id}] Permission denied. "
            "Your API key may lack access to this model or endpoint."
        )
    if code == 404:
        return (
            f"[{provider_id}] Model not found. "
            "Check the model ID in Settings → Models → Routing."
        )
    if code in (500, 502, 503, 504):
        return f"[{provider_id}] Provider server error ({code}). Falling back."
    name = type(exc).__name__
    if "Timeout" in name or "Connection" in name:
        return f"[{provider_id}] Network error — provider unreachable. Falling back."
    return f"[{provider_id}] {name}: {exc}"


# ---------------------------------------------------------------------------
# Usage tracking wrapper
# ---------------------------------------------------------------------------

class UsageTrackingWrapper(BaseChatModel):
    """Wraps any BaseChatModel and writes a UsageRecord after each call.

    ``fallback_models`` holds sibling wrappers to try in order when the primary
    provider fails with a transient error (rate-limit, server error, timeout).
    Permanent failures (auth, permission) surface immediately without retrying.
    """

    inner: Any  # BaseChatModel — typed as Any to avoid Pydantic schema issues
    provider_id: str
    task: str
    fallback_models: list[Any] = Field(default_factory=list)  # list[UsageTrackingWrapper]

    class Config:
        arbitrary_types_allowed = True

    @property
    def _llm_type(self) -> str:
        return "usage-tracking"

    def _generate(
        self,
        messages: list[BaseMessage],
        stop: list[str] | None = None,
        run_manager: Any = None,
        **kwargs: Any,
    ) -> ChatResult:
        try:
            result: ChatResult = self.inner._generate(messages, stop=stop, run_manager=run_manager, **kwargs)
            self._record_usage(result)
            return result
        except Exception as primary_exc:
            msg = _user_message(primary_exc, self.provider_id)
            if _is_permanent(primary_exc) or not self.fallback_models:
                logger.error("Provider %s failed (no fallback): %s", self.provider_id, msg)
                raise RuntimeError(msg) from primary_exc
            logger.warning("%s — trying fallback providers", msg)
            last_exc: Exception = primary_exc
            for fb in self.fallback_models:
                try:
                    result = fb.inner._generate(messages, stop=stop, run_manager=run_manager, **kwargs)
                    fb._record_usage(result)
                    logger.info("Fallback to %s succeeded for task %s", fb.provider_id, self.task)
                    return result
                except Exception as fb_exc:
                    logger.warning("Fallback %s also failed: %s", fb.provider_id, _user_message(fb_exc, fb.provider_id))
                    last_exc = fb_exc
            raise RuntimeError(
                f"All providers failed for task '{self.task}'. "
                f"Primary ({self.provider_id}): {_user_message(primary_exc, self.provider_id)}. "
                f"Last fallback ({self.fallback_models[-1].provider_id}): {_user_message(last_exc, self.fallback_models[-1].provider_id)}"
            ) from primary_exc

    def _stream(
        self,
        messages: list[BaseMessage],
        stop: list[str] | None = None,
        run_manager: Any = None,
        **kwargs: Any,
    ) -> Iterator[ChatGenerationChunk]:
        # Try primary; on transient error before any chunks arrive, fall back.
        # Once chunks are streaming we cannot switch mid-stream, so errors surface directly.
        primary_failed = False
        primary_exc: Exception | None = None
        try:
            gen = self.inner._stream(messages, stop=stop, run_manager=run_manager, **kwargs)
            first = next(gen)  # probe: raises immediately if provider is down
        except Exception as exc:
            if _is_permanent(exc) or not self.fallback_models:
                raise RuntimeError(_user_message(exc, self.provider_id)) from exc
            logger.warning("%s — trying fallback for streaming", _user_message(exc, self.provider_id))
            primary_failed = True
            primary_exc = exc

        if not primary_failed:
            yield first  # type: ignore[possibly-undefined]
            yield from gen  # type: ignore[possibly-undefined]
            return

        for fb in self.fallback_models:
            try:
                yield from fb.inner._stream(messages, stop=stop, run_manager=run_manager, **kwargs)
                logger.info("Streaming fallback to %s succeeded for task %s", fb.provider_id, self.task)
                return
            except Exception as fb_exc:
                logger.warning("Streaming fallback %s failed: %s", fb.provider_id, fb_exc)
                last_exc = fb_exc
        raise RuntimeError(
            f"All providers failed for streaming task '{self.task}'. "
            f"Primary ({self.provider_id}): {_user_message(primary_exc, self.provider_id)}."
        ) from primary_exc

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
        from scholarai.llm.providers.gemini import _KNOWN_MODELS as gemini_models
        from scholarai.llm.providers.groq import _KNOWN_MODELS as groq_models

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

            # Build fallback wrappers from the configured chain (excluding the primary)
            fallback_wrappers: list[UsageTrackingWrapper] = []
            for pid in config.get("fallback_chain", ["ollama"]):
                if pid == provider_id:
                    continue
                # ponytail: cloud provider selected → skip ollama fallback
                if provider_id != "ollama" and pid == "ollama":
                    continue
                fp = registry.get(pid)
                if fp is None:
                    continue
                try:
                    fm = fp.get_chat_model(None, temperature=temperature)
                    fallback_wrappers.append(
                        UsageTrackingWrapper(inner=fm, provider_id=pid, task=task)
                    )
                except Exception:
                    pass  # skip unavailable fallback providers silently
        finally:
            db.close()

        return UsageTrackingWrapper(
            inner=chat_model,
            provider_id=provider_id,
            task=task,
            fallback_models=fallback_wrappers,
        )

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
            if provider is not None:
                try:
                    return provider.get_embeddings(model_id)
                except Exception as exc:
                    logger.warning("Embedding provider %s failed: %s — trying others", provider_id, exc)
            else:
                logger.warning("Embedding provider %s not available, trying others", provider_id)

            # ponytail: try any connected provider — user may not run ollama
            for pid in ("gemini", "groq", "openrouter", "ollama"):
                if pid == provider_id:
                    continue
                p = registry.get(pid)
                if p is None:
                    continue
                try:
                    return p.get_embeddings(None)
                except Exception:
                    continue
            raise RuntimeError("No embedding provider available. Connect at least one provider.")
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
