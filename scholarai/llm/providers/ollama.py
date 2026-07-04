"""OllamaProvider — wraps the existing ChatOllama / OllamaEmbeddings."""

from __future__ import annotations

import time

import httpx
from langchain_core.embeddings import Embeddings
from langchain_core.language_models import BaseChatModel
from langchain_ollama import ChatOllama, OllamaEmbeddings

from scholarai.config import get_settings
from scholarai.llm.providers.base import ProviderCapability, ProviderModel


class OllamaProvider:
    """Local Ollama provider — always available, zero config."""

    provider_id = "ollama"
    capabilities: list[ProviderCapability] = [
        ProviderCapability.CHAT,
        ProviderCapability.STREAMING,
        ProviderCapability.EMBEDDINGS,
        ProviderCapability.TOOL_CALLING,
    ]

    def get_chat_model(self, model_id: str | None, *, temperature: float = 0.0) -> BaseChatModel:
        s = get_settings()
        tag = model_id or self._default_tag()
        return ChatOllama(
            model=tag,
            temperature=temperature,
            base_url=s.ollama.base_url,
            keep_alive="5m",
            num_ctx=8192,
        )

    def get_embeddings(self, model_id: str | None = None) -> Embeddings:
        s = get_settings()
        return OllamaEmbeddings(model=model_id or s.models.embedding, base_url=s.ollama.base_url)

    def list_models(self) -> list[ProviderModel]:
        """Fetch running models from Ollama's /api/tags endpoint."""
        s = get_settings()
        try:
            resp = httpx.get(f"{s.ollama.base_url}/api/tags", timeout=5)
            resp.raise_for_status()
            raw_models = resp.json().get("models", [])
        except Exception:
            return []

        return [
            ProviderModel(
                id=m["name"],
                label=m["name"],
                context_length=m.get("details", {}).get("parameter_size", 0),
                capabilities=[ProviderCapability.CHAT, ProviderCapability.STREAMING],
                input_cost_per_mtok=0.0,
                output_cost_per_mtok=0.0,
                tags=["local"],
            )
            for m in raw_models
        ]

    def health_check(self) -> dict:
        s = get_settings()
        t0 = time.monotonic()
        try:
            resp = httpx.get(f"{s.ollama.base_url}/api/tags", timeout=5)
            resp.raise_for_status()
            latency_ms = int((time.monotonic() - t0) * 1000)
            status = "online" if latency_ms < 500 else "slow"
        except Exception:
            latency_ms = -1
            status = "offline"
        return {"status": status, "latency_ms": latency_ms}

    def _default_tag(self) -> str:
        from scholarai.api.routers.settings import _load as load_settings
        ui = load_settings()
        return ui.get("fastModel") or get_settings().models.model_for("quick_qa")
