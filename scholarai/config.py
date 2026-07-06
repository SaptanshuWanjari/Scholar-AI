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

# Project root = parent of the scholarai package directory.
PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONFIG_DIR = PROJECT_ROOT / "config"


class OllamaConfig(BaseModel):
    base_url: str = "http://localhost:11434"


class ModelsConfig(BaseModel):
    embedding: str = "qwen3-embedding:0.6b"
    # Vision-capable model for image/diagram descriptions + OCR recovery.
    # Lightweight default; user can override via Settings (ui_settings.json).
    vision: str = "qwen2.5vl:3b"
    # task label -> model tag
    routing: dict[str, str] = Field(default_factory=dict)
    override_model: str | None = None

    def model_for(self, task: str) -> str:
        """Resolve a task label to a model tag, falling back to quick_qa."""
        if self.override_model:
            return self.override_model
        if task in self.routing:
            return self.routing[task]
        if "quick_qa" in self.routing:
            return self.routing["quick_qa"]
        raise KeyError(f"No model routing for task {task!r} and no quick_qa fallback")


class ChunkingConfig(BaseModel):
    chunk_size: int = 800
    chunk_overlap: int = 120


class IngestConfig(BaseModel):
    """Multimodal ingestion toggles + thresholds.

    Everything runs through Ollama (no torch / heavy OCR engine). Each stage is
    opt-out: set ``vision_enabled = false`` to skip image descriptions + OCR.
    """

    ocr_enabled: bool = True
    vision_enabled: bool = True
    tables_enabled: bool = True
    # Pages whose native text is shorter than this are treated as scanned.
    scanned_min_chars: int = 40
    ocr_workers: int = 4
    ocr_cache_enabled: bool = True
    tesseract_fallback: bool = True
    # Run an LLM pass post-ingestion to extract summary, tags, and topics.
    metadata_extraction: bool = True
    # Max concurrent ingest jobs in the worker pool.
    max_concurrent: int = 3



class RetrievalConfig(BaseModel):
    top_k: int = 5
    max_distance: float = 0.55
    # Blend BM25 keyword search with vector similarity (Reciprocal Rank Fusion).
    hybrid_search: bool = True
    # LLM relevance rerank pass that reorders the retrieved top_k before
    # generation (Ollama-only; not a torch cross-encoder).
    rerank_enabled: bool = True
    pq_enabled: bool = False
    pq_training_threshold: int = 500
    max_concurrent_llm: int = 5
    max_concurrent_llm: int = 5


class MultiHopConfig(BaseModel):
    enabled: bool = True
    max_hops: int = 2


class DuplicateDetectionConfig(BaseModel):
    enabled: bool = True
    overlap_threshold: float = 0.30
    scope: str = "course"


class PathsConfig(BaseModel):
    data_dir: str = "data"

    def resolved_data_dir(self) -> Path:
        p = Path(self.data_dir)
        if not p.is_absolute():
            p = PROJECT_ROOT / p
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def chat_logs_dir(self) -> Path:
        p = self.resolved_data_dir() / "chat_logs"
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def tables_dir(self) -> Path:
        p = self.resolved_data_dir() / "tables"
        p.mkdir(parents=True, exist_ok=True)
        return p


class FeaturesConfig(BaseModel):
    cloud_providers_enabled: bool = False


class Settings(BaseModel):
    ollama: OllamaConfig = Field(default_factory=OllamaConfig)
    models: ModelsConfig = Field(default_factory=ModelsConfig)
    chunking: ChunkingConfig = Field(default_factory=ChunkingConfig)
    multi_hop: MultiHopConfig = Field(default_factory=MultiHopConfig)
    duplicate_detection: DuplicateDetectionConfig = Field(default_factory=DuplicateDetectionConfig)
    retrieval: RetrievalConfig = Field(default_factory=RetrievalConfig)
    ingest: IngestConfig = Field(default_factory=IngestConfig)
    paths: PathsConfig = Field(default_factory=PathsConfig)
    features: FeaturesConfig = Field(default_factory=FeaturesConfig)

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
