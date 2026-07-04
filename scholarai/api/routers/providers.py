"""Cloud provider management endpoints.

All endpoints return 403 if the cloud-model-providers plugin is not enabled.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from scholarai.storage import get_session
from scholarai.storage.encryption import encrypt, decrypt
from scholarai.storage.models import PluginState, ProviderConfig

router = APIRouter(prefix="/api/providers", tags=["providers"])


def _require_plugin() -> None:
    """Raise 403 if the cloud-model-providers plugin is not enabled."""
    db = get_session()
    try:
        row = db.get(PluginState, "cloud-model-providers")
        if not (row and row.installed and row.enabled):
            raise HTTPException(status_code=403, detail="cloud-model-providers plugin is not enabled")
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class ProviderStatus(BaseModel):
    provider_id: str
    name: str
    description: str
    is_local: bool
    connected: bool
    enabled: bool
    default_model: str | None
    capabilities: list[str]


class ConnectRequest(BaseModel):
    api_key: str


class ProviderModelOut(BaseModel):
    id: str
    label: str
    context_length: int
    capabilities: list[str]
    input_cost_per_mtok: float
    output_cost_per_mtok: float
    is_recommended: bool
    tags: list[str]


class HealthResponse(BaseModel):
    status: str  # "online" | "slow" | "offline"
    latency_ms: int


class TestResponse(BaseModel):
    success: bool
    latency_ms: int
    model_count: int
    streaming: bool
    error: str | None = None


# Static metadata for the providers list
_PROVIDER_META = {
    "ollama": {
        "name": "Ollama (Local)",
        "description": "Local models running on your machine. Always available, fully private.",
        "is_local": True,
        "capabilities": ["chat", "streaming", "embeddings", "tools"],
    },
    "gemini": {
        "name": "Google Gemini",
        "description": "Google's Gemini models. Excellent for vision, reasoning, long-context, and embeddings.",
        "is_local": False,
        "capabilities": ["chat", "streaming", "vision", "json", "tools", "reasoning", "embeddings"],
    },
    "groq": {
        "name": "Groq",
        "description": "Ultra-fast inference for open-source models (Llama, Mixtral).",
        "is_local": False,
        "capabilities": ["chat", "streaming", "json", "tools"],
    },
    "openrouter": {
        "name": "OpenRouter",
        "description": "Unified API for 100+ cloud models from Anthropic, Google, Meta, and more — plus embeddings.",
        "is_local": False,
        "capabilities": ["chat", "streaming", "vision", "json", "tools", "embeddings"],
    },
}


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("", response_model=list[ProviderStatus])
def list_providers() -> list[ProviderStatus]:
    """List all providers with their current connection status."""
    _require_plugin()
    db = get_session()
    try:
        result = []
        for pid, meta in _PROVIDER_META.items():
            if pid == "ollama":
                result.append(ProviderStatus(
                    provider_id=pid,
                    name=meta["name"],
                    description=meta["description"],
                    is_local=meta["is_local"],
                    connected=True,
                    enabled=True,
                    default_model=None,
                    capabilities=meta["capabilities"],
                ))
                continue
            row: ProviderConfig | None = db.get(ProviderConfig, pid)
            result.append(ProviderStatus(
                provider_id=pid,
                name=meta["name"],
                description=meta["description"],
                is_local=meta["is_local"],
                connected=bool(row and row.connected),
                enabled=bool(row and row.enabled),
                default_model=row.default_model if row else None,
                capabilities=meta["capabilities"],
            ))
        return result
    finally:
        db.close()


@router.post("/{provider_id}/connect")
def connect_provider(provider_id: str, payload: ConnectRequest) -> dict:
    """Store an API key and mark provider as connected after validating it."""
    _require_plugin()
    if provider_id not in ("gemini", "groq", "openrouter"):
        raise HTTPException(status_code=404, detail=f"Unknown cloud provider: {provider_id}")

    # Validate key by instantiating provider and listing models
    try:
        provider = _get_provider_instance(provider_id, payload.api_key)
        models = provider.list_models()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Connection failed: {exc}") from exc

    db = get_session()
    try:
        row = db.get(ProviderConfig, provider_id)
        if row is None:
            row = ProviderConfig(provider_id=provider_id)
            db.add(row)
        row.api_key_encrypted = encrypt(payload.api_key)
        row.connected = True
        row.enabled = True
        db.commit()
    finally:
        db.close()

    return {"connected": True, "model_count": len(models)}


@router.delete("/{provider_id}/disconnect")
def disconnect_provider(provider_id: str) -> dict:
    """Remove the API key and mark provider as disconnected."""
    _require_plugin()
    if provider_id not in ("gemini", "groq", "openrouter"):
        raise HTTPException(status_code=404, detail=f"Unknown cloud provider: {provider_id}")

    db = get_session()
    try:
        row = db.get(ProviderConfig, provider_id)
        if row:
            row.api_key_encrypted = None
            row.connected = False
            row.enabled = False
            db.commit()
    finally:
        db.close()

    return {"disconnected": True}


@router.get("/{provider_id}/models", response_model=list[ProviderModelOut])
def list_provider_models(provider_id: str) -> list[ProviderModelOut]:
    """Return models available from the given provider."""
    _require_plugin()

    if provider_id == "ollama":
        from scholarai.llm.providers.ollama import OllamaProvider
        models = OllamaProvider().list_models()
    else:
        provider = _get_connected_provider(provider_id)
        models = provider.list_models()

    return [
        ProviderModelOut(
            id=m.id,
            label=m.label,
            context_length=m.context_length,
            capabilities=[c.value for c in m.capabilities],
            input_cost_per_mtok=m.input_cost_per_mtok,
            output_cost_per_mtok=m.output_cost_per_mtok,
            is_recommended=m.is_recommended,
            tags=m.tags,
        )
        for m in models
    ]


@router.post("/{provider_id}/test", response_model=TestResponse)
def test_provider(provider_id: str) -> TestResponse:
    """Run a smoke test: check connectivity, measure latency, count models."""
    _require_plugin()

    import time

    if provider_id == "ollama":
        from scholarai.llm.providers.ollama import OllamaProvider
        p = OllamaProvider()
        # Health check first — gives a clear "offline" signal when Ollama isn't running
        health = p.health_check()
        if health["status"] == "offline":
            return TestResponse(
                success=False,
                latency_ms=-1,
                model_count=0,
                streaming=False,
                error="Ollama is not running. Start it with: ollama serve",
            )
    else:
        try:
            p = _get_connected_provider(provider_id)  # type: ignore[assignment]
        except HTTPException as exc:
            return TestResponse(success=False, latency_ms=-1, model_count=0, streaming=False, error=exc.detail)

    t0 = time.monotonic()
    try:
        models = p.list_models()
        latency_ms = int((time.monotonic() - t0) * 1000)
        return TestResponse(
            success=True,
            latency_ms=latency_ms,
            model_count=len(models),
            streaming=True,
        )
    except Exception as exc:
        return TestResponse(success=False, latency_ms=-1, model_count=0, streaming=False, error=str(exc))


@router.get("/{provider_id}/health", response_model=HealthResponse)
def provider_health(provider_id: str) -> HealthResponse:
    """Return connection health for a provider."""
    _require_plugin()

    if provider_id == "ollama":
        from scholarai.llm.providers.ollama import OllamaProvider
        result = OllamaProvider().health_check()
    else:
        try:
            p = _get_connected_provider(provider_id)
            result = p.health_check()  # type: ignore[union-attr]
        except HTTPException:
            result = {"status": "offline", "latency_ms": -1}

    return HealthResponse(status=result["status"], latency_ms=result["latency_ms"])


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_connected_provider(provider_id: str):  # type: ignore[return]
    """Load a cloud provider from DB config, raising 404/403 if not connected."""
    db = get_session()
    try:
        row: ProviderConfig | None = db.get(ProviderConfig, provider_id)
        if not (row and row.connected and row.api_key_encrypted):
            raise HTTPException(status_code=404, detail=f"Provider '{provider_id}' is not connected")
        key = decrypt(row.api_key_encrypted)
    finally:
        db.close()

    return _get_provider_instance(provider_id, key)


def _get_provider_instance(provider_id: str, api_key: str):  # type: ignore[return]
    if provider_id == "gemini":
        from scholarai.llm.providers.gemini import GeminiProvider
        return GeminiProvider(api_key)
    if provider_id == "groq":
        from scholarai.llm.providers.groq import GroqProvider
        return GroqProvider(api_key)
    if provider_id == "openrouter":
        from scholarai.llm.providers.openrouter import OpenRouterProvider
        return OpenRouterProvider(api_key)
    raise HTTPException(status_code=404, detail=f"Unknown provider: {provider_id}")
