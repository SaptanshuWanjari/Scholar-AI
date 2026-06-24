# Backend RAG Context

This document contains the entire backend codebase for AI agents to understand the context.

## Directory Structure
```text
scholarcli/
    __init__.py
    cli.py
    config.py
    storage/
        models.py
        __init__.py
        vectors.py
    llm/
        __init__.py
    ingest/
        __init__.py
        vision.py
        tables.py
        analyze.py
        loaders.py
        chunker.py
        pipeline.py
        ocr.py
    rag/
        state.py
        graph.py
        __init__.py
        prompts.py
        nodes/
            router.py
            retriever.py
            __init__.py
            verifier.py
            generator.py
    api/
        __init__.py
        activity_service.py
        knowledge_service.py
        prompt_service.py
        app.py
        parsers.py
        pyq_service.py
        schemas.py
        rag_service.py
        routers/
            __init__.py
            courses.py
            trace.py
            search.py
            dashboard.py
            knowledge.py
            ask.py
            documents.py
            onboarding.py
            notebooks.py
            study.py
            library.py
            prompts.py
            teach.py
            pyq.py
            settings.py
            exam.py
            differences.py
            reading.py
```

## File Contents

### cli.py
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

### config.py
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

### api/__init__.py
```python
"""HTTP API layer (FastAPI) exposing the RAG pipeline to the web frontend."""

```

### api/activity_service.py
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

### api/knowledge_service.py
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

```

### api/prompt_service.py
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
    """Return the active prompt body for a category, or None to use the default.

    Best-effort: any DB/lookup failure returns None so generation falls back to
    the hard-coded RAG default.
    """
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

### api/app.py
```python
"""FastAPI application factory.

Run with: ``scholar serve`` (or ``uvicorn scholarcli.api.app:app --reload``).
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from scholarcli.storage import init_db
from scholarcli.api.prompt_service import seed_prompts


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
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
        courses,
        dashboard,
        differences,
        documents,
        exam,
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
        courses,
        dashboard,
        differences,
        documents,
        exam,
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

### api/parsers.py
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

### api/pyq_service.py
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
    """Load a document's plain text (joined pages) for extraction."""
    content_hash = hashlib.sha256(path.read_bytes()).hexdigest()
    pages, _ = load_document(path, content_hash)
    return "\n\n".join(p.text for p in pages).strip()


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

### api/schemas.py
```python
"""Pydantic request/response models.

Field names use the exact camelCase keys the React frontend expects
(``sizeKb``, ``addedAt``) so responses serialize without extra aliasing.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel


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


class GenerateQuizRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None
    difficulty: Literal["Easy", "Medium", "Hard"] = "Medium"


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


class GenerateDiagramRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None
    type: str | None = None  # flowchart | decision_tree | concept_map


class DiagramOut(BaseModel):
    id: str
    title: str
    course: str
    kind: str
    mermaid: str
    grounded: bool = True


class GenerateMindmapRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None


class MindmapOut(BaseModel):
    id: str
    title: str
    course: str
    text: str
    grounded: bool = True


class GenerateRevisionRequest(BaseModel):
    topic: str | None = None
    course: str | None = None
    document: str | None = None
    format: Literal["notes", "concepts", "formulas", "summary"] = "notes"


class RevisionOut(BaseModel):
    title: str
    markdown: str
    grounded: bool = True


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


class SaveDeckRequest(BaseModel):
    name: str
    course: str | None = None
    color: str | None = None
    cards: list[FlashcardOut] = []


class CardReview(BaseModel):
    ease: Literal["new", "learning", "mastered"]
    due: str | None = None


class SaveQuizRequest(BaseModel):
    title: str
    course: str | None = None
    difficulty: str = "Medium"
    questions: list[QuizQuestionOut] = []


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


class ExamSubmitRequest(BaseModel):
    answers: dict[str, str] = {}
    timeSpent: int | None = None


class ExamResultOut(BaseModel):
    score: int
    correct: int
    total: int
    topicPerformance: list[dict] = []
    difficultyAnalysis: list[dict] = []
    review: list[dict] = []
    recommendedRevisions: list[str] = []


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


class SaveDifferenceRequest(BaseModel):
    title: str
    content: str
    course: str | None = None


class DifferenceTableItem(BaseModel):
    id: int
    title: str
    course: str
    content: str
    createdAt: str


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

```

### api/rag_service.py
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


def run_ask(question: str, course: str | None = None, document: str | None = None, route: str | None = None, search_query: str | None = None) -> dict:
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

    return {
        "content": result.get("answer", "(no answer)"),
        "sources": serialize_chunks(retrieved),
        "confidence": _confidence(retrieved, grounded),
        "grounded": grounded,
        "route": used_route,
    }


def _build_generation_prompt(state: GraphState) -> tuple[str, str]:
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
    return system, user


def stream_ask(
    question: str, course: str | None = None, document: str | None = None, route: str | None = None, search_query: str | None = None
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

    # Router (LLM classify unless route forced) → retrieve → verify.
    state = route_query(state)
    state = retrieve(state)
    state = verify(state)

    retrieved = state.get("retrieved", []) or []
    grounded = bool(state.get("grounded", False))
    used_route = state.get("route", route)
    _record_trace(question, used_route, retrieved, grounded)

    sources = serialize_chunks(retrieved)
    confidence = _confidence(retrieved, grounded)

    if not grounded:
        yield {"type": "token", "value": NOT_GROUNDED}
        yield {
            "type": "done",
            "sources": [],
            "confidence": None,
            "grounded": False,
            "route": used_route,
        }
        return

    system, user = _build_generation_prompt(state)
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
        "confidence": confidence,
        "grounded": True,
        "route": used_route,
    }

```

### api/routers/__init__.py
```python
"""API routers."""

```

### api/routers/courses.py
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

### api/routers/trace.py
```python
"""RAG retrieval trace endpoint."""

from __future__ import annotations

from fastapi import APIRouter

from scholarcli.api import rag_service
from scholarcli.api.schemas import TraceOut

router = APIRouter(prefix="/api", tags=["trace"])


@router.get("/trace/last", response_model=TraceOut)
def last_trace() -> TraceOut:
    data = rag_service.get_last_trace()
    if not data:
        from scholarcli.config import get_settings

        s = get_settings()
        return TraceOut(embeddingModel=s.models.embedding, topK=s.retrieval.top_k)
    return TraceOut(**data)

```

### api/routers/search.py
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

### api/routers/dashboard.py
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

### api/routers/knowledge.py
```python
"""Knowledge-graph endpoints — build, fetch graph, inspect concepts."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from scholarcli.api import knowledge_service
from scholarcli.api.schemas import (
    ConceptInspectorOut,
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

```

### api/routers/ask.py
```python
"""Ask / chat endpoints (one-shot + SSE streaming)."""

from __future__ import annotations

import json

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import StreamingResponse

from scholarcli.api import rag_service
from scholarcli.api.activity_service import record_activity
from scholarcli.api.schemas import AskRequest, AskResponse, SourceOut

router = APIRouter(prefix="/api", tags=["ask"])


@router.post("/ask", response_model=AskResponse)
async def ask(payload: AskRequest) -> AskResponse:
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="question is required")
    result = await run_in_threadpool(
        rag_service.run_ask, question, payload.course, payload.document, payload.route
    )
    record_activity("ask", f"Asked: {question}", payload.course or "")
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

    def event_stream():
        try:
            for event in rag_service.stream_ask(
                question, payload.course, payload.document, payload.route
            ):
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as exc:  # noqa: BLE001 — report errors over the stream
            err = {"type": "error", "value": str(exc)}
            yield f"data: {json.dumps(err)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

```

### api/routers/documents.py
```python
"""Document + source-search endpoints."""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

import scholarcli.llm
from scholarcli.api.activity_service import record_activity
from scholarcli.api.rag_service import serialize_chunks
from scholarcli.api.schemas import DocumentOut, DocumentPatch, SourceOut
from scholarcli.config import get_settings
from scholarcli.ingest.pipeline import ingest_file
from scholarcli.storage import get_session
from scholarcli.storage.models import Course, Document
from scholarcli.storage.vectors import delete_document, search

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
    file: UploadFile = File(...), course: str = Form(...)
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

    try:
        status = await run_in_threadpool(ingest_file, dest, course_name)
    except Exception as exc:  # noqa: BLE001 — surface ingest failures to the client
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {exc}") from exc

    if status == "no-content":
        raise HTTPException(status_code=422, detail="No extractable text in document")

    session = get_session()
    try:
        row = (
            session.query(Document, Course)
            .join(Course, Document.course_id == Course.id)
            .filter(Document.path == str(dest.resolve()), Course.name == course_name)
            .first()
        )
        if not row:
            raise HTTPException(status_code=500, detail="Document not found after ingest")
        doc, c = row
        record_activity("document", f"Indexed {doc.title}", c.name)
        return _serialize(doc, c.name)
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
    query = q.strip()
    if not query:
        return []
    emb = scholarcli.llm.get_embeddings()
    vector = emb.embed_query(query)
    results = search(vector, top_k=max(1, min(limit, 20)), course=course)
    return [SourceOut(**s) for s in serialize_chunks(results)]


from fastapi.responses import FileResponse

@router.get("/documents/images/{content_hash}/{filename}")
def get_document_image(content_hash: str, filename: str) -> FileResponse:
    images_dir = get_settings().paths.resolved_data_dir() / "images" / content_hash
    image_path = images_dir / filename
    if not image_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(image_path)


```

### api/routers/onboarding.py
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

### api/routers/notebooks.py
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

### api/routers/study.py
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
    result = await run_in_threadpool(run_ask, query, req.course, req.document, "flashcards", topic)
    cards = parsers.parse_flashcards(result["content"], deck=topic)
    record_activity("flashcard", f"Generated flashcards: {topic}", req.course or "")
    return FlashcardSet(
        deck=topic,
        course=req.course,
        grounded=result["grounded"],
        cards=[FlashcardOut(**c) for c in cards],
    )


@router.post("/quizzes/generate", response_model=QuizOut)
async def generate_quiz(req: GenerateQuizRequest) -> QuizOut:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    query = f"Generate a {req.difficulty} difficulty quiz about: {topic}"
    result = await run_in_threadpool(run_ask, query, req.course, req.document, "quiz", topic)
    questions = parsers.parse_quiz(result["content"])
    record_activity("quiz", f"Generated quiz: {topic}", req.course or "")
    return QuizOut(
        id=_stable_id("quiz", topic, req.difficulty),
        title=topic,
        course=req.course or "All courses",
        difficulty=req.difficulty,
        grounded=result["grounded"],
        questions=[QuizQuestionOut(**q) for q in questions],
    )


@router.post("/diagrams/generate", response_model=DiagramOut)
async def generate_diagram(req: GenerateDiagramRequest) -> DiagramOut:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    kind = (req.type or "flowchart").replace("_", " ")
    query = f"Generate a {kind} diagram about: {topic}"
    result = await run_in_threadpool(run_ask, query, req.course, req.document, "mermaid", topic)
    mermaid = parsers.strip_mermaid_fences(result["content"])
    course_name = req.course or "All courses"
    kind_label = kind.title()
    diagram_id = _stable_id("dg", topic, kind)

    # Persist grounded diagrams so the library survives reloads.
    if result["grounded"] and mermaid.strip():
        from scholarcli.storage import get_session
        from scholarcli.storage.models import Diagram

        session = get_session()
        try:
            row = Diagram(title=topic, course=course_name, kind=kind_label, mermaid=mermaid)
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
    )


@router.post("/mindmaps/generate", response_model=MindmapOut)
async def generate_mindmap(req: GenerateMindmapRequest) -> MindmapOut:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    query = f"Generate a mind map about: {topic}"
    result = await run_in_threadpool(run_ask, query, req.course, req.document, "mindmap", topic)
    course_name = req.course or "All courses"
    mindmap_id = _stable_id("mm", topic)

    if result["grounded"] and result["content"].strip():
        from scholarcli.storage import get_session
        from scholarcli.storage.models import Mindmap

        session = get_session()
        try:
            row = Mindmap(title=topic, course=course_name, text=result["content"])
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
    )


@router.post("/revision/generate", response_model=RevisionOut)
async def generate_revision(req: GenerateRevisionRequest) -> RevisionOut:
    subject = (req.topic or req.course or "").strip()
    if not subject:
        raise HTTPException(status_code=400, detail="topic or course is required")
    format_hint = {
        "notes": "concise revision notes",
        "concepts": "a list of key concepts with short explanations",
        "formulas": "a formula sheet with each formula explained",
        "summary": "a high-level summary",
    }[req.format]
    query = f"Create {format_hint} for: {subject}"
    result = await run_in_threadpool(run_ask, query, req.course, req.document, "study_notes", subject)
    return RevisionOut(
        title=subject,
        markdown=result["content"],
        grounded=result["grounded"],
    )


@router.post("/revision/generate/stream")
async def generate_revision_stream(req: GenerateRevisionRequest) -> StreamingResponse:
    subject = (req.topic or req.course or "").strip()
    if not subject:
        raise HTTPException(status_code=400, detail="topic or course is required")
    format_hint = {
        "notes": "concise revision notes",
        "concepts": "a list of key concepts with short explanations",
        "formulas": "a formula sheet with each formula explained",
        "summary": "a high-level summary",
    }[req.format]
    query = f"Create {format_hint} for: {subject}"
    record_activity("revision", f"Generated revision: {subject}", req.course or "")

    def event_stream():
        try:
            for event in stream_ask(query, req.course, req.document, "study_notes", subject):
                # Attach title on the done event so the frontend can label the result
                if event.get("type") == "done":
                    event["title"] = subject
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as exc:  # noqa: BLE001
            yield f"data: {json.dumps({'type': 'error', 'value': str(exc)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

```

### api/routers/library.py
```python
"""Persistence for generated study artifacts: decks, flashcards, quizzes."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from scholarcli.api.activity_service import record_activity
from scholarcli.api.schemas import (
    CardReview,
    DeckOut,
    DiagramOut,
    FlashcardOut,
    MindmapOut,
    QuizOut,
    QuizQuestionOut,
    SaveDeckRequest,
    SaveQuizRequest,
)
from scholarcli.storage import get_session
from scholarcli.storage.models import Card, Deck, Diagram, Mindmap, SavedQuiz

router = APIRouter(prefix="/api", tags=["library"])

_DECK_COLORS = ["#4f4d7a", "#3f6b6f", "#3f7a4e", "#a3771f", "#6b3f6f", "#9f3a36"]


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
        deck = Deck(name=name, course=payload.course or "", color=color)
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
            MindmapOut(id=str(m.id), title=m.title, course=m.course, text=m.text, grounded=True)
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

```

### api/routers/prompts.py
```python
"""CRUD router for the prompt library."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from scholarcli.api.prompt_service import CATEGORIES, active_body, seed_prompts
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

### api/routers/teach.py
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

### api/routers/pyq.py
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

```

### api/routers/settings.py
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

### api/routers/exam.py
```python
"""Exam mode — generate a timed question set and grade submissions.

Sessions live in memory (keyed by sessionId) for the life of the process —
enough to support generate → take → submit without a new persistence table.
"""

from __future__ import annotations

from collections import defaultdict

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
    ExamSubmitRequest,
)
from scholarcli.llm import get_llm
from scholarcli.rag.prompts import QUIZ_SYSTEM
from scholarcli.storage import get_session
from scholarcli.storage.models import PYQQuestion

router = APIRouter(prefix="/api/exams", tags=["exam"])

# sessionId -> {"questions": [dict], "topic": str}
_sessions: dict[str, dict] = {}


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

    Used for PYQ-driven exams: the source of truth is the user's uploaded
    question papers, not the document vector index (which may be empty for a
    course that only has PYQs).
    """
    system = active_body("quiz") or QUIZ_SYSTEM
    llm = get_llm("quiz")
    resp = llm.invoke([SystemMessage(content=system), HumanMessage(content=query)])
    return resp.content if hasattr(resp, "content") else str(resp)


@router.post("/generate", response_model=ExamSessionOut)
async def generate_exam(req: ExamGenerateRequest) -> ExamSessionOut:
    subject = (req.topic or req.course or "").strip()
    if not subject:
        raise HTTPException(status_code=400, detail="topic or course is required")

    types_str = ", ".join(req.types) if req.types else "multiple choice"

    # PYQ-aware generation: mirror the real paper's topic/difficulty/style mix
    # and force each question to be tagged with one of the PYQ topics, so the
    # submit step can accumulate per-topic accuracy.
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

    # Ground PYQ-driven exams in the user's actual uploaded papers (a sample of
    # real past questions) so generation works even when the course has no
    # indexed notes in the document vector store.
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

    session_id = f"exam-{abs(hash(subject + content)) % 10_000_000}"
    _sessions[session_id] = {"questions": stored, "topic": subject, "course": req.pyqCourse}

    return ExamSessionOut(
        sessionId=session_id,
        questions=questions,
        grounded=grounded and bool(questions),
    )


@router.post("/{session_id}/submit", response_model=ExamResultOut)
async def submit_exam(session_id: str, payload: ExamSubmitRequest) -> ExamResultOut:
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Exam session not found or expired")

    questions = session["questions"]
    total = len(questions)

    # Pre-grade short/long questions with LLM
    needs_grading = [q for q in questions if q.get("type") in ("short", "long")]
    graded_results = {}
    if needs_grading:
        prompt = "Grade the following user answers against the expected answers. Respond strictly with a JSON object mapping question ID to a boolean (true if the given answer is conceptually correct or very close, false otherwise). Be lenient for minor typos or phrasing differences.\n\n"
        for q in needs_grading:
            given = (payload.answers.get(q["id"]) or "").strip()
            expected = (q.get("answer") or "").strip()
            prompt += f'ID: {q["id"]}\nQuestion: {q["prompt"]}\nExpected: {expected}\nGiven: {given}\n\n'
        prompt += 'Output ONLY the JSON object, e.g. `{"e1": true, "e2": false}`'
        try:
            import re, json
            res = await run_in_threadpool(run_ask, prompt, None, None, "study")
            match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', res["content"], re.DOTALL | re.IGNORECASE)
            json_str = match.group(1) if match else res["content"]
            if "{" in json_str and "}" in json_str:
                json_str = json_str[json_str.find("{"):json_str.rfind("}")+1]
                graded_results = json.loads(json_str)
        except Exception:
            pass

    correct = 0
    by_topic: dict[str, list[int]] = defaultdict(lambda: [0, 0])  # topic -> [correct, total]
    by_diff: dict[str, list[int]] = defaultdict(lambda: [0, 0])

    review_list = []
    incorrect_questions = []

    for q in questions:
        given = (payload.answers.get(q["id"]) or "").strip()
        expected = (q.get("answer") or "").strip()
        
        if q.get("type") in ("short", "long"):
            ok = graded_results.get(q["id"], False)
        else:
            import re
            g_clean = re.sub(r'^[a-d][\)\.\:]\s*', '', given.lower()).strip()
            e_clean = re.sub(r'^[a-d][\)\.\:]\s*', '', expected.lower()).strip()
            ok = bool(e_clean) and g_clean == e_clean
            
        if ok:
            correct += 1
        else:
            incorrect_questions.append({"prompt": q["prompt"], "topic": q["topic"], "given": given, "expected": expected})
            
        by_topic[q["topic"]][0] += int(ok)
        by_topic[q["topic"]][1] += 1
        by_diff[q["difficulty"]][0] += int(ok)
        by_diff[q["difficulty"]][1] += 1
        
        review_list.append({
            "id": q["id"],
            "prompt": q["prompt"],
            "given": given,
            "expected": expected,
            "correct": ok,
            "topic": q["topic"]
        })

    score = round(100 * correct / total) if total else 0
    record_activity("exam", f"Exam: {session['topic']} — {score}%", "", minutes=payload.timeSpent // 60 if payload.timeSpent else None)
    # Feed the PYQ accuracy loop when this exam was generated from a course's PYQs.
    if session.get("course"):
        pyq_service.record_topic_results(session["course"], dict(by_topic))
    topic_perf = [
        {"topic": t, "score": round(100 * c / n) if n else 0} for t, (c, n) in by_topic.items()
    ]
    diff_analysis = [
        {"level": lvl, "correct": c, "total": n} for lvl, (c, n) in by_diff.items()
    ]

    recommended_revisions = []
    if incorrect_questions:
        prompt = f"The user answered these exam questions incorrectly:\n"
        for iq in incorrect_questions:
            prompt += f"- Q: {iq['prompt']} (Topic: {iq['topic']})\n"
        prompt += "\nBased on these mistakes, identify the specific weak topics. Return ONLY a bulleted list of 2-3 short, highly actionable recommended revision topics. Do not include introductory text."
        
        try:
            result = await run_in_threadpool(run_ask, prompt, None, None, "study")
            content = result["content"]
            lines = [line.strip() for line in content.split("\n")]
            for line in lines:
                if line.startswith("- "):
                    recommended_revisions.append(line[2:].strip())
                elif line.startswith("* "):
                    recommended_revisions.append(line[2:].strip())
                elif len(line) > 2 and line[0].isdigit() and line[1] in [".", ")"]:
                    recommended_revisions.append(line[2:].strip())
            if not recommended_revisions:
                recommended_revisions = [line for line in lines if line]
        except Exception:
            pass

    return ExamResultOut(
        score=score,
        correct=correct,
        total=total,
        topicPerformance=topic_perf,
        difficultyAnalysis=diff_analysis,
        review=review_list,
        recommendedRevisions=recommended_revisions[:3]
    )

```

### api/routers/differences.py
```python
"""Difference-table endpoints — generate, save, list, delete."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.api.activity_service import record_activity
from scholarcli.api.prompt_service import active_body
from scholarcli.api.rag_service import run_ask
from scholarcli.api.schemas import (
    DifferenceOut,
    DifferenceTableItem,
    GenerateDifferenceRequest,
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
    else:
        content = await run_in_threadpool(_direct_generate, topic)
        grounded = False

    record_activity("difference", f"Generated difference table: {topic}", req.course or "")
    return DifferenceOut(
        title=topic,
        content=content,
        grounded=grounded,
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

### api/routers/reading.py
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

### ingest/__init__.py
```python
# ingest package

```

### ingest/vision.py
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

### ingest/tables.py
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

### ingest/analyze.py
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

### ingest/loaders.py
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

### ingest/chunker.py
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

### ingest/pipeline.py
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

### ingest/ocr.py
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

### llm/__init__.py
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

### rag/state.py
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

### rag/graph.py
```python
"""LangGraph wiring — assembles the router → retrieve → verify → generate pipeline
with conditional edges so future study modes slot in cleanly.
"""

from __future__ import annotations

from langgraph.graph import END, StateGraph

from scholarcli.rag.nodes.generator import generate
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
    builder.add_node("verify", verify)
    builder.add_node("generate", generate)

    builder.set_entry_point("router")

    # Router → retrieve (if wired) or generate (stub answer).
    builder.add_conditional_edges(
        "router",
        _should_retrieve,
        {"retrieve": "retrieve", "generate": "generate"},
    )

    builder.add_edge("retrieve", "verify")
    builder.add_edge("verify", "generate")
    builder.add_edge("generate", END)

    return builder


def get_rag_app():
    """Return a compiled LangGraph runnable (cached per process)."""
    return build_graph().compile()

```

### rag/__init__.py
```python
"""RAG pipeline — single entry point ``build_rag()`` returns a compiled
LangGraph ``Runnable`` that threads:

    router → retrieve → verify → generate

Invoke it with: ``rag.invoke({"query": "...", "course": "..."})``
"""

from scholarcli.rag.graph import get_rag_app

build_rag = get_rag_app

```

### rag/prompts.py
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

### rag/nodes/router.py
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

### rag/nodes/retriever.py
```python
"""Retrieval node — embed the user query and search LanceDB."""

from __future__ import annotations

from scholarcli.config import get_settings
import scholarcli.llm
from scholarcli.rag.state import GraphState
from scholarcli.storage.vectors import search


def retrieve(state: GraphState) -> GraphState:
    s = get_settings()
    emb = scholarcli.llm.get_embeddings()
    query = state.get("search_query") or state["query"]
    course = state.get("course")

    # embed_query returns list[float].
    query_vector: list[float] = emb.embed_query(query)
    results = search(query_vector, top_k=s.retrieval.top_k, course=course, document=state.get("document"))
    state["retrieved"] = results
    return state

```

### rag/nodes/__init__.py
```python
# RAG node functions

```

### rag/nodes/verifier.py
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

### rag/nodes/generator.py
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

### storage/models.py
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
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
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
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class Mindmap(Base):
    __tablename__ = "mindmaps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    text: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class DifferenceTable(Base):
    __tablename__ = "difference_tables"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    content: Mapped[str] = mapped_column(Text, nullable=False)
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

```

### storage/__init__.py
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
    ],
    "notebooks": [
        ("tags", "JSON"),
    ],
    "pyq_questions": [
        ("subtopics", "JSON"),
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

### storage/vectors.py
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
            db.create_table(TABLE_NAME, data=rows)
        else:
            tbl.add(rows)
    else:
        # First batch — create the table so the vector dimension is correct.
        db.create_table(TABLE_NAME, data=rows)


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

```

