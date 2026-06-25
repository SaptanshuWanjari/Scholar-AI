# Backend RAG Context

This file contains all the context for the backend codebase.

## Directory Structure
```text
scholarcli/
    __init__.py
    cli.py
    config.py
        storage/
            vectors.py
            __init__.py
            models.py
        llm/
            __init__.py
        ingest/
            __init__.py
            vision.py
            tables.py
            analyze.py
            loaders.py
            chunker.py
            ocr.py
            metadata_extractor.py
            pipeline.py
        rag/
            state.py
            __init__.py
            graph.py
            prompts.py
            nodes/
                router.py
                __init__.py
                verifier.py
                generator.py
                reranker.py
                retriever.py
        api/
            __init__.py
            activity_service.py
            parsers.py
            quality.py
            pyq_service.py
            chat_service.py
            job_service.py
            trace_service.py
            app.py
            consistency_service.py
            knowledge_service.py
            prompt_service.py
            rag_service.py
            schemas.py
            routers/
                __init__.py
                courses.py
                search.py
                dashboard.py
                onboarding.py
                teach.py
                settings.py
                reading.py
                study.py
                differences.py
                notebooks.py
                pyq.py
                jobs.py
                ask.py
                consistency.py
                documents.py
                exam.py
                knowledge.py
                library.py
                prompts.py
                trace.py
```


## File: __init__.py
```python
"""ScholarCLI — local-first AI study assistant."""

__version__ = "0.1.0"

```


## File: cli.py
```python
"""CLI entry point — Typer app exposing ingest, ask, courses."""

from __future__ import annotations

from pathlib import Path

import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from scholarcli.ingest.pipeline import ingest_path
from scholarcli.rag import build_rag
from scholarcli.storage import get_session, init_db
from scholarcli.storage.models import Course

app = typer.Typer(name="scholar", help="Terminal AI study assistant")
console = Console()


@app.callback(invoke_without_command=True)
def _callback(ctx: typer.Context) -> None:
    if ctx.invoked_subcommand is None:
        app.print_help()
        raise typer.Exit()


# ---------------------------------------------------------------------------
# ingest
# ---------------------------------------------------------------------------

@app.command()
def ingest(
    path_str: str = typer.Argument(..., help="File or directory of PDF/MD files"),
    course: str = typer.Option(
        ..., "--course", "-c", help="Course name for the ingested material"
    ),
) -> None:
    """Ingest PDFs and Markdown files into your local knowledge base."""
    init_db()
    p = Path(path_str).resolve()
    if not p.exists():
        console.print(f"[red]Path not found:[/red] {path_str}")
        raise typer.Exit(code=1)

    with console.status(f"Ingesting into [bold]{course}[/bold]..."):
        results = ingest_path(p, course)

    for r in results:
        icon = "[green]✓[/green]"
        console.print(f"  {icon} {r}")
    console.print(f"\n[bold green]Done.[/bold green] {len(results)} file(s) processed.")


# ---------------------------------------------------------------------------
# ask
# ---------------------------------------------------------------------------

@app.command()
def ask(
    query: str = typer.Argument(..., help="Your question"),
    course: str = typer.Option(
        None, "--course", "-c", help="Restrict retrieval to this course"
    ),
    model: str = typer.Option("qwen3:8b", "--model", "-m", help="Model to use"),
) -> None:
    """Ask a question grounded in your uploaded materials."""
    from scholarcli.config import get_settings
    get_settings().models.override_model = model
    init_db()
    rag = build_rag()
    result = rag.invoke({"query": query, "course": course})
    answer = result.get("answer", "(no answer)")
    grounded = result.get("grounded", False)

    if grounded:
        console.print(Panel(answer, title="Answer", border_style="green"))
    else:
        console.print(Panel(answer, title="Answer", border_style="yellow"))


# ---------------------------------------------------------------------------
# courses
# ---------------------------------------------------------------------------

@app.command()
def courses() -> None:
    """List all courses and their ingested documents."""
    init_db()
    session = get_session()
    rows = (
        session.query(Course)
        .order_by(Course.name)
        .all()
    )
    if not rows:
        console.print("[dim]No courses found. Use 'scholar ingest' first.[/dim]")
        return

    table = Table(title="Courses")
    table.add_column("ID", style="dim")
    table.add_column("Name")
    table.add_column("Documents", justify="right")
    for c in rows:
        table.add_row(str(c.id), c.name, str(len(c.documents)))
    console.print(table)


# ---------------------------------------------------------------------------
# serve
# ---------------------------------------------------------------------------

@app.command()
def serve(
    host: str = typer.Option("127.0.0.1", "--host", help="Bind address"),
    port: int = typer.Option(8000, "--port", "-p", help="Port to listen on"),
    reload: bool = typer.Option(False, "--reload", help="Auto-reload on code changes"),
) -> None:
    """Run the HTTP API server for the web frontend."""
    import uvicorn

    init_db()
    console.print(
        f"[bold green]ScholarCLI API[/bold green] → http://{host}:{port}  "
        f"(docs at /docs)"
    )
    uvicorn.run(
        "scholarcli.api.app:app", host=host, port=port, reload=reload, factory=False
    )



```


## File: config.py
```python
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
    # Run an LLM pass post-ingestion to extract summary, tags, and topics.
    metadata_extraction: bool = True


class RetrievalConfig(BaseModel):
    top_k: int = 5
    max_distance: float = 0.55
    # Blend BM25 keyword search with vector similarity (Reciprocal Rank Fusion).
    hybrid_search: bool = True
    # LLM relevance rerank pass that reorders the retrieved top_k before
    # generation (Ollama-only; not a torch cross-encoder).
    rerank_enabled: bool = True


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


class Settings(BaseModel):
    ollama: OllamaConfig = Field(default_factory=OllamaConfig)
    models: ModelsConfig = Field(default_factory=ModelsConfig)
    chunking: ChunkingConfig = Field(default_factory=ChunkingConfig)
    retrieval: RetrievalConfig = Field(default_factory=RetrievalConfig)
    ingest: IngestConfig = Field(default_factory=IngestConfig)
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

```


## File: storage/vectors.py
```python
"""LanceDB helper — create/get table, add vectors, search, delete by document.

Table schema (inferred from first batch):
  - id          : str (uuid)
  - document_id : int
  - course      : str
  - title       : str
  - page        : int | null
  - heading     : str
  - chunk_index : int
  - text        : str
  - source_type : str   (text | ocr | table | image | diagram)
  - image_url   : str   (served URL for image/diagram artifacts, else "")
  - vector      : list[float]  (dimension inferred from first real embedding)
"""

from __future__ import annotations

import logging

import lancedb

from scholarcli.config import get_settings

logger = logging.getLogger(__name__)

TABLE_NAME = "chunks"

# Columns that an up-to-date chunks table must carry. A pre-multimodal table
# lacks these, so the first insert recreates it (chunks are rebuildable from
# the source files under data/uploads via reindex_all()).
_REQUIRED_COLUMNS = {"source_type", "image_url"}


def _db():
    s = get_settings()
    return lancedb.connect(str(s.lancedb_path))


def _has_table() -> bool:
    return TABLE_NAME in _db().table_names()


def _open_table():
    """Return an open table handle. Raises if table doesn't exist yet."""
    return _db().open_table(TABLE_NAME)


def has_document_chunks(document_id: int) -> bool:
    """Return True if the chunks table exists and has at least one row for *document_id*."""
    if not _has_table():
        return False
    tbl = _open_table()
    try:
        count = tbl.count_rows(f"document_id = {document_id}")
    except Exception:
        return False
    return count > 0


def _schema_is_current(tbl) -> bool:
    """True if the table already has the multimodal columns."""
    try:
        names = set(tbl.schema.names)
    except Exception:  # noqa: BLE001
        return False
    return _REQUIRED_COLUMNS.issubset(names)


def add_chunks(rows: list[dict]) -> None:
    """Insert chunk rows. Creates the table from the first batch's schema.

    Required keys: id, document_id, course, title, page, heading,
    chunk_index, text, source_type, image_url, vector.

    A pre-multimodal table (missing ``source_type``/``image_url``) is dropped
    and recreated from this batch — LanceDB schemas are fixed at creation, so
    re-indexing is the migration path (see ``pipeline.reindex_all``).
    """
    if not rows:
        return
    db = _db()
    if _has_table():
        tbl = db.open_table(TABLE_NAME)
        if not _schema_is_current(tbl):
            logger.warning(
                "chunks table predates multimodal columns — recreating it; "
                "run reindex_all() (or re-upload) to restore all documents."
            )
            db.drop_table(TABLE_NAME)
            tbl = db.create_table(TABLE_NAME, data=rows)
        else:
            tbl.add(rows)
    else:
        # First batch — create the table so the vector dimension is correct.
        tbl = db.create_table(TABLE_NAME, data=rows)

    try:
        tbl.create_fts_index(["text"], replace=True)
    except Exception as exc:  # noqa: BLE001
        logger.warning("FTS index creation failed (hybrid search disabled): %s", exc)


def search(query_vector: list[float], top_k: int = 5, course: str | None = None, document: str | None = None) -> list[dict]:
    """Return nearest chunks as dicts, closest first.

    Result includes ``_distance`` key (LanceDB cosine; lower = closer).
    Returns [] if no chunks have been indexed yet.
    """
    if not _has_table():
        return []
    tbl = _open_table()
    q = tbl.search(query_vector).metric("cosine").limit(top_k)
    
    filters = []
    if course:
        filters.append(f"course = '{course}'")
    if document:
        filters.append(f"document_id = {document}")
        
    if filters:
        q = q.where(" AND ".join(filters), prefilter=True)
        
    return q.to_list()


def get_document_chunks(document_id: int) -> list[dict]:
    """Return all chunks for a document, ordered by chunk_index. [] if absent."""
    if not _has_table():
        return []
    tbl = _open_table()
    try:
        rows = tbl.search().where(f"document_id = {document_id}").limit(10_000).to_list()
    except Exception:
        return []
    return sorted(rows, key=lambda r: r.get("chunk_index", 0))


def all_chunks(course: str | None = None, limit: int = 5000) -> list[dict]:
    """Return chunks across all documents (optionally filtered by course)."""
    if not _has_table():
        return []
    tbl = _open_table()
    try:
        q = tbl.search().limit(limit)
        if course:
            q = q.where(f"course = '{course}'")
        return q.to_list()
    except Exception:
        return []


def delete_document(document_id: int) -> None:
    """Remove all chunks belonging to a document.  No-op if table absent."""
    if not _has_table():
        return
    _open_table().delete(f"document_id = {document_id}")


def update_document_course(document_id: int, course: str) -> None:
    """Update the course associated with all chunks for a document."""
    if not _has_table():
        return
    _open_table().update(where=f"document_id = {document_id}", values={"course": course})


def hybrid_search(
    query_text: str,
    query_vector: list[float],
    top_k: int = 5,
    course: str | None = None,
    document: str | None = None,
) -> list[dict]:
    """Blend BM25 keyword and vector similarity via Reciprocal Rank Fusion.

    Falls back to pure vector search if the FTS index is unavailable.
    """
    if not _has_table():
        return []

    tbl = _open_table()
    filters = []
    if course:
        filters.append(f"course = '{course}'")
    if document:
        filters.append(f"document_id = {document}")
    where_clause = " AND ".join(filters) if filters else None

    fetch_n = top_k * 3

    # Vector search.
    vq = tbl.search(query_vector).metric("cosine").limit(fetch_n)
    if where_clause:
        vq = vq.where(where_clause, prefilter=True)
    try:
        vector_results = vq.to_list()
    except Exception:
        vector_results = []

    # BM25 / FTS search.
    try:
        fq = tbl.search(query_text, query_type="fts").limit(fetch_n)
        if where_clause:
            fq = fq.where(where_clause)
        bm25_results = fq.to_list()
    except Exception:
        return search(query_vector, top_k=top_k, course=course, document=document)

    # Reciprocal Rank Fusion (k=60 is a standard default).
    K = 60
    scores: dict[str, float] = {}
    id_to_row: dict[str, dict] = {}

    for rank, row in enumerate(vector_results):
        rid = str(row.get("id", ""))
        scores[rid] = scores.get(rid, 0.0) + 1.0 / (K + rank + 1)
        id_to_row[rid] = row

    for rank, row in enumerate(bm25_results):
        rid = str(row.get("id", ""))
        scores[rid] = scores.get(rid, 0.0) + 1.0 / (K + rank + 1)
        if rid not in id_to_row:
            id_to_row[rid] = row

    ranked = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
    return [id_to_row[rid] for rid, _ in ranked[:top_k] if rid in id_to_row]

```


## File: storage/__init__.py
```python
"""SQLAlchemy engine + session factory.

Uses the ``settings.db_path`` (``data/scholar.db``) by default.
"""

from __future__ import annotations

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker

from scholarcli.config import get_settings

_engine: Engine | None = None
_session_factory: sessionmaker[Session] | None = None


def get_engine() -> Engine:
    global _engine
    if _engine is None:
        s = get_settings()
        _engine = create_engine(f"sqlite:///{s.db_path}", echo=False)
    return _engine


def get_session() -> Session:
    global _session_factory
    if _session_factory is None:
        _session_factory = sessionmaker(bind=get_engine())
    return _session_factory()


def reset_engine() -> None:
    """Drop the cached engine + session factory (used in tests)."""
    global _engine, _session_factory
    if _engine is not None:
        _engine.dispose()
    _engine = None
    _session_factory = None


def init_db() -> None:
    """Create all tables if they don't exist (safe to call any time)."""
    from scholarcli.storage.models import Base

    Base.metadata.create_all(bind=get_engine())
    _ensure_columns()


# Columns added after the initial schema. SQLite supports ADD COLUMN, so we
# patch older databases in place rather than requiring a migration framework.
_ADDED_COLUMNS: dict[str, list[tuple[str, str]]] = {
    "documents": [
        ("size_kb", "INTEGER NOT NULL DEFAULT 0"),
        ("pages", "INTEGER NOT NULL DEFAULT 0"),
        ("status", "VARCHAR(16) NOT NULL DEFAULT 'indexed'"),
        ("error", "TEXT"),
        ("summary", "TEXT"),
        ("tags", "JSON"),
        ("topics", "JSON"),
    ],
    "notebooks": [
        ("tags", "JSON"),
        ("is_draft", "INTEGER NOT NULL DEFAULT 0"),
    ],
    "pyq_questions": [
        ("subtopics", "JSON"),
    ],
    # Artifact quality scores (api/quality.py), added per artifact table.
    "decks": [("quality_score", "JSON")],
    "quizzes": [
        ("quality_score", "JSON"),
        ("session_answers", "JSON"),
        ("session_current_question", "INTEGER"),
        ("session_started_at", "TEXT"),
    ],
    "diagrams": [("quality_score", "JSON")],
    "mindmaps": [("quality_score", "JSON")],
    "difference_tables": [("quality_score", "JSON")],
    "exam_sessions": [
        ("duration_minutes", "INTEGER NOT NULL DEFAULT 0"),
        ("expires_at", "TEXT"),
    ],
}


def _ensure_columns() -> None:
    """Add any newly-introduced columns to existing tables (idempotent)."""
    from sqlalchemy import inspect, text

    engine = get_engine()
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())
    with engine.begin() as conn:
        for table, cols in _ADDED_COLUMNS.items():
            if table not in existing_tables:
                continue
            present = {c["name"] for c in inspector.get_columns(table)}
            for name, ddl in cols:
                if name not in present:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {ddl}"))

```


## File: storage/models.py
```python
"""SQLAlchemy ORM models.

YAGNI for MVP: only Course + Document. Chunk text + metadata lives in
LanceDB — the vector store is the source of truth for chunks. Chat
history is kept in-memory until persistence is justified.
"""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(256), unique=True, nullable=False)

    documents: Mapped[list["Document"]] = relationship(
        back_populates="course", cascade="all, delete-orphan"
    )


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    path: Mapped[str] = mapped_column(Text, nullable=False)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    file_type: Mapped[str] = mapped_column(String(16), nullable=False)  # pdf, md, txt
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    # Display metadata surfaced by the HTTP API / frontend.
    size_kb: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    pages: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[str] = mapped_column(
        String(16), nullable=False, default="indexed"
    )  # indexed, processing, failed
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    tags: Mapped[list | None] = mapped_column(JSON, nullable=True)
    topics: Mapped[list | None] = mapped_column(JSON, nullable=True)
    indexed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    course_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("courses.id"), nullable=False
    )
    course: Mapped["Course"] = relationship(back_populates="documents")


# ---------------------------------------------------------------------------
# Persistence for generated study artifacts (decks, quizzes, notebooks, KG).
# Nested structures (quiz questions, notebook blocks) are stored as JSON to
# avoid premature normalization.
# ---------------------------------------------------------------------------

class Deck(Base):
    __tablename__ = "decks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    color: Mapped[str] = mapped_column(String(16), nullable=False, default="#4f4d7a")
    quality_score: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    cards: Mapped[list["Card"]] = relationship(
        back_populates="deck", cascade="all, delete-orphan"
    )


class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    deck_id: Mapped[int] = mapped_column(Integer, ForeignKey("decks.id"), nullable=False)
    type: Mapped[str] = mapped_column(String(16), nullable=False, default="basic")
    front: Mapped[str] = mapped_column(Text, nullable=False)
    back: Mapped[str] = mapped_column(Text, nullable=False)
    due: Mapped[str] = mapped_column(String(32), nullable=False, default="Today")
    ease: Mapped[str] = mapped_column(String(16), nullable=False, default="new")

    deck: Mapped["Deck"] = relationship(back_populates="cards")


class SavedQuiz(Base):
    __tablename__ = "quizzes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    difficulty: Mapped[str] = mapped_column(String(16), nullable=False, default="Medium")
    questions: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    quality_score: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    session_answers: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    session_current_question: Mapped[int | None] = mapped_column(Integer, nullable=True)
    session_started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )


class Notebook(Base):
    __tablename__ = "notebooks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    subtitle: Mapped[str] = mapped_column(Text, nullable=False, default="")
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    color: Mapped[str] = mapped_column(String(16), nullable=False, default="#4f4d7a")
    blocks: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    tags: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    is_draft: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Diagram(Base):
    __tablename__ = "diagrams"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    kind: Mapped[str] = mapped_column(String(64), nullable=False, default="Flowchart")
    mermaid: Mapped[str] = mapped_column(Text, nullable=False)
    quality_score: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class Mindmap(Base):
    __tablename__ = "mindmaps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    text: Mapped[str] = mapped_column(Text, nullable=False)
    quality_score: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class DifferenceTable(Base):
    __tablename__ = "difference_tables"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    content: Mapped[str] = mapped_column(Text, nullable=False)
    quality_score: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class SavedRevision(Base):
    __tablename__ = "revisions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    topic: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    format: Mapped[str] = mapped_column(String(64), nullable=False, default="notes")
    content: Mapped[str] = mapped_column(Text, nullable=False)
    quality_score: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class Prompt(Base):
    """A user-customizable system prompt for a generation category.

    Built-in prompts (``built_in=True``) are seeded from the RAG defaults and
    cannot be edited or deleted; users clone or author their own variants.
    Exactly one prompt per category is ``active`` and drives generation.
    """

    __tablename__ = "prompts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    # Maps to a RAG route: quick_qa|flashcards|quiz|mermaid|mindmap|study_notes
    category: Mapped[str] = mapped_column(String(32), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    style: Mapped[str] = mapped_column(String(32), nullable=False, default="")
    body: Mapped[str] = mapped_column(Text, nullable=False)
    built_in: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Concept(Base):
    __tablename__ = "concepts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(256), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    definition: Mapped[str] = mapped_column(Text, nullable=False, default="")
    summary: Mapped[str] = mapped_column(Text, nullable=False, default="")
    cluster: Mapped[str] = mapped_column(String(16), nullable=False, default="rag")
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    ref_count: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    source_count: Mapped[int] = mapped_column(Integer, nullable=False, default=1)


class ConceptEdge(Base):
    __tablename__ = "concept_edges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source_id: Mapped[int] = mapped_column(Integer, ForeignKey("concepts.id"), nullable=False)
    target_id: Mapped[int] = mapped_column(Integer, ForeignKey("concepts.id"), nullable=False)
    relation: Mapped[str] = mapped_column(String(64), nullable=False, default="related")


class ReadingState(Base):
    __tablename__ = "reading_state"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    document_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("documents.id"), unique=True, nullable=False
    )
    highlights: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    bookmarks: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    progress: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)


class QuestionPaper(Base):
    """An uploaded previous-year question paper (PYQ)."""

    __tablename__ = "question_papers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    source_document: Mapped[str] = mapped_column(String(512), nullable=False, default="")
    question_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    questions: Mapped[list["PYQQuestion"]] = relationship(
        back_populates="paper", cascade="all, delete-orphan"
    )


class PYQQuestion(Base):
    """A single question extracted from a question paper."""

    __tablename__ = "pyq_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    paper_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("question_papers.id"), nullable=False
    )
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    topic: Mapped[str] = mapped_column(String(256), nullable=False, default="General")
    subtopics: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    difficulty: Mapped[str] = mapped_column(String(16), nullable=False, default="Medium")  # Easy|Medium|Hard
    # definition|explanation|comparison|advantages|architecture|case_study|numerical|problem_solving|short_answer|long_answer|other
    qtype: Mapped[str] = mapped_column(String(32), nullable=False, default="other")
    marks: Mapped[int | None] = mapped_column(Integer, nullable=True)

    paper: Mapped["QuestionPaper"] = relationship(back_populates="questions")


class TopicStat(Base):
    """Accumulated per-topic answer accuracy for a course (the feedback loop)."""

    __tablename__ = "topic_stats"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    topic: Mapped[str] = mapped_column(String(256), nullable=False)
    correct: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    total: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_attempt: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )


class LearningPackage(Base):
    """A saved ``/teach`` workspace — a topic's whole mini-course bundled into
    one row. Overview, per-artifact payloads and sources are stored as JSON so
    the entire workspace can be restored without re-generating anything.
    """

    __tablename__ = "learning_packages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)  # the topic
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    depth: Mapped[str] = mapped_column(String(16), nullable=False, default="standard")  # quick|standard|deep
    overview: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)  # {markdown, grounded}
    artifacts: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)  # {notes, flashcards, quiz, mindmap, diagram, difference}
    sources: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class ExamSession(Base):
    """Durable exam session — persists generate → submit across process restarts."""

    __tablename__ = "exam_sessions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    topic: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str | None] = mapped_column(String(128), nullable=True)
    questions: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    submitted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    # Server-side time enforcement. duration_minutes==0 means untimed.
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )


class Activity(Base):
    """Event log powering the dashboard (study stats, sessions, activity feed)."""

    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    kind: Mapped[str] = mapped_column(String(32), nullable=False)  # ask|flashcard|quiz|document|diagram|exam|note
    text: Mapped[str] = mapped_column(Text, nullable=False, default="")
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    cards: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ---------------------------------------------------------------------------
# Chat history (cross-session Q&A persistence).
# ---------------------------------------------------------------------------

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False, default="New chat")
    course: Mapped[str | None] = mapped_column(String(256), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    messages: Mapped[list["ChatMessage"]] = relationship(
        back_populates="session", cascade="all, delete-orphan"
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("chat_sessions.id"), nullable=False
    )
    role: Mapped[str] = mapped_column(String(16), nullable=False)  # user|assistant
    content: Mapped[str] = mapped_column(Text, nullable=False, default="")
    sources: Mapped[list | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    session: Mapped["ChatSession"] = relationship(back_populates="messages")


# ---------------------------------------------------------------------------
# Durable background jobs (e.g. document ingestion) — survive a reload so the
# UI can poll progress instead of holding it only in request-scoped state.
# ---------------------------------------------------------------------------

class BackgroundJob(Base):
    __tablename__ = "background_jobs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    kind: Mapped[str] = mapped_column(String(32), nullable=False)  # ingest|...
    status: Mapped[str] = mapped_column(
        String(16), nullable=False, default="queued"
    )  # queued|running|done|failed
    label: Mapped[str] = mapped_column(String(512), nullable=False, default="")
    payload: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    result: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )





# ---------------------------------------------------------------------------
# Retrieval-trace analytics — which chunks consistently show up in weak (low
# confidence / ungrounded) generations, plus manual thumbs-down feedback.
# ---------------------------------------------------------------------------

class ChunkFeedback(Base):
    __tablename__ = "chunk_feedback"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    query: Mapped[str] = mapped_column(Text, nullable=False, default="")
    chunk_id: Mapped[str] = mapped_column(String(128), nullable=False, default="")
    source: Mapped[str] = mapped_column(String(512), nullable=False, default="")
    similarity: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    verdict: Mapped[str] = mapped_column(String(16), nullable=False, default="weak")  # weak|down
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

```


## File: llm/__init__.py
```python
"""Ollama model factory.

Single entry point: ``get_llm(task)`` returns a ``ChatOllama`` bound to the model
tag that ``config/models.toml`` maps the task label to. ``get_embeddings()``
returns ``OllamaEmbeddings`` with the configured embedding model.
"""

from __future__ import annotations

import json

from langchain_ollama import ChatOllama, OllamaEmbeddings

from scholarcli.config import get_settings

# Tasks that prefer the more capable "reasoning" model when the user has
# configured a separate one. Everything else uses the fast model.
_REASONING_TASKS = {"deep_analysis"}


def _active_model(task: str) -> str:
    """Resolve task → model tag, honouring live ui_settings.json overrides.

    Priority:
    1. ui_settings.json  (fastModel / reasoningModel written by the Settings UI)
    2. config/default.toml  [models.routing] table  (static TOML config)
    """
    s = get_settings()
    ui_path = s.paths.resolved_data_dir() / "ui_settings.json"
    if ui_path.exists():
        try:
            ui = json.loads(ui_path.read_text())
            if task in _REASONING_TASKS:
                tag = ui.get("reasoningModel") or ui.get("fastModel")
            else:
                tag = ui.get("fastModel")
            if tag:
                return tag
        except (json.JSONDecodeError, OSError):
            pass
    # Fall back to TOML routing.
    return s.models.model_for(task)


def get_llm(task: str = "quick_qa", *, temperature: float = 0.0) -> ChatOllama:
    """Return a ``ChatOllama`` for the given task label."""
    s = get_settings()
    tag = _active_model(task)
    return ChatOllama(model=tag, temperature=temperature, base_url=s.ollama.base_url)


def get_embeddings() -> OllamaEmbeddings:
    s = get_settings()
    return OllamaEmbeddings(model=s.models.embedding, base_url=s.ollama.base_url)


def _active_vision_model() -> str:
    """Resolve the vision model tag, honouring ui_settings.json overrides.

    Priority: ui_settings.json ``visionModel`` → config ``models.vision``.
    """
    s = get_settings()
    ui_path = s.paths.resolved_data_dir() / "ui_settings.json"
    if ui_path.exists():
        try:
            ui = json.loads(ui_path.read_text())
            tag = ui.get("visionModel")
            if tag:
                return tag
        except (json.JSONDecodeError, OSError):
            pass
    return s.models.vision


def get_vision_llm(*, temperature: float = 0.0) -> ChatOllama:
    """Return a ``ChatOllama`` bound to the vision-capable model."""
    s = get_settings()
    return ChatOllama(
        model=_active_vision_model(), temperature=temperature, base_url=s.ollama.base_url
    )

```


## File: ingest/__init__.py
```python
# ingest package

```


## File: ingest/vision.py
```python
"""Vision-model helpers (qwen2.5vl via Ollama).

Two jobs:
  * ``describe_image`` — a short academic description of an image/diagram,
    used as a retrievable chunk.
  * ``transcribe`` — verbatim OCR recovery for pages where Surya was unsure.

Both lazily build a ``ChatOllama`` bound to the configured vision model, so
nothing here runs (or imports heavy deps) unless multimodal ingest is enabled.
"""

from __future__ import annotations

import base64
import json
import logging

from langchain_core.messages import HumanMessage

from scholarcli.llm import get_vision_llm

logger = logging.getLogger(__name__)

# Description kept short — it's an embedding target, not prose for the reader.
_DESCRIBE_PROMPT = (
    "You are analysing a figure from an engineering/CS study document. "
    "Reply with ONLY a JSON object, no markdown fences:\n"
    '{"type": "image|diagram|chart", "description": "..."}\n'
    "Pick \"diagram\" for flowcharts, architecture/UML/sequence/network "
    "diagrams or concept maps; \"chart\" for plots/graphs; else \"image\". "
    "The description (<=80 words) must name the key components, labels and "
    "relationships so the figure is findable by a text search."
)

_TRANSCRIBE_PROMPT = (
    "Transcribe ALL text in this page image exactly, preserving reading "
    "order, headings and lists. If there are tables, extract them and "
    "convert them into clean, valid Markdown format using `|` for column "
    "separators and `---` for the header separator. For multi-line cell "
    "content, use `<br>` to separate lines. Output only the transcribed "
    "text — no commentary, no markdown fences."
)

_VALID_TYPES = {"image", "diagram", "chart"}


def _data_url(image_bytes: bytes, ext: str = "png") -> str:
    mime = "jpeg" if ext.lower() in ("jpg", "jpeg") else ext.lower()
    b64 = base64.b64encode(image_bytes).decode("ascii")
    return f"data:image/{mime};base64,{b64}"


def _invoke(prompt: str, image_bytes: bytes, ext: str) -> str:
    llm = get_vision_llm()
    msg = HumanMessage(
        content=[
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": _data_url(image_bytes, ext)},
        ]
    )
    resp = llm.invoke([msg])
    return (getattr(resp, "content", "") or "").strip()


def _strip_json(raw: str) -> str:
    """Pull a JSON object out of a model reply that may be fenced."""
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1] if raw.count("```") >= 2 else raw.strip("`")
        if raw.lstrip().startswith("json"):
            raw = raw.lstrip()[4:]
    start, end = raw.find("{"), raw.rfind("}")
    if start != -1 and end != -1 and end > start:
        return raw[start : end + 1]
    return raw


def describe_image(image_bytes: bytes, ext: str = "png") -> dict:
    """Return ``{"type": ..., "description": ...}`` for an image/diagram.

    Falls back to ``{"type": "image", "description": ""}`` on any failure so
    the caller can decide whether to keep the artifact.
    """
    try:
        raw = _invoke(_DESCRIBE_PROMPT, image_bytes, ext)
        data = json.loads(_strip_json(raw))
        kind = str(data.get("type", "image")).lower()
        if kind not in _VALID_TYPES:
            kind = "image"
        desc = str(data.get("description", "")).strip()
        return {"type": kind, "description": desc}
    except Exception as exc:  # noqa: BLE001 — degrade gracefully, never break ingest
        logger.warning("vision.describe_image failed: %s", exc)
        return {"type": "image", "description": ""}


def transcribe(image_bytes: bytes, ext: str = "png") -> str:
    """Return verbatim text transcribed from a page image (OCR recovery)."""
    try:
        return _invoke(_TRANSCRIBE_PROMPT, image_bytes, ext)
    except Exception as exc:  # noqa: BLE001
        logger.warning("vision.transcribe failed: %s", exc)
        return ""

```


## File: ingest/tables.py
```python
"""Table extraction — preserve tables as markdown instead of flattening them.

Uses PyMuPDF's ``page.find_tables()``. Each table becomes a chunk whose text is
a one-line retrieval summary followed by the original markdown table, so the
embedding captures the gist while the reader/renderer still sees the real grid.
"""

from __future__ import annotations

import logging
from typing import NamedTuple

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.config import get_settings
from scholarcli.llm import get_llm

logger = logging.getLogger(__name__)

_SUMMARY_SYSTEM = (
    "You summarise tables from study material. Given a markdown table, reply "
    "with ONE plain sentence (no markdown) stating what the table compares or "
    "lists and its key columns. No preamble."
)


class TableArtifact(NamedTuple):
    markdown: str  # the original table as GFM markdown
    summary: str  # one-line retrieval summary (may be "")

    @property
    def chunk_text(self) -> str:
        return f"{self.summary}\n\n{self.markdown}".strip() if self.summary else self.markdown


def _summarize(markdown: str) -> str:
    """One-line summary of a markdown table via the fast LLM. "" on failure."""
    try:
        llm = get_llm("study_notes")
        resp = llm.invoke(
            [SystemMessage(content=_SUMMARY_SYSTEM), HumanMessage(content=markdown)]
        )
        return (getattr(resp, "content", "") or "").strip().replace("\n", " ")
    except Exception as exc:  # noqa: BLE001 — summary is a nice-to-have
        logger.warning("table summary failed: %s", exc)
        return ""


def extract_tables(page) -> list[TableArtifact]:
    """Return structured table artifacts found on a PyMuPDF page."""
    if not get_settings().ingest.tables_enabled:
        return []
    try:
        finder = page.find_tables()
    except Exception as exc:  # noqa: BLE001 — PyMuPDF table finder is heuristic
        logger.warning("find_tables failed on page: %s", exc)
        return []

    artifacts: list[TableArtifact] = []
    for tbl in getattr(finder, "tables", []) or []:
        try:
            md = tbl.to_markdown().strip()
        except Exception as exc:  # noqa: BLE001
            logger.warning("table to_markdown failed: %s", exc)
            continue
        # Skip trivial/degenerate detections (a single row/cell isn't a table).
        if not md or md.count("\n") < 2:
            continue
        artifacts.append(TableArtifact(markdown=md, summary=_summarize(md)))
    return artifacts

```


## File: ingest/analyze.py
```python
"""Per-page document analysis — cheap heuristics that drive ingest branching.

Not persisted: the flags only decide which extractors run for a page
(native text vs. OCR, whether to look for images). Tables are handled
separately by ``tables.extract_tables`` which self-guards.
"""

from __future__ import annotations

from typing import NamedTuple

from scholarcli.config import get_settings


class PageInfo(NamedTuple):
    page_number: int
    has_text: bool  # enough native text to use directly
    has_images: bool  # at least one foreground image block
    is_scanned: bool  # little/no native text but rendered content present


def _has_foreground_image(page) -> bool:
    page_area = page.rect.width * page.rect.height
    blocks = page.get_text("dict", sort=True).get("blocks", [])
    for b in blocks:
        if b.get("type") != 1:
            continue
        bbox = b.get("bbox")
        if bbox:
            w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
            if w * h > 0.8 * page_area:
                continue  # full-page background image, not a figure
        return True
    return False


def analyze_page(page, page_number: int) -> PageInfo:
    """Classify a PyMuPDF page for the ingest orchestrator."""
    min_chars = get_settings().ingest.scanned_min_chars
    text = page.get_text("text").strip()
    has_text = len(text) >= min_chars
    has_images = _has_foreground_image(page)

    try:
        has_drawings = bool(page.get_drawings())
    except Exception:  # noqa: BLE001 — older PyMuPDF / odd pages
        has_drawings = False

    is_scanned = (not has_text) and (has_images or has_drawings)
    return PageInfo(
        page_number=page_number,
        has_text=has_text,
        has_images=has_images,
        is_scanned=is_scanned,
    )

```


## File: ingest/loaders.py
```python
"""Document loaders. PDF via PyMuPDF, Markdown via heading-aware splitting.

Each loader returns a list of ``Page`` namedtuples. A ``Page`` may be native
text, OCR output, a table, or an image/diagram description — distinguished by
``source_type``. The orchestrator in :func:`load_pdf` decides which extractors
run per page based on :func:`scholarcli.ingest.analyze.analyze_page`.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import NamedTuple

import fitz  # pymupdf

logger = logging.getLogger(__name__)


class Page(NamedTuple):
    """A page (or section/artifact) extracted from a document."""

    page_number: int  # 1-based
    title: str  # document title (same across pages)
    heading: str  # nearest heading on this page, or ""
    text: str
    source_type: str = "text"  # text | ocr | table | image | diagram
    image_url: str = ""  # served URL for image/diagram artifacts


# ---------------------------------------------------------------------------
# public entry point
# ---------------------------------------------------------------------------

def load_document(path: Path, content_hash: str) -> tuple[list[Page], str]:
    """Load a PDF or Markdown file. Returns (pages, file_type)."""
    suffix = path.suffix.lower()
    if suffix == ".pdf":
        return load_pdf(path, content_hash), "pdf"
    if suffix in (".md", ".markdown"):
        return load_markdown(path, content_hash), "md"
    if suffix in (".txt", ".text"):
        return load_markdown(path, content_hash), "txt"
    raise ValueError(f"Unsupported file type: {suffix}")


# ---------------------------------------------------------------------------
# PDF
# ---------------------------------------------------------------------------

def load_pdf(path: Path, content_hash: str) -> list[Page]:
    """Orchestrate multimodal extraction for a PDF.

    Per page: scanned pages go through OCR; otherwise native text is extracted
    (with images described inline + as separate retrievable chunks) and tables
    are pulled out as their own markdown chunks. Every optional stage degrades
    gracefully so a failure never aborts ingestion.
    """
    from scholarcli.config import get_settings
    from scholarcli.ingest.analyze import analyze_page

    cfg = get_settings().ingest
    images_dir = get_settings().paths.resolved_data_dir() / "images" / content_hash

    doc = fitz.open(path)
    title = _pdf_title(doc, path)
    pages: list[Page] = []
    for i, page in enumerate(doc):
        page_num = i + 1
        info = analyze_page(page, page_num)
        heading = _pdf_page_heading(page)

        # --- Scanned / image-only page → OCR ---------------------------------
        if cfg.ocr_enabled and info.is_scanned:
            from scholarcli.ingest.ocr import ocr_page

            try:
                ocr_text, _conf = ocr_page(page)
            except Exception as exc:  # noqa: BLE001
                logger.warning("OCR failed on page %d: %s", page_num, exc)
                ocr_text = ""
            if ocr_text.strip():
                pages.append(
                    Page(page_num, title, heading, ocr_text.strip(), source_type="ocr")
                )
            continue  # OCR covers the whole page; skip native/image passes

        # --- Native text + inline/embedded images ----------------------------
        text_parts: list[str] = []
        for b_idx, b in enumerate(page.get_text("dict", sort=True).get("blocks", [])):
            if b.get("type") == 0:
                lines = [
                    "".join(span.get("text", "") for span in line.get("spans", []))
                    for line in b.get("lines", [])
                ]
                block_text = "\n".join(lines).strip()
                if block_text:
                    text_parts.append(block_text)
            elif b.get("type") == 1:
                seg = _handle_image_block(
                    b, i, b_idx, page, content_hash, images_dir, title, heading, cfg, pages
                )
                if seg:
                    text_parts.append(seg)

        text = "\n\n".join(text_parts).strip()
        if text:
            pages.append(Page(page_num, title, heading, text, source_type="text"))

        # --- Tables (structured markdown chunks) -----------------------------
        if cfg.tables_enabled:
            from scholarcli.ingest.tables import extract_tables

            for t in extract_tables(page):
                pages.append(
                    Page(page_num, title, heading, t.chunk_text, source_type="table")
                )

    doc.close()
    return pages


def _handle_image_block(
    b, page_idx, b_idx, page, content_hash, images_dir, title, heading, cfg, pages
) -> str | None:
    """Save an image block, describe it (if enabled), and append an image chunk.

    Returns the inline markdown to embed in the page's text (so it renders in
    Reading mode), or ``None`` for background/unsaveable images.
    """
    page_area = page.rect.width * page.rect.height
    bbox = b.get("bbox")
    if bbox:
        w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
        if w * h > 0.8 * page_area:
            return None  # full-page background image

    image_bytes = b.get("image")
    if not image_bytes:
        return None
    ext = b.get("ext", "png")
    images_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{page_idx + 1}_{b_idx}.{ext}"
    (images_dir / filename).write_bytes(image_bytes)
    url = f"/api/documents/images/{content_hash}/{filename}"

    description = ""
    source_type = "image"
    if cfg.vision_enabled:
        from scholarcli.ingest import vision

        result = vision.describe_image(image_bytes, ext)
        description = result.get("description", "")
        source_type = "diagram" if result.get("type") == "diagram" else "image"

    # Separate retrievable chunk carrying the description + a thumbnail URL.
    if description:
        pages.append(
            Page(
                page_idx + 1,
                title,
                heading,
                description,
                source_type=source_type,
                image_url=url,
            )
        )

    # Inline markdown for Reading mode; alt text doubles as a caption.
    alt = description.replace("]", " ").replace("\n", " ")[:200] if description else "Image"
    return f"![{alt}]({url})"


def _pdf_title(doc, path: Path) -> str:
    meta = doc.metadata
    if meta and meta.get("title"):
        return meta["title"]
    # Fall back to the first line of the first page.
    if doc.page_count:
        first_text = doc[0].get_text(sort=True).strip()
        if first_text:
            return first_text.split("\n")[0].strip()[:200]
    return path.stem


def _pdf_page_heading(page) -> str:
    """Heuristic: largest font-size text block on page (its first line)."""
    blocks = page.get_text("dict", sort=True).get("blocks", [])
    best = ""
    best_size = 0.0
    for b in blocks:
        if b.get("type") != 0:
            continue
        for line in b.get("lines", []):
            for span in line.get("spans", []):
                sz = span.get("size", 0)
                if sz > best_size and span.get("text", "").strip():
                    best_size = sz
                    best = span["text"].strip()
    return best


# ---------------------------------------------------------------------------
# Markdown
# ---------------------------------------------------------------------------

def load_markdown(path: Path, content_hash: str) -> list[Page]:
    text = path.read_text(encoding="utf-8")
    title = path.stem
    pages: list[Page] = []

    # Split on top-level headings (## and ### in the spec, but we also
    # treat # as a major boundary).  We use a simple line-by-line scanner
    # so we can track the heading stack.
    heading = ""
    page_text: list[str] = []
    page_num = 1

    for line in text.splitlines():
        if line.startswith("# "):
            title = line[2:].strip()
            continue
        if line.startswith("## "):
            _flush_section(pages, page_num, title, heading, page_text)
            heading = line[3:].strip()
            page_text = []
            page_num += 1
            continue
        if line.startswith("### "):
            _flush_section(pages, page_num, title, heading, page_text)
            heading = line[4:].strip()
            page_text = []
            page_num += 1
            continue
        page_text.append(line)

    _flush_section(pages, page_num, title, heading, page_text)
    return pages


def _flush_section(pages, page_num, title, heading, lines):
    joined = "\n".join(lines).strip()
    if joined:
        pages.append(Page(page_number=page_num, title=title, heading=heading, text=joined))

```


## File: ingest/chunker.py
```python
"""Structural chunker — preserves document hierarchy within a token budget.

The chunker respects page/heading boundaries: it tries to keep text from
the same page+heading together, and never splits a page+heading section
unless the section itself exceeds the chunk budget (in which case it
falls back to a simple sliding window for that section).
"""

from __future__ import annotations

from scholarcli.config import get_settings
from scholarcli.ingest.loaders import Page


def chunk_pages(pages: list[Page]) -> list[dict]:
    """Convert pages into chunk dicts ready for embedding + storage.

    Returns a list of dicts with keys:
        page, heading, chunk_index, text, source_type, image_url
    """
    s = get_settings()
    budget = s.chunking.chunk_size
    overlap = s.chunking.chunk_overlap
    chunks: list[dict] = []

    for page in pages:
        source_type = getattr(page, "source_type", "text")
        image_url = getattr(page, "image_url", "")

        # Non-text artifacts (tables, image/diagram descriptions, OCR) are kept
        # whole: splitting a markdown table or a caption mid-way destroys it.
        if source_type != "text":
            page_chunks = [page.text]
        else:
            # Loaders give us one Page per heading-section, so we chunk each
            # page's text structurally within the token budget.
            page_chunks = _token_budget_chunks(page.text, budget=budget, overlap=overlap)

        for ci, chunk_text in enumerate(page_chunks):
            chunks.append(
                {
                    "page": page.page_number,
                    "heading": page.heading,
                    "chunk_index": ci,
                    "text": chunk_text,
                    "source_type": source_type,
                    "image_url": image_url,
                }
            )

    # Assign global chunk_index within the document.
    for i, ch in enumerate(chunks):
        ch["chunk_index"] = i
    return chunks


def _token_budget_chunks(text: str, budget: int, overlap: int) -> list[str]:
    """Split text into chunks, trying paragraph boundaries first.

    ``budget`` and ``overlap`` are in approximate characters (4 chars ≈ 1 token
    for English text). Real tokenization would come from the embedding model;
    this approximation is fine for the MVP.
    """
    paragraphs = text.split("\n\n")
    chunks: list[str] = []
    current: list[str] = []
    current_len = 0

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        plen = len(para)
        if current_len + plen <= budget:
            current.append(para)
            current_len += plen
        else:
            if current:
                chunks.append("\n\n".join(current))
                current = []
                current_len = 0
            # If a single paragraph exceeds the budget, break it further.
            if plen > budget:
                for sub in _sliding_window(para, budget, overlap):
                    chunks.append(sub)
            else:
                current.append(para)
                current_len = plen

    if current:
        chunks.append("\n\n".join(current))
    return chunks


def _sliding_window(text: str, size: int, overlap: int) -> list[str]:
    step = max(1, size - overlap)
    out: list[str] = []
    for i in range(0, len(text), step):
        out.append(text[i : i + size])
    return out

```


## File: ingest/ocr.py
```python
"""OCR for scanned / handwritten pages — vision-model only (no torch).

Kept deliberately lightweight: the page is rendered to an image and handed to
the configured vision model (``qwen2.5vl``) for transcription. No heavyweight
OCR engine is bundled, so a low-spec machine only needs Ollama.
"""

from __future__ import annotations

import logging

from scholarcli.config import get_settings

logger = logging.getLogger(__name__)


def _page_image_png(page, dpi: int = 200) -> bytes:
    """Render a PyMuPDF page to PNG bytes."""
    pix = page.get_pixmap(dpi=dpi)
    return pix.tobytes("png")


def ocr_page(page) -> tuple[str, float | None]:
    """Transcribe a scanned page via the vision model.

    Returns ``(text, None)`` — confidence is always ``None`` since the vision
    model gives no per-token score. Returns ``("", None)`` when vision is
    disabled or transcription fails.
    """
    if not get_settings().ingest.vision_enabled:
        return "", None

    from scholarcli.ingest import vision

    try:
        png = _page_image_png(page)
    except Exception as exc:  # noqa: BLE001
        logger.warning("page render failed for OCR: %s", exc)
        return "", None

    return vision.transcribe(png), None

```


## File: ingest/metadata_extractor.py
```python
"""LLM-based document metadata extraction: summary, tags, topics.

Runs a single inference pass over the first ~4 k chars of a document's
chunk text and returns structured metadata. Gated by
``ingest.metadata_extraction`` in config — set to false to skip on slow
machines.
"""

from __future__ import annotations

import json
import logging
import re

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.llm import get_llm

logger = logging.getLogger(__name__)

_SYSTEM = """\
You are a metadata extractor for academic study documents. Given a sample of \
document text, return ONLY a JSON object with these keys:
- "summary": a 2-3 sentence plain-language description of what the document covers
- "tags": a list of 5-8 short keyword tags (lowercase, 1-3 words each)
- "topics": a list of 3-5 main topic names (Title Case, 1-4 words each)

Output valid JSON only — no prose, no markdown fences, no explanation.\
"""


def extract(text_sample: str) -> dict:
    """Return {"summary": str, "tags": list[str], "topics": list[str]}.

    Never raises — falls back to empty values so ingestion is never blocked.
    """
    try:
        llm = get_llm("quick_qa")
        resp = llm.invoke([
            SystemMessage(content=_SYSTEM),
            HumanMessage(content=f"Document text:\n\n{text_sample[:4000]}"),
        ])
        raw = (getattr(resp, "content", "") or "").strip()
        # Strip markdown fences the model may add despite instructions.
        if raw.startswith("```"):
            raw = re.sub(r"^```[a-z]*\s*", "", raw, flags=re.MULTILINE)
            raw = raw.rstrip("` \n")
        start, end = raw.find("{"), raw.rfind("}")
        if start != -1 and end > start:
            data = json.loads(raw[start:end + 1])
            return {
                "summary": str(data.get("summary", "")).strip(),
                "tags": [str(t).strip().lower() for t in data.get("tags", []) if t][:10],
                "topics": [str(t).strip() for t in data.get("topics", []) if t][:8],
            }
    except Exception as exc:  # noqa: BLE001
        logger.warning("metadata extraction failed: %s", exc)
    return {"summary": "", "tags": [], "topics": []}

```


## File: ingest/pipeline.py
```python
"""Ingestion pipeline: load → chunk → embed → store.

Handles hash-based re-index: if a file's content hash has changed,
the old chunks are deleted and re-embedded. If unchanged, ingestion is
skipped.
"""

from __future__ import annotations

import hashlib
import uuid
from pathlib import Path

from langchain_core.embeddings import Embeddings

from sqlalchemy.orm import Session

from scholarcli.config import get_settings
from scholarcli.ingest.chunker import chunk_pages
from scholarcli.ingest.loaders import load_document
from scholarcli.storage import get_session, init_db
from scholarcli.storage.models import Course, Document
from scholarcli.storage.vectors import add_chunks, delete_document, has_document_chunks
from scholarcli.llm import get_embeddings


def _hash_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _ensure_course(name: str, session: Session) -> Course:
    """Get or create a ``Course`` by name within *session*."""
    course = session.query(Course).filter(Course.name == name).first()
    if course is None:
        course = Course(name=name)
        session.add(course)
        session.commit()
    return course


def ingest_file(
    path: Path,
    course_name: str,
    *,
    embeddings: Embeddings | None = None,
) -> str:
    """Ingest a single file. Returns a status string (e.g. 'indexed', 'up-to-date')."""
    init_db()
    session = get_session()
    if embeddings is None:
        embeddings = get_embeddings()

    content_hash = _hash_file(path)
    course = _ensure_course(course_name, session)

    # Check for existing document.
    existing = (
        session.query(Document)
        .filter(Document.path == str(path.resolve()), Document.course_id == course.id)
        .first()
    )
    if existing and existing.content_hash == content_hash:
        if has_document_chunks(existing.id):
            return "up-to-date"
        # Vector store data was lost (e.g. lancedb directory deleted).
        # Fall through to re-embed, reusing the existing document record.

    pages, file_type = load_document(path, content_hash)
    if not pages:
        return "no-content"

    title = pages[0].title
    chunks = chunk_pages(pages)
    size_kb = max(1, round(path.stat().st_size / 1024))
    page_count = max((p.page_number for p in pages), default=0)

    # If the file was previously indexed with different content, clear old.
    if existing:
        delete_document(existing.id)
        existing.version += 1
        existing.content_hash = content_hash
        existing.title = title
        existing.file_type = file_type
        existing.size_kb = size_kb
        existing.pages = page_count
        existing.status = "indexed"
        session.commit()
        doc_id = existing.id
    else:
        doc = Document(
            path=str(path.resolve()),
            title=title,
            file_type=file_type,
            content_hash=content_hash,
            size_kb=size_kb,
            pages=page_count,
            status="indexed",
            course_id=course.id,
        )
        session.add(doc)
        session.commit()
        doc_id = doc.id

    # Embed all chunk texts in one batch.
    chunk_texts = [ch["text"] for ch in chunks]
    # OllamaEmbeddings.embed_documents() accepts list[str]; returns list[list[float]].
    vectors: list[list[float]] = embeddings.embed_documents(chunk_texts)

    rows: list[dict] = []
    for ch, vec in zip(chunks, vectors):
        rows.append(
            {
                "id": str(uuid.uuid4()),
                "document_id": doc_id,
                "course": course_name,
                "title": title,
                "page": ch["page"],
                "heading": ch["heading"],
                "chunk_index": ch["chunk_index"],
                "text": ch["text"],
                "source_type": ch.get("source_type", "text"),
                "image_url": ch.get("image_url", ""),
                "vector": vec,
            }
        )

    add_chunks(rows)

    # Optional LLM metadata extraction (summary, tags, topics).
    cfg = get_settings().ingest
    if cfg.metadata_extraction and chunks:
        from scholarcli.ingest.metadata_extractor import extract as extract_metadata
        sample = "\n\n".join(ch["text"] for ch in chunks[:20])
        meta = extract_metadata(sample)
        if meta["summary"] or meta["tags"] or meta["topics"]:
            doc_row = session.get(Document, doc_id)
            if doc_row:
                doc_row.summary = meta["summary"] or None
                doc_row.tags = meta["tags"] or None
                doc_row.topics = meta["topics"] or None
                session.commit()

    # Clear any previous error on successful re-index.
    doc_row = session.get(Document, doc_id)
    if doc_row and doc_row.error is not None:
        doc_row.error = None
        session.commit()

    return "indexed"


def reindex_all() -> list[str]:
    """Re-ingest every known document (rebuilds the vector store).

    Use after the chunks-table schema changes (e.g. the multimodal upgrade):
    ``add_chunks`` recreates the table on the first insert, then this re-embeds
    every document from its source file. Returns ``"title: status"`` strings.
    """
    init_db()
    session = get_session()
    embeddings = get_embeddings()
    results: list[str] = []
    docs = session.query(Document).all()
    for doc in docs:
        course = session.get(Course, doc.course_id)
        course_name = course.name if course else ""
        src = Path(doc.path)
        if not src.exists():
            results.append(f"{doc.title}: missing-file")
            continue
        delete_document(doc.id)  # clear stale vectors before re-embedding
        try:
            status = ingest_file(src, course_name, embeddings=embeddings)
        except Exception as exc:  # noqa: BLE001
            status = f"failed ({exc})"
        results.append(f"{doc.title}: {status}")
    return results


def ingest_path(path: Path, course_name: str) -> list[str]:
    """Ingest a file or all supported files in a directory.

    Returns a list of ``"path: status"`` strings suitable for CLI output.
    """
    files: list[Path] = []
    if path.is_file():
        files.append(path)
    elif path.is_dir():
        for p in sorted(path.rglob("*")):
            if p.is_file() and p.suffix.lower() in (".pdf", ".md", ".markdown"):
                files.append(p)
    else:
        raise FileNotFoundError(f"Path not found: {path}")

    results: list[str] = []
    for fp in files:
        st = ingest_file(fp, course_name)
        results.append(f"{fp}: {st}")
    return results

```


## File: rag/state.py
```python
"""LangGraph state — the shared dictionary threaded through every node."""

from __future__ import annotations

from typing import TypedDict


class GraphState(TypedDict, total=False):
    query: str  # user's question
    search_query: str | None  # query to use for retrieval (if different from query)
    course: str | None  # restrict retrieval to this course, or None
    document: str | None  # restrict retrieval to this document, or None
    route: str  # task label set by router
    retrieved: list[dict]  # chunks from LanceDB (with _distance)
    grounded: bool  # True if at least one chunk passes the verifier gate
    answer: str  # final answer with citations

```


## File: rag/__init__.py
```python
"""RAG pipeline — single entry point ``build_rag()`` returns a compiled
LangGraph ``Runnable`` that threads:

    router → retrieve → verify → generate

Invoke it with: ``rag.invoke({"query": "...", "course": "..."})``
"""

from scholarcli.rag.graph import get_rag_app

build_rag = get_rag_app

```


## File: rag/graph.py
```python
"""LangGraph wiring — assembles the router → retrieve → verify → generate pipeline
with conditional edges so future study modes slot in cleanly.
"""

from __future__ import annotations

from langgraph.graph import END, StateGraph

from scholarcli.rag.nodes.generator import generate
from scholarcli.rag.nodes.reranker import rerank
from scholarcli.rag.nodes.retriever import retrieve
from scholarcli.rag.nodes.router import route_query
from scholarcli.rag.nodes.verifier import verify
from scholarcli.rag.state import GraphState


def _should_retrieve(state: GraphState) -> str:
    """After routing: only proceed to retrieval if the route is wired."""
    # The router already sets grounded=False and a stub answer for
    # unwired routes. If answer is already set, short-circuit to generate.
    if state.get("answer") is not None:
        return "generate"
    return "retrieve"


def _ground_check(state: GraphState) -> str:
    """After verification: generate answer or skip."""
    return "generate"


def build_graph() -> StateGraph:
    """Build and return (not compile) the LangGraph state graph.

    The caller compiles it to get a runnable.
    """
    builder = StateGraph(GraphState)

    builder.add_node("router", route_query)
    builder.add_node("retrieve", retrieve)
    builder.add_node("rerank", rerank)
    builder.add_node("verify", verify)
    builder.add_node("generate", generate)

    builder.set_entry_point("router")

    # Router → retrieve (if wired) or generate (stub answer).
    builder.add_conditional_edges(
        "router",
        _should_retrieve,
        {"retrieve": "retrieve", "generate": "generate"},
    )

    builder.add_edge("retrieve", "rerank")
    builder.add_edge("rerank", "verify")
    builder.add_edge("verify", "generate")
    builder.add_edge("generate", END)

    return builder


def get_rag_app():
    """Return a compiled LangGraph runnable (cached per process)."""
    return build_graph().compile()

```


## File: rag/prompts.py
```python
"""LLM prompt templates for the RAG pipeline."""

ROUTER_SYSTEM = """\
You are a query classifier for a student study assistant. Read the user's
question and output ONLY one of these task labels:

- quick_qa    — a factual question answerable from lecture material
- flashcards  — request to generate flashcards
- quiz        — request to generate a quiz
- mermaid     — request to generate a diagram in Mermaid syntax
- mindmap     — request to generate a mind-map / concept tree
- study_notes — request to generate study notes or a summary
- differences — request to compare or contrast two concepts
- deep_analysis — request requiring deep cross-topic reasoning

Return exactly the label, nothing else.\
"""

GENERATOR_SYSTEM = """\
You are a precise, citation-grounded study assistant. Answer the student's
question using ONLY the provided context chunks. Follow these rules:

1. If the context does not contain enough information, say "This topic is not
   covered in your uploaded materials."
2. Cite sources inline using the format: [Source: {title}, p.{page}]
3. Be concise and accurate — prefer bullet points for lists.
4. If the question asks for a comparison, use a markdown table.
5. Never make up facts. If you're unsure, say so.\
"""

RERANKER_SYSTEM = """\
You are a retrieval reranker. Given a student's question and a numbered list of
candidate text chunks, score how relevant each chunk is to answering the
question, from 0 (irrelevant) to 10 (directly answers it).
Output ONLY a JSON object mapping each chunk number (as a string) to its integer
score, e.g. {"0": 8, "1": 2, "2": 5}. Include every chunk number. No prose.\
"""

# Prompt for the one-shot path.
QA_PROMPT_TEMPLATE = """\
Context from your uploaded materials:
{context}

Student's question: {query}

Answer:\
"""

NOT_GROUNDED = (
    "This topic is not covered in your uploaded materials. "
    "Try uploading relevant documents or rephrasing your question."
)

FLASHCARDS_SYSTEM = """\
You are a flashcard generator for students. Given context from study materials,
generate flashcards as Q&A pairs. Rules:

1. Generate 5-10 flashcards covering key concepts from the context.
2. Each flashcard must be grounded in the provided context.
3. Format each flashcard exactly as:
   Q: <question>
   A: <answer>
4. Separate flashcards with a blank line.
5. Keep answers concise (1-3 sentences).
6. Cover definitions, key facts, and relationships between concepts.\
"""

QUIZ_SYSTEM = """\
You are a quiz generator for students. Given context from study materials,
generate a multiple-choice quiz. Rules:

1. Generate 5 questions from the provided context.
2. Each question has 4 options (A, B, C, D) with exactly one correct answer.
3. Format each question exactly as:
   Q<number>: <question text>
   A) <option>
   B) <option>
   C) <option>
   D) <option>
   Answer: <letter>
4. Separate questions with a blank line.
5. Mix difficulty levels. Include both factual recall and conceptual questions.\
"""

MERMAID_SYSTEM = """\
You are a diagram generator. Given context from study materials, generate a
Mermaid diagram that visualizes the key concepts and relationships. Rules:

1. Output ONLY valid Mermaid syntax (no markdown fences, no explanation).
2. Use flowchart TD (top-down) or graph LR (left-right) as appropriate.
3. Keep node labels short and readable.
4. Show relationships and hierarchies from the source material.
5. Use subgraphs to group related concepts if needed.
6. DO NOT use 'note' syntax inside graph or flowchart. Use normal nodes if notes are needed.\
"""

MINDMAP_SYSTEM = """\
You are a mind map generator. Given context from study materials, create a
hierarchical concept tree. Rules:

1. Output a text-based mind map using indentation.
2. Format:
   Main Topic
   ├── Subtopic 1
   │   ├── Detail A
   │   └── Detail B
   ├── Subtopic 2
   │   └── Detail C
   └── Subtopic 3
3. Cover all key concepts from the context.
4. Keep entries concise (2-5 words each).
5. Maximum 3 levels of depth.\
"""

STUDY_NOTES_SYSTEM = """\
You are a study notes generator. Given context from study materials, create
concise revision notes. Rules:

1. Organize by topic/subtopic with clear headings.
2. Use bullet points for key facts.
3. Highlight definitions with **bold**.
4. Include important formulas or relationships.
5. Keep total length under 500 words.
6. Add a "Key Takeaways" section at the end with 3-5 bullet points.
7. Cite sources using [Source: title, p.page] format.\
"""

DIFFERENCES_SYSTEM = """\
You are a difference-table generator for students. Given context from study
materials, produce a structured comparison table between the two concepts in
the student's query. Rules:

1. Output a markdown table with exactly three columns:
   | Feature | <Concept A> | <Concept B> |
   Replace <Concept A> and <Concept B> with the actual names from the query.
2. Include only rows that are relevant to the pair being compared. Choose
   from: Definition, Purpose, Architecture, Protocol/Format, Performance,
   Advantages, Disadvantages, Use Cases, Scalability, Complexity, Examples,
   Common Misconceptions. Skip rows that would be identical or N/A for both.
3. Keep each cell concise — one short phrase or sentence.
4. After the table, add a section:
   ## Exam Perspective
   List 2-3 common exam questions about these concepts as a bulleted list.
5. Do not add introductory text before the table.
6. Ground every claim in the provided context; do not invent facts.\
"""

```


## File: rag/nodes/router.py
```python
"""Query router node — classifies the user's query into a task label.

Uses LLM classification when no explicit route is set. Falls back to
quick_qa on errors. All study modes are wired.
"""

from __future__ import annotations

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.llm import get_llm
from scholarcli.rag.prompts import ROUTER_SYSTEM
from scholarcli.rag.state import GraphState

# All task labels that have working downstream paths.
_WIRED = {
    "quick_qa",
    "flashcards",
    "quiz",
    "mermaid",
    "mindmap",
    "study_notes",
    "deep_analysis",
}


def route_query(state: GraphState) -> GraphState:
    # If route is already set, skip LLM call.
    if state.get("route") and state["route"] in _WIRED:
        return state

    query = state.get("query", "")

    # Classify via LLM.
    try:
        llm = get_llm("quick_qa")
        resp = llm.invoke(
            [SystemMessage(content=ROUTER_SYSTEM), HumanMessage(content=query)]
        )
        task = resp.content.strip().lower().replace(" ", "_")
    except Exception:
        task = "quick_qa"

    # Validate task label.
    if task not in _WIRED:
        task = "quick_qa"

    state["route"] = task
    return state

```


## File: rag/nodes/__init__.py
```python
# RAG node functions

```


## File: rag/nodes/verifier.py
```python
"""Verification node — check if retrieved context is actually relevant.

MVP: threshold-based gate (best cosine distance from LanceDB).
Future: add an LLM relevance check for higher precision.
"""

from __future__ import annotations

from scholarcli.config import get_settings
from scholarcli.rag.state import GraphState


def verify(state: GraphState) -> GraphState:
    s = get_settings()
    max_dist = s.retrieval.max_distance
    chunks = state.get("retrieved", [])

    # LanceDB returns _distance (cosine, 0 = identical). Lower = more similar.
    # If the closest chunk is too far, nothing is relevant.
    if not chunks:
        state["grounded"] = False
        return state

    best = min(ch["_distance"] for ch in chunks)
    state["grounded"] = best <= max_dist
    return state

```


## File: rag/nodes/generator.py
```python
"""Generator node — produce a grounded answer with citations.

Route-aware: picks the correct system prompt based on state["route"].
"""

from __future__ import annotations

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.llm import get_llm
from scholarcli.api.prompt_service import active_body
from scholarcli.rag.prompts import (
    DIFFERENCES_SYSTEM,
    FLASHCARDS_SYSTEM,
    GENERATOR_SYSTEM,
    MERMAID_SYSTEM,
    MINDMAP_SYSTEM,
    NOT_GROUNDED,
    QA_PROMPT_TEMPLATE,
    QUIZ_SYSTEM,
    STUDY_NOTES_SYSTEM,
)
from scholarcli.rag.state import GraphState

# Map route → system prompt. Anything not listed falls back to GENERATOR_SYSTEM.
_ROUTE_PROMPTS: dict[str, str] = {
    "quick_qa": GENERATOR_SYSTEM,
    "deep_analysis": GENERATOR_SYSTEM,
    "flashcards": FLASHCARDS_SYSTEM,
    "quiz": QUIZ_SYSTEM,
    "mermaid": MERMAID_SYSTEM,
    "mindmap": MINDMAP_SYSTEM,
    "study_notes": STUDY_NOTES_SYSTEM,
    "differences": DIFFERENCES_SYSTEM,
}


def generate(state: GraphState) -> GraphState:
    if not state.get("grounded"):
        state["answer"] = NOT_GROUNDED
        return state

    route = state.get("route", "quick_qa")
    llm = get_llm(route)
    chunks = state["retrieved"]

    # Build context block with source tags.
    context_parts: list[str] = []
    citations: list[str] = []
    seen = set()
    for ch in chunks:
        st = ch.get("source_type", "text")
        kind = "" if st in ("text", None) else f", {st}"
        ctx = f"[Source: {ch['title']}, p.{ch['page']}{kind}]\n{ch['text']}"
        context_parts.append(ctx)
        cite = f"[{ch['title']}, p.{ch['page']}]"
        if cite not in seen:
            seen.add(cite)
            citations.append(cite)

    context = "\n\n---\n\n".join(context_parts)
    prompt = QA_PROMPT_TEMPLATE.format(context=context, query=state["query"])
    # Prepend citation list so the model knows what sources to reference.
    prompt = f"Available sources: {', '.join(citations)}\n\n{prompt}"

    # ponytail: user's active_body overrides hard-coded default
    system_prompt = active_body(route) or _ROUTE_PROMPTS.get(route, GENERATOR_SYSTEM)

    response = llm.invoke(
        [SystemMessage(content=system_prompt), HumanMessage(content=prompt)]
    )
    # response is an AIMessage; .content is str.
    answer: str = response.content if hasattr(response, "content") else str(response)
    state["answer"] = answer.strip()
    return state

```


## File: rag/nodes/reranker.py
```python
"""Rerank node — an LLM relevance pass over retrieved chunks.

A lightweight, Ollama-only alternative to a torch cross-encoder: the LLM scores
each candidate chunk 0-10 for relevance to the query in a single batched call,
and we reorder + truncate to ``top_k``. Best-effort: any failure leaves the
original retrieval order untouched.
"""

from __future__ import annotations

import json
import re

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.config import get_settings
from scholarcli.llm import get_llm
from scholarcli.rag.prompts import RERANKER_SYSTEM
from scholarcli.rag.state import GraphState

# Keep each chunk preview short so the rerank prompt stays cheap.
_PREVIEW_CHARS = 500


def _parse_scores(text: str, n: int) -> dict[int, float]:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return {}
    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError:
        return {}
    scores: dict[int, float] = {}
    if isinstance(data, dict):
        for k, v in data.items():
            try:
                idx = int(str(k).strip())
                if 0 <= idx < n:
                    scores[idx] = float(v)
            except (TypeError, ValueError):
                continue
    return scores


def rerank(state: GraphState) -> GraphState:
    s = get_settings()
    retrieved = state.get("retrieved") or []
    top_k = s.retrieval.top_k
    if not s.retrieval.rerank_enabled or len(retrieved) <= 1:
        state["retrieved"] = retrieved[:top_k]
        return state

    query = state.get("search_query") or state["query"]
    listing = "\n\n".join(
        f"[{i}] {(ch.get('text') or '').strip()[:_PREVIEW_CHARS]}"
        for i, ch in enumerate(retrieved)
    )
    human = f"Question: {query}\n\nChunks:\n{listing}"
    try:
        llm = get_llm("quick_qa")
        resp = llm.invoke(
            [SystemMessage(content=RERANKER_SYSTEM), HumanMessage(content=human)]
        )
        scores = _parse_scores(getattr(resp, "content", str(resp)), len(retrieved))
    except Exception:  # noqa: BLE001 — never let rerank break retrieval
        scores = {}

    if not scores:
        state["retrieved"] = retrieved[:top_k]
        return state

    # Stable sort by score desc; chunks without a score keep their relative order
    # at the back (default score -1).
    order = sorted(
        range(len(retrieved)),
        key=lambda i: scores.get(i, -1.0),
        reverse=True,
    )
    state["retrieved"] = [retrieved[i] for i in order[:top_k]]
    return state

```


## File: rag/nodes/retriever.py
```python
"""Retrieval node — embed the user query and search LanceDB."""

from __future__ import annotations

from scholarcli.config import get_settings
import scholarcli.llm
from scholarcli.rag.state import GraphState
from scholarcli.storage.vectors import hybrid_search, search


def retrieve(state: GraphState) -> GraphState:
    s = get_settings()
    emb = scholarcli.llm.get_embeddings()
    query = state.get("search_query") or state["query"]
    course = state.get("course")

    query_vector: list[float] = emb.embed_query(query)

    if s.retrieval.hybrid_search:
        results = hybrid_search(
            query_text=query,
            query_vector=query_vector,
            top_k=s.retrieval.top_k,
            course=course,
            document=state.get("document"),
        )
    else:
        results = search(query_vector, top_k=s.retrieval.top_k, course=course, document=state.get("document"))

    state["retrieved"] = results
    return state

```


## File: api/__init__.py
```python
"""HTTP API layer (FastAPI) exposing the RAG pipeline to the web frontend."""

```


## File: api/activity_service.py
```python
"""Activity logging + dashboard aggregation.

``record_activity`` is best-effort (never raises into the request path).
``dashboard`` derives the homepage stats from real Activity / Deck / Document
rows instead of mock data.
"""

from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timedelta, timezone

from scholarcli.storage import get_session
from scholarcli.storage.models import Activity, Card, Deck, Document, SavedQuiz

# Rough per-event time estimates (minutes) when a caller doesn't pass one.
_DEFAULT_MINUTES = {"ask": 3, "quiz": 10, "exam": 20, "diagram": 2, "flashcard": 1, "note": 4}
_SESSION_KINDS = {"ask", "quiz", "exam"}
_KIND_TITLE = {
    "ask": "Q&A session",
    "quiz": "Quiz",
    "exam": "Exam",
    "flashcard": "Flashcard review",
    "diagram": "Diagram",
    "document": "Document",
    "note": "Notebook",
}


def record_activity(
    kind: str, text: str, course: str = "", minutes: int | None = None, cards: int = 0
) -> None:
    try:
        session = get_session()
        try:
            session.add(
                Activity(
                    kind=kind,
                    text=text[:512],
                    course=course or "",
                    minutes=minutes if minutes is not None else _DEFAULT_MINUTES.get(kind, 2),
                    cards=cards,
                )
            )
            session.commit()
        finally:
            session.close()
    except Exception:
        # Never let logging break the real request.
        pass


def _ago(then: datetime, now: datetime) -> str:
    if then.tzinfo is None:
        then = then.replace(tzinfo=timezone.utc)
    secs = (now - then).total_seconds()
    if secs < 60:
        return "just now"
    if secs < 3600:
        return f"{int(secs // 60)}m ago"
    if secs < 86400:
        return f"{int(secs // 3600)}h ago"
    days = int(secs // 86400)
    return "Yesterday" if days == 1 else f"{days}d ago"


def dashboard() -> dict:
    session = get_session()
    try:
        now = datetime.now(timezone.utc)
        acts = session.query(Activity).order_by(Activity.created_at.desc()).all()
        decks = session.query(Deck).all()

        documents = session.query(Document).count()
        flashcards = session.query(Card).count()
        quizzes_taken = sum(1 for a in acts if a.kind in ("quiz", "exam")) + session.query(SavedQuiz).count()
        study_sessions = sum(1 for a in acts if a.kind in _SESSION_KINDS)

        # 7-day study-activity series (oldest → newest).
        per_day_minutes: dict[str, int] = defaultdict(int)
        per_day_cards: dict[str, int] = defaultdict(int)
        for a in acts:
            created = a.created_at or now
            if created.tzinfo is None:
                created = created.replace(tzinfo=timezone.utc)
            key = created.date().isoformat()
            per_day_minutes[key] += a.minutes
            per_day_cards[key] += a.cards
        study_activity = []
        for i in range(6, -1, -1):
            d = (now - timedelta(days=i)).date()
            key = d.isoformat()
            study_activity.append(
                {"day": d.strftime("%a"), "minutes": per_day_minutes.get(key, 0), "cards": per_day_cards.get(key, 0)}
            )

        # Recent sessions (study-kind activities).
        recent_sessions = [
            {
                "id": f"ss{a.id}",
                "title": (a.text or _KIND_TITLE.get(a.kind, "Session"))[:60],
                "course": a.course or "—",
                "duration": f"{a.minutes}m",
                "date": _ago(a.created_at or now, now),
            }
            for a in acts
            if a.kind in _SESSION_KINDS
        ][:4]

        # Activity feed.
        activity = [
            {"id": f"a{a.id}", "kind": a.kind, "text": a.text or _KIND_TITLE.get(a.kind, a.kind), "time": _ago(a.created_at or now, now)}
            for a in acts[:6]
        ]

        # Weak topics + suggested revision derived from deck mastery.
        weak_topics = []
        suggested = []
        for d in decks:
            total = len(d.cards)
            if total == 0:
                continue
            mastered = sum(1 for c in d.cards if c.ease == "mastered")
            mastery = round(100 * mastered / total)
            if mastery < 70:
                weak_topics.append({"id": f"w{d.id}", "topic": d.name, "course": d.course or "—", "mastery": mastery})
                suggested.append(
                    {"id": f"r{d.id}", "topic": d.name, "reason": f"{total - mastered} cards to master", "course": d.course or "—"}
                )
        weak_topics.sort(key=lambda w: w["mastery"])

        return {
            "metrics": {
                "documents": documents,
                "flashcards": flashcards,
                "quizzesTaken": quizzes_taken,
                "studySessions": study_sessions,
            },
            "studyActivity": study_activity,
            "recentSessions": recent_sessions,
            "activity": activity,
            "weakTopics": weak_topics[:4],
            "suggestedRevision": suggested[:3],
        }
    finally:
        session.close()

```


## File: api/parsers.py
```python
"""Parse the LLM's text output (per prompts.py formats) into structured data.

The generator prompts ask for specific plain-text layouts (Q:/A: flashcards,
``Q1: ... A) ... Answer: B`` quizzes, raw Mermaid, indented mind maps). These
helpers turn that text into the dicts the frontend's typed models expect. They
are deliberately forgiving — models drift from the format, so we parse what we
can and skip the rest.
"""

from __future__ import annotations

import re


def _slug(prefix: str, i: int) -> str:
    return f"{prefix}-{i}"


def parse_flashcards(text: str, deck: str) -> list[dict]:
    """Parse ``Q: ... / A: ...`` pairs into flashcard dicts."""
    cards: list[dict] = []
    q: str | None = None
    a_lines: list[str] = []

    def flush() -> None:
        nonlocal q, a_lines
        if q and a_lines:
            front = q.strip()
            back = " ".join(a_lines).strip()
            cards.append(
                {
                    "id": _slug("fc", len(cards) + 1),
                    "type": "cloze" if "{{" in front else "basic",
                    "front": front,
                    "back": back,
                    "deck": deck,
                    "due": "Today",
                    "ease": "new",
                }
            )
        q, a_lines = None, []

    for raw in text.splitlines():
        line = raw.strip()
        if re.match(r"^Q[\d\.\):]*\s*[:\-]", line, re.IGNORECASE) or line.upper().startswith("Q:"):
            flush()
            q = re.sub(r"^Q[\d\.\):]*\s*[:\-]\s*", "", line, flags=re.IGNORECASE)
        elif re.match(r"^A[\d\.\):]*\s*[:\-]", line, re.IGNORECASE) or line.upper().startswith("A:"):
            a_lines = [re.sub(r"^A[\d\.\):]*\s*[:\-]\s*", "", line, flags=re.IGNORECASE)]
        elif line and a_lines:
            a_lines.append(line)
    flush()
    return cards


_OPT_RE = re.compile(r"^([A-D])[\)\.\:]\s*(.+)$")
_ANS_RE = re.compile(r"^Answer\s*[:\-]\s*([A-D])", re.IGNORECASE)
_Q_RE = re.compile(r"^Q\d*\s*[:\-\.]?\s*(.+)$", re.IGNORECASE)


def parse_quiz(text: str) -> list[dict]:
    """Parse the ``Q1: ... A) ... Answer: B`` quiz layout into question dicts."""
    import json
    # Try finding the first [ and last ] to extract JSON array
    start = text.find('[')
    end = text.rfind(']')
    if start != -1 and end != -1 and end > start:
        json_str = text[start:end+1]
        try:
            parsed = json.loads(json_str)
            if isinstance(parsed, list):
                questions = []
                for i, q in enumerate(parsed):
                    questions.append({
                        "id": _slug("qq", i + 1),
                        "type": q.get("type", "mcq"),
                        "prompt": q.get("prompt", ""),
                        "options": q.get("options", []),
                        "answer": q.get("answer", ""),
                        "explanation": q.get("explanation", ""),
                        "topic": q.get("topic", ""),  # carried through for PYQ-tagged exams
                    })
                if questions:
                    return questions
        except Exception:
            pass

    questions: list[dict] = []
    prompt: str | None = None
    options: dict[str, str] = {}
    answer_letter: str | None = None

    def flush() -> None:
        nonlocal prompt, options, answer_letter
        if prompt and options:
            opts = [options[k] for k in sorted(options)]
            ans_text = options.get(answer_letter or "", opts[0] if opts else "")
            questions.append(
                {
                    "id": _slug("qq", len(questions) + 1),
                    "type": "mcq",
                    "prompt": prompt.strip(),
                    "options": opts,
                    "answer": ans_text,
                    "explanation": "",
                }
            )
        prompt, options, answer_letter = None, {}, None

    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        opt = _OPT_RE.match(line)
        ans = _ANS_RE.match(line)
        if ans:
            answer_letter = ans.group(1).upper()
        elif opt:
            options[opt.group(1).upper()] = opt.group(2).strip()
        elif line.lower().startswith("q") and _Q_RE.match(line):
            # New question begins — flush the previous one.
            if prompt is not None:
                flush()
            prompt = _Q_RE.match(line).group(1)  # type: ignore[union-attr]
    flush()
    return questions


_DIFFICULTIES = {"easy": "Easy", "medium": "Medium", "hard": "Hard"}
_QTYPES = {
    "definition", "explanation", "comparison", "advantages", "architecture",
    "case_study", "numerical", "problem_solving", "short_answer", "long_answer", "other",
}
# Tolerate common synonyms the model may emit for the richer taxonomy.
_QTYPE_ALIASES = {
    "define": "definition", "definitions": "definition",
    "explain": "explanation", "explanations": "explanation", "describe": "explanation",
    "compare": "comparison", "comparisons": "comparison", "difference": "comparison",
    "advantage": "advantages", "advantages/disadvantages": "advantages",
    "pros_cons": "advantages", "merits": "advantages",
    "architecture": "architecture", "diagram": "architecture",
    "case": "case_study", "case study": "case_study", "casestudy": "case_study",
    "numerical": "numerical", "numericals": "numerical", "calculation": "numerical",
    "problem": "problem_solving", "problem solving": "problem_solving",
    "short": "short_answer", "short note": "short_answer", "short notes": "short_answer",
    "long": "long_answer", "essay": "long_answer",
}


def parse_pyq(text: str) -> list[dict]:
    """Parse an extracted-questions JSON array into PYQ question dicts.

    Forgiving like ``parse_quiz``: grab the first ``[`` … last ``]``, ``json.loads``,
    and skip/normalize bad items. Each item may carry ``text``/``question``,
    ``topic``, ``difficulty``, ``type``, ``marks``, ``year``.
    """
    import json

    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1 or end <= start:
        return []
    try:
        parsed = json.loads(text[start : end + 1])
    except Exception:
        return []
    if not isinstance(parsed, list):
        return []

    out: list[dict] = []
    for q in parsed:
        if not isinstance(q, dict):
            continue
        body = str(q.get("text") or q.get("question") or "").strip()
        if not body:
            continue
        diff = _DIFFICULTIES.get(str(q.get("difficulty", "")).strip().lower(), "Medium")
        qtype = str(q.get("type") or q.get("qtype") or "other").strip().lower().replace("-", "_")
        qtype = _QTYPE_ALIASES.get(qtype, qtype)
        if qtype not in _QTYPES:
            qtype = "other"
        subs = q.get("subtopics") or []
        if isinstance(subs, str):
            subs = [s.strip() for s in subs.split(",") if s.strip()]
        subtopics = [str(s).strip()[:128] for s in subs if str(s).strip()][:8] if isinstance(subs, list) else []
        marks = q.get("marks")
        try:
            marks = int(marks) if marks not in (None, "") else None
        except (TypeError, ValueError):
            marks = None
        year = q.get("year")
        try:
            year = int(year) if year not in (None, "") else None
        except (TypeError, ValueError):
            year = None
        out.append(
            {
                "text": body,
                "topic": str(q.get("topic") or "General").strip()[:256] or "General",
                "subtopics": subtopics,
                "difficulty": diff,
                "type": qtype,
                "marks": marks,
                "year": year,
            }
        )
    return out


def strip_mermaid_fences(text: str) -> str:
    """Remove ```mermaid fences and stray prose, returning bare diagram source."""
    t = text.strip()
    fence = re.search(r"```(?:mermaid)?\s*(.+?)```", t, re.DOTALL)
    if fence:
        return fence.group(1).strip()
    # Drop leading prose lines before the first diagram keyword.
    lines = t.splitlines()
    for i, line in enumerate(lines):
        if re.match(r"^\s*(graph|flowchart|sequenceDiagram|classDiagram|mindmap|erDiagram|stateDiagram)", line):
            return "\n".join(lines[i:]).strip()
    return t

```


## File: api/quality.py
```python
"""Objective artifact quality scoring.

Estimates how complete, grounded, balanced and well-structured a generated
artifact is using *measurable* signals only — no LLM self-grading. Each artifact
is scored against the source chunks that grounded it (``retrieved``) plus the
artifact's own structure.

The public entry point is :func:`score_artifact`, which dispatches on the RAG
route and returns a :class:`~scholarcli.api.schemas.QualityScore`.
"""

from __future__ import annotations

import math
import re
from collections import Counter

from scholarcli.api.schemas import QualityScore

# A small stopword set — enough to keep keyphrase/coverage signals on content
# words rather than glue words. Deliberately tiny (no NLTK dependency).
_STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "if", "then", "else", "of", "to", "in",
    "on", "for", "with", "as", "by", "at", "from", "into", "is", "are", "was",
    "were", "be", "been", "being", "this", "that", "these", "those", "it", "its",
    "they", "them", "their", "we", "you", "he", "she", "his", "her", "which",
    "who", "whom", "what", "when", "where", "how", "why", "can", "could", "will",
    "would", "should", "may", "might", "must", "do", "does", "did", "not", "no",
    "yes", "so", "than", "such", "also", "more", "most", "some", "any", "each",
    "all", "both", "between", "about", "over", "under", "up", "down", "out",
    "have", "has", "had", "use", "used", "using", "via", "per", "etc",
}

_WORD_RE = re.compile(r"[a-z0-9]+")


def _words(text: str) -> list[str]:
    """Content words: lowercased, len>2, not a stopword."""
    return [
        w for w in _WORD_RE.findall((text or "").lower())
        if len(w) > 2 and w not in _STOPWORDS
    ]


def _token_set(text: str) -> set[str]:
    return set(_words(text))


def _pct(x: float) -> int:
    """Clamp a 0..1 ratio to an integer percentage."""
    return int(round(max(0.0, min(1.0, x)) * 100))


def keyphrases(texts: list[str], k: int = 40) -> list[str]:
    """Top-``k`` content words across ``texts`` by frequency."""
    counter: Counter[str] = Counter()
    for t in texts:
        counter.update(_words(t))
    return [w for w, _ in counter.most_common(k)]


def lexical_coverage(artifact_text: str, source_keyphrases: list[str]) -> float:
    """Fraction of source keyphrases that appear in the artifact (0..1)."""
    if not source_keyphrases:
        return 0.0
    present = _token_set(artifact_text)
    hits = sum(1 for kp in source_keyphrases if kp in present)
    return hits / len(source_keyphrases)


def _jaccard(a: set[str], b: set[str]) -> float:
    if not a and not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union else 0.0


def redundancy(token_sets: list[set[str]], threshold: float = 0.6) -> float:
    """Share of item pairs that are near-duplicates (Jaccard >= threshold)."""
    n = len(token_sets)
    if n < 2:
        return 0.0
    dup = 0
    total = 0
    for i in range(n):
        for j in range(i + 1, n):
            total += 1
            if _jaccard(token_sets[i], token_sets[j]) >= threshold:
                dup += 1
    return dup / total if total else 0.0


def balance_entropy(counts: list[int]) -> float:
    """Normalised Shannon entropy of a distribution (1.0 = perfectly even)."""
    counts = [c for c in counts if c > 0]
    n = len(counts)
    if n <= 1:
        return 0.0
    total = sum(counts)
    h = -sum((c / total) * math.log(c / total) for c in counts)
    return h / math.log(n)


def grounding(retrieved: list[dict], artifact_text: str) -> tuple[float, int, int]:
    """Blend retrieval similarity, source diversity and lexical overlap.

    Returns ``(score 0..1, chunk_count, document_count)``.
    """
    if not retrieved:
        return 0.0, 0, 0
    sims = [max(0.0, min(1.0, 1.0 - (ch.get("_distance") or 1.0))) for ch in retrieved]
    avg_sim = sum(sims) / len(sims)
    docs = len({ch.get("document_id") for ch in retrieved if ch.get("document_id") is not None})
    diversity = min(1.0, docs / 3.0)
    source_tokens = _token_set(" ".join(ch.get("text", "") for ch in retrieved))
    art_tokens = _token_set(artifact_text)
    overlap = (len(art_tokens & source_tokens) / len(art_tokens)) if art_tokens else 0.0
    score = 0.45 * avg_sim + 0.15 * diversity + 0.40 * overlap
    return score, len(retrieved), docs


def _weighted(parts: list[tuple[int | None, float]]) -> int:
    """Weighted mean over the present (non-None) sub-scores."""
    num = sum(v * w for v, w in parts if v is not None)
    den = sum(w for v, w in parts if v is not None)
    return int(round(num / den)) if den else 0


# ---------------------------------------------------------------------------
# Per-artifact scorers
# ---------------------------------------------------------------------------

def score_notes(markdown: str, retrieved: list[dict], source_kps: list[str]) -> QualityScore:
    coverage = _pct(lexical_coverage(markdown, source_kps))
    g, chunks, docs = grounding(retrieved, markdown)
    grounding_pct = _pct(g)

    has_headings = bool(re.search(r"(?m)^#{1,6}\s+\S", markdown))
    bullets = len(re.findall(r"(?m)^\s*[-*]\s+\S", markdown))
    bold = len(re.findall(r"\*\*[^*]+\*\*", markdown))
    has_examples = bool(re.search(r"\b(example|e\.g\.|for instance)\b", markdown, re.I))
    length_ok = len(_words(markdown)) >= 80
    checks = [has_headings, bullets >= 3, bold >= 1, has_examples, length_ok]
    structure = _pct(sum(checks) / len(checks))

    notes: list[str] = []
    if not has_headings:
        notes.append("No section headings")
    if bold < 1:
        notes.append("No bolded definitions")
    if not has_examples:
        notes.append("No examples")
    if not length_ok:
        notes.append("Very short for revision notes")

    overall = _weighted([(coverage, 0.35), (grounding_pct, 0.35), (structure, 0.30)])
    return QualityScore(
        overall=overall, coverage=coverage, grounding=grounding_pct,
        structure=structure, sourceChunks=chunks, documents=docs, notes=notes,
    )


def _concept_buckets(items: list[str], source_kps: list[str]) -> Counter[str]:
    """Bucket each item by the first source keyphrase it mentions."""
    buckets: Counter[str] = Counter()
    for it in items:
        toks = _token_set(it)
        label = next((kp for kp in source_kps if kp in toks), "(other)")
        buckets[label] += 1
    return buckets


def score_flashcards(cards: list[dict], retrieved: list[dict], source_kps: list[str]) -> QualityScore:
    texts = [f"{c.get('front', '')} {c.get('back', '')}" for c in cards]
    joined = " ".join(texts)
    coverage = _pct(lexical_coverage(joined, source_kps))

    buckets = _concept_buckets(texts, source_kps)
    balance = _pct(balance_entropy(list(buckets.values())))
    red = redundancy([_token_set(c.get("front", "")) for c in cards])
    redundancy_pct = _pct(red)

    valid = sum(1 for c in cards if c.get("front", "").strip() and c.get("back", "").strip())
    structure = _pct(valid / len(cards)) if cards else 0

    notes: list[str] = []
    if cards:
        top_share = max(buckets.values()) / len(cards)
        if top_share > 0.5 and len(buckets) > 1:
            notes.append("Too many cards on one concept")
    covered = set(buckets)
    missing = [kp for kp in source_kps[:8] if kp not in covered]
    if len(missing) >= 4:
        notes.append("Missing major concepts")
    if red >= 0.2:
        notes.append("Redundant cards")

    overall = _weighted([
        (coverage, 0.40), (balance, 0.30), (structure, 0.20), (100 - redundancy_pct, 0.10),
    ])
    return QualityScore(
        overall=overall, coverage=coverage, balance=balance, redundancy=redundancy_pct,
        structure=structure, sourceChunks=len(retrieved),
        documents=len({ch.get("document_id") for ch in retrieved}), notes=notes,
    )


def score_quiz(questions: list[dict], retrieved: list[dict], source_kps: list[str]) -> QualityScore:
    prompts = [q.get("prompt", "") for q in questions]
    joined = " ".join(f"{q.get('prompt', '')} {' '.join(q.get('options') or [])}" for q in questions)
    concept_cov = lexical_coverage(joined, source_kps)

    # Topic coverage: distinct concept buckets vs the source's top concepts.
    buckets = _concept_buckets(prompts, source_kps)
    top_concepts = max(1, min(len(source_kps[:8]), len(questions)))
    topic_cov = len([b for b in buckets if b != "(other)"]) / top_concepts
    coverage = _pct((concept_cov + min(1.0, topic_cov)) / 2)

    types = Counter(q.get("type", "mcq") for q in questions)
    balance = _pct(balance_entropy(list(types.values())))
    red = redundancy([_token_set(p) for p in prompts])
    diversity = _pct(1.0 - red)

    g, chunks, docs = grounding(retrieved, joined)
    grounding_pct = _pct(g)

    def _ok(q: dict) -> bool:
        if q.get("type", "mcq") == "mcq":
            opts = q.get("options") or []
            return len(opts) >= 2 and bool(q.get("answer"))
        return bool(q.get("prompt"))
    structure = _pct(sum(_ok(q) for q in questions) / len(questions)) if questions else 0

    notes: list[str] = []
    if len(types) == 1 and "mcq" in types and len(questions) > 1:
        notes.append("Only MCQs")
    if len(buckets) <= 1 and len(questions) > 2:
        notes.append("Over-focused on one topic")
    if red >= 0.2:
        notes.append("Redundant questions")

    overall = _weighted([
        (coverage, 0.30), (balance, 0.20), (grounding_pct, 0.20),
        (diversity, 0.15), (structure, 0.15),
    ])
    return QualityScore(
        overall=overall, coverage=coverage, balance=balance, grounding=grounding_pct,
        diversity=diversity, redundancy=_pct(red), structure=structure,
        sourceChunks=chunks, documents=docs, notes=notes,
    )


def _parse_mindmap(text: str) -> tuple[list[tuple[int, str]], int, int]:
    """Return ``(nodes[(level,label)], max_depth, branch_count)``.

    Depth = indentation groups (4 chars each) plus one extra level for the
    branch connector (``├──``/``└──``), so top-level branches sit below the root.
    """
    nodes: list[tuple[int, str]] = []
    for raw in text.splitlines():
        if not raw.strip():
            continue
        stripped = raw.replace("│", " ")  # vertical guides count as indent
        has_branch = bool(re.search(r"[├└]|^\s*[-*]", stripped))
        label = re.sub(r"^[\s├└─|`+\-*]*", "", stripped).strip()
        if not label:
            continue
        indent = len(stripped) - len(stripped.lstrip(" "))
        level = indent // 4 + (1 if has_branch else 0)
        nodes.append((level, label))
    if nodes:
        # Normalise so the root is level 0.
        base = min(lvl for lvl, _ in nodes)
        nodes = [(lvl - base, lbl) for lvl, lbl in nodes]
    max_depth = max((lvl for lvl, _ in nodes), default=0)
    branch_count = sum(1 for lvl, _ in nodes if lvl == 1)
    return nodes, max_depth, branch_count


def score_mindmap(text: str, retrieved: list[dict], source_kps: list[str]) -> QualityScore:
    nodes, max_depth, branch_count = _parse_mindmap(text)
    labels = " ".join(lbl for _, lbl in nodes)
    coverage = _pct(lexical_coverage(labels, source_kps))
    g, chunks, docs = grounding(retrieved, labels)
    grounding_pct = _pct(g)

    # Branch balance: distribution of descendants across top-level branches.
    branch_sizes: list[int] = []
    current = 0
    for lvl, _ in nodes:
        if lvl == 1:
            branch_sizes.append(current)
            current = 0
        elif lvl > 1:
            current += 1
    branch_sizes.append(current)
    balance = balance_entropy([s + 1 for s in branch_sizes]) if branch_count > 1 else 0.0

    depth_score = min(1.0, max_depth / 3.0)
    branch_score = min(1.0, branch_count / 4.0)
    structure = _pct((depth_score + branch_score + balance) / 3)

    notes: list[str] = []
    if max_depth <= 1:
        notes.append("Flat map")
    if branch_count < 2:
        notes.append("Missing major branches")
    if len(nodes) <= 1:
        notes.append("Disconnected concepts")

    overall = _weighted([(coverage, 0.35), (structure, 0.35), (grounding_pct, 0.30)])
    return QualityScore(
        overall=overall, coverage=coverage, structure=structure, balance=_pct(balance),
        grounding=grounding_pct, sourceChunks=chunks, documents=docs, notes=notes,
    )


# Node id, an optional [..]/(..)/{..} label, an arrow, an optional |edge label|,
# then the next node id. Handles the common ``A[Process] --> B[Thread]`` form.
_EDGE_RE = re.compile(
    r"(\w[\w]*)(?:[\[\(\{][^\]\)\}]*[\]\)\}])?\s*"
    r"(?:--+>|==+>|-\.->|---|-->|->|--)\s*"
    r"(?:\|[^|]*\|\s*)?(\w[\w]*)"
)
_LABEL_RE = re.compile(r"[\[\(\{]+([^\]\)\}]+)[\]\)\}]+")
_DECL_RE = re.compile(r"(\w[\w]*)\s*[\[\(\{]")  # any id that declares a label
_HEADER_RE = re.compile(
    r"^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|mindmap)",
    re.I,
)


def score_diagram(mermaid: str, retrieved: list[dict], source_kps: list[str]) -> QualityScore:
    lines = mermaid.splitlines()
    valid_header = bool(lines) and bool(_HEADER_RE.match(lines[0]))

    edges = _EDGE_RE.findall(mermaid)
    edge_nodes: set[str] = set()
    for a, b in edges:
        edge_nodes.add(a)
        edge_nodes.add(b)
    declared = set(_DECL_RE.findall(mermaid))
    all_nodes = edge_nodes | declared
    labels = " ".join(_LABEL_RE.findall(mermaid))

    coverage = _pct(lexical_coverage(labels, source_kps))
    g, chunks, docs = grounding(retrieved, labels)
    grounding_pct = _pct(g)

    edges_present = len(edges) > 0
    connectivity = (len(edge_nodes) / len(all_nodes)) if all_nodes else 0.0
    density_ok = min(1.0, len(edges) / max(1, len(all_nodes)))
    signals = [float(valid_header), float(edges_present), connectivity, density_ok]
    structure = _pct(sum(signals) / len(signals))

    notes: list[str] = []
    if not valid_header:
        notes.append("Invalid diagram syntax")
    if not edges_present:
        notes.append("No logical flow")
    if all_nodes and connectivity < 1.0:
        notes.append("Disconnected nodes")

    overall = _weighted([(coverage, 0.35), (structure, 0.35), (grounding_pct, 0.30)])
    return QualityScore(
        overall=overall, coverage=coverage, structure=structure, grounding=grounding_pct,
        sourceChunks=chunks, documents=docs, notes=notes,
    )


def _parse_table_rows(content: str) -> list[list[str]]:
    rows: list[list[str]] = []
    for line in content.splitlines():
        line = line.strip()
        if not line.startswith("|") or line.count("|") < 2:
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if all(re.fullmatch(r":?-{2,}:?", c or "-") for c in cells):
            continue  # separator row
        rows.append(cells)
    return rows


def score_difference(content: str, retrieved: list[dict], source_kps: list[str]) -> QualityScore:
    rows = _parse_table_rows(content)
    header = rows[0] if rows else []
    data = rows[1:] if len(rows) > 1 else []
    dimensions = len(data)

    cell_text = " ".join(" ".join(r) for r in data)
    coverage = _pct(lexical_coverage(cell_text, source_kps))
    g, chunks, docs = grounding(retrieved, cell_text)
    grounding_pct = _pct(g)

    has_table = dimensions > 0
    filled = (
        sum(1 for r in data if len(r) >= 3 and r[1].strip() and r[2].strip()) / dimensions
        if dimensions else 0.0
    )
    has_exam = bool(re.search(r"exam perspective", content, re.I))
    depth = min(1.0, dimensions / 6.0)
    structure = _pct((float(has_table) + filled + float(has_exam) + depth) / 4)

    notes: list[str] = []
    if dimensions < 4:
        notes.append("Missing key contrasts")
    if not has_exam:
        notes.append("No exam perspective")
    if len(header) < 3:
        notes.append("Comparison not two-sided")

    overall = _weighted([(coverage, 0.35), (structure, 0.35), (grounding_pct, 0.30)])
    return QualityScore(
        overall=overall, coverage=coverage, structure=structure, grounding=grounding_pct,
        sourceChunks=chunks, documents=docs, notes=notes,
    )


# ---------------------------------------------------------------------------
# Dispatcher
# ---------------------------------------------------------------------------

def score_artifact(route: str, parsed, retrieved: list[dict], grounded: bool) -> QualityScore:
    """Score a parsed artifact. ``parsed`` shape depends on ``route``:

    flashcards/quiz -> list[dict]; mermaid/mindmap/study_notes/differences -> str.
    """
    retrieved = retrieved or []
    source_kps = keyphrases([ch.get("text", "") for ch in retrieved]) if retrieved else []

    if route == "flashcards":
        return score_flashcards(parsed, retrieved, source_kps)
    if route == "quiz":
        return score_quiz(parsed, retrieved, source_kps)
    if route == "mermaid":
        return score_diagram(parsed, retrieved, source_kps)
    if route == "mindmap":
        return score_mindmap(parsed, retrieved, source_kps)
    if route == "differences":
        return score_difference(parsed, retrieved, source_kps)
    # study_notes / quick_qa / fallback
    return score_notes(parsed, retrieved, source_kps)

```


## File: api/pyq_service.py
```python
"""PYQ (previous-year question) analysis service.

Extraction feeds the *full paper text* straight to the LLM (no RAG retrieval —
we already have the exact text and want every question, not a grounded
summary). Everything the page displays is then computed deterministically from
the stored rows, honouring the spec's "evidence over prediction" principle:
accuracy/readiness are derived from real ``TopicStat`` data, and topics with no
attempts report ``None`` rather than a fabricated number.
"""

from __future__ import annotations

import hashlib
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.api import parsers
from scholarcli.config import get_settings
from scholarcli.ingest.loaders import load_document
from scholarcli.llm import get_llm
from scholarcli.storage import get_session
from scholarcli.storage.models import PYQQuestion, QuestionPaper, TopicStat

# Cap paper text fed to the model — a question paper is a few pages; this guards
# against a stray huge upload blowing the context window.
_MAX_CHARS = 16000

_EXTRACT_SYSTEM = (
    "You extract exam questions from a previous-year question paper. "
    "Return ONLY a JSON array, no prose. Each element is an object with: "
    "'text' (the full question, verbatim), "
    "'topic' (a short canonical topic name, e.g. 'Deadlocks'), "
    "'subtopics' (array of 0-4 short subtopic names, e.g. ['Prevention','Avoidance']), "
    "'difficulty' (one of Easy, Medium, Hard), "
    "'type' (one of: definition, explanation, comparison, advantages, architecture, "
    "case_study, numerical, problem_solving, short_answer, long_answer, other), "
    "'marks' (integer or null). "
    "Use consistent topic/subtopic names across similar questions so they group cleanly. "
    "Skip instructions, headers, and marks tables — only real questions."
)

_PATTERN_LABELS = {
    "definition": "Definitions",
    "explanation": "Explanations",
    "comparison": "Comparisons",
    "advantages": "Advantages / Disadvantages",
    "architecture": "Architecture",
    "case_study": "Case Studies",
    "numerical": "Numericals",
    "problem_solving": "Problem Solving",
    "short_answer": "Short Answers",
    "long_answer": "Long Answers",
    "other": "Other",
}


# ---------------------------------------------------------------------------
# Extraction + persistence
# ---------------------------------------------------------------------------

def _read_text(path: Path) -> str:
    """Load a document's plain text for extraction.

    PDFs use a direct fitz pass with per-page OCR fallback for sparse pages,
    bypassing the full ingest pipeline (which filters full-page background
    images and would miss typical scanned exam papers).
    """
    if path.suffix.lower() == ".pdf":
        return _read_pdf_text(path)
    content_hash = hashlib.sha256(path.read_bytes()).hexdigest()
    pages, _ = load_document(path, content_hash)
    return "\n\n".join(p.text for p in pages).strip()[:_MAX_CHARS]


def _read_pdf_text(path: Path) -> str:
    """Extract text from a PDF with per-page OCR for sparse pages."""
    import fitz
    from scholarcli.ingest import ocr as ocr_mod

    min_chars = get_settings().ingest.scanned_min_chars
    parts: list[str] = []
    doc = fitz.open(str(path))
    try:
        for page in doc:
            text = page.get_text("text").strip()
            if len(text) < min_chars:
                ocr_text, _ = ocr_mod.ocr_page(page)
                if ocr_text.strip():
                    parts.append(ocr_text.strip())
            else:
                parts.append(text)
    finally:
        doc.close()
    return "\n\n".join(parts)[:_MAX_CHARS]


def extract_and_store(
    *, course: str, title: str, year: int | None, source_document: str, path: Path
) -> QuestionPaper:
    """Extract questions from *path* via the LLM and persist a paper + its rows."""
    doc_text = _read_text(path)
    if not doc_text:
        raise ValueError("No extractable text in paper")

    user = f"Question paper text:\n\n{doc_text[:_MAX_CHARS]}"
    llm = get_llm("quiz")
    resp = llm.invoke([SystemMessage(content=_EXTRACT_SYSTEM), HumanMessage(content=user)])
    questions = parsers.parse_pyq(getattr(resp, "content", "") or "")
    if not questions:
        raise ValueError("Could not extract any questions from the paper")

    session = get_session()
    try:
        paper = QuestionPaper(
            course=course,
            title=title,
            year=year,
            source_document=source_document,
            question_count=len(questions),
        )
        session.add(paper)
        session.flush()  # assign paper.id
        for q in questions:
            session.add(
                PYQQuestion(
                    paper_id=paper.id,
                    course=course,
                    year=q["year"] if q["year"] is not None else year,
                    text=q["text"],
                    topic=q["topic"],
                    subtopics=q.get("subtopics") or [],
                    difficulty=q["difficulty"],
                    qtype=q["type"],
                    marks=q["marks"],
                )
            )
        session.commit()
        session.refresh(paper)
        return paper
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Accuracy feedback loop
# ---------------------------------------------------------------------------

def record_topic_results(course: str, by_topic: dict[str, list[int]]) -> None:
    """Upsert per-topic ``[correct, total]`` increments into ``TopicStat``."""
    if not course or not by_topic:
        return
    session = get_session()
    try:
        now = datetime.now(timezone.utc)
        for topic, (correct, total) in by_topic.items():
            if not total:
                continue
            stat = (
                session.query(TopicStat)
                .filter(TopicStat.course == course, TopicStat.topic == topic)
                .first()
            )
            if stat is None:
                stat = TopicStat(course=course, topic=topic, correct=0, total=0)
                session.add(stat)
            stat.correct += int(correct)
            stat.total += int(total)
            stat.last_attempt = now
        session.commit()
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Deterministic aggregation
# ---------------------------------------------------------------------------

def _stars(rank_ratio: float) -> int:
    """Map a 0..1 occurrence-rank ratio to 1..5 importance stars."""
    return max(1, min(5, round(rank_ratio * 5)))


def _freq_label(occurrences: int, mx: int) -> str:
    if mx <= 0:
        return "Low"
    r = occurrences / mx
    return "High" if r >= 0.66 else "Medium" if r >= 0.33 else "Low"


def _trend(year_counts: dict[int, int]) -> str:
    """Compare the recent half of years to the earlier half."""
    years = sorted(year_counts)
    if len(years) < 2:
        return "Stable"
    mid = len(years) // 2
    early = sum(year_counts[y] for y in years[:mid])
    late = sum(year_counts[y] for y in years[mid:])
    if late > early:
        return "Increasing"
    if late < early:
        return "Decreasing"
    return "Stable"


_DIFF_PATTERNS = [
    re.compile(r"\bbetween\s+(.+?)\s+and\s+(.+?)(?:[.?\n]|$)", re.IGNORECASE),
    re.compile(r"\b(.+?)\s+(?:vs\.?|versus)\s+(.+?)(?:[.?\n]|$)", re.IGNORECASE),
    re.compile(r"\b(?:compare|differentiate|distinguish)\s+(.+?)\s+(?:and|with|from)\s+(.+?)(?:[.?\n]|$)", re.IGNORECASE),
]


def _clean_term(t: str) -> str:
    t = re.sub(r"\s+", " ", t).strip(" .,:;\"'()").strip()
    # Drop trailing instructional fragments the regex may capture.
    t = re.split(
        r"\b(?:with\s+respect|in\s+terms|in\s+detail|in\s+brief|briefly|using|give|"
        r"explain|state|with\s+(?:an?\s+)?(?:example|diagram)s?)\b",
        t,
        flags=re.IGNORECASE,
    )[0].strip(" .,:;\"'()").strip()
    return t[:60]


def difference_suggestions(course: str) -> list[dict]:
    """Mine comparison-style PYQ questions for recurring 'X vs Y' pairs."""
    session = get_session()
    try:
        rows = (
            session.query(PYQQuestion)
            .filter(PYQQuestion.course == course, PYQQuestion.qtype == "comparison")
            .all()
        )
        items = [(q.text, q.topic) for q in rows]
    finally:
        session.close()

    pairs: dict[tuple, dict] = {}
    for text, topic in items:
        for pat in _DIFF_PATTERNS:
            m = pat.search(text)
            if not m:
                continue
            a, b = _clean_term(m.group(1)), _clean_term(m.group(2))
            if not a or not b or len(a) < 2 or len(b) < 2 or a.lower() == b.lower():
                continue
            key = tuple(sorted([a.lower(), b.lower()]))
            entry = pairs.setdefault(key, {"a": a, "b": b, "topic": topic, "count": 0, "example": text})
            entry["count"] += 1
            break
    return sorted(pairs.values(), key=lambda e: e["count"], reverse=True)


def build_analysis(course: str) -> dict:
    """Aggregate stored PYQ questions + topic stats into the page payload."""
    session = get_session()
    try:
        questions = (
            session.query(PYQQuestion).filter(PYQQuestion.course == course).all()
        )
        papers = (
            session.query(QuestionPaper)
            .filter(QuestionPaper.course == course)
            .all()
        )
        stats = {
            s.topic: s
            for s in session.query(TopicStat).filter(TopicStat.course == course).all()
        }
    finally:
        session.close()

    total_questions = len(questions)
    if total_questions == 0:
        return {
            "course": course,
            "papers": 0,
            "totalQuestions": 0,
            "yearsLabel": "",
            "summary": {},
            "topicFrequency": [],
            "patterns": [],
            "difficulty": [],
            "marksDistribution": [],
            "yearTrends": [],
            "revisionRisk": [],
            "readiness": {},
        }

    years = sorted({q.year for q in questions if q.year is not None})
    years_label = f"{years[0]}-{years[-1]}" if len(years) > 1 else (str(years[0]) if years else "")

    # --- per-topic aggregation ---
    topic_count: dict[str, int] = defaultdict(int)
    topic_years: dict[str, dict[int, int]] = defaultdict(lambda: defaultdict(int))
    topic_styles: dict[str, set[str]] = defaultdict(set)
    topic_subs: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for q in questions:
        topic_count[q.topic] += 1
        if q.year is not None:
            topic_years[q.topic][q.year] += 1
        topic_styles[q.topic].add(q.qtype)
        for sub in (q.subtopics or []):
            topic_subs[q.topic][sub] += 1

    mx = max(topic_count.values())
    ranked = sorted(topic_count.items(), key=lambda kv: kv[1], reverse=True)

    def topic_accuracy(topic: str) -> int | None:
        s = stats.get(topic)
        if not s or s.total == 0:
            return None
        return round(100 * s.correct / s.total)

    topic_freq = []
    for i, (topic, occ) in enumerate(ranked):
        topic_freq.append(
            {
                "topic": topic,
                "occurrences": occ,
                "frequency": _freq_label(occ, mx),
                "trend": _trend(topic_years[topic]),
                "importance": _stars((len(ranked) - i) / len(ranked)),
                "accuracy": topic_accuracy(topic),
                "styles": sorted(topic_styles[topic]),
                "subtopics": [
                    s for s, _ in sorted(topic_subs[topic].items(), key=lambda kv: kv[1], reverse=True)
                ][:6],
            }
        )

    recurring = sum(1 for _, occ in ranked if occ >= 2)

    # --- question patterns ---
    type_count: dict[str, int] = defaultdict(int)
    type_examples: dict[str, list[str]] = defaultdict(list)
    for q in questions:
        type_count[q.qtype] += 1
        if len(type_examples[q.qtype]) < 3:
            type_examples[q.qtype].append(q.text)
    patterns = [
        {
            "type": t,
            "label": _PATTERN_LABELS.get(t, t.title()),
            "pct": round(100 * c / total_questions),
            "count": c,
            "examples": type_examples[t],
        }
        for t, c in sorted(type_count.items(), key=lambda kv: kv[1], reverse=True)
    ]

    # --- difficulty distribution ---
    diff_count: dict[str, int] = defaultdict(int)
    for q in questions:
        diff_count[q.difficulty] += 1
    difficulty = [
        {"level": lvl, "count": diff_count.get(lvl, 0)}
        for lvl in ("Easy", "Medium", "Hard")
    ]
    diff_weight = {"Easy": 1, "Medium": 2, "Hard": 3}
    avg_diff_num = sum(diff_weight.get(q.difficulty, 2) for q in questions) / total_questions
    avg_difficulty = "Easy" if avg_diff_num < 1.66 else "Medium" if avg_diff_num < 2.33 else "Hard"

    # --- marks distribution ---
    marks_count: dict[int, int] = defaultdict(int)
    for q in questions:
        if q.marks is not None:
            marks_count[q.marks] += 1
    marks_distribution = [
        {"marks": m, "count": c} for m, c in sorted(marks_count.items())
    ]

    # --- year trends (per topic, top 8 by frequency) ---
    year_trends = [
        {
            "topic": topic,
            "years": [
                {"year": y, "count": topic_years[topic][y]}
                for y in sorted(topic_years[topic])
            ],
        }
        for topic, _ in ranked[:8]
        if topic_years[topic]
    ]

    # --- readiness + revision risk (attempted topics only) ---
    attempted = [t for t in topic_count if t in stats and stats[t].total > 0]
    coverage = round(100 * len(attempted) / len(topic_count)) if topic_count else 0

    weighted_num = 0.0
    weighted_den = 0
    weak, strong = [], []
    for topic in attempted:
        acc = topic_accuracy(topic) or 0
        weighted_num += acc * topic_count[topic]
        weighted_den += topic_count[topic]
        (weak if acc < 60 else strong).append(topic)
    readiness_pct = round(weighted_num / weighted_den) if weighted_den else 0

    revision_risk = []
    for topic in attempted:
        acc = topic_accuracy(topic) or 0
        occ = topic_count[topic]
        score = (occ / mx) * (1 - acc / 100)  # high frequency + low accuracy
        risk = "High" if score >= 0.4 else "Medium" if score >= 0.2 else "Low"
        revision_risk.append(
            {"topic": topic, "occurrences": occ, "accuracy": acc, "risk": risk, "score": round(score, 3)}
        )
    revision_risk.sort(key=lambda r: r["score"], reverse=True)

    summary = {
        "topicsIdentified": len(topic_count),
        "recurringTopics": recurring,
        "questionTypes": len(type_count),
        "avgDifficulty": avg_difficulty,
        "coverage": coverage,
        "readiness": readiness_pct,
    }

    return {
        "course": course,
        "papers": len(papers),
        "totalQuestions": total_questions,
        "yearsLabel": years_label,
        "summary": summary,
        "topicFrequency": topic_freq,
        "patterns": patterns,
        "difficulty": difficulty,
        "marksDistribution": marks_distribution,
        "yearTrends": year_trends,
        "revisionRisk": revision_risk,
        "readiness": {
            "coverage": coverage,
            "readiness": readiness_pct,
            "weakTopics": weak,
            "strongTopics": strong,
        },
    }

```


## File: api/chat_service.py
```python
"""Cross-session chat history persistence.

Each Ask conversation can be tied to a ChatSession; user + assistant turns are
stored as ChatMessage rows so history survives reloads and restarts. All
helpers are self-contained (own session, commit, close).
"""

from __future__ import annotations

import secrets

from scholarcli.storage import get_session
from scholarcli.storage.models import ChatMessage, ChatSession


def _title_from(text: str) -> str:
    t = " ".join((text or "").split())
    return (t[:60] + "…") if len(t) > 60 else (t or "New chat")


def create_session(course: str | None = None, title: str | None = None) -> dict:
    session = get_session()
    try:
        row = ChatSession(
            id=secrets.token_hex(8),
            title=title or "New chat",
            course=course,
        )
        session.add(row)
        session.commit()
        session.refresh(row)
        return _session_meta(row, 0)
    finally:
        session.close()


def list_sessions() -> list[dict]:
    session = get_session()
    try:
        rows = (
            session.query(ChatSession)
            .order_by(ChatSession.updated_at.desc())
            .all()
        )
        return [_session_meta(r, len(r.messages)) for r in rows]
    finally:
        session.close()


def get_session_detail(session_id: str) -> dict | None:
    session = get_session()
    try:
        row = session.get(ChatSession, session_id)
        if not row:
            return None
        msgs = sorted(row.messages, key=lambda m: m.id)
        return {
            **_session_meta(row, len(msgs)),
            "messages": [_message_out(m) for m in msgs],
        }
    finally:
        session.close()


def delete_session(session_id: str) -> bool:
    session = get_session()
    try:
        row = session.get(ChatSession, session_id)
        if not row:
            return False
        session.delete(row)
        session.commit()
        return True
    finally:
        session.close()


def append_message(
    session_id: str, role: str, content: str, sources: list | None = None
) -> None:
    """Append a message; first user turn (re)names an untitled session."""
    session = get_session()
    try:
        row = session.get(ChatSession, session_id)
        if not row:
            return
        session.add(
            ChatMessage(
                session_id=session_id,
                role=role,
                content=content,
                sources=sources,
            )
        )
        if role == "user" and (not row.title or row.title == "New chat"):
            row.title = _title_from(content)
        session.commit()
    finally:
        session.close()


def _session_meta(row: ChatSession, count: int) -> dict:
    return {
        "id": row.id,
        "title": row.title,
        "course": row.course or "",
        "messageCount": count,
        "updatedAt": row.updated_at.isoformat() if row.updated_at else "",
    }


def _message_out(m: ChatMessage) -> dict:
    return {
        "id": str(m.id),
        "role": m.role,
        "content": m.content,
        "sources": m.sources or [],
        "createdAt": m.created_at.isoformat() if m.created_at else "",
    }

```


## File: api/job_service.py
```python
"""Durable background-job tracking.

FastAPI ``BackgroundTasks`` already runs ingestion off the request path, but its
state lived only in memory. These helpers persist each job in the BackgroundJob
table so the UI can poll progress (and see it after a reload). Best-effort:
status updates never raise into the caller.
"""

from __future__ import annotations

import secrets

from scholarcli.storage import get_session
from scholarcli.storage.models import BackgroundJob


def create_job(kind: str, label: str = "", payload: dict | None = None) -> str:
    job_id = secrets.token_hex(8)
    session = get_session()
    try:
        session.add(
            BackgroundJob(
                id=job_id, kind=kind, status="queued", label=label, payload=payload
            )
        )
        session.commit()
    finally:
        session.close()
    return job_id


def _update(job_id: str, **fields) -> None:
    session = get_session()
    try:
        job = session.get(BackgroundJob, job_id)
        if job:
            for k, v in fields.items():
                setattr(job, k, v)
            session.commit()
    except Exception:  # noqa: BLE001 — status tracking must never break the task
        pass
    finally:
        session.close()


def mark_running(job_id: str) -> None:
    _update(job_id, status="running")


def mark_done(job_id: str, result: dict | None = None) -> None:
    _update(job_id, status="done", result=result, error=None)


def mark_failed(job_id: str, error: str) -> None:
    _update(job_id, status="failed", error=error[:500])


def _job_out(job: BackgroundJob) -> dict:
    return {
        "id": job.id,
        "kind": job.kind,
        "status": job.status,
        "label": job.label,
        "result": job.result,
        "error": job.error,
        "createdAt": job.created_at.isoformat() if job.created_at else "",
        "updatedAt": job.updated_at.isoformat() if job.updated_at else "",
    }


def list_jobs(limit: int = 50) -> list[dict]:
    session = get_session()
    try:
        rows = (
            session.query(BackgroundJob)
            .order_by(BackgroundJob.created_at.desc())
            .limit(limit)
            .all()
        )
        return [_job_out(j) for j in rows]
    finally:
        session.close()


def get_job(job_id: str) -> dict | None:
    session = get_session()
    try:
        job = session.get(BackgroundJob, job_id)
        return _job_out(job) if job else None
    finally:
        session.close()

```


## File: api/trace_service.py
```python
"""Retrieval-trace analytics.

Records which chunks show up in *weak* generations (ungrounded or low
confidence) plus manual thumbs-down feedback, then aggregates per source so a
user can see which chunks consistently lead to poor answers. Logging is
best-effort and never raises into the request path.
"""

from __future__ import annotations

from collections import defaultdict

from scholarcli.storage import get_session
from scholarcli.storage.models import ChunkFeedback

# Generations at or below this confidence are treated as "weak" for logging.
WEAK_CONFIDENCE = 0.4


def log_weak_generation(
    query: str, retrieved: list[dict], grounded: bool, confidence: float | None
) -> None:
    """If a generation was ungrounded / low-confidence, record its chunks."""
    is_weak = (not grounded) or (confidence is not None and confidence <= WEAK_CONFIDENCE)
    if not is_weak or not retrieved:
        return
    session = get_session()
    try:
        for ch in retrieved:
            dist = ch.get("_distance")
            sim = round(max(0.0, min(1.0, 1.0 - dist)), 4) if dist is not None else 0.0
            session.add(
                ChunkFeedback(
                    query=(query or "")[:512],
                    chunk_id=str(ch.get("id", ""))[:128],
                    source=str(ch.get("title", "Untitled"))[:512],
                    similarity=sim,
                    verdict="weak",
                )
            )
        session.commit()
    except Exception:  # noqa: BLE001 — analytics logging is best-effort
        pass
    finally:
        session.close()


def record_feedback(chunk_id: str, source: str, query: str = "", similarity: float = 0.0) -> None:
    """Record a manual thumbs-down on a chunk."""
    session = get_session()
    try:
        session.add(
            ChunkFeedback(
                query=(query or "")[:512],
                chunk_id=(chunk_id or "")[:128],
                source=(source or "")[:512],
                similarity=float(similarity or 0.0),
                verdict="down",
            )
        )
        session.commit()
    finally:
        session.close()


def analytics(limit: int = 20) -> dict:
    """Aggregate feedback per source: how often each shows up in weak answers."""
    session = get_session()
    try:
        rows = session.query(ChunkFeedback).all()
    finally:
        session.close()

    by_source: dict[str, dict] = defaultdict(
        lambda: {"weak": 0, "down": 0, "simSum": 0.0, "n": 0}
    )
    for r in rows:
        agg = by_source[r.source or "Untitled"]
        agg["n"] += 1
        agg["simSum"] += r.similarity
        if r.verdict == "down":
            agg["down"] += 1
        else:
            agg["weak"] += 1

    items = [
        {
            "source": src,
            "weakCount": a["weak"],
            "downCount": a["down"],
            "total": a["n"],
            "avgSimilarity": round(a["simSum"] / a["n"], 4) if a["n"] else 0.0,
        }
        for src, a in by_source.items()
    ]
    # Worst offenders first: most flags, then lowest similarity.
    items.sort(key=lambda x: (-(x["weakCount"] + x["downCount"]), x["avgSimilarity"]))
    return {
        "totalFlags": len(rows),
        "sources": items[:limit],
    }

```


## File: api/app.py
```python
"""FastAPI application factory.

Run with: ``scholar serve`` (or ``uvicorn scholarcli.api.app:app --reload``).
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from scholarcli.storage import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    from scholarcli.api.prompt_service import seed_prompts
    seed_prompts()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="ScholarCLI API",
        version="0.1.0",
        description="HTTP API over the local-first RAG study assistant.",
        lifespan=lifespan,
    )

    # Vite dev server origins. Adjust/extend for deployment.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    from scholarcli.api.routers import (
        ask,
        consistency,
        courses,
        dashboard,
        differences,
        documents,
        exam,
        jobs,
        knowledge,
        library,
        notebooks,
        onboarding,
        prompts,
        pyq,
        reading,
        search,
        settings,
        study,
        teach,
        trace,
    )

    for module in (
        ask,
        consistency,
        courses,
        dashboard,
        differences,
        documents,
        exam,
        jobs,
        knowledge,
        library,
        notebooks,
        onboarding,
        prompts,
        pyq,
        reading,
        search,
        settings,
        study,
        teach,
        trace,
    ):
        app.include_router(module.router)

    @app.get("/api/health", tags=["health"])
    def health() -> dict:
        return {"status": "ok"}

    return app


app = create_app()

```


## File: api/consistency_service.py
```python
"""Cross-artifact consistency analysis.

Detects when learning artifacts generated from the same source material
silently diverge in concept coverage. Pipeline:

    source material -> canonical concept set (1 LLM call)
                    -> per-artifact coverage scoring (1 LLM call each)
                    -> coverage comparison + consistency report

ANALYZE-ONLY. Nothing here regenerates or mutates any artifact. Mirrors the
defensive LLM+JSON pattern in ``knowledge_service``.
"""

from __future__ import annotations

import json
import re

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.llm import get_llm
from scholarcli.storage import get_session
from scholarcli.storage.models import (
    Concept,
    Course,
    Deck,
    DifferenceTable,
    Diagram,
    Document,
    LearningPackage,
    Mindmap,
    Notebook,
    SavedQuiz,
)
from scholarcli.storage.vectors import all_chunks, get_document_chunks

# Artifact keys shared with the frontend Teach store / LearningPackage.artifacts.
ARTIFACT_KEYS = ["notes", "flashcards", "quiz", "mindmap", "diagram", "difference"]

_ARTIFACT_LABELS = {
    "notes": "Notes",
    "flashcards": "Flashcards",
    "quiz": "Quiz",
    "mindmap": "Mind Map",
    "diagram": "Diagram",
    "difference": "Difference Table",
}

_STATUS_SCORE = {"covered": 1.0, "weak": 0.5, "missing": 0.0}
_VALID_STATUS = set(_STATUS_SCORE)

_MAX_SOURCE_CHARS = 8000
_MAX_ARTIFACT_CHARS = 6000


# ---------------------------------------------------------------------------
# Canonical concept extraction
# ---------------------------------------------------------------------------

_CANONICAL_SYSTEM = """\
You are analyzing study source material to build a canonical concept checklist.
Read the text and list the KEY concepts that a complete set of study materials
should cover. Output ONLY a JSON array of strings, no prose. Rules:
- 8 to 15 concepts, the most important ones only.
- Each is a short noun phrase (1-4 words), Title Case.
- Canonical names only — no synonyms or duplicates.
- Do not include examples, asides or trivia, only core concepts.
- Output valid JSON only, e.g. ["Concept One", "Concept Two"].\
"""


def _parse_concept_names(text: str) -> list[str]:
    """Extract a JSON array of concept-name strings from LLM output, defensively."""
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if not match:
        return []
    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError:
        return []
    out: list[str] = []
    seen: set[str] = set()
    if isinstance(data, list):
        for item in data:
            # Tolerate objects like {"name": "..."} as well as bare strings.
            if isinstance(item, dict):
                item = item.get("name", "")
            name = str(item).strip()[:120]
            key = name.lower()
            if name and key not in seen:
                seen.add(key)
                out.append(name)
    return out


def extract_canonical_concepts(source_text: str, max_concepts: int = 15) -> list[str]:
    """Extract the canonical concept set from source material via the LLM."""
    sample = (source_text or "").strip()[:_MAX_SOURCE_CHARS]
    if not sample:
        return []
    llm = get_llm("deep_analysis")
    try:
        resp = llm.invoke(
            [SystemMessage(content=_CANONICAL_SYSTEM), HumanMessage(content=sample)]
        )
    except Exception:
        return []
    return _parse_concept_names(getattr(resp, "content", str(resp)))[:max_concepts]


# ---------------------------------------------------------------------------
# Per-artifact coverage scoring
# ---------------------------------------------------------------------------

_SCORE_SYSTEM = """\
You are checking whether a study artifact covers a fixed checklist of concepts.
For EACH concept in the provided list, classify how well the artifact covers it:
- "covered": clearly and adequately explained or tested.
- "weak": mentioned or touched but shallow, incomplete, or only in passing.
- "missing": not present at all.
Judge by meaning, not exact wording — paraphrase still counts as coverage.
Output ONLY a JSON object mapping each concept (exactly as given) to one of
"covered" / "weak" / "missing". Include every concept. No prose.\
"""


def _parse_status_map(text: str, concepts: list[str]) -> dict[str, str]:
    """Parse the LLM status object into ``{canonical_concept: status}``.

    This is the single normalization point: lookups are done against the
    *canonical* concept list (case-insensitive), so artifact-to-artifact
    counting downstream is always keyed by canonical names. Anything unknown,
    unparseable, or absent defaults to ``"missing"``.
    """
    result = {c: "missing" for c in concepts}
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return result
    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError:
        return result
    if not isinstance(data, dict):
        return result
    # Normalize the LLM's keys for case-insensitive matching.
    norm = {str(k).strip().lower(): str(v).strip().lower() for k, v in data.items()}
    for c in concepts:
        status = norm.get(c.lower())
        if status in _VALID_STATUS:
            result[c] = status
    return result


def score_artifact_coverage(artifact_text: str, concepts: list[str]) -> dict[str, str]:
    """Classify each canonical concept as covered/weak/missing in the artifact."""
    if not concepts:
        return {}
    text = (artifact_text or "").strip()[:_MAX_ARTIFACT_CHARS]
    if not text:
        return {c: "missing" for c in concepts}
    llm = get_llm("deep_analysis")
    human = f"CONCEPTS:\n{json.dumps(concepts)}\n\nARTIFACT:\n{text}"
    try:
        resp = llm.invoke(
            [SystemMessage(content=_SCORE_SYSTEM), HumanMessage(content=human)]
        )
    except Exception:
        return {c: "missing" for c in concepts}
    return _parse_status_map(getattr(resp, "content", str(resp)), concepts)


# ---------------------------------------------------------------------------
# Artifact payload -> plain text
# ---------------------------------------------------------------------------

def _coerce(payload) -> dict:
    """Normalize a payload (Pydantic model or dict) into a plain dict."""
    if payload is None:
        return {}
    if isinstance(payload, dict):
        return payload
    if hasattr(payload, "model_dump"):
        return payload.model_dump()
    return {}


def artifact_to_text(key: str, payload) -> str:
    """Flatten an artifact payload into a plain-text blob for concept scoring.

    Payloads use the same shapes the generative endpoints return (see
    ``schemas.py``). Everything is defensive ``.get`` so partial/old payloads
    never raise. Returns ``""`` when there is no usable text.
    """
    data = _coerce(payload)
    if not data:
        return ""

    if key == "notes":
        return str(data.get("markdown", "")).strip()

    if key == "difference":
        return str(data.get("content", "")).strip()

    if key == "mindmap":
        return str(data.get("text", "")).strip()

    if key == "diagram":
        return str(data.get("mermaid", "")).strip()

    if key == "flashcards":
        cards = data.get("cards", []) or []
        parts = []
        for c in cards:
            c = _coerce(c)
            front = str(c.get("front", "")).strip()
            back = str(c.get("back", "")).strip()
            if front or back:
                parts.append(f"{front} — {back}".strip(" —"))
        return "\n".join(parts).strip()

    if key == "quiz":
        questions = data.get("questions", []) or []
        parts = []
        for q in questions:
            q = _coerce(q)
            chunk = [str(q.get("prompt", "")).strip()]
            opts = q.get("options") or []
            if opts:
                chunk.append(" ".join(str(o) for o in opts))
            for fld in ("answer", "explanation"):
                val = str(q.get(fld, "")).strip()
                if val:
                    chunk.append(val)
            line = " ".join(p for p in chunk if p).strip()
            if line:
                parts.append(line)
        return "\n".join(parts).strip()

    return ""


# ---------------------------------------------------------------------------
# Report assembly
# ---------------------------------------------------------------------------

def _build_recommendations(
    per_artifact: list[dict], underrepresented: list[str], overall: float
) -> list[str]:
    recs: list[str] = []
    for a in per_artifact:
        missing = a["missing"]
        if missing:
            label = _ARTIFACT_LABELS.get(a["artifact"], a["artifact"].title())
            shown = ", ".join(missing[:4])
            more = "" if len(missing) <= 4 else f" (+{len(missing) - 4} more)"
            recs.append(
                f"Regenerate {label} with concept-coverage focus — missing: {shown}{more}."
            )
    if underrepresented:
        shown = ", ".join(underrepresented[:4])
        recs.append(
            f"These concepts appear in few artifacts — consider adding them: {shown}."
        )
    if per_artifact and overall < 0.6:
        recs.append(
            "Overall coverage is low — generated materials diverge significantly "
            "from the source. Review and regenerate the weakest artifacts."
        )
    if not recs and per_artifact:
        recs.append("Coverage looks consistent across artifacts. No action needed.")
    return recs


def build_report(source_text: str, artifacts: dict) -> dict:
    """Run the full pipeline and return a consistency report dict.

    ``artifacts`` maps artifact key -> payload (dict). Artifacts whose text is
    empty are skipped. Concept counting is keyed by canonical concept names.
    """
    concepts = extract_canonical_concepts(source_text)
    artifacts = artifacts or {}

    if not concepts:
        return {
            "canonicalConcepts": [],
            "overallCoverage": 0.0,
            "artifacts": [],
            "underrepresented": [],
            "overrepresented": [],
            "recommendations": [
                "Could not extract concepts from the source material. Ensure the "
                "source has enough content and the LLM is available, then retry."
            ],
        }

    per_artifact: list[dict] = []
    # canonical concept -> list of coverage scores across present artifacts
    coverage_matrix: dict[str, list[float]] = {c: [] for c in concepts}

    for key in ARTIFACT_KEYS:
        if key not in artifacts:
            continue
        text = artifact_to_text(key, artifacts[key])
        if not text.strip():
            continue
        status_map = score_artifact_coverage(text, concepts)
        covered = [c for c in concepts if status_map.get(c) == "covered"]
        weak = [c for c in concepts if status_map.get(c) == "weak"]
        missing = [c for c in concepts if status_map.get(c) == "missing"]
        if concepts:
            coverage = round(
                sum(_STATUS_SCORE[status_map.get(c, "missing")] for c in concepts)
                / len(concepts)
                * 100,
                1,
            )
        else:
            coverage = 0.0
        for c in concepts:
            coverage_matrix[c].append(_STATUS_SCORE[status_map.get(c, "missing")])
        per_artifact.append(
            {
                "artifact": key,
                "coverage": coverage,
                "covered": covered,
                "weak": weak,
                "missing": missing,
            }
        )

    n = len(per_artifact)
    overall = (
        round(sum(a["coverage"] for a in per_artifact) / n, 1) if n else 0.0
    )

    # Under-represented = strongly covered (score 1.0) by only a small minority.
    underrepresented = [
        c
        for c, scores in coverage_matrix.items()
        if n and sum(1 for s in scores if s >= 1.0) <= max(1, n // 3)
    ]
    # Over-represented = strongly covered by every present artifact (redundant emphasis).
    overrepresented = [
        c for c, scores in coverage_matrix.items() if n and all(s >= 1.0 for s in scores)
    ]

    recommendations = _build_recommendations(per_artifact, underrepresented, overall)
    suggestions = _build_suggestions(per_artifact)

    return {
        "canonicalConcepts": concepts,
        "overallCoverage": overall,
        "artifacts": per_artifact,
        "underrepresented": underrepresented,
        "overrepresented": overrepresented,
        "recommendations": recommendations,
        "suggestions": suggestions,
    }


# ---------------------------------------------------------------------------
# Auto-correct: suggest + apply revised artifact text covering missing concepts.
# ---------------------------------------------------------------------------

# Only text-shaped artifacts can be auto-corrected in place. Flashcards/quizzes
# are structured and excluded.
_APPLYABLE = {"notes", "mindmap", "diagram", "difference"}


def _build_suggestions(per_artifact: list[dict]) -> list[dict]:
    """Deterministic list of fixable gaps the UI can offer an 'Apply' button for."""
    out: list[dict] = []
    for a in per_artifact:
        key = a["artifact"]
        if key not in _APPLYABLE:
            continue
        gap = a["missing"] + a["weak"]
        if not gap:
            continue
        label = _ARTIFACT_LABELS.get(key, key.title())
        out.append(
            {
                "artifactType": key,
                "label": label,
                "issue": f"{label} under-covers {len(gap)} concept(s).",
                "concepts": gap[:8],
            }
        )
    return out


_REVISE_SYSTEM = """\
You revise study artifacts so they fully cover a set of concepts that are
currently missing or weak, WITHOUT removing existing correct content. Keep the
artifact's existing format exactly:
- notes / difference: Markdown.
- mindmap: an indented text tree using ├──/└── connectors.
- diagram: valid Mermaid syntax only (no fences, no prose).
Output ONLY the revised artifact, no commentary.\
"""


def apply_correction(course: str, artifact_type: str, concepts: list[str]) -> dict:
    """Regenerate a saved artifact so it covers ``concepts``, then persist it.

    Returns {applied, artifactType, preview, message}.
    """
    if artifact_type not in _APPLYABLE:
        return {"applied": False, "artifactType": artifact_type, "preview": "",
                "message": f"{artifact_type} cannot be auto-corrected."}

    session = get_session()
    try:
        row, current = _load_applyable(session, course, artifact_type)
        if row is None:
            return {"applied": False, "artifactType": artifact_type, "preview": "",
                    "message": f"No saved {artifact_type} found for course '{course}'."}

        concept_list = ", ".join(concepts) or "the source's key concepts"
        human = (
            f"Concepts to ensure are covered: {concept_list}\n\n"
            f"Current {artifact_type} to revise:\n{current}"
        )
        try:
            llm = get_llm("study_notes")
            resp = llm.invoke(
                [SystemMessage(content=_REVISE_SYSTEM), HumanMessage(content=human)]
            )
            revised = (getattr(resp, "content", "") or "").strip()
        except Exception as exc:  # noqa: BLE001
            return {"applied": False, "artifactType": artifact_type, "preview": "",
                    "message": f"Revision failed: {exc}"}
        if not revised:
            return {"applied": False, "artifactType": artifact_type, "preview": "",
                    "message": "Model returned no revision."}

        _write_applyable(row, artifact_type, revised)
        session.commit()
        return {"applied": True, "artifactType": artifact_type,
                "preview": revised[:600], "message": "Applied to saved artifact."}
    finally:
        session.close()


def _load_applyable(session, course: str, artifact_type: str):
    """Return (row, current_text) for the most-recent applyable artifact."""
    if artifact_type == "notes":
        row = (
            session.query(Notebook)
            .filter(Notebook.course == course)
            .order_by(Notebook.updated_at.desc())
            .first()
        )
        return row, (_notebook_to_markdown(row.blocks) if row else "")
    if artifact_type == "mindmap":
        row = (
            session.query(Mindmap)
            .filter(Mindmap.course == course)
            .order_by(Mindmap.created_at.desc())
            .first()
        )
        return row, (row.text if row else "")
    if artifact_type == "diagram":
        row = (
            session.query(Diagram)
            .filter(Diagram.course == course)
            .order_by(Diagram.created_at.desc())
            .first()
        )
        return row, (row.mermaid if row else "")
    # difference
    row = (
        session.query(DifferenceTable)
        .filter(DifferenceTable.course == course)
        .order_by(DifferenceTable.created_at.desc())
        .first()
    )
    return row, (row.content if row else "")


def _write_applyable(row, artifact_type: str, revised: str) -> None:
    if artifact_type == "notes":
        # Replace blocks with a single markdown block holding the revised notes.
        row.blocks = [{"type": "markdown", "text": revised}]
    elif artifact_type == "mindmap":
        row.text = revised
    elif artifact_type == "diagram":
        row.mermaid = revised
    else:  # difference
        row.content = revised


# ---------------------------------------------------------------------------
# Library (DB-backed) path
# ---------------------------------------------------------------------------

def _notebook_to_markdown(blocks: list) -> str:
    """Flatten notebook ``blocks`` JSON into text, defensively."""
    parts: list[str] = []
    for b in blocks or []:
        if isinstance(b, str):
            parts.append(b)
        elif isinstance(b, dict):
            for fld in ("text", "content", "markdown", "value"):
                val = b.get(fld)
                if isinstance(val, str) and val.strip():
                    parts.append(val.strip())
                    break
    return "\n\n".join(parts).strip()


def _library_source_text(session, course: str, document_title: str | None) -> str:
    """Build canonical source text for a course, optionally scoped to a document.

    NOTE: ``document_title`` only sharpens the *source* concept set — saved
    artifact rows carry no document_id, so artifact gathering stays course-wide.
    """
    chunks: list[dict] = []
    if document_title:
        doc = (
            session.query(Document)
            .join(Course)
            .filter(Document.title == document_title, Course.name == course)
            .first()
        )
        if doc is not None:
            chunks = get_document_chunks(doc.id)
    if not chunks:
        chunks = all_chunks(course=course)
    text = "\n\n".join(ch.get("text", "") for ch in chunks)[:_MAX_SOURCE_CHARS]
    if text.strip():
        return text
    # Fallback: synthesize from a previously-built knowledge graph (may be stale).
    concepts = session.query(Concept).filter(Concept.course == course).all()
    return "\n".join(f"{c.name}: {c.description}" for c in concepts).strip()


def _gather_saved_artifacts(session, course: str) -> dict:
    """Aggregate saved artifacts for a course into per-key payloads.

    Linkage is course-only (saved rows store ``course``, not document_id).
    Multiple rows of a type are merged into one payload.
    """
    artifacts: dict = {}

    # Flashcards — all decks' cards for the course.
    decks = session.query(Deck).filter(Deck.course == course).all()
    cards = [
        {"front": c.front, "back": c.back}
        for d in decks
        for c in d.cards
    ]
    if cards:
        artifacts["flashcards"] = {"cards": cards}

    # Quiz — merge all saved quizzes' questions.
    quizzes = session.query(SavedQuiz).filter(SavedQuiz.course == course).all()
    questions = [q for quiz in quizzes for q in (quiz.questions or [])]
    if questions:
        artifacts["quiz"] = {"questions": questions}

    # Notes — most-recent notebook for the course.
    nb = (
        session.query(Notebook)
        .filter(Notebook.course == course)
        .order_by(Notebook.updated_at.desc())
        .first()
    )
    if nb is not None:
        md = _notebook_to_markdown(nb.blocks)
        if md:
            artifacts["notes"] = {"markdown": md}

    # Mind map — most-recent.
    mm = (
        session.query(Mindmap)
        .filter(Mindmap.course == course)
        .order_by(Mindmap.created_at.desc())
        .first()
    )
    if mm is not None and (mm.text or "").strip():
        artifacts["mindmap"] = {"text": mm.text}

    # Diagram — most-recent.
    dg = (
        session.query(Diagram)
        .filter(Diagram.course == course)
        .order_by(Diagram.created_at.desc())
        .first()
    )
    if dg is not None and (dg.mermaid or "").strip():
        artifacts["diagram"] = {"mermaid": dg.mermaid}

    # Difference table — most-recent.
    dt = (
        session.query(DifferenceTable)
        .filter(DifferenceTable.course == course)
        .order_by(DifferenceTable.created_at.desc())
        .first()
    )
    if dt is not None and (dt.content or "").strip():
        artifacts["difference"] = {"content": dt.content}

    # Fallback: merge a learning package's artifacts for keys still missing.
    if len(artifacts) < len(ARTIFACT_KEYS):
        pkg = (
            session.query(LearningPackage)
            .filter(LearningPackage.course == course)
            .order_by(LearningPackage.updated_at.desc())
            .first()
        )
        if pkg is not None and isinstance(pkg.artifacts, dict):
            for key in ARTIFACT_KEYS:
                if key not in artifacts and pkg.artifacts.get(key):
                    artifacts[key] = pkg.artifacts[key]

    return artifacts


def build_library_report(course: str, document_title: str | None = None) -> dict:
    """Consistency report over saved artifacts for a course (DB-backed)."""
    session = get_session()
    try:
        source_text = _library_source_text(session, course, document_title)
        artifacts = _gather_saved_artifacts(session, course)
    finally:
        session.close()

    if not artifacts:
        return {
            "canonicalConcepts": [],
            "overallCoverage": 0.0,
            "artifacts": [],
            "underrepresented": [],
            "overrepresented": [],
            "recommendations": [
                f"No saved artifacts found for course '{course}'. Generate and save "
                "some artifacts (flashcards, quiz, notes, etc.) first."
            ],
        }
    return build_report(source_text, artifacts)

```


## File: api/knowledge_service.py
```python
"""Knowledge-graph extraction.

Runs an LLM over indexed document chunks to extract concepts and their
relationships, then persists them as Concept + ConceptEdge rows. The graph is
fully rebuilt on each ``build`` so it stays consistent with the LLM output.
"""

from __future__ import annotations

import json
import re

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.llm import get_llm
from scholarcli.storage import get_session
from scholarcli.storage.models import Concept, ConceptEdge, Document
from scholarcli.storage.vectors import get_document_chunks

_CLUSTERS = ["rag", "agent", "infra", "eval"]

_EXTRACT_SYSTEM = """\
You are a knowledge-graph extractor for student study material. Read the text
and extract the key concepts and how they relate. Output ONLY a JSON array,
no prose. Each element must be:
  {"name": "Concept Name", "description": "one concise sentence", "related": ["Other Concept", ...]}
Rules:
- Extract 5 to 12 of the most important concepts.
- Keep names short (1-4 words), Title Case.
- "related" lists other concept names (ideally also in this array) it connects to.
- Output valid JSON only.\
"""


def _cluster_for(name: str) -> str:
    return _CLUSTERS[abs(hash(name)) % len(_CLUSTERS)]


def _size_for(ref_count: int) -> str:
    if ref_count >= 6:
        return "large"
    if ref_count >= 3:
        return "medium"
    return "small"


def _parse_concepts(text: str) -> list[dict]:
    """Extract a JSON array of concepts from the LLM output, defensively."""
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if not match:
        return []
    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError:
        return []
    out: list[dict] = []
    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict) and item.get("name"):
                out.append(
                    {
                        "name": str(item["name"]).strip()[:120],
                        "description": str(item.get("description", "")).strip(),
                        "related": [str(r).strip()[:120] for r in item.get("related", []) if r],
                    }
                )
    return out


def _extract_for_text(sample: str) -> list[dict]:
    llm = get_llm("deep_analysis")
    resp = llm.invoke(
        [SystemMessage(content=_EXTRACT_SYSTEM), HumanMessage(content=sample)]
    )
    return _parse_concepts(getattr(resp, "content", str(resp)))


def build_graph(course: str | None = None, max_documents: int = 8) -> dict:
    """Extract concepts from up to ``max_documents`` and persist the graph."""
    session = get_session()
    try:
        docs = session.query(Document).all()
        if course:
            docs = [d for d in docs if d.course and d.course.name == course]
        docs = docs[:max_documents]

        # Aggregate concepts across documents.
        # name -> {description, sources:set(doc_id), related:set(names)}
        agg: dict[str, dict] = {}
        for doc in docs:
            chunks = get_document_chunks(doc.id)
            if not chunks:
                continue
            sample = "\n\n".join(ch.get("text", "") for ch in chunks)[:6000]
            for c in _extract_for_text(sample):
                name = c["name"]
                entry = agg.setdefault(
                    name, {"description": c["description"], "sources": set(), "related": set()}
                )
                entry["sources"].add(doc.id)
                if not entry["description"] and c["description"]:
                    entry["description"] = c["description"]
                entry["related"].update(r for r in c["related"] if r != name)

        if not agg:
            return {"concepts": 0, "edges": 0}

        # Wipe the previous graph and rebuild.
        session.query(ConceptEdge).delete()
        session.query(Concept).delete()
        session.commit()

        # Ensure every referenced concept exists (related targets may be new).
        all_names = set(agg)
        for entry in agg.values():
            all_names.update(entry["related"])

        name_to_id: dict[str, int] = {}
        for name in all_names:
            entry = agg.get(name, {"description": "", "sources": set(), "related": set()})
            ref_count = len(entry["related"]) + len(entry["sources"]) + 1
            concept = Concept(
                name=name,
                description=entry["description"],
                definition=entry["description"],
                summary="",
                cluster=_cluster_for(name),
                course=course or "",
                ref_count=ref_count,
                source_count=max(1, len(entry["sources"])),
            )
            session.add(concept)
            session.flush()
            name_to_id[name] = concept.id

        edges = 0
        seen_pairs: set[tuple[int, int]] = set()
        for name, entry in agg.items():
            src = name_to_id[name]
            for rel in entry["related"]:
                tgt = name_to_id.get(rel)
                if tgt is None or tgt == src:
                    continue
                pair = (src, tgt)
                if pair in seen_pairs or (tgt, src) in seen_pairs:
                    continue
                seen_pairs.add(pair)
                session.add(ConceptEdge(source_id=src, target_id=tgt, relation="related"))
                edges += 1

        session.commit()
        return {"concepts": len(name_to_id), "edges": edges}
    finally:
        session.close()


def graph(course: str | None = None) -> dict:
    """Return the persisted graph as nodes + edges."""
    session = get_session()
    try:
        cq = session.query(Concept)
        if course:
            cq = cq.filter(Concept.course == course)
        concepts = cq.all()
        ids = {c.id for c in concepts}
        nodes = [
            {
                "id": str(c.id),
                "label": c.name,
                "description": c.description,
                "size": _size_for(c.ref_count),
                "refCount": c.ref_count,
                "sourceCount": c.source_count,
                "cluster": c.cluster,
            }
            for c in concepts
        ]
        edges = [
            {
                "id": f"e{e.source_id}-{e.target_id}",
                "source": str(e.source_id),
                "target": str(e.target_id),
                "label": e.relation,
            }
            for e in session.query(ConceptEdge).all()
            if e.source_id in ids and e.target_id in ids
        ]
        return {"nodes": nodes, "edges": edges}
    finally:
        session.close()


def inspector(concept_id: int) -> dict | None:
    session = get_session()
    try:
        c = session.get(Concept, concept_id)
        if not c:
            return None
        # Related concept names via edges in either direction.
        related: list[str] = []
        for e in session.query(ConceptEdge).all():
            peer = None
            if e.source_id == c.id:
                peer = e.target_id
            elif e.target_id == c.id:
                peer = e.source_id
            if peer is not None:
                pc = session.get(Concept, peer)
                if pc:
                    related.append(pc.name)
        confidence = round(min(0.99, 0.7 + c.ref_count * 0.03), 2)
        return {
            "id": str(c.id),
            "name": c.name,
            "confidence": confidence,
            "refCount": c.ref_count,
            "sourceCount": c.source_count,
            "description": c.description,
            "definition": c.definition or c.description,
            "aiSummary": c.summary
            or f"{c.name} is referenced across {c.ref_count} artifacts in "
            f"{c.source_count} source documents.",
            "relatedConcepts": related[:8],
            "referencedIn": {
                "documents": c.source_count,
                "notes": 0,
                "flashcards": 0,
                "quizzes": 0,
                "answers": 0,
                "diagrams": 0,
            },
            "citations": [],
        }
    finally:
        session.close()


def discover(concept_id: int) -> list[str]:
    data = inspector(concept_id)
    return data["relatedConcepts"] if data else []


def sidebar(course: str | None = None) -> dict:
    """Explorer side-panel data derived from the concept graph."""
    session = get_session()
    try:
        cq = session.query(Concept)
        if course:
            cq = cq.filter(Concept.course == course)
        concepts = cq.all()

        # Collections = concepts grouped by cluster.
        counts: dict[str, int] = {}
        for c in concepts:
            counts[c.cluster] = counts.get(c.cluster, 0) + 1
        collections = [
            {"id": f"col-{cl}", "label": cl.upper(), "count": n}
            for cl, n in sorted(counts.items(), key=lambda kv: -kv[1])
        ]

        # Recent concepts = highest-id (most recently extracted) names.
        recent = [c.name for c in sorted(concepts, key=lambda c: c.id, reverse=True)[:6]]

        return {
            "collections": collections,
            "recentConcepts": recent,
            "sourceFilters": ["Documents", "Notes", "Answers", "Flashcards", "Quizzes", "Diagrams"],
        }
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Manual curation — prune (delete) and merge synonymous concepts.
# ---------------------------------------------------------------------------

def delete_concept(concept_id: int) -> bool:
    """Remove a concept and any edges touching it."""
    session = get_session()
    try:
        concept = session.get(Concept, concept_id)
        if not concept:
            return False
        session.query(ConceptEdge).filter(
            (ConceptEdge.source_id == concept_id) | (ConceptEdge.target_id == concept_id)
        ).delete(synchronize_session=False)
        session.delete(concept)
        session.commit()
        return True
    finally:
        session.close()


def merge_concepts(keep_id: int, drop_id: int) -> dict | None:
    """Merge ``drop_id`` into ``keep_id``: repoint its edges, fold in its refs,
    then delete it. Returns the kept concept's inspector dict, or None if either
    id is missing / they're the same.
    """
    if keep_id == drop_id:
        return None
    session = get_session()
    try:
        keep = session.get(Concept, keep_id)
        drop = session.get(Concept, drop_id)
        if not keep or not drop:
            return None

        # Fold descriptive fields + reference counts into the survivor.
        if not keep.description and drop.description:
            keep.description = drop.description
        if not keep.definition and drop.definition:
            keep.definition = drop.definition
        keep.ref_count = keep.ref_count + drop.ref_count
        keep.source_count = max(keep.source_count, drop.source_count)

        # Repoint edges from drop → keep, dropping self-loops and duplicates.
        existing: set[tuple[int, int]] = {
            (e.source_id, e.target_id) for e in session.query(ConceptEdge).all()
        }
        for edge in session.query(ConceptEdge).filter(
            (ConceptEdge.source_id == drop_id) | (ConceptEdge.target_id == drop_id)
        ).all():
            new_src = keep_id if edge.source_id == drop_id else edge.source_id
            new_tgt = keep_id if edge.target_id == drop_id else edge.target_id
            if new_src == new_tgt or (new_src, new_tgt) in existing or (new_tgt, new_src) in existing:
                session.delete(edge)
            else:
                edge.source_id = new_src
                edge.target_id = new_tgt
                existing.add((new_src, new_tgt))

        session.delete(drop)
        session.commit()
    finally:
        session.close()
    return inspector(keep_id)

```


## File: api/prompt_service.py
```python
"""Prompt library — user-customizable system prompts per generation category.

Built-in prompts are seeded from ``scholarcli.rag.prompts`` (the originals,
labelled "Default") plus three alternative *styles* per category — Concise,
Comprehensive and Socratic — so users have ready-made variants to pick from or
clone. The single ``active`` prompt per category overrides the hard-coded
default at generation time (see ``active_body``).
"""

from __future__ import annotations

from scholarcli.rag.prompts import (
    FLASHCARDS_SYSTEM,
    GENERATOR_SYSTEM,
    MERMAID_SYSTEM,
    MINDMAP_SYSTEM,
    QUIZ_SYSTEM,
    STUDY_NOTES_SYSTEM,
)
from scholarcli.storage import get_session
from scholarcli.storage.models import Prompt

# Category metadata surfaced to the frontend. ``key`` is the RAG route.
CATEGORIES: list[dict[str, str]] = [
    {"key": "quick_qa", "label": "Answers", "description": "How the assistant answers your questions."},
    {"key": "flashcards", "label": "Flashcards", "description": "Generating Q&A flashcards from your material."},
    {"key": "quiz", "label": "Quizzes", "description": "Generating multiple-choice quizzes."},
    {"key": "mermaid", "label": "Diagrams", "description": "Generating Mermaid diagrams of concepts."},
    {"key": "mindmap", "label": "Mind Maps", "description": "Generating hierarchical concept trees."},
    {"key": "study_notes", "label": "Study Notes", "description": "Generating revision notes and summaries."},
]

_CATEGORY_KEYS = {c["key"] for c in CATEGORIES}


# ---------------------------------------------------------------------------
# Built-in seed data: the original default + 3 styled variants per category.
# ---------------------------------------------------------------------------

_CONCISE = "Concise"
_COMPREHENSIVE = "Comprehensive"
_SOCRATIC = "Socratic"

_BUILTINS: dict[str, list[tuple[str, str, str]]] = {
    # category: [(name, style, body), ...]  — first entry is the seeded default.
    "quick_qa": [
        ("Default", "", GENERATOR_SYSTEM),
        (
            "Explain Like I'm 5",
            "Simple",
            """\
You are an expert tutor. Answer using ONLY the provided context chunks.
Rules:

1. Explain the concepts so simply that a 5-year-old could understand them.
2. Use simple analogies and everyday language.
3. Cite sources inline as [Source: {title}, p.{page}].
4. If the context lacks the answer, say "I don't have that information in the materials provided."
5. Never invent facts.\
""",
        ),
        (
            "Concise Answers",
            _CONCISE,
            """\
You are a citation-grounded study assistant. Answer using ONLY the provided
context chunks. Be as brief as possible:

1. Lead with the direct answer in one or two sentences.
2. Cite sources inline as [Source: {title}, p.{page}].
3. Use bullets only when listing. No preamble, no filler.
4. If the context lacks the answer, say "This topic is not covered in your
   uploaded materials."
5. Never invent facts.\
""",
        ),
        (
            "Comprehensive Answers",
            _COMPREHENSIVE,
            """\
You are a thorough, citation-grounded study assistant. Answer using ONLY the
provided context chunks. Aim for depth and clarity:

1. Open with a direct answer, then expand with explanation and worked detail.
2. Define key terms the first time they appear (**bold** them).
3. Cite every claim inline as [Source: {title}, p.{page}].
4. Use markdown tables for comparisons and bullet lists for enumerations.
5. End with a short "In summary" line tying the answer together.
6. If the context is insufficient, say so explicitly and state what is missing.
7. Never fabricate facts beyond the context.\
""",
        ),
        (
            "Socratic Tutor",
            _SOCRATIC,
            """\
You are a Socratic study tutor. Answer using ONLY the provided context chunks,
but teach by guiding the student's reasoning:

1. Briefly restate the core question to confirm understanding.
2. Give the grounded answer, citing sources as [Source: {title}, p.{page}].
3. Surface the underlying principle, then pose 1-2 probing follow-up questions
   that push the student to apply or extend the idea.
4. Suggest one concrete next thing to explore in their materials.
5. If the context does not cover it, say so and ask a question that reframes
   the topic toward what IS covered.
6. Never invent facts.\
""",
        ),
    ],
    "flashcards": [
        ("Default", "", FLASHCARDS_SYSTEM),
        (
            "Fill-in-the-Blank",
            "Cloze",
            """\
You are a flashcard generator. From the provided context, produce fill-in-the-blank (cloze) flashcards. Rules:

1. Generate 8-12 flashcards.
2. Provide a key statement with a critical word or phrase replaced by "_____".
3. Format each card exactly as:
   Q: <statement with blank>
   A: <the missing word or phrase>
4. Separate cards with a blank line. Ground every card in the context.\
""",
        ),
        (
            "Rapid Recall",
            _CONCISE,
            """\
You are a flashcard generator. From the provided context, produce tight
recall-focused flashcards. Rules:

1. Generate 8-12 flashcards covering the key facts and definitions.
2. Keep questions short and answers to a single sentence or phrase.
3. Favor atomic facts — one idea per card.
4. Format each card exactly as:
   Q: <question>
   A: <answer>
5. Separate cards with a blank line. Ground every card in the context.\
""",
        ),
        (
            "Deep Understanding",
            _COMPREHENSIVE,
            """\
You are a flashcard generator focused on understanding, not just recall. From
the provided context, create flashcards that build conceptual mastery. Rules:

1. Generate 6-10 flashcards mixing definitions, "why/how" reasoning, and
   relationships between concepts.
2. Include at least two cards that ask the student to compare or contrast.
3. Answers may be 2-4 sentences and should explain, not just state.
4. Format each card exactly as:
   Q: <question>
   A: <answer>
5. Separate cards with a blank line. Ground every card in the context.\
""",
        ),
        (
            "Exam Prep",
            _SOCRATIC,
            """\
You are a flashcard generator preparing a student for exams. From the provided
context, create flashcards that anticipate how the material is tested. Rules:

1. Generate 8-10 flashcards phrased the way an exam would ask them.
2. Include application/scenario questions ("Given X, what happens to Y?").
3. Add a brief "Watch out:" note in the answer for common mistakes where
   relevant.
4. Format each card exactly as:
   Q: <question>
   A: <answer>
5. Separate cards with a blank line. Ground every card in the context.\
""",
        ),
    ],
    "quiz": [
        ("Default", "", QUIZ_SYSTEM),
        (
            "True or False",
            "Binary",
            """\
You are a quiz generator. From the provided context, generate a short True/False quiz. Rules:

1. Generate 6 factual statements. Half should be true, half should be false.
2. Format each question exactly as:
   Q<number>: <statement>
   A) True
   B) False
   Answer: <letter>
3. Separate questions with a blank line.\
""",
        ),
        (
            "Quick Check",
            _CONCISE,
            """\
You are a quiz generator. From the provided context, generate a short
multiple-choice quiz for a fast knowledge check. Rules:

1. Generate 5 factual-recall questions.
2. Each has 4 options (A-D) with exactly one correct answer.
3. Keep questions and options short.
4. Format each question exactly as:
   Q<number>: <question text>
   A) <option>
   B) <option>
   C) <option>
   D) <option>
   Answer: <letter>
5. Separate questions with a blank line.\
""",
        ),
        (
            "Rigorous Exam",
            _COMPREHENSIVE,
            """\
You are a quiz generator building a challenging exam. From the provided
context, generate a demanding multiple-choice quiz. Rules:

1. Generate 8 questions spanning recall, conceptual understanding, and
   application/analysis.
2. Each has 4 plausible options (A-D) with exactly one correct answer; make
   distractors tempting but defensibly wrong.
3. Include at least two multi-step or scenario-based questions.
4. Format each question exactly as:
   Q<number>: <question text>
   A) <option>
   B) <option>
   C) <option>
   D) <option>
   Answer: <letter>
5. Separate questions with a blank line.\
""",
        ),
        (
            "Concept Probing",
            _SOCRATIC,
            """\
You are a quiz generator that probes understanding. From the provided context,
generate a multiple-choice quiz that targets reasoning and misconceptions.
Rules:

1. Generate 6 questions, each isolating one concept or common misconception.
2. Phrase questions to require understanding the "why", not just the "what".
3. Each has 4 options (A-D) with exactly one correct answer; let distractors
   represent typical wrong mental models.
4. Format each question exactly as:
   Q<number>: <question text>
   A) <option>
   B) <option>
   C) <option>
   D) <option>
   Answer: <letter>
5. Separate questions with a blank line.\
""",
        ),
    ],
    "mermaid": [
        ("Default", "", MERMAID_SYSTEM),
        (
            "Entity Relationship",
            "Data structures",
            """\
You are a diagram generator. From the provided context, output a Mermaid entity-relationship diagram (erDiagram). Rules:

1. Output ONLY valid Mermaid syntax — no fences, no explanation.
2. Use erDiagram.
3. Map out the main concepts as entities and their relationships.
4. Add basic attributes if present in the text.\
""",
        ),
        (
            "Minimal Flow",
            _CONCISE,
            """\
You are a diagram generator. From the provided context, output a clean, minimal
Mermaid diagram. Rules:

1. Output ONLY valid Mermaid syntax — no fences, no explanation.
2. Use flowchart TD or graph LR.
3. Keep to the essential nodes and edges; avoid clutter (aim < 12 nodes).
4. Node labels: 1-3 words.
5. DO NOT use 'note' syntax inside the graph.\
""",
        ),
        (
            "Detailed Map",
            _COMPREHENSIVE,
            """\
You are a diagram generator. From the provided context, output a detailed
Mermaid diagram that captures structure and relationships. Rules:

1. Output ONLY valid Mermaid syntax — no fences, no explanation.
2. Use flowchart TD or graph LR; group related concepts with subgraphs.
3. Label edges with the relationship they represent where it adds clarity.
4. Show hierarchies and dependencies present in the source material.
5. Keep labels readable. DO NOT use 'note' syntax inside the graph.\
""",
        ),
        (
            "Process Sequence",
            _SOCRATIC,
            """\
You are a diagram generator specializing in processes and flows. From the
provided context, output a Mermaid diagram emphasizing order and causality.
Rules:

1. Output ONLY valid Mermaid syntax — no fences, no explanation.
2. Prefer flowchart TD with clearly directed steps; use decision nodes
   (diamonds) for branches where the material describes conditions.
3. Make the start and end states explicit.
4. Label edges with conditions/triggers where relevant.
5. DO NOT use 'note' syntax inside the graph.\
""",
        ),
    ],
    "mindmap": [
        ("Default", "", MINDMAP_SYSTEM),
        (
            "Chronological Timeline",
            "Sequential",
            """\
You are a timeline generator. From the provided context, output a timeline-style text mind map. Rules:

1. Output a text tree using indentation and ├──/└── connectors.
2. Order nodes chronologically or sequentially based on the text.
3. Focus on events, steps, or stages in order.\
""",
        ),
        (
            "Skeleton",
            _CONCISE,
            """\
You are a mind map generator. From the provided context, output a compact
hierarchical concept tree. Rules:

1. Output a text mind map using indentation and ├──/└── connectors.
2. One main topic, up to 4 subtopics, 1-2 details each.
3. Entries are 2-4 words. Maximum 2 levels of depth.
4. Capture only the most important structure.\
""",
        ),
        (
            "Exhaustive Tree",
            _COMPREHENSIVE,
            """\
You are a mind map generator. From the provided context, output a thorough
hierarchical concept tree. Rules:

1. Output a text mind map using indentation and ├──/└── connectors.
2. Cover all key concepts and their sub-points; include cross-cutting themes.
3. Up to 3 levels of depth. Keep entries concise (2-6 words).
4. Order siblings logically (e.g. foundational → advanced).\
""",
        ),
        (
            "Question-Led",
            _SOCRATIC,
            """\
You are a mind map generator that organizes material around questions. From the
provided context, output a hierarchical tree. Rules:

1. Output a text mind map using indentation and ├──/└── connectors.
2. The main node is the central topic; first-level branches are the key
   questions the material answers (What / Why / How / When).
3. Under each question, list the answering concepts as leaves.
4. Maximum 3 levels. Keep entries concise.\
""",
        ),
    ],
    "study_notes": [
        ("Default", "", STUDY_NOTES_SYSTEM),
        (
            "Glossary Format",
            "Key terms",
            """\
You are a study notes generator. From the provided context, produce a glossary. Rules:

1. Extract all the key terms and concepts.
2. Format as a pure alphabetized list.
3. Each item should be "**Term**: Definition (1-2 sentences)."
4. Cite sources as [Source: title, p.page].\
""",
        ),
        (
            "Cheat Sheet",
            _CONCISE,
            """\
You are a study notes generator. From the provided context, produce a tight
cheat sheet. Rules:

1. Organize under short headings.
2. Pure bullet points — no prose paragraphs.
3. **Bold** every definition and key term.
4. Include formulas/relationships verbatim where present.
5. Keep under 250 words. Cite sources as [Source: title, p.page].\
""",
        ),
        (
            "Detailed Notes",
            _COMPREHENSIVE,
            """\
You are a study notes generator. From the provided context, produce thorough
revision notes. Rules:

1. Organize by topic/subtopic with clear headings.
2. Mix short explanatory sentences with bullet points.
3. **Bold** definitions; show formulas and worked relationships.
4. Add an "Examples" sub-point where the material supports it.
5. End with a "Key Takeaways" section of 4-6 bullets.
6. Cite sources as [Source: title, p.page].\
""",
        ),
        (
            "Active Recall",
            _SOCRATIC,
            """\
You are a study notes generator that builds notes for active recall. From the
provided context, produce notes interleaved with self-test prompts. Rules:

1. Organize by topic with clear headings and concise bullet points.
2. **Bold** key terms and definitions.
3. After each subtopic, add a "> Q:" line posing a recall question the student
   should be able to answer from the notes above.
4. End with a "Key Takeaways" section of 3-5 bullets.
5. Cite sources as [Source: title, p.page].\
""",
        ),
    ],
}


# ---------------------------------------------------------------------------
# Seeding + resolution
# ---------------------------------------------------------------------------

def seed_prompts() -> None:
    """Insert built-in prompts that don't yet exist (idempotent).

    Built-ins are matched by (category, name). The category's default is marked
    active if that category has no active prompt yet.
    """
    session = get_session()
    try:
        for category, entries in _BUILTINS.items():
            existing = {
                p.name
                for p in session.query(Prompt)
                .filter(Prompt.category == category, Prompt.built_in.is_(True))
                .all()
            }
            has_active = (
                session.query(Prompt).filter(Prompt.category == category, Prompt.active.is_(True)).count() > 0
            )
            for i, (name, style, body) in enumerate(entries):
                if name in existing:
                    continue
                session.add(
                    Prompt(
                        category=category,
                        name=name,
                        style=style,
                        body=body,
                        built_in=True,
                        # Activate the default (first entry) when nothing else is.
                        active=(i == 0 and not has_active),
                    )
                )
        session.commit()
    finally:
        session.close()


def active_body(category: str | None) -> str | None:
    """Return the prompt body to use for a category, or None for the default."""
    if not category or category not in _CATEGORY_KEYS:
        return None
    try:
        session = get_session()
        try:
            row = (
                session.query(Prompt)
                .filter(Prompt.category == category, Prompt.active.is_(True))
                .first()
            )
            return row.body if row else None
        finally:
            session.close()
    except Exception:  # noqa: BLE001 — never let prompt lookup break generation
        return None

```


## File: api/rag_service.py
```python
"""Service layer bridging the HTTP API and the existing RAG pipeline.

Reuses the LangGraph app (``get_rag_app``) for one-shot answers and the
individual nodes (``retrieve``/``verify``) plus a direct LLM stream for
token-by-token streaming. Also keeps the most recent retrieval trace in
memory so the frontend's Trace panel can inspect it.
"""

from __future__ import annotations

from typing import Any, Iterator

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.config import get_settings
from scholarcli.llm import get_llm
from scholarcli.rag.graph import get_rag_app
from scholarcli.rag.nodes.generator import _ROUTE_PROMPTS
from scholarcli.api.prompt_service import active_body
from scholarcli.rag.nodes.reranker import rerank
from scholarcli.rag.nodes.retriever import retrieve
from scholarcli.rag.nodes.router import route_query
from scholarcli.rag.nodes.verifier import verify
from scholarcli.rag.prompts import GENERATOR_SYSTEM, NOT_GROUNDED, QA_PROMPT_TEMPLATE
from scholarcli.rag.state import GraphState

# A small, stable palette so each course gets a consistent accent colour.
_PALETTE = ["#4f4d7a", "#3f6b6f", "#3f7a4e", "#a3771f", "#6b3f6f", "#3f5a7a"]

# Most recent retrieval, surfaced by GET /api/trace/last.
_last_trace: dict[str, Any] = {}


def course_code(name: str) -> str:
    """Derive a short course code (e.g. 'Machine Learning' -> 'ML')."""
    words = [w for w in name.split() if w]
    if not words:
        return "??"
    if len(words) == 1:
        return words[0][:2].upper()
    return "".join(w[0] for w in words[:3]).upper()


def course_color(course_id: int) -> str:
    return _PALETTE[course_id % len(_PALETTE)]


def _similarity(distance: float | None) -> float:
    """Map LanceDB cosine distance (lower = closer) to a 0..1 similarity."""
    if distance is None:
        return 0.0
    return round(max(0.0, min(1.0, 1.0 - distance)), 4)


def serialize_chunks(retrieved: list[dict]) -> list[dict]:
    """Turn raw LanceDB rows into Source dicts for the frontend."""
    sources: list[dict] = []
    for ch in retrieved:
        text = ch.get("text", "")
        snippet = text.strip().replace("\n", " ")
        if len(snippet) > 320:
            snippet = snippet[:317] + "…"
        sources.append(
            {
                "id": str(ch.get("id", "")),
                "title": ch.get("title", "Untitled"),
                "page": int(ch.get("page") or 0),
                "course": ch.get("course", ""),
                "snippet": snippet,
                "similarity": _similarity(ch.get("_distance")),
                "sourceType": ch.get("source_type", "text") or "text",
                "imageUrl": ch.get("image_url", "") or "",
            }
        )
    return sources


def _confidence(retrieved: list[dict], grounded: bool) -> float | None:
    if not retrieved or not grounded:
        return None
    return max(_similarity(ch.get("_distance")) for ch in retrieved)


def _record_trace(query: str, route: str | None, retrieved: list[dict], grounded: bool) -> None:
    s = get_settings()
    sims = [_similarity(ch.get("_distance")) for ch in retrieved]
    chunks = [
        {
            "id": str(ch.get("id", ""))[:12] or f"chk_{i}",
            "source": ch.get("title", "Untitled"),
            "page": int(ch.get("page") or 0),
            "similarity": _similarity(ch.get("_distance")),
            "tokens": max(1, len(ch.get("text", "")) // 4),
            "text": ch.get("text", ""),
        }
        for i, ch in enumerate(retrieved)
    ]
    _last_trace.clear()
    _last_trace.update(
        {
            "query": query,
            "route": route,
            "grounded": grounded,
            "embeddingModel": s.models.embedding,
            "vectorStore": "LanceDB",
            "topK": s.retrieval.top_k,
            "documents": len({ch.get("document_id") for ch in retrieved}),
            "retrievedChunks": len(retrieved),
            "avgSimilarity": round(sum(sims) / len(sims), 4) if sims else 0.0,
            "chunks": chunks,
        }
    )


def get_last_trace() -> dict[str, Any]:
    return dict(_last_trace)


_STRICT_NOT_FOUND = (
    "I couldn't find sufficient information in your ingested documents to answer this question. "
    "Try switching to AI Fallback mode if you want the model to use its own knowledge."
)

_SOCRATIC_PREFIX = (
    "You are a Socratic tutor. Do NOT give the direct answer. "
    "Instead, guide the student step-by-step using probing questions and short hints. "
    "Only reveal the answer if the user explicitly says they are stuck or asks you to. "
    "Acknowledge what the student says before asking the next guiding question.\n\n"
)


def run_ask(
    question: str,
    course: str | None = None,
    document: str | None = None,
    route: str | None = None,
    search_query: str | None = None,
    rag_mode: str = "fallback",
    socratic: bool = False,
) -> dict:
    """One-shot RAG answer. Returns answer, sources, confidence, grounded, route."""
    state: GraphState = {"query": question, "course": course, "document": document}
    if search_query:
        state["search_query"] = search_query
    if route:
        state["route"] = route
    result = get_rag_app().invoke(state)

    retrieved = result.get("retrieved", []) or []
    grounded = bool(result.get("grounded", False))
    used_route = result.get("route", route)
    _record_trace(question, used_route, retrieved, grounded)
    confidence = _confidence(retrieved, grounded)
    from scholarcli.api import trace_service
    trace_service.log_weak_generation(question, retrieved, grounded, confidence)

    # Strict mode: refuse to answer if not grounded in documents.
    if rag_mode == "strict" and not grounded:
        return {
            "content": _STRICT_NOT_FOUND,
            "sources": [],
            "retrieved": [],
            "confidence": None,
            "grounded": False,
            "route": used_route,
        }

    return {
        "content": result.get("answer", "(no answer)"),
        "sources": serialize_chunks(retrieved),
        "retrieved": retrieved,  # raw chunks (text/_distance/document_id) for quality scoring
        "confidence": _confidence(retrieved, grounded),
        "grounded": grounded,
        "route": used_route,
    }


def _build_generation_prompt(state: GraphState, socratic: bool = False) -> tuple[str, str]:
    """Mirror generator.generate's prompt assembly. Returns (system, user)."""
    route = state.get("route", "quick_qa")
    chunks = state["retrieved"]

    context_parts: list[str] = []
    citations: list[str] = []
    seen: set[str] = set()
    for ch in chunks:
        st = ch.get("source_type", "text")
        kind = "" if st in ("text", None) else f", {st}"
        context_parts.append(f"[Source: {ch['title']}, p.{ch['page']}{kind}]\n{ch['text']}")
        cite = f"[{ch['title']}, p.{ch['page']}]"
        if cite not in seen:
            seen.add(cite)
            citations.append(cite)

    context = "\n\n---\n\n".join(context_parts)
    user = QA_PROMPT_TEMPLATE.format(context=context, query=state["query"])
    user = f"Available sources: {', '.join(citations)}\n\n{user}"
    system = active_body(route) or _ROUTE_PROMPTS.get(route, GENERATOR_SYSTEM)
    if socratic:
        system = _SOCRATIC_PREFIX + system
    return system, user


def stream_ask(
    question: str,
    course: str | None = None,
    document: str | None = None,
    route: str | None = None,
    search_query: str | None = None,
    rag_mode: str = "fallback",
    socratic: bool = False,
) -> Iterator[dict]:
    """Yield streaming events for the Ask endpoint.

    Event dicts:
      {"type": "token", "value": str}
      {"type": "done", "sources": [...], "confidence": float|None, "grounded": bool, "route": str}
    """
    state: GraphState = {"query": question, "course": course, "document": document}
    if search_query:
        state["search_query"] = search_query
    if route:
        state["route"] = route

    # Router (LLM classify unless route forced) → retrieve → rerank → verify.
    state = route_query(state)
    state = retrieve(state)
    state = rerank(state)
    state = verify(state)

    retrieved = state.get("retrieved", []) or []
    grounded = bool(state.get("grounded", False))
    used_route = state.get("route", route)
    _record_trace(question, used_route, retrieved, grounded)

    sources = serialize_chunks(retrieved)
    confidence = _confidence(retrieved, grounded)
    from scholarcli.api import trace_service
    trace_service.log_weak_generation(question, retrieved, grounded, confidence)

    if not grounded:
        # Strict mode: refuse to answer from AI knowledge.
        not_found_msg = _STRICT_NOT_FOUND if rag_mode == "strict" else NOT_GROUNDED
        yield {"type": "token", "value": not_found_msg}
        yield {
            "type": "done",
            "sources": [],
            "retrieved": retrieved,
            "confidence": None,
            "grounded": False,
            "route": used_route,
        }
        return

    system, user = _build_generation_prompt(state, socratic=socratic)
    llm = get_llm(used_route or "quick_qa")
    for chunk in llm.stream(
        [SystemMessage(content=system), HumanMessage(content=user)]
    ):
        piece = getattr(chunk, "content", "") or ""
        if piece:
            yield {"type": "token", "value": piece}

    yield {
        "type": "done",
        "sources": sources,
        "retrieved": retrieved,
        "confidence": confidence,
        "grounded": True,
        "route": used_route,
    }

```


## File: api/schemas.py
```python
"""Pydantic request/response models.

Field names use the exact camelCase keys the React frontend expects
(``sizeKb``, ``addedAt``) so responses serialize without extra aliasing.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel


# ---------------------------------------------------------------------------
# Artifact quality
# ---------------------------------------------------------------------------

class QualityScore(BaseModel):
    """Objective quality estimate for a generated artifact (see api/quality.py).

    Sub-scores are 0..100 ints; dimensions that don't apply to an artifact are
    left ``None`` and omitted from the response.
    """

    overall: int
    coverage: int | None = None
    grounding: int | None = None
    structure: int | None = None
    balance: int | None = None
    diversity: int | None = None
    redundancy: int | None = None
    sourceChunks: int = 0
    documents: int = 0
    notes: list[str] = []


# ---------------------------------------------------------------------------
# Sources / Ask
# ---------------------------------------------------------------------------

class SourceOut(BaseModel):
    id: str
    title: str
    page: int
    course: str
    snippet: str
    similarity: float
    sourceType: str = "text"  # text | ocr | table | image | diagram
    imageUrl: str = ""


class AskRequest(BaseModel):
    question: str
    course: str | None = None
    document: str | None = None
    route: str | None = None  # force a study mode; None = let the router decide
    sessionId: str | None = None  # persist this turn into a chat session
    rag_mode: str = "fallback"  # "strict" = only ingested docs; "fallback" = AI fills gaps
    socratic: bool = False  # guide user step-by-step instead of direct answer


# ---------------------------------------------------------------------------
# Chat history (cross-session persistence)
# ---------------------------------------------------------------------------

class ChatMessageOut(BaseModel):
    id: str
    role: Literal["user", "assistant"]
    content: str
    sources: list = []
    createdAt: str = ""


class ChatSessionMeta(BaseModel):
    id: str
    title: str
    course: str = ""
    messageCount: int = 0
    updatedAt: str = ""


class ChatSessionOut(ChatSessionMeta):
    messages: list[ChatMessageOut] = []


class ChatSessionCreate(BaseModel):
    course: str | None = None
    title: str | None = None


class AskResponse(BaseModel):
    id: str
    role: Literal["assistant"] = "assistant"
    content: str
    sources: list[SourceOut] = []
    confidence: float | None = None
    grounded: bool = False
    route: str | None = None


# ---------------------------------------------------------------------------
# Courses
# ---------------------------------------------------------------------------

class CourseOut(BaseModel):
    id: str
    name: str
    code: str
    color: str
    documents: int
    flashcards: int
    progress: int


class CourseCreate(BaseModel):
    name: str


# ---------------------------------------------------------------------------
# Documents
# ---------------------------------------------------------------------------

class DocumentOut(BaseModel):
    id: str
    title: str
    type: str  # pdf | docx | markdown | text
    course: str
    sizeKb: int
    pages: int
    addedAt: str
    status: str  # indexed | processing | failed


class DocumentPatch(BaseModel):
    course: str | None = None


# ---------------------------------------------------------------------------
# Background jobs
# ---------------------------------------------------------------------------

class JobOut(BaseModel):
    id: str
    kind: str
    status: str  # queued | running | done | failed
    label: str = ""
    result: dict | None = None
    error: str | None = None
    createdAt: str = ""
    updatedAt: str = ""


# ---------------------------------------------------------------------------
# Trace
# ---------------------------------------------------------------------------

class TraceChunk(BaseModel):
    id: str
    source: str
    page: int
    similarity: float
    tokens: int
    text: str


class TraceOut(BaseModel):
    query: str | None = None
    route: str | None = None
    grounded: bool = False
    embeddingModel: str = ""
    vectorStore: str = "LanceDB"
    topK: int = 0
    documents: int = 0
    retrievedChunks: int = 0
    avgSimilarity: float = 0.0
    chunks: list[TraceChunk] = []


class TraceSourceStat(BaseModel):
    source: str
    weakCount: int = 0
    downCount: int = 0
    total: int = 0
    avgSimilarity: float = 0.0


class TraceAnalyticsOut(BaseModel):
    totalFlags: int = 0
    sources: list[TraceSourceStat] = []


class TraceFeedbackRequest(BaseModel):
    chunkId: str = ""
    source: str
    query: str = ""
    similarity: float = 0.0


# ---------------------------------------------------------------------------
# Settings / Models
# ---------------------------------------------------------------------------

class SettingsOut(BaseModel):
    fastModel: str
    reasoningModel: str
    embeddingModel: str
    visionModel: str
    temperature: float
    topK: int
    similarityThreshold: float
    streaming: bool
    citationsInline: bool
    accent: str
    density: str
    industry: str = ""
    role: str = ""
    goals: str = ""
    interests: str = ""
    learningPreferences: str = ""
    ragMode: str = "fallback"  # "strict" | "fallback"


class SettingsPatch(BaseModel):
    fastModel: str | None = None
    reasoningModel: str | None = None
    embeddingModel: str | None = None
    visionModel: str | None = None
    temperature: float | None = None
    topK: int | None = None
    similarityThreshold: float | None = None
    streaming: bool | None = None
    citationsInline: bool | None = None
    accent: str | None = None
    density: str | None = None
    industry: str | None = None
    role: str | None = None
    goals: str | None = None
    interests: str | None = None
    learningPreferences: str | None = None
    ragMode: str | None = None


class ModelsList(BaseModel):
    fastModels: list[str]
    reasoningModels: list[str]
    embeddingModels: list[str]
    visionModels: list[str]


# ---------------------------------------------------------------------------
# Generative study features
# ---------------------------------------------------------------------------

class GenerateFlashcardsRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None
    count: int = 8
    rag_mode: str = "fallback"  # "strict" | "fallback"


class FlashcardOut(BaseModel):
    id: str
    type: Literal["basic", "cloze"] = "basic"
    front: str
    back: str
    deck: str
    due: str = "Today"
    ease: Literal["new", "learning", "mastered"] = "new"


class FlashcardSet(BaseModel):
    deck: str
    course: str | None = None
    grounded: bool = True
    cards: list[FlashcardOut] = []
    quality: QualityScore | None = None


class GenerateQuizRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None
    difficulty: Literal["Easy", "Medium", "Hard"] = "Medium"
    rag_mode: str = "fallback"


class QuizQuestionOut(BaseModel):
    id: str
    type: Literal["mcq", "truefalse", "short"] = "mcq"
    prompt: str
    options: list[str] | None = None
    answer: str
    explanation: str = ""


class QuizOut(BaseModel):
    id: str
    title: str
    course: str
    difficulty: str
    grounded: bool = True
    questions: list[QuizQuestionOut] = []
    quality: QualityScore | None = None
    session_answers: dict | None = None
    session_current_question: int | None = None
    session_started_at: str | None = None


class GenerateDiagramRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None
    type: str | None = None  # flowchart | decision_tree | concept_map
    rag_mode: str = "fallback"


class DiagramOut(BaseModel):
    id: str
    title: str
    course: str
    kind: str
    mermaid: str
    grounded: bool = True
    quality: QualityScore | None = None


class GenerateMindmapRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None
    rag_mode: str = "fallback"


class MindmapOut(BaseModel):
    id: str
    title: str
    course: str
    text: str
    grounded: bool = True
    quality: QualityScore | None = None


class GenerateRevisionRequest(BaseModel):
    topic: str | None = None
    course: str | None = None
    document: str | None = None
    format: Literal["notes", "concepts", "formulas", "summary"] = "notes"
    rag_mode: str = "fallback"


class RevisionOut(BaseModel):
    title: str
    markdown: str
    grounded: bool = True
    quality: QualityScore | None = None


class SaveRevisionRequest(BaseModel):
    title: str
    topic: str
    course: str | None = None
    format: Literal["notes", "concepts", "formulas", "summary"] = "notes"
    content: str
    quality: QualityScore | None = None


class SavedRevisionOut(BaseModel):
    id: str
    title: str
    topic: str
    course: str
    format: str
    content: str
    quality: QualityScore | None = None
    timestamp: float


class SearchResultOut(BaseModel):
    id: str
    group: str
    title: str
    snippet: str
    course: str


# ---------------------------------------------------------------------------
# Persistence: decks / cards / quizzes
# ---------------------------------------------------------------------------

class DeckOut(BaseModel):
    id: str
    name: str
    course: str
    color: str
    cards: int
    mastered: int
    quality: QualityScore | None = None


class SaveDeckRequest(BaseModel):
    name: str
    course: str | None = None
    color: str | None = None
    cards: list[FlashcardOut] = []
    quality: QualityScore | None = None


class CardReview(BaseModel):
    ease: Literal["new", "learning", "mastered"]
    due: str | None = None


class SaveQuizRequest(BaseModel):
    title: str
    course: str | None = None
    difficulty: str = "Medium"
    questions: list[QuizQuestionOut] = []
    quality: QualityScore | None = None


class QuizSessionPatch(BaseModel):
    session_answers: dict
    session_current_question: int


# ---------------------------------------------------------------------------
# Notebooks
# ---------------------------------------------------------------------------

class NotebookMetaOut(BaseModel):
    id: str
    name: str
    course: str
    color: str
    notes: int
    lastEdited: str


class NotebookOut(BaseModel):
    id: str
    title: str
    subtitle: str
    course: str
    color: str
    blocks: list = []
    tags: list[str] = []
    updated: str
    is_draft: bool = False


class CollectionOut(BaseModel):
    id: str
    name: str
    count: int


class NotebookCreate(BaseModel):
    title: str
    course: str | None = None
    subtitle: str | None = None
    color: str | None = None
    tags: list[str] | None = None


class NotebookPatch(BaseModel):
    title: str | None = None
    subtitle: str | None = None
    blocks: list | None = None
    color: str | None = None
    tags: list[str] | None = None
    is_draft: bool | None = None


class NotebookAssistRequest(BaseModel):
    action: Literal["explain", "summarize", "improve"] = "explain"
    text: str
    course: str | None = None


class NotebookAssistResponse(BaseModel):
    text: str


# ---------------------------------------------------------------------------
# Reading
# ---------------------------------------------------------------------------

class ReadingSectionOut(BaseModel):
    id: str
    number: str
    title: str
    paragraphs: list[str]


class ReadingDocOut(BaseModel):
    id: str
    title: str
    author: str = ""
    kind: str = ""
    pages: int = 0
    sections: list[ReadingSectionOut] = []
    highlights: list[dict] = []
    bookmarks: list[dict] = []
    progress: float = 0.0


class HighlightCreate(BaseModel):
    text: str
    section: str = ""


class BookmarkCreate(BaseModel):
    section: str
    note: str = ""


class LensResponse(BaseModel):
    level: str
    text: str


# ---------------------------------------------------------------------------
# Exam
# ---------------------------------------------------------------------------

class ExamGenerateRequest(BaseModel):
    topic: str | None = None
    course: str | None = None
    document: str | None = None
    difficulty: Literal["Easy", "Medium", "Hard"] = "Medium"
    count: int = 8
    types: list[Literal["mcq", "truefalse", "short", "long"]] = ["mcq"]
    # When set, bias the generated exam toward the PYQ topic/difficulty mix of
    # this course (and record per-topic accuracy on submit).
    pyqCourse: str | None = None
    # Server-enforced time limit in minutes; 0 = untimed.
    durationMinutes: int = 0


class ExamQuestionOut(BaseModel):
    id: str
    type: Literal["mcq", "truefalse", "short", "long"] = "mcq"
    topic: str
    difficulty: str
    prompt: str
    options: list[str] | None = None
    answer: str | None = None


class ExamSessionOut(BaseModel):
    sessionId: str
    questions: list[ExamQuestionOut]
    grounded: bool = True
    durationMinutes: int = 0
    remainingSeconds: int | None = None  # null = untimed


class ExamStatusOut(BaseModel):
    sessionId: str
    submitted: bool = False
    expired: bool = False
    durationMinutes: int = 0
    remainingSeconds: int | None = None  # null = untimed


class ExamSubmitRequest(BaseModel):
    answers: dict[str, str] = {}
    timeSpent: int | None = None


class ExamResultOut(BaseModel):
    score: int
    correct: float  # fractional with partial credit (e.g. 2.5 out of 5)
    total: int
    topicPerformance: list[dict] = []
    difficultyAnalysis: list[dict] = []
    review: list[dict] = []  # each item includes score: int (0-100) for partial credit
    recommendedRevisions: list[str] = []
    elapsedSeconds: int | None = None
    timedOut: bool = False


# ---------------------------------------------------------------------------
# Knowledge graph
# ---------------------------------------------------------------------------

class KGBuildRequest(BaseModel):
    course: str | None = None
    max_documents: int = 8


class KGBuildResponse(BaseModel):
    concepts: int
    edges: int


class KGNode(BaseModel):
    id: str
    label: str
    description: str
    size: Literal["large", "medium", "small"]
    refCount: int
    sourceCount: int
    cluster: str


class KGEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str


class KGGraphOut(BaseModel):
    nodes: list[KGNode] = []
    edges: list[KGEdge] = []


class ConceptMergeRequest(BaseModel):
    keepId: int
    dropId: int


class ConceptInspectorOut(BaseModel):
    id: str
    name: str
    confidence: float
    refCount: int
    sourceCount: int
    description: str
    definition: str
    aiSummary: str
    relatedConcepts: list[str] = []
    referencedIn: dict = {}
    citations: list[dict] = []


# ---------------------------------------------------------------------------
# Differences
# ---------------------------------------------------------------------------

class GenerateDifferenceRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None


class DifferenceOut(BaseModel):
    title: str
    content: str
    grounded: bool = True
    quality: QualityScore | None = None


class SaveDifferenceRequest(BaseModel):
    title: str
    content: str
    course: str | None = None
    quality: QualityScore | None = None


class DifferenceTableItem(BaseModel):
    id: int
    title: str
    course: str
    content: str
    createdAt: str
    quality: QualityScore | None = None


# ---------------------------------------------------------------------------
# Teach Me — learning overview + saved packages
# ---------------------------------------------------------------------------

class TeachRequest(BaseModel):
    topic: str
    depth: Literal["quick", "standard", "deep"] = "standard"
    course: str | None = None
    document: str | None = None


class OverviewOut(BaseModel):
    title: str
    markdown: str
    grounded: bool = True
    sources: list[SourceOut] = []


class PackageIn(BaseModel):
    title: str
    course: str | None = None
    depth: str = "standard"
    overview: dict = {}
    artifacts: dict = {}
    sources: list = []


class PackageMeta(BaseModel):
    id: str
    title: str
    course: str
    depth: str
    artifactCount: int
    createdAt: str


class PackageOut(BaseModel):
    id: str
    title: str
    course: str
    depth: str
    overview: dict = {}
    artifacts: dict = {}
    sources: list = []
    createdAt: str
    updatedAt: str


# ---------------------------------------------------------------------------
# PYQ analysis
# ---------------------------------------------------------------------------

class PyqPaperOut(BaseModel):
    id: int
    course: str
    title: str
    year: int | None = None
    questionCount: int
    createdAt: str


class PyqUploadResponse(BaseModel):
    paper: PyqPaperOut
    extracted: int


class PyqQuestionOut(BaseModel):
    id: int
    text: str
    topic: str
    subtopics: list[str] = []
    difficulty: str
    type: str
    marks: int | None = None
    year: int | None = None


class PyqQuestionPatch(BaseModel):
    text: str | None = None
    topic: str | None = None
    subtopics: list[str] | None = None
    difficulty: Literal["Easy", "Medium", "Hard"] | None = None
    type: str | None = None  # maps to PYQQuestion.qtype
    marks: int | None = None
    year: int | None = None


class PyqAnalysisOut(BaseModel):
    course: str
    papers: int
    totalQuestions: int
    yearsLabel: str = ""
    summary: dict = {}
    topicFrequency: list[dict] = []
    patterns: list[dict] = []
    difficulty: list[dict] = []
    marksDistribution: list[dict] = []
    yearTrends: list[dict] = []
    revisionRisk: list[dict] = []
    readiness: dict = {}


class PyqDifferenceSuggestion(BaseModel):
    a: str
    b: str
    topic: str
    count: int
    example: str


# ---------------------------------------------------------------------------
# Cross-Artifact Consistency Engine
# ---------------------------------------------------------------------------

class ConsistencyRequest(BaseModel):
    """Analyze in-memory Teach Me Package artifacts against their source."""

    sourceText: str
    artifacts: dict[str, dict] = {}  # {notes:{markdown}, flashcards:{cards}, quiz:{questions}, ...}


class ConsistencyLibraryRequest(BaseModel):
    """Analyze saved artifacts for a course (optionally a single document)."""

    course: str
    document: str | None = None  # document TITLE, optional


class ArtifactCoverage(BaseModel):
    artifact: str
    coverage: float
    covered: list[str] = []
    weak: list[str] = []
    missing: list[str] = []


class ConsistencySuggestion(BaseModel):
    artifactType: str  # notes | mindmap | diagram | difference
    label: str
    issue: str
    concepts: list[str] = []


class ConsistencyReport(BaseModel):
    canonicalConcepts: list[str] = []
    overallCoverage: float = 0.0
    artifacts: list[ArtifactCoverage] = []
    underrepresented: list[str] = []
    overrepresented: list[str] = []
    recommendations: list[str] = []
    suggestions: list[ConsistencySuggestion] = []


class ConsistencyApplyRequest(BaseModel):
    course: str
    artifactType: str  # notes | mindmap | diagram | difference
    concepts: list[str] = []


class ConsistencyApplyResponse(BaseModel):
    applied: bool
    artifactType: str
    preview: str = ""
    message: str = ""

```


## File: api/routers/__init__.py
```python
"""API routers."""

```


## File: api/routers/courses.py
```python
"""Course endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from scholarcli.api.rag_service import course_code, course_color
from scholarcli.api.schemas import CourseCreate, CourseOut
from scholarcli.storage import get_session
from scholarcli.storage.models import Course

router = APIRouter(prefix="/api/courses", tags=["courses"])


def _serialize(course: Course) -> CourseOut:
    return CourseOut(
        id=str(course.id),
        name=course.name,
        code=course_code(course.name),
        color=course_color(course.id),
        documents=len(course.documents),
        flashcards=0,
        progress=0,
    )


@router.get("", response_model=list[CourseOut])
def list_courses() -> list[CourseOut]:
    session = get_session()
    try:
        rows = session.query(Course).order_by(Course.name).all()
        return [_serialize(c) for c in rows]
    finally:
        session.close()


@router.post("", response_model=CourseOut, status_code=201)
def create_course(payload: CourseCreate) -> CourseOut:
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Course name is required")
    session = get_session()
    try:
        existing = session.query(Course).filter(Course.name == name).first()
        if existing:
            return _serialize(existing)
        course = Course(name=name)
        session.add(course)
        session.commit()
        session.refresh(course)
        return _serialize(course)
    finally:
        session.close()

@router.put("/{course_id}", response_model=CourseOut)
def update_course(course_id: int, payload: CourseCreate) -> CourseOut:
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Course name is required")
    session = get_session()
    try:
        course = session.query(Course).get(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        existing = session.query(Course).filter(Course.name == name).first()
        if existing and existing.id != course_id:
            raise HTTPException(status_code=400, detail="Course with this name already exists")
        course.name = name
        session.commit()
        session.refresh(course)
        return _serialize(course)
    finally:
        session.close()

@router.delete("/{course_id}", status_code=204)
def delete_course(course_id: int) -> None:
    session = get_session()
    try:
        course = session.query(Course).get(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        session.delete(course)
        session.commit()
    finally:
        session.close()

```


## File: api/routers/search.py
```python
"""Global semantic search endpoint.

v1 searches indexed document chunks (vector search). Flashcards/quizzes/etc.
will join in once those are persisted (see persistence task).
"""

from __future__ import annotations

import scholarcli.llm
from fastapi import APIRouter

from scholarcli.api.rag_service import serialize_chunks
from scholarcli.api.schemas import SearchResultOut
from scholarcli.storage.vectors import search

router = APIRouter(prefix="/api", tags=["search"])


@router.get("/search", response_model=list[SearchResultOut])
def global_search(q: str, filter: str = "all", limit: int = 10) -> list[SearchResultOut]:
    query = q.strip()
    if not query:
        return []

    results: list[SearchResultOut] = []
    if filter in ("all", "documents"):
        emb = scholarcli.llm.get_embeddings()
        vector = emb.embed_query(query)
        for s in serialize_chunks(search(vector, top_k=max(1, min(limit, 20)))):
            results.append(
                SearchResultOut(
                    id=s["id"],
                    group="Documents",
                    title=s["title"],
                    snippet=s["snippet"],
                    course=s["course"],
                )
            )
    return results

```


## File: api/routers/dashboard.py
```python
"""Dashboard aggregate + activity feed (derived from real Activity rows)."""

from __future__ import annotations

from fastapi import APIRouter

from scholarcli.api import activity_service

router = APIRouter(prefix="/api", tags=["dashboard"])


@router.get("/dashboard")
def get_dashboard() -> dict:
    return activity_service.dashboard()


@router.get("/activity")
def get_activity() -> list:
    return activity_service.dashboard()["activity"]

```


## File: api/routers/onboarding.py
```python
"""Onboarding analysis endpoint — returns library stats and heuristic topic/concept extraction."""

from __future__ import annotations

from fastapi import APIRouter

from scholarcli.storage import get_session
from scholarcli.storage.models import Document

router = APIRouter(prefix="/api", tags=["onboarding"])

_STOP_WORDS = {
    "the", "and", "for", "with", "this", "that", "from", "your", "have",
    "into", "will", "about", "more", "also", "been", "each", "when", "they",
    "then", "some", "such", "their", "there", "these", "which", "where",
    "other", "using", "based", "used", "over", "under", "after", "before",
}


def _extract_concepts(titles: list[str]) -> list[str]:
    seen: set[str] = set()
    concepts: list[str] = []
    for title in titles:
        cleaned = title.replace("-", " ").replace("_", " ")
        for part in cleaned.split():
            word = part.strip(".,()[]")
            if len(word) > 4 and word.lower() not in _STOP_WORDS and word.isalpha():
                key = word.lower()
                if key not in seen:
                    seen.add(key)
                    concepts.append(word)
    return concepts[:12]


@router.get("/onboarding/analysis")
def library_analysis() -> dict:
    session = get_session()
    try:
        docs = session.query(Document).filter(Document.status == "indexed").all()
        total_pages = sum(d.pages or 0 for d in docs)

        # Topics: unique document titles (without extension)
        seen_topics: set[str] = set()
        topics: list[str] = []
        for d in docs:
            topic = d.title.rsplit(".", 1)[0].strip()
            if topic and topic.lower() not in seen_topics:
                seen_topics.add(topic.lower())
                topics.append(topic)

        concepts = _extract_concepts([d.title for d in docs])

        return {
            "documents": len(docs),
            "pages": total_pages,
            "topics": topics[:8],
            "concepts": concepts[:10],
            "sources": len(docs),
        }
    finally:
        session.close()

```


## File: api/routers/teach.py
```python
"""Teach Me — a one-topic learning workspace.

The ``/api/teach/overview`` endpoint generates the learning overview (and
returns the retrieved sources that drive the package's Sources view). The
remaining artifacts reuse the existing generative endpoints (flashcards, quiz,
diagram, mind map, revision notes, differences). ``/api/teach/packages`` saves
and restores a whole generated workspace as a single JSON snapshot.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from scholarcli.api.activity_service import record_activity
from scholarcli.api.rag_service import run_ask
from scholarcli.api.schemas import (
    OverviewOut,
    PackageIn,
    PackageMeta,
    PackageOut,
    SourceOut,
    TeachRequest,
)
from scholarcli.storage import get_session
from scholarcli.storage.models import LearningPackage

router = APIRouter(prefix="/api/teach", tags=["teach"])

_DEPTH_HINT = {
    "quick": "Keep it brief — a short, high-level overview.",
    "standard": "Provide a balanced, exam-ready overview.",
    "deep": "Go in depth with thorough explanations and nuance.",
}


@router.post("/overview", response_model=OverviewOut)
async def generate_overview(req: TeachRequest) -> OverviewOut:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    hint = _DEPTH_HINT.get(req.depth, _DEPTH_HINT["standard"])
    query = (
        f"Write a learning overview for: {topic}. {hint} "
        "Use these markdown sections with '## ' headings, in this order: "
        "Definition, Importance, Prerequisites, Related Topics, "
        "Estimated Study Time, Difficulty."
    )
    result = await run_in_threadpool(run_ask, query, req.course, req.document, "study_notes", topic)
    record_activity("revision", f"Teach overview: {topic}", "")
    return OverviewOut(
        title=topic,
        markdown=result["content"],
        grounded=result["grounded"],
        sources=[SourceOut(**s) for s in result["sources"]],
    )


# ---------------------------------------------------------------------------
# Saved packages
# ---------------------------------------------------------------------------

def _artifact_count(pkg: LearningPackage) -> int:
    arts = pkg.artifacts or {}
    count = sum(1 for v in arts.values() if v)
    if pkg.overview:
        count += 1
    return count


def _meta(pkg: LearningPackage) -> PackageMeta:
    return PackageMeta(
        id=str(pkg.id),
        title=pkg.title,
        course=pkg.course,
        depth=pkg.depth,
        artifactCount=_artifact_count(pkg),
        createdAt=pkg.created_at.isoformat(),
    )


def _full(pkg: LearningPackage) -> PackageOut:
    return PackageOut(
        id=str(pkg.id),
        title=pkg.title,
        course=pkg.course,
        depth=pkg.depth,
        overview=pkg.overview or {},
        artifacts=pkg.artifacts or {},
        sources=pkg.sources or [],
        createdAt=pkg.created_at.isoformat(),
        updatedAt=pkg.updated_at.isoformat(),
    )


@router.get("/packages", response_model=list[PackageMeta])
def list_packages() -> list[PackageMeta]:
    session = get_session()
    try:
        rows = (
            session.query(LearningPackage)
            .order_by(LearningPackage.created_at.desc())
            .all()
        )
        return [_meta(p) for p in rows]
    finally:
        session.close()


@router.get("/packages/{package_id}", response_model=PackageOut)
def get_package(package_id: int) -> PackageOut:
    session = get_session()
    try:
        pkg = session.get(LearningPackage, package_id)
        if not pkg:
            raise HTTPException(status_code=404, detail="Package not found")
        return _full(pkg)
    finally:
        session.close()


@router.post("/packages", response_model=PackageOut, status_code=201)
def save_package(payload: PackageIn) -> PackageOut:
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="title is required")
    session = get_session()
    try:
        pkg = LearningPackage(
            title=title,
            course=payload.course or "",
            depth=payload.depth,
            overview=payload.overview,
            artifacts=payload.artifacts,
            sources=payload.sources,
        )
        session.add(pkg)
        session.commit()
        session.refresh(pkg)
        record_activity("note", f"Saved learning package: {title}", pkg.course)
        return _full(pkg)
    finally:
        session.close()


@router.delete("/packages/{package_id}", status_code=204)
def delete_package(package_id: int) -> None:
    session = get_session()
    try:
        pkg = session.get(LearningPackage, package_id)
        if not pkg:
            raise HTTPException(status_code=404, detail="Package not found")
        session.delete(pkg)
        session.commit()
    finally:
        session.close()

```


## File: api/routers/settings.py
```python
"""User-facing settings + available-model listing.

UI settings are persisted to ``data/ui_settings.json`` (separate from the
TOML app config). Model lists come from the live Ollama server when reachable,
falling back to the configured tags.
"""

from __future__ import annotations

import json

import httpx
from fastapi import APIRouter

from scholarcli.api.schemas import ModelsList, SettingsOut, SettingsPatch
from scholarcli.config import get_settings

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

```


## File: api/routers/reading.py
```python
"""Reading mode — serve a document's text as sections, plus highlights,
bookmarks and adaptive-difficulty ("lens") explanations.

Sections are reconstructed from the chunks already indexed in LanceDB
(grouped by heading), so no re-parsing of the source file is needed.
"""

from __future__ import annotations

from langchain_core.messages import HumanMessage, SystemMessage

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from scholarcli.api.schemas import (
    BookmarkCreate,
    HighlightCreate,
    LensResponse,
    ReadingDocOut,
    ReadingSectionOut,
)
from scholarcli.llm import get_llm
from scholarcli.storage import get_session
from scholarcli.storage.models import Document, ReadingState
from scholarcli.storage.vectors import get_document_chunks

router = APIRouter(prefix="/api/reading", tags=["reading"])

_LENS_SYSTEM = {
    "Beginner": "Explain the passage to a beginner using a simple analogy and plain language. 2-3 sentences.",
    "Intermediate": "Explain the passage to an intermediate student precisely but accessibly. 2-3 sentences.",
    "Expert": "Explain the passage to an expert, including formal notation and nuance where relevant. 2-3 sentences.",
}


def _build_sections(document_id: int, fallback_title: str) -> list[ReadingSectionOut]:
    chunks = get_document_chunks(document_id)
    sections: list[ReadingSectionOut] = []
    current_heading: str | None = None
    paragraphs: list[str] = []
    number = 0

    def flush(heading: str | None) -> None:
        nonlocal number, paragraphs
        if paragraphs:
            number += 1
            sections.append(
                ReadingSectionOut(
                    id=f"sec{number}",
                    number=str(number),
                    title=(heading or fallback_title or "Section").strip()[:120],
                    paragraphs=paragraphs,
                )
            )
        paragraphs = []

    for ch in chunks:
        # Image/diagram chunks exist for retrieval; the image itself already
        # renders inline (with its description as caption) inside the text
        # chunk, so skip the standalone description here to avoid duplicates.
        if ch.get("source_type") in ("image", "diagram"):
            continue
        heading = (ch.get("heading") or "").strip()
        if current_heading is None:
            current_heading = heading
        if heading != current_heading:
            flush(current_heading)
            current_heading = heading
        paragraphs.append(ch.get("text", ""))
    flush(current_heading)
    return sections


def _get_state(session, document_id: int) -> ReadingState:
    state = (
        session.query(ReadingState)
        .filter(ReadingState.document_id == document_id)
        .first()
    )
    if state is None:
        state = ReadingState(document_id=document_id, highlights=[], bookmarks=[], progress=0.0)
        session.add(state)
        session.commit()
        session.refresh(state)
    return state


@router.get("/{document_id}", response_model=ReadingDocOut)
def get_reading(document_id: int) -> ReadingDocOut:
    session = get_session()
    try:
        doc = session.get(Document, document_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        state = _get_state(session, document_id)
        return ReadingDocOut(
            id=str(doc.id),
            title=doc.title,
            kind=doc.file_type.upper(),
            pages=doc.pages,
            sections=_build_sections(document_id, doc.title),
            highlights=list(state.highlights or []),
            bookmarks=list(state.bookmarks or []),
            progress=state.progress,
        )
    finally:
        session.close()


@router.post("/{document_id}/highlights", response_model=ReadingDocOut)
def add_highlight(document_id: int, payload: HighlightCreate) -> ReadingDocOut:
    session = get_session()
    try:
        doc = session.get(Document, document_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        state = _get_state(session, document_id)
        hls = list(state.highlights or [])
        hls.append({"id": f"hl{len(hls) + 1}", "text": payload.text, "section": payload.section})
        state.highlights = hls
        session.commit()
        return get_reading(document_id)
    finally:
        session.close()


@router.post("/{document_id}/bookmarks", response_model=ReadingDocOut)
def add_bookmark(document_id: int, payload: BookmarkCreate) -> ReadingDocOut:
    session = get_session()
    try:
        doc = session.get(Document, document_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        state = _get_state(session, document_id)
        bms = list(state.bookmarks or [])
        bms.append({"id": f"bm{len(bms) + 1}", "section": payload.section, "note": payload.note})
        state.bookmarks = bms
        session.commit()
        return get_reading(document_id)
    finally:
        session.close()


@router.get("/{document_id}/lens", response_model=LensResponse)
async def lens(document_id: int, text: str, level: str = "Intermediate") -> LensResponse:
    passage = text.strip()
    if not passage:
        raise HTTPException(status_code=400, detail="text is required")
    system = _LENS_SYSTEM.get(level, _LENS_SYSTEM["Intermediate"])

    def _run() -> str:
        llm = get_llm("quick_qa")
        resp = llm.invoke([SystemMessage(content=system), HumanMessage(content=passage)])
        return getattr(resp, "content", str(resp)).strip()

    explanation = await run_in_threadpool(_run)
    return LensResponse(level=level, text=explanation)

```


## File: api/routers/study.py
```python
"""Generative study endpoints — flashcards, quizzes, diagrams, mind maps,
revision notes. Each reuses the RAG pipeline with an explicit route (which
selects the matching system prompt) and parses the text result into the
structured shapes the frontend expects.
"""

from __future__ import annotations

import json

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import StreamingResponse

from scholarcli.api import parsers
from scholarcli.api.activity_service import record_activity
from scholarcli.api.quality import score_artifact
from scholarcli.api.rag_service import run_ask, stream_ask
from scholarcli.api.schemas import (
    DiagramOut,
    FlashcardOut,
    FlashcardSet,
    GenerateDiagramRequest,
    GenerateFlashcardsRequest,
    GenerateMindmapRequest,
    GenerateQuizRequest,
    GenerateRevisionRequest,
    MindmapOut,
    QuizOut,
    QuizQuestionOut,
    RevisionOut,
)

router = APIRouter(prefix="/api", tags=["study"])


def _stable_id(prefix: str, *parts: str) -> str:
    return f"{prefix}-{abs(hash('|'.join(parts))) % 10_000_000}"


@router.post("/flashcards/generate", response_model=FlashcardSet)
async def generate_flashcards(req: GenerateFlashcardsRequest) -> FlashcardSet:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    query = f"Generate {req.count} flashcards covering: {topic}"
    result = await run_in_threadpool(run_ask, query, req.course, req.document, "flashcards", topic, req.rag_mode)
    cards = parsers.parse_flashcards(result["content"], deck=topic)
    quality = score_artifact("flashcards", cards, result["retrieved"], result["grounded"])
    record_activity("flashcard", f"Generated flashcards: {topic}", req.course or "")
    return FlashcardSet(
        deck=topic,
        course=req.course,
        grounded=result["grounded"],
        cards=[FlashcardOut(**c) for c in cards],
        quality=quality,
    )


@router.post("/quizzes/generate", response_model=QuizOut)
async def generate_quiz(req: GenerateQuizRequest) -> QuizOut:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    query = f"Generate a {req.difficulty} difficulty quiz about: {topic}"
    result = await run_in_threadpool(run_ask, query, req.course, req.document, "quiz", topic, req.rag_mode)
    questions = parsers.parse_quiz(result["content"])
    quality = score_artifact("quiz", questions, result["retrieved"], result["grounded"])
    record_activity("quiz", f"Generated quiz: {topic}", req.course or "")
    return QuizOut(
        id=_stable_id("quiz", topic, req.difficulty),
        title=topic,
        course=req.course or "All courses",
        difficulty=req.difficulty,
        grounded=result["grounded"],
        questions=[QuizQuestionOut(**q) for q in questions],
        quality=quality,
    )


@router.post("/diagrams/generate", response_model=DiagramOut)
async def generate_diagram(req: GenerateDiagramRequest) -> DiagramOut:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    kind = (req.type or "flowchart").replace("_", " ")
    query = f"Generate a {kind} diagram about: {topic}"
    result = await run_in_threadpool(run_ask, query, req.course, req.document, "mermaid", topic, req.rag_mode)
    mermaid = parsers.strip_mermaid_fences(result["content"])
    quality = score_artifact("mermaid", mermaid, result["retrieved"], result["grounded"])
    course_name = req.course or "All courses"
    kind_label = kind.title()
    diagram_id = _stable_id("dg", topic, kind)

    # Persist grounded diagrams so the library survives reloads.
    if result["grounded"] and mermaid.strip():
        from scholarcli.storage import get_session
        from scholarcli.storage.models import Diagram

        session = get_session()
        try:
            row = Diagram(
                title=topic, course=course_name, kind=kind_label, mermaid=mermaid,
                quality_score=quality.model_dump(),
            )
            session.add(row)
            session.commit()
            session.refresh(row)
            diagram_id = str(row.id)
        finally:
            session.close()

    record_activity("diagram", f"Generated diagram: {topic}", req.course or "")
    return DiagramOut(
        id=diagram_id,
        title=topic,
        course=course_name,
        kind=kind_label,
        mermaid=mermaid,
        grounded=result["grounded"],
        quality=quality,
    )


@router.post("/mindmaps/generate", response_model=MindmapOut)
async def generate_mindmap(req: GenerateMindmapRequest) -> MindmapOut:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    query = f"Generate a mind map about: {topic}"
    result = await run_in_threadpool(run_ask, query, req.course, req.document, "mindmap", topic, req.rag_mode)
    quality = score_artifact("mindmap", result["content"], result["retrieved"], result["grounded"])
    course_name = req.course or "All courses"
    mindmap_id = _stable_id("mm", topic)

    if result["grounded"] and result["content"].strip():
        from scholarcli.storage import get_session
        from scholarcli.storage.models import Mindmap

        session = get_session()
        try:
            row = Mindmap(
                title=topic, course=course_name, text=result["content"],
                quality_score=quality.model_dump(),
            )
            session.add(row)
            session.commit()
            session.refresh(row)
            mindmap_id = str(row.id)
        finally:
            session.close()

    return MindmapOut(
        id=mindmap_id,
        title=topic,
        course=course_name,
        text=result["content"],
        grounded=result["grounded"],
        quality=quality,
    )


@router.post("/revision/generate", response_model=RevisionOut)
async def generate_revision(req: GenerateRevisionRequest) -> RevisionOut:
    subject = (req.topic or req.course or "").strip()
    if not subject:
        raise HTTPException(status_code=400, detail="topic or course is required")
    format_hint = {
        "notes": "concise revision notes",
        "concepts": "a list of key concepts with short explanations",
        "formulas": "a formula explorer. For each formula include: 1. The formula (in LaTeX math blocks), 2. Where it is used, 3. Common mistakes, 4. Variables (with definitions), 5. Units, 6. Related formulas.",
        "summary": "a high-level summary",
    }[req.format]
    query = f"Create {format_hint} for: {subject}"
    result = await run_in_threadpool(run_ask, query, req.course, req.document, "study_notes", subject, req.rag_mode)
    quality = score_artifact("study_notes", result["content"], result["retrieved"], result["grounded"])
    return RevisionOut(
        title=subject,
        markdown=result["content"],
        grounded=result["grounded"],
        quality=quality,
    )


@router.post("/revision/generate/stream")
async def generate_revision_stream(req: GenerateRevisionRequest) -> StreamingResponse:
    subject = (req.topic or req.course or "").strip()
    if not subject:
        raise HTTPException(status_code=400, detail="topic or course is required")
    format_hint = {
        "notes": "concise revision notes",
        "concepts": "a list of key concepts with short explanations",
        "formulas": "a formula explorer. For each formula include: 1. The formula (in LaTeX math blocks), 2. Where it is used, 3. Common mistakes, 4. Variables (with definitions), 5. Units, 6. Related formulas.",
        "summary": "a high-level summary",
    }[req.format]
    query = f"Create {format_hint} for: {subject}"
    record_activity("revision", f"Generated revision: {subject}", req.course or "")

    def event_stream():
        text_parts: list[str] = []
        try:
            for event in stream_ask(query, req.course, req.document, "study_notes", subject, req.rag_mode):
                if event.get("type") == "token":
                    text_parts.append(event.get("value", ""))
                elif event.get("type") == "done":
                    # Score the assembled notes; drop raw chunks before serializing.
                    retrieved = event.pop("retrieved", []) or []
                    quality = score_artifact(
                        "study_notes", "".join(text_parts), retrieved, event.get("grounded", False)
                    )
                    event["quality"] = quality.model_dump()
                    event["title"] = subject  # so the frontend can label the result
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as exc:  # noqa: BLE001
            yield f"data: {json.dumps({'type': 'error', 'value': str(exc)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

```


## File: api/routers/differences.py
```python
"""Difference-table endpoints — generate, save, list, delete."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.api.activity_service import record_activity
from scholarcli.api.prompt_service import active_body
from scholarcli.api.quality import score_artifact
from scholarcli.api.rag_service import run_ask
from scholarcli.api.schemas import (
    DifferenceOut,
    DifferenceTableItem,
    GenerateDifferenceRequest,
    QualityScore,
    SaveDifferenceRequest,
)
from scholarcli.llm import get_llm
from scholarcli.rag.prompts import DIFFERENCES_SYSTEM
from scholarcli.storage import get_session
from scholarcli.storage.models import Concept, DifferenceTable

router = APIRouter(prefix="/api/differences", tags=["differences"])

_FALLBACK_SUGGESTIONS = [
    "Process vs Thread",
    "REST vs gRPC",
    "Paging vs Segmentation",
    "Monolith vs Microservices",
    "RAG vs Fine-Tuning",
    "Deadlock Prevention vs Deadlock Avoidance",
    "TCP vs UDP",
    "Stack vs Heap",
]


def _direct_generate(topic: str) -> str:
    """Direct LLM call — no RAG grounding gate. Used when documents don't cover the topic."""
    system = active_body("differences") or DIFFERENCES_SYSTEM
    llm = get_llm("differences")
    resp = llm.invoke([
        SystemMessage(content=system),
        HumanMessage(content=f"Compare and contrast: {topic}"),
    ])
    content = resp.content if hasattr(resp, "content") else str(resp)
    return content if isinstance(content, str) else str(content)


@router.post("/generate", response_model=DifferenceOut)
async def generate_difference(req: GenerateDifferenceRequest) -> DifferenceOut:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    query = f"Compare and contrast: {topic}"
    result = await run_in_threadpool(run_ask, query, req.course, req.document, "differences")

    if result["grounded"]:
        content = result["content"]
        grounded = True
        retrieved = result["retrieved"]
    else:
        content = await run_in_threadpool(_direct_generate, topic)
        grounded = False
        retrieved = []

    quality = score_artifact("differences", content, retrieved, grounded)
    record_activity("difference", f"Generated difference table: {topic}", req.course or "")
    return DifferenceOut(
        title=topic,
        content=content,
        grounded=grounded,
        quality=quality,
    )


@router.get("/suggestions", response_model=list[str])
def get_suggestions() -> list[str]:
    session = get_session()
    try:
        concepts = (
            session.query(Concept.name)
            .order_by(Concept.ref_count.desc())
            .limit(10)
            .all()
        )
    finally:
        session.close()
    names = [c.name for c in concepts]
    pairs = [f"{names[i]} vs {names[i + 1]}" for i in range(0, len(names) - 1, 2)]
    seen = set(pairs)
    for fb in _FALLBACK_SUGGESTIONS:
        if len(pairs) >= 5:
            break
        if fb not in seen:
            pairs.append(fb)
            seen.add(fb)
    return pairs[:5]


@router.get("", response_model=list[DifferenceTableItem])
def list_differences() -> list[DifferenceTableItem]:
    session = get_session()
    try:
        rows = (
            session.query(DifferenceTable)
            .order_by(DifferenceTable.created_at.desc())
            .all()
        )
        return [
            DifferenceTableItem(
                id=r.id,
                title=r.title,
                course=r.course,
                content=r.content,
                createdAt=r.created_at.isoformat(),
                quality=QualityScore(**r.quality_score) if r.quality_score else None,
            )
            for r in rows
        ]
    finally:
        session.close()


@router.post("", response_model=DifferenceTableItem, status_code=201)
def save_difference(req: SaveDifferenceRequest) -> DifferenceTableItem:
    session = get_session()
    try:
        row = DifferenceTable(
            title=req.title,
            content=req.content,
            course=req.course or "",
            quality_score=req.quality.model_dump() if req.quality else None,
        )
        session.add(row)
        session.commit()
        session.refresh(row)
        return DifferenceTableItem(
            id=row.id,
            title=row.title,
            course=row.course,
            content=row.content,
            createdAt=row.created_at.isoformat(),
            quality=QualityScore(**row.quality_score) if row.quality_score else None,
        )
    finally:
        session.close()


@router.delete("/{table_id}")
def delete_difference(table_id: int) -> dict:
    session = get_session()
    try:
        row = session.get(DifferenceTable, table_id)
        if not row:
            raise HTTPException(status_code=404, detail="not found")
        session.delete(row)
        session.commit()
    finally:
        session.close()
    return {"ok": True}

```


## File: api/routers/notebooks.py
```python
"""Notebook CRUD + AI writing assistance."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from scholarcli.api.activity_service import record_activity
from scholarcli.api.rag_service import run_ask
from scholarcli.api.schemas import (
    CollectionOut,
    NotebookAssistRequest,
    NotebookAssistResponse,
    NotebookCreate,
    NotebookMetaOut,
    NotebookOut,
    NotebookPatch,
)
from scholarcli.storage import get_session
from scholarcli.storage.models import Notebook

router = APIRouter(prefix="/api/notebooks", tags=["notebooks"])

_COLORS = ["#4f4d7a", "#3f6b6f", "#a3771f", "#3f7a4e", "#9f3a36"]


def _fmt_updated(nb: Notebook) -> str:
    return nb.updated_at.strftime("%Y-%m-%d %H:%M") if nb.updated_at else ""


def _meta(nb: Notebook) -> NotebookMetaOut:
    blocks = nb.blocks or []
    return NotebookMetaOut(
        id=str(nb.id),
        name=nb.title,
        course=nb.course,
        color=nb.color,
        notes=len(blocks),
        lastEdited=_fmt_updated(nb),
    )


def _full(nb: Notebook) -> NotebookOut:
    return NotebookOut(
        id=str(nb.id),
        title=nb.title,
        subtitle=nb.subtitle,
        course=nb.course,
        color=nb.color,
        blocks=nb.blocks or [],
        tags=nb.tags or [],
        updated=_fmt_updated(nb),
        is_draft=nb.is_draft,
    )


@router.get("", response_model=list[NotebookMetaOut])
def list_notebooks() -> list[NotebookMetaOut]:
    session = get_session()
    try:
        return [_meta(nb) for nb in session.query(Notebook).order_by(Notebook.updated_at.desc()).all()]
    finally:
        session.close()


@router.post("", response_model=NotebookOut, status_code=201)
def create_notebook(payload: NotebookCreate) -> NotebookOut:
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title is required")
    session = get_session()
    try:
        nb = Notebook(
            title=title,
            subtitle=payload.subtitle or "",
            course=payload.course or "",
            color=payload.color or _COLORS[hash(title) % len(_COLORS)],
            blocks=[],
            tags=payload.tags or [],
        )
        session.add(nb)
        session.commit()
        session.refresh(nb)
        record_activity("note", f"Created notebook: {nb.title}", nb.course)
        return _full(nb)
    finally:
        session.close()


@router.get("/collections", response_model=list[CollectionOut])
def notebook_collections() -> list[CollectionOut]:
    """Collections = notebooks grouped by course."""
    session = get_session()
    try:
        counts: dict[str, int] = {}
        for nb in session.query(Notebook).all():
            key = nb.course or "Uncategorized"
            counts[key] = counts.get(key, 0) + 1
        return [
            CollectionOut(id=f"col-{i}", name=name, count=n)
            for i, (name, n) in enumerate(sorted(counts.items()))
        ]
    finally:
        session.close()


@router.get("/tags", response_model=list[str])
def notebook_tags() -> list[str]:
    """Distinct tags across all notebooks."""
    session = get_session()
    try:
        seen: list[str] = []
        for nb in session.query(Notebook).all():
            for t in (nb.tags or []):
                if t not in seen:
                    seen.append(t)
        return seen
    finally:
        session.close()


@router.get("/{notebook_id}", response_model=NotebookOut)
def get_notebook(notebook_id: int) -> NotebookOut:
    session = get_session()
    try:
        nb = session.get(Notebook, notebook_id)
        if not nb:
            raise HTTPException(status_code=404, detail="Notebook not found")
        return _full(nb)
    finally:
        session.close()


@router.put("/{notebook_id}", response_model=NotebookOut)
def update_notebook(notebook_id: int, patch: NotebookPatch) -> NotebookOut:
    session = get_session()
    try:
        nb = session.get(Notebook, notebook_id)
        if not nb:
            raise HTTPException(status_code=404, detail="Notebook not found")
        if patch.title is not None:
            nb.title = patch.title
        if patch.subtitle is not None:
            nb.subtitle = patch.subtitle
        if patch.blocks is not None:
            nb.blocks = patch.blocks
        if patch.color is not None:
            nb.color = patch.color
        if patch.tags is not None:
            nb.tags = patch.tags
        if patch.is_draft is not None:
            nb.is_draft = patch.is_draft
        session.commit()
        session.refresh(nb)
        return _full(nb)
    finally:
        session.close()


@router.delete("/{notebook_id}", status_code=204)
def delete_notebook(notebook_id: int) -> None:
    session = get_session()
    try:
        nb = session.get(Notebook, notebook_id)
        if not nb:
            raise HTTPException(status_code=404, detail="Notebook not found")
        session.delete(nb)
        session.commit()
    finally:
        session.close()


@router.post("/assist", response_model=NotebookAssistResponse)
async def assist(req: NotebookAssistRequest) -> NotebookAssistResponse:
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    instruction = {
        "explain": f"Explain the following in clear study notes:\n\n{text}",
        "summarize": f"Summarize the following concisely:\n\n{text}",
        "improve": f"Improve the clarity and structure of the following notes:\n\n{text}",
    }[req.action]
    result = await run_in_threadpool(run_ask, instruction, req.course, "study_notes")
    return NotebookAssistResponse(text=result["content"])

```


## File: api/routers/pyq.py
```python
"""PYQ (previous-year question) analysis endpoints.

These power a dedicated **Assessment Library** (question papers, mock tests)
kept *separate* from the Knowledge Library (the RAG-indexed documents). PYQs are
deliberately NOT ingested into the vector store — mixing exam papers into RAG
retrieval pollutes answer quality. The ``QuestionPaper`` / ``PYQQuestion`` tables
are the source of truth here; analytics are computed deterministically from them
(see ``pyq_service``).
"""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

from scholarcli.api import pyq_service
from scholarcli.api.activity_service import record_activity
from scholarcli.api.schemas import (
    PyqAnalysisOut,
    PyqDifferenceSuggestion,
    PyqPaperOut,
    PyqQuestionOut,
    PyqQuestionPatch,
    PyqUploadResponse,
)
from scholarcli.config import get_settings
from scholarcli.storage import get_session
from scholarcli.storage.models import PYQQuestion, QuestionPaper

router = APIRouter(prefix="/api/pyq", tags=["pyq"])

_SUPPORTED_SUFFIXES = {".pdf", ".md", ".markdown", ".txt", ".text"}


def _serialize_paper(p: QuestionPaper) -> PyqPaperOut:
    return PyqPaperOut(
        id=p.id,
        course=p.course,
        title=p.title,
        year=p.year,
        questionCount=p.question_count,
        createdAt=p.created_at.strftime("%Y-%m-%d") if p.created_at else "",
    )


@router.post("/papers/upload", response_model=PyqUploadResponse, status_code=201)
async def upload_paper(
    file: UploadFile = File(...),
    course: str = Form(...),
    year: int | None = Form(None),
) -> PyqUploadResponse:
    course_name = course.strip()
    if not course_name:
        raise HTTPException(status_code=400, detail="course is required")

    filename = Path(file.filename or "upload").name
    suffix = Path(filename).suffix.lower()
    if suffix not in _SUPPORTED_SUFFIXES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{suffix}'. Supported: PDF, Markdown, TXT.",
        )

    # Assessment Library lives apart from the RAG-indexed uploads, so PYQ files
    # never enter the knowledge base / vector store.
    pyq_dir = get_settings().paths.resolved_data_dir() / "pyq"
    pyq_dir.mkdir(parents=True, exist_ok=True)
    dest = pyq_dir / filename
    dest.write_bytes(await file.read())

    title = Path(filename).stem
    try:
        paper = await run_in_threadpool(
            pyq_service.extract_and_store,
            course=course_name,
            title=title,
            year=year,
            source_document=filename,
            path=dest,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001 — surface LLM/extraction failures
        raise HTTPException(status_code=500, detail=f"Extraction failed: {exc}") from exc

    record_activity("exam", f"Analyzed PYQ: {title} ({paper.question_count} questions)", course_name)
    return PyqUploadResponse(paper=_serialize_paper(paper), extracted=paper.question_count)


@router.get("/papers", response_model=list[PyqPaperOut])
def list_papers(course: str | None = None) -> list[PyqPaperOut]:
    session = get_session()
    try:
        q = session.query(QuestionPaper)
        if course and course != "all":
            q = q.filter(QuestionPaper.course == course)
        rows = q.order_by(QuestionPaper.created_at.desc()).all()
        return [_serialize_paper(p) for p in rows]
    finally:
        session.close()


@router.delete("/papers/{paper_id}", status_code=204)
def delete_paper(paper_id: int) -> None:
    session = get_session()
    try:
        paper = session.get(QuestionPaper, paper_id)
        if not paper:
            raise HTTPException(status_code=404, detail="Paper not found")
        session.delete(paper)  # cascade removes its questions
        session.commit()
    finally:
        session.close()


@router.get("/analysis", response_model=PyqAnalysisOut)
async def analysis(course: str) -> PyqAnalysisOut:
    course = course.strip()
    if not course:
        raise HTTPException(status_code=400, detail="course is required")
    data = await run_in_threadpool(pyq_service.build_analysis, course)
    return PyqAnalysisOut(**data)


@router.get("/difference-suggestions", response_model=list[PyqDifferenceSuggestion])
async def difference_suggestions(course: str) -> list[PyqDifferenceSuggestion]:
    course = course.strip()
    if not course:
        raise HTTPException(status_code=400, detail="course is required")
    pairs = await run_in_threadpool(pyq_service.difference_suggestions, course)
    return [PyqDifferenceSuggestion(**p) for p in pairs]


@router.get("/questions", response_model=list[PyqQuestionOut])
def list_questions(
    course: str,
    year: int | None = None,
    topic: str | None = None,
    difficulty: str | None = None,
    type: str | None = None,
    q: str | None = None,
) -> list[PyqQuestionOut]:
    session = get_session()
    try:
        query = session.query(PYQQuestion).filter(PYQQuestion.course == course)
        if year is not None:
            query = query.filter(PYQQuestion.year == year)
        if topic:
            query = query.filter(PYQQuestion.topic == topic)
        if difficulty:
            query = query.filter(PYQQuestion.difficulty == difficulty)
        if type:
            query = query.filter(PYQQuestion.qtype == type)
        if q:
            query = query.filter(PYQQuestion.text.ilike(f"%{q}%"))
        rows = query.order_by(PYQQuestion.year.desc().nullslast(), PYQQuestion.id).all()
        return [
            PyqQuestionOut(
                id=r.id,
                text=r.text,
                topic=r.topic,
                subtopics=r.subtopics or [],
                difficulty=r.difficulty,
                type=r.qtype,
                marks=r.marks,
                year=r.year,
            )
            for r in rows
        ]
    finally:
        session.close()


_QUESTION_FIELD_MAP = {"type": "qtype"}


@router.patch("/questions/{question_id}", response_model=PyqQuestionOut)
def patch_question(question_id: int, body: PyqQuestionPatch) -> PyqQuestionOut:
    session = get_session()
    try:
        q = session.get(PYQQuestion, question_id)
        if not q:
            raise HTTPException(status_code=404, detail="Question not found")
        for field, value in body.model_dump(exclude_unset=True).items():
            setattr(q, _QUESTION_FIELD_MAP.get(field, field), value)
        session.commit()
        session.refresh(q)
        return PyqQuestionOut(
            id=q.id,
            text=q.text,
            topic=q.topic,
            subtopics=q.subtopics or [],
            difficulty=q.difficulty,
            type=q.qtype,
            marks=q.marks,
            year=q.year,
        )
    finally:
        session.close()


@router.delete("/questions/{question_id}", status_code=204)
def delete_question(question_id: int) -> None:
    session = get_session()
    try:
        q = session.get(PYQQuestion, question_id)
        if not q:
            raise HTTPException(status_code=404, detail="Question not found")
        paper = session.get(QuestionPaper, q.paper_id)
        session.delete(q)
        if paper and paper.question_count > 0:
            paper.question_count -= 1
        session.commit()
    finally:
        session.close()

```


## File: api/routers/jobs.py
```python
"""Background-job status endpoints (poll ingestion + other async work)."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from scholarcli.api import job_service
from scholarcli.api.schemas import JobOut

router = APIRouter(prefix="/api", tags=["jobs"])


@router.get("/jobs", response_model=list[JobOut])
def list_jobs() -> list[JobOut]:
    return [JobOut(**j) for j in job_service.list_jobs()]


@router.get("/jobs/{job_id}", response_model=JobOut)
def get_job(job_id: str) -> JobOut:
    job = job_service.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobOut(**job)

```


## File: api/routers/ask.py
```python
"""Ask / chat endpoints (one-shot + SSE streaming) and chat-history CRUD."""

from __future__ import annotations

import json

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import StreamingResponse

from scholarcli.api import chat_service, rag_service
from scholarcli.api.activity_service import record_activity
from scholarcli.api.schemas import (
    AskRequest,
    AskResponse,
    ChatSessionCreate,
    ChatSessionMeta,
    ChatSessionOut,
    SourceOut,
)

router = APIRouter(prefix="/api", tags=["ask"])


@router.post("/ask", response_model=AskResponse)
async def ask(payload: AskRequest) -> AskResponse:
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="question is required")
    if payload.sessionId:
        chat_service.append_message(payload.sessionId, "user", question)
    result = await run_in_threadpool(
        rag_service.run_ask, question, payload.course, payload.document, payload.route,
        None, payload.rag_mode, payload.socratic
    )
    record_activity("ask", f"Asked: {question}", payload.course or "")
    if payload.sessionId:
        chat_service.append_message(
            payload.sessionId, "assistant", result["content"], result["sources"]
        )
    return AskResponse(
        id=f"a-{abs(hash(question)) % 10_000_000}",
        content=result["content"],
        sources=[SourceOut(**s) for s in result["sources"]],
        confidence=result["confidence"],
        grounded=result["grounded"],
        route=result["route"],
    )


@router.post("/ask/stream")
async def ask_stream(payload: AskRequest) -> StreamingResponse:
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="question is required")
    record_activity("ask", f"Asked: {question}", payload.course or "")
    session_id = payload.sessionId
    if session_id:
        chat_service.append_message(session_id, "user", question)

    def event_stream():
        parts: list[str] = []
        final_sources: list = []
        try:
            for event in rag_service.stream_ask(
                question, payload.course, payload.document, payload.route,
                None, payload.rag_mode, payload.socratic
            ):
                if event.get("type") == "token":
                    parts.append(event.get("value", ""))
                elif event.get("type") == "done":
                    final_sources = event.get("sources", []) or []
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as exc:  # noqa: BLE001 — report errors over the stream
            err = {"type": "error", "value": str(exc)}
            yield f"data: {json.dumps(err)}\n\n"
        finally:
            if session_id and parts:
                chat_service.append_message(
                    session_id, "assistant", "".join(parts), final_sources
                )

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ---------------------------------------------------------------------------
# Chat history
# ---------------------------------------------------------------------------

@router.get("/chat/sessions", response_model=list[ChatSessionMeta])
def list_chat_sessions() -> list[ChatSessionMeta]:
    return [ChatSessionMeta(**s) for s in chat_service.list_sessions()]


@router.post("/chat/sessions", response_model=ChatSessionMeta, status_code=201)
def create_chat_session(payload: ChatSessionCreate) -> ChatSessionMeta:
    return ChatSessionMeta(**chat_service.create_session(payload.course, payload.title))


@router.get("/chat/sessions/{session_id}", response_model=ChatSessionOut)
def get_chat_session(session_id: str) -> ChatSessionOut:
    data = chat_service.get_session_detail(session_id)
    if not data:
        raise HTTPException(status_code=404, detail="Chat session not found")
    return ChatSessionOut(**data)


@router.delete("/chat/sessions/{session_id}", status_code=204)
def delete_chat_session(session_id: str) -> None:
    if not chat_service.delete_session(session_id):
        raise HTTPException(status_code=404, detail="Chat session not found")

```


## File: api/routers/consistency.py
```python
"""Cross-artifact consistency endpoints — analyze-only.

Two entry points share one core service (``consistency_service``):
- ``/api/consistency/analyze``  : in-memory Teach Me Package artifacts.
- ``/api/consistency/library``  : saved artifacts for a course (DB-backed).
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from scholarcli.api import consistency_service
from scholarcli.api.schemas import (
    ConsistencyApplyRequest,
    ConsistencyApplyResponse,
    ConsistencyLibraryRequest,
    ConsistencyReport,
    ConsistencyRequest,
)

router = APIRouter(prefix="/api/consistency", tags=["consistency"])


@router.post("/analyze", response_model=ConsistencyReport)
async def analyze(req: ConsistencyRequest) -> ConsistencyReport:
    if not req.sourceText.strip():
        raise HTTPException(status_code=400, detail="sourceText is required")
    report = await run_in_threadpool(
        consistency_service.build_report, req.sourceText, req.artifacts
    )
    return ConsistencyReport(**report)


@router.post("/library", response_model=ConsistencyReport)
async def library(req: ConsistencyLibraryRequest) -> ConsistencyReport:
    if not req.course.strip():
        raise HTTPException(status_code=400, detail="course is required")
    report = await run_in_threadpool(
        consistency_service.build_library_report, req.course, req.document
    )
    return ConsistencyReport(**report)


@router.post("/apply", response_model=ConsistencyApplyResponse)
async def apply(req: ConsistencyApplyRequest) -> ConsistencyApplyResponse:
    if not req.course.strip():
        raise HTTPException(status_code=400, detail="course is required")
    result = await run_in_threadpool(
        consistency_service.apply_correction, req.course, req.artifactType, req.concepts
    )
    return ConsistencyApplyResponse(**result)

```


## File: api/routers/documents.py
```python
"""Document + source-search endpoints."""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, File, Form, HTTPException, UploadFile

import scholarcli.llm
from scholarcli.api import job_service
from scholarcli.api.activity_service import record_activity
from scholarcli.api.rag_service import serialize_chunks
from scholarcli.api.schemas import DocumentOut, DocumentPatch, SourceOut
from scholarcli.config import get_settings
from scholarcli.ingest.pipeline import ingest_file
from scholarcli.storage import get_session
from scholarcli.storage.models import Course, Document
from scholarcli.storage.vectors import delete_document, hybrid_search, search

router = APIRouter(prefix="/api", tags=["documents"])

# Stored file_type -> frontend DocType.
_TYPE_MAP = {"pdf": "pdf", "md": "markdown", "txt": "text", "docx": "docx"}
_SUPPORTED_SUFFIXES = {".pdf", ".md", ".markdown", ".txt", ".text"}


def _serialize(doc: Document, course_name: str) -> DocumentOut:
    return DocumentOut(
        id=str(doc.id),
        title=doc.title,
        type=_TYPE_MAP.get(doc.file_type, "text"),
        course=course_name,
        sizeKb=doc.size_kb,
        pages=doc.pages,
        addedAt=doc.indexed_at.strftime("%Y-%m-%d") if doc.indexed_at else "",
        status=doc.status,
    )


@router.get("/documents", response_model=list[DocumentOut])
def list_documents(course: str | None = None, search: str | None = None) -> list[DocumentOut]:
    session = get_session()
    try:
        q = session.query(Document, Course).join(Course, Document.course_id == Course.id)
        if course and course != "all":
            q = q.filter(Course.name == course)
        if search:
            q = q.filter(Document.title.ilike(f"%{search}%"))
        rows = q.order_by(Document.indexed_at.desc()).all()
        return [_serialize(doc, c.name) for doc, c in rows]
    finally:
        session.close()


@router.post("/documents/upload", response_model=DocumentOut, status_code=201)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    course: str = Form(...),
) -> DocumentOut:
    course_name = course.strip()
    if not course_name:
        raise HTTPException(status_code=400, detail="course is required")

    filename = Path(file.filename or "upload").name
    suffix = Path(filename).suffix.lower()
    if suffix not in _SUPPORTED_SUFFIXES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{suffix}'. Supported: PDF, Markdown, TXT.",
        )

    uploads_dir = get_settings().paths.resolved_data_dir() / "uploads"
    uploads_dir.mkdir(parents=True, exist_ok=True)
    dest = uploads_dir / filename
    dest.write_bytes(await file.read())

    # Create a stub Document row immediately so the frontend can show status.
    session = get_session()
    try:
        course_obj = session.query(Course).filter(Course.name == course_name).first()
        if course_obj is None:
            course_obj = Course(name=course_name)
            session.add(course_obj)
            session.commit()
            session.refresh(course_obj)

        existing = (
            session.query(Document)
            .filter(Document.path == str(dest.resolve()), Document.course_id == course_obj.id)
            .first()
        )
        if existing:
            existing.status = "processing"
            existing.error = None
            session.commit()
            doc_id = existing.id
            stub_out = _serialize(existing, course_name)
        else:
            size_kb = max(1, round(dest.stat().st_size / 1024))
            doc = Document(
                path=str(dest.resolve()),
                title=Path(filename).stem,
                file_type=suffix.lstrip("."),
                content_hash="",
                size_kb=size_kb,
                pages=0,
                status="processing",
                course_id=course_obj.id,
            )
            session.add(doc)
            session.commit()
            session.refresh(doc)
            doc_id = doc.id
            stub_out = _serialize(doc, course_name)
    finally:
        session.close()

    job_id = job_service.create_job(
        "ingest", label=f"Ingesting {filename}", payload={"documentId": doc_id, "course": course_name}
    )
    background_tasks.add_task(_ingest_bg, dest, course_name, doc_id, job_id)
    return stub_out


def _ingest_bg(path: Path, course_name: str, doc_id: int, job_id: str) -> None:
    """Background ingestion task — updates Document + Job status on completion."""
    job_service.mark_running(job_id)
    try:
        status = ingest_file(path, course_name)
        if status == "no-content":
            _set_doc_status(doc_id, "failed", "No extractable text in document")
            job_service.mark_failed(job_id, "No extractable text in document")
        else:
            record_activity("document", f"Indexed {path.name}", course_name)
            job_service.mark_done(job_id, {"documentId": doc_id, "status": status})
    except Exception as exc:  # noqa: BLE001
        _set_doc_status(doc_id, "failed", str(exc)[:500])
        job_service.mark_failed(job_id, str(exc))


def _set_doc_status(doc_id: int, status: str, error: str | None = None) -> None:
    session = get_session()
    try:
        doc = session.get(Document, doc_id)
        if doc:
            doc.status = status
            doc.error = error
            session.commit()
    except Exception:  # noqa: BLE001
        pass
    finally:
        session.close()


@router.delete("/documents/{document_id}", status_code=204)
def delete_document_endpoint(document_id: int) -> None:
    session = get_session()
    try:
        doc = session.get(Document, document_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        delete_document(doc.id)
        session.delete(doc)
        session.commit()
    finally:
        session.close()


@router.patch("/documents/{document_id}", response_model=DocumentOut)
def update_document_endpoint(document_id: int, patch: DocumentPatch) -> DocumentOut:
    session = get_session()
    try:
        doc = session.get(Document, document_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        
        if patch.course is not None:
            course_name = patch.course.strip()
            if course_name and course_name != doc.course.name:
                course = session.query(Course).filter(Course.name == course_name).first()
                if not course:
                    course = Course(name=course_name)
                    session.add(course)
                    session.flush()
                
                doc.course_id = course.id
                from scholarcli.storage.vectors import update_document_course
                update_document_course(doc.id, course.name)
                
        session.commit()
        return _serialize(doc, doc.course.name)
    finally:
        session.close()


@router.get("/sources/search", response_model=list[SourceOut])
def search_sources(q: str, course: str | None = None, limit: int = 5) -> list[SourceOut]:
    from scholarcli.config import get_settings
    query = q.strip()
    if not query:
        return []
    emb = scholarcli.llm.get_embeddings()
    vector = emb.embed_query(query)
    top_k = max(1, min(limit, 20))
    cfg = get_settings()
    if cfg.retrieval.hybrid_search:
        results = hybrid_search(query_text=query, query_vector=vector, top_k=top_k, course=course)
    else:
        results = search(vector, top_k=top_k, course=course)
    return [SourceOut(**src) for src in serialize_chunks(results)]


from fastapi.responses import FileResponse

@router.get("/documents/images/{content_hash}/{filename}")
def get_document_image(content_hash: str, filename: str) -> FileResponse:
    images_dir = get_settings().paths.resolved_data_dir() / "images" / content_hash
    image_path = images_dir / filename
    if not image_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(image_path)


```


## File: api/routers/exam.py
```python
"""Exam mode — generate a timed question set and grade submissions.

Sessions are persisted in the ExamSession table so they survive process
restarts. Subjective answers (short/long) are scored 0-100 by the LLM for
partial credit. Timing is measured server-side from started_at.
"""

from __future__ import annotations

import json
import re
import secrets
from collections import defaultdict
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.api import parsers, pyq_service
from scholarcli.api.activity_service import record_activity
from scholarcli.api.prompt_service import active_body
from scholarcli.api.rag_service import run_ask
from scholarcli.api.schemas import (
    ExamGenerateRequest,
    ExamQuestionOut,
    ExamResultOut,
    ExamSessionOut,
    ExamStatusOut,
    ExamSubmitRequest,
)

# Grace window: server accepts a late submission within this many seconds past
# expiry (clock skew / in-flight request) but still flags it as timed out.
_GRACE_SECONDS = 10


def _aware(dt: datetime | None) -> datetime | None:
    if dt is not None and dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def _remaining_seconds(exam, now: datetime) -> int | None:
    """Seconds left before expiry, or None for an untimed exam."""
    expires = _aware(getattr(exam, "expires_at", None))
    if not exam.duration_minutes or expires is None:
        return None
    return max(0, int((expires - now).total_seconds()))
from scholarcli.llm import get_llm
from scholarcli.rag.prompts import QUIZ_SYSTEM
from scholarcli.storage import get_session
from scholarcli.storage.models import ExamSession, PYQQuestion

router = APIRouter(prefix="/api/exams", tags=["exam"])


def _sample_pyq_questions(course: str, limit: int = 16) -> list[dict]:
    """Pull real past questions for a course to ground PYQ-based generation."""
    session = get_session()
    try:
        rows = (
            session.query(PYQQuestion)
            .filter(PYQQuestion.course == course)
            .order_by(PYQQuestion.year.desc())
            .limit(limit)
            .all()
        )
        return [
            {"text": r.text, "topic": r.topic, "marks": r.marks}
            for r in rows
        ]
    finally:
        session.close()


def _direct_quiz_generate(query: str) -> str:
    """Generate quiz/exam content via a direct LLM call (no RAG grounding gate).

    Used for PYQ-driven exams where the vector index may be empty.
    """
    system = active_body("quiz") or QUIZ_SYSTEM
    llm = get_llm("quiz")
    resp = llm.invoke([SystemMessage(content=system), HumanMessage(content=query)])
    content = resp.content if hasattr(resp, "content") else str(resp)
    return content if isinstance(content, str) else str(content)


@router.post("/generate", response_model=ExamSessionOut)
async def generate_exam(req: ExamGenerateRequest) -> ExamSessionOut:
    subject = (req.topic or req.course or "").strip()
    if not subject:
        raise HTTPException(status_code=400, detail="topic or course is required")

    types_str = ", ".join(req.types) if req.types else "multiple choice"

    pyq_block = ""
    pyq_topics: list[str] = []
    if req.pyqCourse:
        analysis = await run_in_threadpool(pyq_service.build_analysis, req.pyqCourse)
        topics = analysis.get("topicFrequency", [])[:10]
        pyq_topics = [t["topic"] for t in topics]
        if pyq_topics:
            topic_lines = "\n".join(
                f"- {t['topic']} ({t['frequency']} frequency, {t['occurrences']} past questions)"
                for t in topics
            )
            diff_lines = ", ".join(
                f"{d['level']}: {d['count']}" for d in analysis.get("difficulty", [])
            )
            style_lines = ", ".join(
                f"{p['label']} {p['pct']}%" for p in analysis.get("patterns", [])[:6]
            )
            marks_lines = ", ".join(
                f"{m['marks']}-mark ×{m['count']}" for m in analysis.get("marksDistribution", [])
            )
            pyq_block = f"""
Base this exam on the real previous-year-question trends for this subject — do NOT invent a random mix.
Weight questions toward the most frequent topics below; mirror the historical difficulty, question-style, and marks mix.
Topics (most → least frequent):
{topic_lines}
Historical difficulty distribution: {diff_lines}.
Question-style distribution to mirror: {style_lines or "n/a"}.
Marks distribution seen in past papers: {marks_lines or "n/a"}.
Set each question's 'topic' field to the single best-matching topic from the list above.
"""

    use_pyq = bool(req.pyqCourse and pyq_topics)
    sample_block = ""
    if use_pyq:
        samples = _sample_pyq_questions(req.pyqCourse or "")
        if samples:
            sample_lines = "\n".join(
                f"- {s['text'][:300]}"
                + (f" [topic: {s['topic']}" + (f", {s['marks']} marks]" if s['marks'] else "]") if s['topic'] else "")
                for s in samples
            )
            sample_block = f"""
Real previous-year questions from this subject's uploaded papers — match their style, scope and difficulty, and generate NEW questions in the same spirit (do NOT copy verbatim):
{sample_lines}
"""

    query = f"""Generate a {req.difficulty} difficulty {req.count}-question exam about: {subject}.
Include these question types: {types_str}.
{pyq_block}
{sample_block}
Output the exam strictly as a markdown JSON array block ```json [...] ```.
Each object must have: 'type' (mcq, truefalse, short, or long), 'prompt', 'options' (array of strings, for mcq/truefalse), 'answer' (the exact correct answer string), 'explanation', and 'topic' (a short topic label).
"""
    if use_pyq:
        content = await run_in_threadpool(_direct_quiz_generate, query)
        grounded = True
    else:
        result = await run_in_threadpool(run_ask, query, req.course, req.document, "quiz")
        content = result["content"]
        grounded = result["grounded"]
    parsed = parsers.parse_quiz(content)

    questions: list[ExamQuestionOut] = []
    stored: list[dict] = []
    for i, q in enumerate(parsed):
        eq = {
            "id": f"e{i + 1}",
            "type": q.get("type", "mcq"),
            "topic": (q.get("topic") or "").strip() or subject,
            "difficulty": req.difficulty,
            "prompt": q["prompt"],
            "options": q.get("options"),
            "answer": q.get("answer"),
        }
        stored.append(eq)
        questions.append(ExamQuestionOut(**eq))

    session_id = secrets.token_hex(8)
    now = datetime.now(timezone.utc)
    duration = max(0, int(req.durationMinutes or 0))
    expires_at = now + timedelta(minutes=duration) if duration else None
    db = get_session()
    try:
        db.add(ExamSession(
            id=session_id,
            topic=subject,
            course=req.pyqCourse,
            questions=stored,
            started_at=now,
            duration_minutes=duration,
            expires_at=expires_at,
        ))
        db.commit()
    finally:
        db.close()

    return ExamSessionOut(
        sessionId=session_id,
        questions=questions,
        grounded=grounded and bool(questions),
        durationMinutes=duration,
        remainingSeconds=(duration * 60 if duration else None),
    )


@router.get("/{session_id}/status", response_model=ExamStatusOut)
def exam_status(session_id: str) -> ExamStatusOut:
    db = get_session()
    try:
        exam = db.get(ExamSession, session_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Exam session not found")
        now = datetime.now(timezone.utc)
        remaining = _remaining_seconds(exam, now)
        return ExamStatusOut(
            sessionId=session_id,
            submitted=exam.submitted_at is not None,
            expired=remaining == 0,
            durationMinutes=exam.duration_minutes,
            remainingSeconds=remaining,
        )
    finally:
        db.close()


@router.post("/{session_id}/submit", response_model=ExamResultOut)
async def submit_exam(session_id: str, payload: ExamSubmitRequest) -> ExamResultOut:
    db = get_session()
    try:
        exam = db.get(ExamSession, session_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Exam session not found or expired")
        if exam.submitted_at is not None:
            raise HTTPException(status_code=409, detail="Exam already submitted")

        questions = exam.questions
        now = datetime.now(timezone.utc)
        started = exam.started_at
        if started.tzinfo is None:
            started = started.replace(tzinfo=timezone.utc)
        elapsed_seconds = int((now - started).total_seconds())

        # Server-side time enforcement: if a duration was set and the window has
        # elapsed (beyond a small grace), the submission is flagged timed-out.
        # We still grade whatever was answered rather than discarding the attempt.
        expires = _aware(exam.expires_at)
        timed_out = bool(
            exam.duration_minutes
            and expires is not None
            and now > expires + timedelta(seconds=_GRACE_SECONDS)
        )

        # Grade short/long answers with LLM (0-100 per question for partial credit)
        needs_grading = [q for q in questions if q.get("type") in ("short", "long")]
        graded_scores: dict[str, int] = {}
        if needs_grading:
            prompt = (
                "Grade the following student answers against the expected answers. "
                "Respond ONLY with a JSON object mapping question ID to an integer score 0-100. "
                "100 = fully correct, 0 = completely wrong; award partial credit proportionally. "
                'Example: {"e1": 100, "e2": 45, "e3": 0}\n\n'
            )
            for q in needs_grading:
                given = (payload.answers.get(q["id"]) or "").strip()
                expected = (q.get("answer") or "").strip()
                prompt += f'ID: {q["id"]}\nQuestion: {q["prompt"]}\nExpected: {expected}\nGiven: {given}\n\n'
            try:
                res = await run_in_threadpool(run_ask, prompt, None, None, "study")
                json_str = res["content"]
                fence = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', json_str, re.DOTALL | re.IGNORECASE)
                if fence:
                    json_str = fence.group(1)
                elif "{" in json_str and "}" in json_str:
                    json_str = json_str[json_str.find("{"):json_str.rfind("}") + 1]
                raw = json.loads(json_str)
                # Normalise: accept booleans (legacy) and convert to 0/100
                for k, v in raw.items():
                    if isinstance(v, bool):
                        graded_scores[k] = 100 if v else 0
                    else:
                        graded_scores[k] = max(0, min(100, int(v)))
            except Exception:
                pass

        correct: float = 0.0
        by_topic: dict[str, list[int]] = defaultdict(lambda: [0, 0])
        by_diff: dict[str, list[int]] = defaultdict(lambda: [0, 0])
        review_list = []
        incorrect_questions = []

        for q in questions:
            given = (payload.answers.get(q["id"]) or "").strip()
            expected = (q.get("answer") or "").strip()

            if q.get("type") in ("short", "long"):
                q_score = graded_scores.get(q["id"], 0)
                contribution = q_score / 100.0
            else:
                g_clean = re.sub(r'^[a-d][\)\.\:]\s*', '', given.lower()).strip()
                e_clean = re.sub(r'^[a-d][\)\.\:]\s*', '', expected.lower()).strip()
                match = bool(e_clean) and g_clean == e_clean
                q_score = 100 if match else 0
                contribution = float(match)

            correct += contribution
            if contribution < 1.0:
                incorrect_questions.append({
                    "prompt": q["prompt"],
                    "topic": q["topic"],
                    "given": given,
                    "expected": expected,
                })

            by_topic[q["topic"]][0] += round(contribution * 100)
            by_topic[q["topic"]][1] += 100
            by_diff[q["difficulty"]][0] += round(contribution * 100)
            by_diff[q["difficulty"]][1] += 100

            review_list.append({
                "id": q["id"],
                "prompt": q["prompt"],
                "given": given,
                "expected": expected,
                "correct": contribution >= 1.0,
                "score": q_score,
                "topic": q["topic"],
            })

        total = len(questions)
        score = round(100 * correct / total) if total else 0

        record_activity(
            "exam",
            f"Exam: {exam.topic} — {score}%",
            exam.course or "",
            minutes=elapsed_seconds // 60 or None,
        )

        if exam.course:
            # Convert back to [correct_count, total_count] for the existing API
            topic_for_stat = {
                t: [vals[0] // 100, vals[1] // 100]
                for t, vals in by_topic.items()
            }
            pyq_service.record_topic_results(exam.course, topic_for_stat)

        exam.submitted_at = now
        db.commit()
    finally:
        db.close()

    topic_perf = [
        {"topic": t, "score": round(100 * c / n) if n else 0}
        for t, (c, n) in by_topic.items()
    ]
    diff_analysis = [
        {"level": lvl, "correct": c, "total": n}
        for lvl, (c, n) in by_diff.items()
    ]

    recommended_revisions: list[str] = []
    if incorrect_questions:
        rev_prompt = "The user answered these exam questions incorrectly:\n"
        for iq in incorrect_questions:
            rev_prompt += f"- Q: {iq['prompt']} (Topic: {iq['topic']})\n"
        rev_prompt += (
            "\nBased on these mistakes, identify the specific weak topics. "
            "Return ONLY a bulleted list of 2-3 short, highly actionable recommended revision topics. "
            "Do not include introductory text."
        )
        try:
            result = await run_in_threadpool(run_ask, rev_prompt, None, None, "study")
            lines = [line.strip() for line in result["content"].split("\n")]
            for line in lines:
                if line.startswith(("- ", "* ")):
                    recommended_revisions.append(line[2:].strip())
                elif len(line) > 2 and line[0].isdigit() and line[1] in [".", ")"]:
                    recommended_revisions.append(line[2:].strip())
            if not recommended_revisions:
                recommended_revisions = [l for l in lines if l]
        except Exception:
            pass

    return ExamResultOut(
        score=score,
        correct=round(correct, 2),
        total=total,
        topicPerformance=topic_perf,
        difficultyAnalysis=diff_analysis,
        review=review_list,
        recommendedRevisions=recommended_revisions[:3],
        elapsedSeconds=elapsed_seconds,
        timedOut=timed_out,
    )

```


## File: api/routers/knowledge.py
```python
"""Knowledge-graph endpoints — build, fetch graph, inspect concepts."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from scholarcli.api import knowledge_service
from scholarcli.api.schemas import (
    ConceptInspectorOut,
    ConceptMergeRequest,
    KGBuildRequest,
    KGBuildResponse,
    KGGraphOut,
)

router = APIRouter(prefix="/api", tags=["knowledge"])


@router.post("/knowledge/build", response_model=KGBuildResponse)
async def build(req: KGBuildRequest) -> KGBuildResponse:
    result = await run_in_threadpool(
        knowledge_service.build_graph, req.course, req.max_documents
    )
    return KGBuildResponse(**result)


@router.get("/knowledge-graph", response_model=KGGraphOut)
def get_graph(course: str | None = None) -> KGGraphOut:
    return KGGraphOut(**knowledge_service.graph(course))


@router.get("/knowledge/sidebar")
def kg_sidebar(course: str | None = None) -> dict:
    return knowledge_service.sidebar(course)


@router.get("/concepts/discover", response_model=list[str])
def discover(conceptId: int) -> list[str]:
    return knowledge_service.discover(conceptId)


@router.get("/concepts/{concept_id}", response_model=ConceptInspectorOut)
def get_concept(concept_id: int) -> ConceptInspectorOut:
    data = knowledge_service.inspector(concept_id)
    if not data:
        raise HTTPException(status_code=404, detail="Concept not found")
    return ConceptInspectorOut(**data)


@router.post("/concepts/merge", response_model=ConceptInspectorOut)
def merge_concepts(req: ConceptMergeRequest) -> ConceptInspectorOut:
    data = knowledge_service.merge_concepts(req.keepId, req.dropId)
    if not data:
        raise HTTPException(status_code=400, detail="Invalid concept ids for merge")
    return ConceptInspectorOut(**data)


@router.delete("/concepts/{concept_id}", status_code=204)
def delete_concept(concept_id: int) -> None:
    if not knowledge_service.delete_concept(concept_id):
        raise HTTPException(status_code=404, detail="Concept not found")

```


## File: api/routers/library.py
```python
"""Persistence for generated study artifacts: decks, flashcards, quizzes."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import Response

from scholarcli.api.activity_service import record_activity
from scholarcli.api.schemas import (
    CardReview,
    DeckOut,
    DiagramOut,
    FlashcardOut,
    MindmapOut,
    QualityScore,
    QuizOut,
    QuizQuestionOut,
    QuizSessionPatch,
    SaveDeckRequest,
    SaveQuizRequest,
    SaveRevisionRequest,
    SavedRevisionOut,
)
from scholarcli.storage import get_session
from scholarcli.storage.models import Card, Deck, Diagram, Mindmap, SavedQuiz, SavedRevision

router = APIRouter(prefix="/api", tags=["library"])

_DECK_COLORS = ["#4f4d7a", "#3f6b6f", "#3f7a4e", "#a3771f", "#6b3f6f", "#9f3a36"]


def _quality(stored: dict | None) -> QualityScore | None:
    """Map a persisted quality_score JSON blob back to a QualityScore."""
    return QualityScore(**stored) if stored else None


# ---------------------------------------------------------------------------
# Decks + flashcards
# ---------------------------------------------------------------------------

def _deck_out(deck: Deck) -> DeckOut:
    cards = deck.cards
    return DeckOut(
        id=str(deck.id),
        name=deck.name,
        course=deck.course,
        color=deck.color,
        cards=len(cards),
        mastered=sum(1 for c in cards if c.ease == "mastered"),
        quality=_quality(deck.quality_score),
    )


@router.get("/decks", response_model=list[DeckOut])
def list_decks() -> list[DeckOut]:
    session = get_session()
    try:
        return [_deck_out(d) for d in session.query(Deck).order_by(Deck.created_at.desc()).all()]
    finally:
        session.close()


@router.post("/decks", response_model=DeckOut, status_code=201)
def save_deck(payload: SaveDeckRequest) -> DeckOut:
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Deck name is required")
    session = get_session()
    try:
        color = payload.color or _DECK_COLORS[hash(name) % len(_DECK_COLORS)]
        deck = Deck(
            name=name, course=payload.course or "", color=color,
            quality_score=payload.quality.model_dump() if payload.quality else None,
        )
        for c in payload.cards:
            deck.cards.append(
                Card(type=c.type, front=c.front, back=c.back, due=c.due, ease=c.ease)
            )
        session.add(deck)
        session.commit()
        session.refresh(deck)
        return _deck_out(deck)
    finally:
        session.close()


@router.delete("/decks/{deck_id}", status_code=204)
def delete_deck(deck_id: int) -> None:
    session = get_session()
    try:
        deck = session.get(Deck, deck_id)
        if not deck:
            raise HTTPException(status_code=404, detail="Deck not found")
        session.delete(deck)
        session.commit()
    finally:
        session.close()


@router.get("/flashcards", response_model=list[FlashcardOut])
def list_flashcards(deck: str | None = None, course: str | None = None) -> list[FlashcardOut]:
    session = get_session()
    try:
        q = session.query(Card, Deck).join(Deck, Card.deck_id == Deck.id)
        if deck:
            q = q.filter(Deck.name == deck)
        if course:
            q = q.filter(Deck.course == course)
        return [
            FlashcardOut(
                id=str(card.id),
                type=card.type,  # type: ignore[arg-type]
                front=card.front,
                back=card.back,
                deck=d.name,
                due=card.due,
                ease=card.ease,  # type: ignore[arg-type]
            )
            for card, d in q.all()
        ]
    finally:
        session.close()


@router.put("/flashcards/{card_id}", response_model=FlashcardOut)
def review_card(card_id: int, review: CardReview) -> FlashcardOut:
    session = get_session()
    try:
        card = session.get(Card, card_id)
        if not card:
            raise HTTPException(status_code=404, detail="Card not found")
        card.ease = review.ease
        if review.due:
            card.due = review.due
        session.commit()
        session.refresh(card)
        deck = session.get(Deck, card.deck_id)
        record_activity("flashcard", f"Reviewed card in {deck.name if deck else 'deck'}", deck.course if deck else "", cards=1)
        return FlashcardOut(
            id=str(card.id),
            type=card.type,  # type: ignore[arg-type]
            front=card.front,
            back=card.back,
            deck=deck.name if deck else "",
            due=card.due,
            ease=card.ease,  # type: ignore[arg-type]
        )
    finally:
        session.close()


@router.delete("/flashcards/{card_id}", status_code=204)
def delete_card(card_id: int) -> None:
    session = get_session()
    try:
        card = session.get(Card, card_id)
        if not card:
            raise HTTPException(status_code=404, detail="Card not found")
        session.delete(card)
        session.commit()
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Saved quizzes
# ---------------------------------------------------------------------------

def _quiz_out(q: SavedQuiz) -> QuizOut:
    return QuizOut(
        id=str(q.id),
        title=q.title,
        course=q.course,
        difficulty=q.difficulty,
        grounded=True,
        questions=[QuizQuestionOut(**qq) for qq in q.questions],
        quality=_quality(q.quality_score),
        session_answers=q.session_answers,
        session_current_question=q.session_current_question,
        session_started_at=q.session_started_at.isoformat() if q.session_started_at else None,
    )


@router.get("/quizzes", response_model=list[QuizOut])
def list_quizzes() -> list[QuizOut]:
    session = get_session()
    try:
        return [_quiz_out(q) for q in session.query(SavedQuiz).order_by(SavedQuiz.created_at.desc()).all()]
    finally:
        session.close()


@router.post("/quizzes", response_model=QuizOut, status_code=201)
def save_quiz(payload: SaveQuizRequest) -> QuizOut:
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Quiz title is required")
    session = get_session()
    try:
        quiz = SavedQuiz(
            title=title,
            course=payload.course or "",
            difficulty=payload.difficulty,
            questions=[qq.model_dump() for qq in payload.questions],
            quality_score=payload.quality.model_dump() if payload.quality else None,
        )
        session.add(quiz)
        session.commit()
        session.refresh(quiz)
        return _quiz_out(quiz)
    finally:
        session.close()


@router.delete("/quizzes/{quiz_id}", status_code=204)
def delete_quiz(quiz_id: int) -> None:
    session = get_session()
    try:
        quiz = session.get(SavedQuiz, quiz_id)
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        session.delete(quiz)
        session.commit()
    finally:
        session.close()


@router.patch("/quizzes/{quiz_id}/session", response_model=QuizOut)
def patch_quiz_session(quiz_id: int, payload: QuizSessionPatch) -> QuizOut:
    session = get_session()
    try:
        quiz = session.get(SavedQuiz, quiz_id)
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        quiz.session_answers = payload.session_answers
        quiz.session_current_question = payload.session_current_question
        if quiz.session_started_at is None:
            quiz.session_started_at = datetime.now(timezone.utc)
        session.commit()
        session.refresh(quiz)
        return _quiz_out(quiz)
    finally:
        session.close()


@router.delete("/quizzes/{quiz_id}/session", status_code=204)
def clear_quiz_session(quiz_id: int) -> None:
    session = get_session()
    try:
        quiz = session.get(SavedQuiz, quiz_id)
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        quiz.session_answers = None
        quiz.session_current_question = None
        quiz.session_started_at = None
        session.commit()
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Saved diagrams
# ---------------------------------------------------------------------------

@router.get("/diagrams", response_model=list[DiagramOut])
def list_diagrams() -> list[DiagramOut]:
    session = get_session()
    try:
        return [
            DiagramOut(
                id=str(d.id),
                title=d.title,
                course=d.course,
                kind=d.kind,
                mermaid=d.mermaid,
                grounded=True,
                quality=_quality(d.quality_score),
            )
            for d in session.query(Diagram).order_by(Diagram.created_at.desc()).all()
        ]
    finally:
        session.close()


@router.delete("/diagrams/{diagram_id}", status_code=204)
def delete_diagram(diagram_id: int) -> None:
    session = get_session()
    try:
        d = session.get(Diagram, diagram_id)
        if not d:
            raise HTTPException(status_code=404, detail="Diagram not found")
        session.delete(d)
        session.commit()
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Mind maps
# ---------------------------------------------------------------------------

@router.get("/mindmaps", response_model=list[MindmapOut])
def list_mindmaps() -> list[MindmapOut]:
    session = get_session()
    try:
        return [
            MindmapOut(
                id=str(m.id), title=m.title, course=m.course, text=m.text, grounded=True,
                quality=_quality(m.quality_score),
            )
            for m in session.query(Mindmap).order_by(Mindmap.created_at.desc()).all()
        ]
    finally:
        session.close()


@router.delete("/mindmaps/{mindmap_id}", status_code=204)
def delete_mindmap(mindmap_id: int) -> None:
    session = get_session()
    try:
        m = session.get(Mindmap, mindmap_id)
        if not m:
            raise HTTPException(status_code=404, detail="Mind map not found")
        session.delete(m)
        session.commit()
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Saved revisions
# ---------------------------------------------------------------------------

@router.get("/revisions", response_model=list[SavedRevisionOut])
def list_revisions() -> list[SavedRevisionOut]:
    session = get_session()
    try:
        return [
            SavedRevisionOut(
                id=str(r.id),
                title=r.title,
                topic=r.topic,
                course=r.course,
                format=r.format,
                content=r.content,
                quality=_quality(r.quality_score),
                timestamp=r.created_at.timestamp() * 1000,
            )
            for r in session.query(SavedRevision).order_by(SavedRevision.created_at.desc()).all()
        ]
    finally:
        session.close()


@router.post("/revisions", response_model=SavedRevisionOut, status_code=201)
def save_revision(payload: SaveRevisionRequest) -> SavedRevisionOut:
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title is required")
    session = get_session()
    try:
        rev = SavedRevision(
            title=title,
            topic=payload.topic,
            course=payload.course or "",
            format=payload.format,
            content=payload.content,
            quality_score=payload.quality.model_dump() if payload.quality else None,
        )
        session.add(rev)
        session.commit()
        session.refresh(rev)
        return SavedRevisionOut(
            id=str(rev.id),
            title=rev.title,
            topic=rev.topic,
            course=rev.course,
            format=rev.format,
            content=rev.content,
            quality=_quality(rev.quality_score),
            timestamp=rev.created_at.timestamp() * 1000,
        )
    finally:
        session.close()


@router.delete("/revisions/{revision_id}", status_code=204)
def delete_revision(revision_id: int) -> None:
    session = get_session()
    try:
        rev = session.get(SavedRevision, revision_id)
        if not rev:
            raise HTTPException(status_code=404, detail="Revision not found")
        session.delete(rev)
        session.commit()
    finally:
        session.close()

```


## File: api/routers/prompts.py
```python
"""CRUD router for the prompt library."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from scholarcli.api import prompt_service
from scholarcli.api.prompt_service import CATEGORIES
from scholarcli.storage import get_session
from scholarcli.storage.models import Prompt

router = APIRouter(prefix="/api/prompts", tags=["prompts"])


# ── schemas ────────────────────────────────────────────────────────────────────

class PromptOut(BaseModel):
    id: int
    category: str
    name: str
    style: str
    body: str
    built_in: bool
    active: bool

    model_config = {"from_attributes": True}


class PromptCreate(BaseModel):
    category: str
    name: str
    style: str = ""
    body: str



# ── endpoints ──────────────────────────────────────────────────────────────────

@router.get("/categories")
def list_categories():
    return CATEGORIES


@router.get("/", response_model=list[PromptOut])
def list_prompts(category: str | None = None):
    session = get_session()
    try:
        q = session.query(Prompt)
        if category:
            q = q.filter(Prompt.category == category)
        return q.order_by(Prompt.category, Prompt.id).all()
    finally:
        session.close()


@router.post("/", response_model=PromptOut, status_code=201)
def create_prompt(body: PromptCreate):
    session = get_session()
    try:
        p = Prompt(
            category=body.category,
            name=body.name,
            style=body.style,
            body=body.body,
            built_in=False,
            active=False,
        )
        session.add(p)
        session.commit()
        session.refresh(p)
        return p
    finally:
        session.close()


@router.put("/{prompt_id}/activate", response_model=PromptOut)
def activate_prompt(prompt_id: int):
    session = get_session()
    try:
        target = session.get(Prompt, prompt_id)
        if not target:
            raise HTTPException(404, "Prompt not found")
        # Deactivate all in same category
        session.query(Prompt).filter(Prompt.category == target.category).update({"active": False})
        target.active = True
        session.commit()
        session.refresh(target)
        return target
    finally:
        session.close()


@router.delete("/{prompt_id}", status_code=204)
def delete_prompt(prompt_id: int):
    session = get_session()
    try:
        target = session.get(Prompt, prompt_id)
        if not target:
            raise HTTPException(404, "Prompt not found")
        if target.built_in:
            raise HTTPException(400, "Cannot delete built-in prompts")
        session.delete(target)
        session.commit()
    finally:
        session.close()

```


## File: api/routers/trace.py
```python
"""RAG retrieval trace endpoint."""

from __future__ import annotations

from fastapi import APIRouter

from scholarcli.api import rag_service, trace_service
from scholarcli.api.schemas import (
    TraceAnalyticsOut,
    TraceFeedbackRequest,
    TraceOut,
)

router = APIRouter(prefix="/api", tags=["trace"])


@router.get("/trace/last", response_model=TraceOut)
def last_trace() -> TraceOut:
    data = rag_service.get_last_trace()
    if not data:
        from scholarcli.config import get_settings

        s = get_settings()
        return TraceOut(embeddingModel=s.models.embedding, topK=s.retrieval.top_k)
    return TraceOut(**data)


@router.get("/trace/analytics", response_model=TraceAnalyticsOut)
def trace_analytics() -> TraceAnalyticsOut:
    return TraceAnalyticsOut(**trace_service.analytics())


@router.post("/trace/feedback", status_code=204)
def trace_feedback(req: TraceFeedbackRequest) -> None:
    trace_service.record_feedback(req.chunkId, req.source, req.query, req.similarity)

```
