"""OpenAICompatProvider — generic OpenAI-compatible endpoint (LM Studio, vLLM, Together, etc.)."""

from __future__ import annotations

import time

import httpx
from langchain_core.embeddings import Embeddings
from langchain_core.language_models import BaseChatModel
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from scholarai.llm.providers.base import ProviderCapability, ProviderModel

class OpenAICompatProvider:
    """Generic OpenAI-compatible provider.

    Works with any server that implements the OpenAI REST spec:
    LM Studio, Ollama's OpenAI-compat layer, vLLM, Together AI,
    Fireworks AI, Anyscale, Perplexity, etc.
    """

    provider_id = "openai_compat"
    capabilities: list[ProviderCapability] = [
        ProviderCapability.CHAT,
        ProviderCapability.STREAMING,
        ProviderCapability.JSON_MODE,
        ProviderCapability.TOOL_CALLING,
    ]

    def __init__(self, api_key: str, base_url: str) -> None:
        self._api_key = api_key
        self._base_url = base_url.rstrip("/")

    def get_chat_model(self, model_id: str | None, *, temperature: float = 0.0) -> BaseChatModel:
        return ChatOpenAI(
            model=model_id or "default",
            temperature=temperature,
            openai_api_key=self._api_key,  # type: ignore[arg-type]
            openai_api_base=self._base_url,  # type: ignore[call-arg]
        )

    def get_embeddings(self, model_id: str | None = None) -> Embeddings:
        return OpenAIEmbeddings(
            model=model_id or "text-embedding-ada-002",
            openai_api_key=self._api_key,  # type: ignore[arg-type]
            openai_api_base=self._base_url,  # type: ignore[call-arg]
        )

    def list_models(self) -> list[ProviderModel]:
        """Fetch models from the /models endpoint; return empty list on failure."""
        try:
            headers: dict[str, str] = {}
            if self._api_key and self._api_key != "none":
                headers["Authorization"] = f"Bearer {self._api_key}"
            resp = httpx.get(f"{self._base_url}/models", headers=headers, timeout=8)
            resp.raise_for_status()
            data = resp.json().get("data", [])
            return [
                ProviderModel(
                    id=m["id"],
                    label=m.get("id", m["id"]),
                    context_length=m.get("context_length", 0),
                    capabilities=[ProviderCapability.CHAT, ProviderCapability.STREAMING],
                    input_cost_per_mtok=0.0,
                    output_cost_per_mtok=0.0,
                    tags=["openai-compat"],
                )
                for m in data
                if "id" in m
            ]
        except Exception:
            return []

    def health_check(self) -> dict:
        t0 = time.monotonic()
        try:
            headers: dict[str, str] = {}
            if self._api_key and self._api_key != "none":
                headers["Authorization"] = f"Bearer {self._api_key}"
            resp = httpx.get(f"{self._base_url}/models", headers=headers, timeout=5)
            resp.raise_for_status()
            latency_ms = int((time.monotonic() - t0) * 1000)
            status = "online" if latency_ms < 500 else "slow"
        except Exception:
            latency_ms = -1
            status = "offline"
        return {"status": status, "latency_ms": latency_ms}
