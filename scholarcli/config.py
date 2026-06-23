"""Configuration loading + validation.

Reads ``config/default.toml`` (and ``config/local.toml`` if present, merged on
top) and validates it into typed pydantic models. The rest of the app imports
``get_settings()`` rather than reading files directly.
"""

from __future__ import annotations

import tomllib
from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel, Field

# Project root = parent of the scholarcli package directory.
PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONFIG_DIR = PROJECT_ROOT / "config"


class OllamaConfig(BaseModel):
    base_url: str = "http://localhost:11434"


class ModelsConfig(BaseModel):
    embedding: str = "qwen3-embedding:0.6b"
    # task label -> model tag
    routing: dict[str, str] = Field(default_factory=dict)

    def model_for(self, task: str) -> str:
        """Resolve a task label to a model tag, falling back to quick_qa."""
        if task in self.routing:
            return self.routing[task]
        if "quick_qa" in self.routing:
            return self.routing["quick_qa"]
        raise KeyError(f"No model routing for task {task!r} and no quick_qa fallback")


class ChunkingConfig(BaseModel):
    chunk_size: int = 800
    chunk_overlap: int = 120


class RetrievalConfig(BaseModel):
    top_k: int = 5
    max_distance: float = 0.55


class PathsConfig(BaseModel):
    data_dir: str = "data"

    def resolved_data_dir(self) -> Path:
        p = Path(self.data_dir)
        if not p.is_absolute():
            p = PROJECT_ROOT / p
        p.mkdir(parents=True, exist_ok=True)
        return p


class Settings(BaseModel):
    ollama: OllamaConfig = Field(default_factory=OllamaConfig)
    models: ModelsConfig = Field(default_factory=ModelsConfig)
    chunking: ChunkingConfig = Field(default_factory=ChunkingConfig)
    retrieval: RetrievalConfig = Field(default_factory=RetrievalConfig)
    paths: PathsConfig = Field(default_factory=PathsConfig)

    @property
    def db_path(self) -> Path:
        return self.paths.resolved_data_dir() / "scholar.db"

    @property
    def lancedb_path(self) -> Path:
        return self.paths.resolved_data_dir() / "lancedb"


def _deep_merge(base: dict, override: dict) -> dict:
    out = dict(base)
    for key, val in override.items():
        if isinstance(val, dict) and isinstance(out.get(key), dict):
            out[key] = _deep_merge(out[key], val)
        else:
            out[key] = val
    return out


def _load_toml(path: Path) -> dict:
    with path.open("rb") as fh:
        return tomllib.load(fh)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Load + validate settings (cached). default.toml, then local.toml on top."""
    data: dict = {}
    default = CONFIG_DIR / "default.toml"
    if default.exists():
        data = _load_toml(default)
    local = CONFIG_DIR / "local.toml"
    if local.exists():
        data = _deep_merge(data, _load_toml(local))
    return Settings.model_validate(data)
