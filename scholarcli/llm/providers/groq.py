"""GroqProvider — wraps langchain-groq."""

from __future__ import annotations

import time

from langchain_core.embeddings import Embeddings
from langchain_core.language_models import BaseChatModel
from langchain_groq import ChatGroq

from scholarcli.llm.providers.base import ProviderCapability, ProviderModel

# Groq doesn't offer embeddings — placeholder that raises clearly
class _NoEmbeddings:
    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        raise NotImplementedError("Groq does not provide an embeddings model")

    def embed_query(self, text: str) -> list[float]:
        raise NotImplementedError("Groq does not provide an embeddings model")


_KNOWN_MODELS: list[ProviderModel] = [
    ProviderModel(
        id="llama-3.3-70b-versatile",
        label="Llama 3.3 70B",
        context_length=128_000,
        capabilities=[
            ProviderCapability.CHAT,
            ProviderCapability.STREAMING,
            ProviderCapability.JSON_MODE,
            ProviderCapability.TOOL_CALLING,
        ],
        input_cost_per_mtok=0.59,
        output_cost_per_mtok=0.79,
        is_recommended=True,
        tags=["fast", "open-source"],
    ),
    ProviderModel(
        id="llama-3.1-8b-instant",
        label="Llama 3.1 8B Instant",
        context_length=128_000,
        capabilities=[
            ProviderCapability.CHAT,
            ProviderCapability.STREAMING,
            ProviderCapability.JSON_MODE,
            ProviderCapability.TOOL_CALLING,
        ],
        input_cost_per_mtok=0.05,
        output_cost_per_mtok=0.08,
        is_recommended=False,
        tags=["fast", "cheap", "open-source"],
    ),
    ProviderModel(
        id="mixtral-8x7b-32768",
        label="Mixtral 8x7B",
        context_length=32_768,
        capabilities=[
            ProviderCapability.CHAT,
            ProviderCapability.STREAMING,
            ProviderCapability.JSON_MODE,
        ],
        input_cost_per_mtok=0.24,
        output_cost_per_mtok=0.24,
        is_recommended=False,
        tags=["open-source"],
    ),
    ProviderModel(
        id="gemma2-9b-it",
        label="Gemma 2 9B",
        context_length=8_192,
        capabilities=[
            ProviderCapability.CHAT,
            ProviderCapability.STREAMING,
        ],
        input_cost_per_mtok=0.20,
        output_cost_per_mtok=0.20,
        is_recommended=False,
        tags=["fast", "open-source"],
    ),
]


class GroqProvider:
    """Groq cloud provider — extremely fast inference."""

    provider_id = "groq"
    capabilities: list[ProviderCapability] = [
        ProviderCapability.CHAT,
        ProviderCapability.STREAMING,
        ProviderCapability.JSON_MODE,
        ProviderCapability.TOOL_CALLING,
    ]

    def __init__(self, api_key: str) -> None:
        self._api_key = api_key

    def get_chat_model(self, model_id: str | None, *, temperature: float = 0.0) -> BaseChatModel:
        return ChatGroq(
            model=model_id or "llama-3.3-70b-versatile",
            temperature=temperature,
            groq_api_key=self._api_key,
        )

    def get_embeddings(self) -> Embeddings:  # type: ignore[override]
        return _NoEmbeddings()  # type: ignore[return-value]

    def list_models(self) -> list[ProviderModel]:
        return _KNOWN_MODELS

    def health_check(self) -> dict:
        t0 = time.monotonic()
        try:
            llm = self.get_chat_model(None, temperature=0.0)
            llm.invoke("hi")
            latency_ms = int((time.monotonic() - t0) * 1000)
            status = "online" if latency_ms < 500 else "slow"
        except Exception:
            latency_ms = -1
            status = "offline"
        return {"status": status, "latency_ms": latency_ms}
