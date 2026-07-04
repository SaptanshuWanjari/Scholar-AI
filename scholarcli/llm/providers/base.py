"""Provider abstraction: protocol, capability enum, and model dataclass."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import StrEnum
from typing import Protocol, runtime_checkable

from langchain_core.embeddings import Embeddings
from langchain_core.language_models import BaseChatModel


class ProviderCapability(StrEnum):
    CHAT = "chat"
    STREAMING = "streaming"
    VISION = "vision"
    EMBEDDINGS = "embeddings"
    JSON_MODE = "json"
    TOOL_CALLING = "tools"
    REASONING = "reasoning"


@dataclass
class ProviderModel:
    id: str                          # raw API id, e.g. "gemini-2.5-flash"
    label: str                       # friendly name, e.g. "Gemini 2.5 Flash"
    context_length: int
    capabilities: list[ProviderCapability]
    input_cost_per_mtok: float       # USD per million input tokens
    output_cost_per_mtok: float      # USD per million output tokens
    is_recommended: bool = False
    tags: list[str] = field(default_factory=list)  # e.g. "fast", "vision", "reasoning"


@runtime_checkable
class BaseProvider(Protocol):
    provider_id: str
    capabilities: list[ProviderCapability]

    def get_chat_model(self, model_id: str | None, *, temperature: float) -> BaseChatModel:
        """Return a chat model for the given model ID (or provider default)."""
        ...

    def get_embeddings(self, model_id: str | None = None) -> Embeddings:
        """Return an embeddings model, optionally for a specific model ID."""
        ...

    def list_models(self) -> list[ProviderModel]:
        """Return all models available from this provider."""
        ...

    def health_check(self) -> dict:
        """Return {"status": "online"|"slow"|"offline", "latency_ms": int}."""
        ...
