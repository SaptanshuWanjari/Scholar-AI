"""GeminiProvider — wraps langchain-google-genai."""

from __future__ import annotations

import time

from langchain_core.embeddings import Embeddings
from langchain_core.language_models import BaseChatModel
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

from scholarcli.llm.providers.base import ProviderCapability, ProviderModel

# Static model list — chat + embedding models
_KNOWN_MODELS: list[ProviderModel] = [
    ProviderModel(
        id="gemini-2.5-flash",
        label="Gemini 2.5 Flash",
        context_length=1_048_576,
        capabilities=[
            ProviderCapability.CHAT,
            ProviderCapability.STREAMING,
            ProviderCapability.VISION,
            ProviderCapability.JSON_MODE,
            ProviderCapability.TOOL_CALLING,
            ProviderCapability.REASONING,
        ],
        input_cost_per_mtok=0.30,
        output_cost_per_mtok=2.50,
        is_recommended=True,
        tags=["fast", "vision", "reasoning"],
    ),
    ProviderModel(
        id="gemini-2.5-pro",
        label="Gemini 2.5 Pro",
        context_length=2_097_152,
        capabilities=[
            ProviderCapability.CHAT,
            ProviderCapability.STREAMING,
            ProviderCapability.VISION,
            ProviderCapability.JSON_MODE,
            ProviderCapability.TOOL_CALLING,
            ProviderCapability.REASONING,
        ],
        input_cost_per_mtok=1.25,
        output_cost_per_mtok=10.00,
        is_recommended=False,
        tags=["vision", "reasoning", "large-context"],
    ),
    ProviderModel(
        id="gemini-2.0-flash",
        label="Gemini 2.0 Flash",
        context_length=1_048_576,
        capabilities=[
            ProviderCapability.CHAT,
            ProviderCapability.STREAMING,
            ProviderCapability.VISION,
            ProviderCapability.JSON_MODE,
            ProviderCapability.TOOL_CALLING,
        ],
        input_cost_per_mtok=0.10,
        output_cost_per_mtok=0.40,
        is_recommended=False,
        tags=["fast", "vision"],
    ),
    # Embedding-only models
    ProviderModel(
        id="models/text-embedding-004",
        label="Text Embedding 004",
        context_length=2048,
        capabilities=[ProviderCapability.EMBEDDINGS],
        input_cost_per_mtok=0.0,
        output_cost_per_mtok=0.0,
        is_recommended=True,
        tags=["embedding"],
    ),
    ProviderModel(
        id="models/text-multilingual-embedding-002",
        label="Text Multilingual Embedding 002",
        context_length=2048,
        capabilities=[ProviderCapability.EMBEDDINGS],
        input_cost_per_mtok=0.0,
        output_cost_per_mtok=0.0,
        is_recommended=False,
        tags=["embedding", "multilingual"],
    ),
]


class GeminiProvider:
    """Google Gemini provider."""

    provider_id = "gemini"
    capabilities: list[ProviderCapability] = [
        ProviderCapability.CHAT,
        ProviderCapability.STREAMING,
        ProviderCapability.VISION,
        ProviderCapability.JSON_MODE,
        ProviderCapability.TOOL_CALLING,
        ProviderCapability.REASONING,
        ProviderCapability.EMBEDDINGS,
    ]

    def __init__(self, api_key: str) -> None:
        self._api_key = api_key

    def get_chat_model(self, model_id: str | None, *, temperature: float = 0.0) -> BaseChatModel:
        return ChatGoogleGenerativeAI(
            model=model_id or "gemini-2.5-flash",
            temperature=temperature,
            google_api_key=self._api_key,
            convert_system_message_to_human=True,
        )

    def get_embeddings(self, model_id: str | None = None) -> Embeddings:
        return GoogleGenerativeAIEmbeddings(
            model=model_id or "models/text-embedding-004",
            google_api_key=self._api_key,
        )

    def list_models(self) -> list[ProviderModel]:
        """Return known models (static list — avoids google-generativeai import complexity)."""
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
