"""ProviderRegistry — singleton that holds all configured provider instances."""

from __future__ import annotations

import logging
from functools import lru_cache

from sqlalchemy.orm import Session

from scholarai.llm.providers.base import BaseProvider
from scholarai.llm.providers.ollama import OllamaProvider
from scholarai.storage.encryption import decrypt
from scholarai.storage.models import ProviderConfig

logger = logging.getLogger(__name__)


def _load_provider(db: Session, provider_id: str) -> "BaseProvider | None":
    """Instantiate a cloud provider from its DB config, or return None if not connected."""
    row: ProviderConfig | None = db.get(ProviderConfig, provider_id)
    if row is None or not row.connected or row.api_key_encrypted is None:
        return None

    try:
        key = decrypt(row.api_key_encrypted)
    except Exception:
        logger.warning("Failed to decrypt API key for provider %s", provider_id)
        return None

    if provider_id == "gemini":
        from scholarai.llm.providers.gemini import GeminiProvider
        return GeminiProvider(key)
    if provider_id == "groq":
        from scholarai.llm.providers.groq import GroqProvider
        return GroqProvider(key)
    if provider_id == "openrouter":
        from scholarai.llm.providers.openrouter import OpenRouterProvider
        return OpenRouterProvider(key)
    if provider_id == "openai_compat":
        from scholarai.llm.providers.openai_compat import OpenAICompatProvider
        base_url = row.base_url or "http://localhost:1234/v1"
        return OpenAICompatProvider(key, base_url)

    return None


class ProviderRegistry:
    """Holds one instance per provider, loaded on demand from the DB."""

    # Always-available local provider
    _ollama = OllamaProvider()

    def __init__(self, db: Session) -> None:
        self._db = db

    def get_ollama(self) -> OllamaProvider:
        return self._ollama

    def get(self, provider_id: str) -> "BaseProvider | None":
        """Return the provider instance, or None if not configured/connected."""
        if provider_id == "ollama":
            return self._ollama
        return _load_provider(self._db, provider_id)

    def list_connected(self) -> list[BaseProvider]:
        """Return all currently connected providers (ollama + any cloud)."""
        providers: list[BaseProvider] = [self._ollama]
        for pid in ("gemini", "groq", "openrouter", "openai_compat"):
            p = _load_provider(self._db, pid)
            if p is not None:
                providers.append(p)
        return providers

    def all_provider_ids(self) -> list[str]:
        return ["ollama", "gemini", "groq", "openrouter", "openai_compat"]
