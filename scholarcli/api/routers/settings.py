"""User-facing settings + available-model listing.

UI settings are persisted to ``data/ui_settings.json`` (separate from the
TOML app config). Model lists come from the live Ollama server when reachable,
falling back to the configured tags.
"""

from __future__ import annotations

import json
import shutil
import logging

import httpx
from fastapi import APIRouter

from scholarcli.api.schemas import ModelsList, SettingsOut, SettingsPatch
from scholarcli.config import get_settings
from scholarcli.storage.database import engine

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["settings"])


def _settings_file():
    return get_settings().paths.resolved_data_dir() / "ui_settings.json"


def _defaults() -> dict:
    s = get_settings()
    routing = s.models.routing
    return {
        "fastModel": routing.get("quick_qa", "qwen3:8b"),
        "reasoningModel": routing.get("deep_analysis", routing.get("quick_qa", "qwen3:8b")),
        "embeddingModel": s.models.embedding,
        "visionModel": s.models.vision,
        "temperature": 0.4,
        "topK": s.retrieval.top_k,
        "similarityThreshold": round(1.0 - s.retrieval.max_distance, 2),
        "streaming": True,
        "citationsInline": True,
        "accent": "violet",
        "density": "comfortable",
        "industry": "",
        "role": "",
        "goals": "",
        "interests": "",
        "learningPreferences": "",
        "ragMode": "fallback",
    }


def _load() -> dict:
    data = _defaults()
    path = _settings_file()
    if path.exists():
        try:
            data.update(json.loads(path.read_text()))
        except (json.JSONDecodeError, OSError):
            pass
    return data


@router.get("/settings", response_model=SettingsOut)
def get_ui_settings() -> SettingsOut:
    return SettingsOut(**_load())


@router.put("/settings", response_model=SettingsOut)
def update_ui_settings(patch: SettingsPatch) -> SettingsOut:
    current = _load()
    current.update({k: v for k, v in patch.model_dump().items() if v is not None})
    _settings_file().write_text(json.dumps(current, indent=2))
    return SettingsOut(**current)


@router.get("/models/list", response_model=ModelsList)
def list_models() -> ModelsList:
    s = get_settings()
    installed: list[str] = []
    try:
        resp = httpx.get(f"{s.ollama.base_url}/api/tags", timeout=3.0)
        resp.raise_for_status()
        installed = [m["name"] for m in resp.json().get("models", [])]
    except (httpx.HTTPError, KeyError, ValueError):
        installed = []

    if not installed:
        # Fall back to whatever the routing table references.
        installed = sorted({*s.models.routing.values(), s.models.embedding})

    chat_models = [m for m in installed if "embed" not in m.lower()]
    embed_models = [m for m in installed if "embed" in m.lower()]
    if not chat_models:
        chat_models = installed
    if not embed_models:
        embed_models = [s.models.embedding]

    # Heuristic: surface likely vision-capable tags first, but allow any chat
    # model so users running a custom multimodal build can still pick it.
    _vision_hints = ("vl", "vision", "llava", "moondream", "minicpm", "bakllava", "gemma3")
    vision_models = [m for m in chat_models if any(h in m.lower() for h in _vision_hints)]
    # Always include the configured vision tag, then the rest as fallback.
    ordered = vision_models + [m for m in chat_models if m not in vision_models]
    if s.models.vision not in ordered:
        ordered.insert(0, s.models.vision)

    return ModelsList(
        fastModels=chat_models,
        reasoningModels=chat_models,
        embeddingModels=embed_models,
        visionModels=ordered,
    )

@router.delete("/settings/nuke")
def nuke_data():
    s = get_settings()
    data_dir = s.paths.resolved_data_dir()
    
    # Close any open DB connections to release file locks
    engine.dispose()
    
    try:
        if data_dir.exists():
            shutil.rmtree(data_dir.as_posix(), ignore_errors=True)
            data_dir.mkdir(parents=True, exist_ok=True)
        return {"status": "nuked"}
    except Exception as e:
        logger.error(f"Failed to nuke data: {e}")
        return {"status": "error", "message": str(e)}
