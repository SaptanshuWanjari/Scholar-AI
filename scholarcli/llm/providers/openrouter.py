"""OpenRouterProvider — wraps langchain-openai with OpenRouter's OpenAI-compat API."""

from __future__ import annotations

import time

import httpx
from langchain_core.embeddings import Embeddings
from langchain_core.language_models import BaseChatModel
from langchain_openai import ChatOpenAI

from scholarcli.llm.providers.base import ProviderCapability, ProviderModel

_OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

# Capability tags to ProviderCapability mapping for OpenRouter model metadata
_CAP_MAP: dict[str, ProviderCapability] = {
    "vision": ProviderCapability.VISION,
    "function_calling": ProviderCapability.TOOL_CALLING,
    "json_mode": ProviderCapability.JSON_MODE,
    "streaming": ProviderCapability.STREAMING,
    "reasoning": ProviderCapability.REASONING,
}

# Static embedding models available via OpenRouter (OpenAI-compatible endpoint)
_EMBEDDING_MODELS: list[ProviderModel] = [
    ProviderModel(
        id="openai/text-embedding-3-small",
        label="Text Embedding 3 Small",
        context_length=8191,
        capabilities=[ProviderCapability.EMBEDDINGS],
        input_cost_per_mtok=0.02,
        output_cost_per_mtok=0.0,
        is_recommended=True,
        tags=["embedding", "fast"],
    ),
    ProviderModel(
        id="openai/text-embedding-3-large",
        label="Text Embedding 3 Large",
        context_length=8191,
        capabilities=[ProviderCapability.EMBEDDINGS],
        input_cost_per_mtok=0.13,
        output_cost_per_mtok=0.0,
        is_recommended=False,
        tags=["embedding", "high-quality"],
    ),
    ProviderModel(
        id="openai/text-embedding-ada-002",
        label="Text Embedding Ada 002",
        context_length=8191,
        capabilities=[ProviderCapability.EMBEDDINGS],
        input_cost_per_mtok=0.10,
        output_cost_per_mtok=0.0,
        is_recommended=False,
        tags=["embedding", "legacy"],
    ),
]


class OpenRouterEmbeddings(Embeddings):
    """Direct-HTTP embeddings for OpenRouter.

    OpenRouter's /embeddings endpoint requires plain-text string input.
    The langchain_openai.OpenAIEmbeddings class tokenizes input first, which
    causes OpenRouter to return an empty data array ("No embedding data received").
    This class bypasses tokenization by posting JSON directly with httpx.
    """

    def __init__(self, api_key: str, model: str) -> None:
        self._api_key = api_key
        self._model = model

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        resp = httpx.post(
            f"{_OPENROUTER_BASE_URL}/embeddings",
            headers={
                "Authorization": f"Bearer {self._api_key}",
                "HTTP-Referer": "https://github.com/scholarcli",
                "X-Title": "ScholarCLI",
                "Content-Type": "application/json",
            },
            json={"model": self._model, "input": texts},
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        if not data.get("data"):
            raise ValueError(
                f"OpenRouter returned no embedding data for model '{self._model}'. "
                "Check that the model ID is correct and your API key has access to it."
            )
        return [item["embedding"] for item in data["data"]]

    def embed_query(self, text: str) -> list[float]:
        return self.embed_documents([text])[0]


class OpenRouterProvider:
    """OpenRouter provider — unified access to many cloud models."""

    provider_id = "openrouter"
    capabilities: list[ProviderCapability] = [
        ProviderCapability.CHAT,
        ProviderCapability.STREAMING,
        ProviderCapability.TOOL_CALLING,
        ProviderCapability.JSON_MODE,
        ProviderCapability.VISION,
        ProviderCapability.EMBEDDINGS,
    ]

    def __init__(self, api_key: str) -> None:
        self._api_key = api_key

    def get_chat_model(self, model_id: str | None, *, temperature: float = 0.0) -> BaseChatModel:
        return ChatOpenAI(
            model=model_id or "anthropic/claude-3-5-haiku",
            temperature=temperature,
            openai_api_key=self._api_key,  # type: ignore[arg-type]
            openai_api_base=_OPENROUTER_BASE_URL,  # type: ignore[call-arg]
            default_headers={
                "HTTP-Referer": "https://github.com/scholarcli",
                "X-Title": "ScholarCLI",
            },
        )

    def get_embeddings(self, model_id: str | None = None) -> Embeddings:
        return OpenRouterEmbeddings(
            api_key=self._api_key,
            model=model_id or "openai/text-embedding-3-small",
        )

    def list_models(self) -> list[ProviderModel]:
        """Fetch model list from OpenRouter's public /api/v1/models endpoint."""
        try:
            resp = httpx.get(
                f"{_OPENROUTER_BASE_URL}/models",
                headers={"Authorization": f"Bearer {self._api_key}"},
                timeout=10,
            )
            resp.raise_for_status()
            raw = resp.json().get("data", [])
        except Exception:
            return self._fallback_models() + _EMBEDDING_MODELS

        models: list[ProviderModel] = []
        for m in raw:
            arch = m.get("architecture", {})
            pricing = m.get("pricing", {})
            raw_caps: list[str] = m.get("supported_parameters", [])
            caps = [ProviderCapability.CHAT, ProviderCapability.STREAMING]
            for raw_cap in raw_caps:
                if raw_cap in _CAP_MAP:
                    caps.append(_CAP_MAP[raw_cap])

            try:
                input_cost = float(pricing.get("prompt", 0)) * 1_000_000
                output_cost = float(pricing.get("completion", 0)) * 1_000_000
            except (TypeError, ValueError):
                input_cost = output_cost = 0.0

            models.append(
                ProviderModel(
                    id=m["id"],
                    label=m.get("name", m["id"]),
                    context_length=m.get("context_length", 0),
                    capabilities=caps,
                    input_cost_per_mtok=input_cost,
                    output_cost_per_mtok=output_cost,
                    tags=[arch.get("modality", "text")],
                )
            )
        # Always include the known static embedding models
        return models + _EMBEDDING_MODELS

    def health_check(self) -> dict:
        t0 = time.monotonic()
        try:
            resp = httpx.get(
                f"{_OPENROUTER_BASE_URL}/auth/key",
                headers={"Authorization": f"Bearer {self._api_key}"},
                timeout=5,
            )
            resp.raise_for_status()
            latency_ms = int((time.monotonic() - t0) * 1000)
            status = "online" if latency_ms < 500 else "slow"
        except Exception:
            latency_ms = -1
            status = "offline"
        return {"status": status, "latency_ms": latency_ms}

    def _fallback_models(self) -> list[ProviderModel]:
        """Return a curated subset when the API call fails."""
        return [
            ProviderModel(
                id="anthropic/claude-3-5-haiku",
                label="Claude 3.5 Haiku",
                context_length=200_000,
                capabilities=[ProviderCapability.CHAT, ProviderCapability.STREAMING, ProviderCapability.TOOL_CALLING],
                input_cost_per_mtok=0.80,
                output_cost_per_mtok=4.00,
                is_recommended=True,
                tags=["fast"],
            ),
            ProviderModel(
                id="anthropic/claude-sonnet-4-5",
                label="Claude Sonnet 4.5",
                context_length=200_000,
                capabilities=[ProviderCapability.CHAT, ProviderCapability.STREAMING, ProviderCapability.VISION, ProviderCapability.TOOL_CALLING],
                input_cost_per_mtok=3.00,
                output_cost_per_mtok=15.00,
                is_recommended=False,
                tags=["vision", "reasoning"],
            ),
            ProviderModel(
                id="google/gemini-2.5-flash",
                label="Gemini 2.5 Flash (via OR)",
                context_length=1_048_576,
                capabilities=[ProviderCapability.CHAT, ProviderCapability.STREAMING, ProviderCapability.VISION],
                input_cost_per_mtok=0.30,
                output_cost_per_mtok=2.50,
                is_recommended=False,
                tags=["fast", "vision"],
            ),
        ]
