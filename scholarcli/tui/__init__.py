"""ScholarCLI TUI — full dashboard + feature screens wired to backend.

All screens use real data from SQLite/LanceDB. Study mode screens
(flashcards, quiz, diagrams, mindmap, study notes) go through the
RAG pipeline with explicit route forcing.
"""

from __future__ import annotations

import asyncio
from datetime import datetime, timezone

import urllib.request
from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Horizontal, Vertical, ScrollableContainer
from textual.screen import Screen, ModalScreen
from textual.widgets import Footer, Input, RichLog, Rule, Static, DataTable, Button, DirectoryTree
from pathlib import Path
from typing import Iterable
import os


# ---------------------------------------------------------------------------
# CSS — dark navy/purple theme matching reference design
# ---------------------------------------------------------------------------

_CSS = """
Screen {
    background: #0f1219;
    color: #c9d1d9;
}

/* ── Header bar ─────────────────────────────────────────────── */

#header-bar {
    height: 3;
    background: #161b22;
    border-bottom: solid #30363d;
}

#hdr-left {
    width: auto;
    height: 100%;
    padding: 0 2;
    content-align: left middle;
}

#hdr-center {
    width: 1fr;
    height: 100%;
    content-align: center middle;
}

#hdr-right {
    width: auto;
    height: 100%;
    padding: 0 2;
    content-align: right middle;
}

/* ── Main layout ────────────────────────────────────────────── */

#main-area {
    height: 1fr;
}

/* ── Sidebar ────────────────────────────────────────────────── */

#sidebar {
    width: 30;
    background: #161b22;
    border-right: solid #30363d;
    padding: 1 0;
}

.nav-item {
    height: 3;
    padding: 1 2;
    content-align: left middle;
}

.nav-item:hover {
    background: #1c2333;
}

.nav-active {
    background: #7c3aed;
    color: #ffffff;
}

.nav-active:hover {
    background: #7c3aed;
}

.nav-quit {
    color: #ef4444;
}

.nav-spacer {
    height: 1fr;
}

/* ── Center panel ───────────────────────────────────────────── */

#center {
    width: 1fr;
    padding: 1 3;
}

#welcome {
    height: auto;
    padding: 1 0;
}

.section-title {
    color: #c084fc;
    text-style: bold;
    height: auto;
    padding: 1 0 0 0;
}

/* ── Quick Actions ──────────────────────────────────────────── */

#quick-actions {
    height: auto;
    padding: 1 0;
}

.action-card {
    width: 1fr;
    height: 7;
    border: round #30363d;
    content-align: center middle;
    text-align: center;
    margin: 0 1;
}

.action-card:hover {
    background: #1c2333;
    border: round #484f58;
}

.card-active {
    border: round #22c55e;
}

.card-active:hover {
    border: round #22c55e;
    background: #0d2818;
}

/* ── Documents ──────────────────────────────────────────────── */

#docs-header {
    height: auto;
}

#docs-title {
    width: 1fr;
}

#docs-viewall {
    width: auto;
    padding: 1 0 0 0;
    color: #c084fc;
}

.doc-row {
    height: auto;
    padding: 1 2;
    border-bottom: solid #1c2333;
}

.doc-row:hover {
    background: #1c2333;
}

/* ── Activity panel ─────────────────────────────────────────── */

#activity-panel {
    width: 38;
    background: #161b22;
    border-left: solid #30363d;
    padding: 1 2;
}

.activity-item {
    height: auto;
    padding: 1 0;
    border-bottom: solid #1e2530;
}

.view-all {
    height: auto;
    padding: 1 0;
    color: #c084fc;
}

/* ── Shared ─────────────────────────────────────────────────── */

Rule {
    color: #30363d;
    margin: 1 0;
}

Footer {
    background: #161b22;
    color: #8b949e;
}

/* ── Sub-screen shared styles ──────────────────────────────── */

.screen-header {
    height: 3;
    width: 100%;
    background: #161b22;
    border-bottom: solid #30363d;
    content-align: center middle;
}

.screen-body {
    padding: 1 3;
}

#ask-split {
    height: 1fr;
}

#sources-panel {
    width: 35%;
    border-right: solid #30363d;
    display: block;
}

#sources-panel.hidden {
    display: none;
}

#answer-panel {
    width: 1fr;
}

.panel-title {
    color: #c084fc;
    text-style: bold;
    height: auto;
    padding: 0 1;
}

#sources-log, #chat-log {
    height: 1fr;
    border: none;
    background: #0f1219;
    padding: 0 1;
    overflow-y: auto;
    scrollbar-size-vertical: 1;
}

#chat-input, .screen-input {
    margin: 0 1;
    background: #161b22;
    border: round #30363d;
}

#chat-input:focus, .screen-input:focus {
    border: round #7c3aed;
}

/* ── DataTable styling ─────────────────────────────────────── */

DataTable {
    height: auto;
    max-height: 20;
    margin: 1 0;
}

/* ── Stats row ─────────────────────────────────────────────── */

.stats-row {
    height: auto;
    padding: 1 0;
}

.stat-box {
    width: 1fr;
    height: 5;
    border: round #30363d;
    content-align: center middle;
    text-align: center;
    margin: 0 1;
}

/* ── Result log ────────────────────────────────────────────── */

.result-log {
    height: 1fr;
    border: none;
    background: #0f1219;
    padding: 1 3;
}

/* ── File Picker Modal ───────────────────────────────────────── */

FilePickerModal {
    align: center middle;
    background: rgba(15, 18, 25, 0.8);
}

#picker-dialog {
    width: 80;
    height: 40;
    background: #161b22;
    border: round #7c3aed;
    padding: 1 2;
}

#picker-tree {
    height: 1fr;
    border: solid #30363d;
    margin: 1 0;
}

#ingest-path-container {
    height: auto;
    margin: 1 3;
}

#ingest-path-container .screen-input {
    margin: 0;
    width: 1fr;
}

#btn-browse {
    margin: 0 0 0 1;
    min-width: 15;
}
"""


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _fmt_date(dt: datetime | None) -> str:
    """Format datetime to short display string."""
    if dt is None:
        return "—"
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    now = datetime.now(timezone.utc)
    delta = now - dt
    if delta.days == 0:
        return "Today"
    if delta.days == 1:
        return "Yesterday"
    if delta.days < 7:
        return f"{delta.days}d ago"
    return dt.strftime("%b %d")


def _get_documents(limit: int = 20) -> list[dict]:
    """Fetch documents from SQLite, most recent first."""
    try:
        from scholarcli.storage import get_session
        from scholarcli.storage.models import Course, Document
        session = get_session()
        docs = (
            session.query(Document)
            .join(Course)
            .order_by(Document.indexed_at.desc())
            .limit(limit)
            .all()
        )
        return [
            {
                "id": d.id,
                "title": d.title,
                "file_type": d.file_type,
                "course": d.course.name,
                "indexed_at": d.indexed_at,
            }
            for d in docs
        ]
    except Exception:
        return []


def _get_courses() -> list[dict]:
    """Fetch courses with document counts from SQLite."""
    try:
        from scholarcli.storage import get_session
        from scholarcli.storage.models import Course
        session = get_session()
        courses = session.query(Course).order_by(Course.name).all()
        return [
            {"id": c.id, "name": c.name, "doc_count": len(c.documents)}
            for c in courses
        ]
    except Exception:
        return []


async def _check_ollama() -> bool:
    """Ping Ollama API, return True if reachable."""
    # ponytail: stdlib instead of httpx dependency
    def _ping() -> bool:
        try:
            from scholarcli.config import get_settings
            url = get_settings().ollama.base_url.rstrip("/") + "/api/tags"
            req = urllib.request.Request(url, method="GET")
            with urllib.request.urlopen(req, timeout=3) as resp:
                return resp.status == 200
        except Exception:
            return False
    return await asyncio.to_thread(_ping)


async def _run_rag(query: str, course: str | None, route: str | None = None) -> dict:
    """Run RAG pipeline in thread. Optionally force a route."""
    from scholarcli.rag import build_rag

    inputs: dict = {"query": query, "course": course}
    if route:
        inputs["route"] = route

    return await asyncio.to_thread(lambda: build_rag().invoke(inputs))


# ---------------------------------------------------------------------------
# Ask Screen — chat wired to existing RAG pipeline
# ---------------------------------------------------------------------------

class AskScreen(Screen):
    """Chat interface for RAG queries."""

    BINDINGS = [
        Binding("escape", "go_back", "Back"),
        Binding("s", "toggle_sources", "Toggle Sources"),
    ]

    def __init__(self, course: str | None = None) -> None:
        super().__init__()
        self._course = course

    def compose(self) -> ComposeResult:
        yield Static("[b]❯ Ask — ScholarCLI[/b]", classes="screen-header")
        with Horizontal(id="ask-split"):
            with Vertical(id="sources-panel"):
                yield Static("SOURCES", classes="panel-title")
                yield RichLog(id="sources-log", highlight=True, markup=True, wrap=True)
            with Vertical(id="answer-panel"):
                yield Static("ANSWER", classes="panel-title")
                yield RichLog(id="chat-log", highlight=True, markup=True, wrap=True)
        yield Input(
            placeholder="Ask a question about your materials…",
            id="chat-input",
        )

    def on_mount(self) -> None:
        log = self.query_one("#chat-log", RichLog)
        course_info = f" (course: {self._course})" if self._course else ""
        log.write(f"[bold green]ScholarCLI[/bold green] — Ask Mode{course_info}")
        log.write("[dim]Type a question and press Enter. Escape to go back.[/dim]\n")

        src_log = self.query_one("#sources-log", RichLog)
        src_log.write("[dim]Waiting for query…[/dim]")

    def action_toggle_sources(self) -> None:
        panel = self.query_one("#sources-panel")
        panel.toggle_class("hidden")

    async def on_input_submitted(self, event: Input.Submitted) -> None:
        text = event.value.strip()
        if not text:
            return
        event.input.clear()
        log = self.query_one("#chat-log", RichLog)
        src_log = self.query_one("#sources-log", RichLog)
        
        log.write(f"[bold cyan]▶[/bold cyan] {text}")
        src_log.clear()
        src_log.write("[dim]Searching…[/dim]")

        try:
            result = await _run_rag(text, self._course)
            answer = result.get("answer", "(no answer)")

            chunks = result.get("retrieved", [])
            src_log.clear()
            if chunks:
                seen: set[str] = set()
                valid_chunks = []
                for ch in chunks:
                    title = ch.get("title", "?")
                    page = ch.get("page", "?")
                    c_key = f"{title}_{page}"
                    if c_key not in seen:
                        seen.add(c_key)
                        valid_chunks.append(ch)

                src_log.write(f"[b]{len(valid_chunks)} relevant sources[/b]\n")
                
                for idx, ch in enumerate(valid_chunks, 1):
                    src_log.write(f"❯ [[#22c55e]{idx}[/#22c55e]] [b]{ch.get('title', '?')}[/b]")
                    src_log.write(f"    Page {ch.get('page', '?')}")
                    # Attempt to extract distance/similarity if backend provides it
                    if "_distance" in ch:
                        sim = max(0, int((1 - ch["_distance"]) * 100))
                        src_log.write(f"    [dim]Sim: {sim}%[/dim]")
                    src_log.write("")
            else:
                src_log.write("[dim]No sources found.[/dim]")

            log.write(f"[green]⏎[/green] {answer}\n")
        except Exception as exc:
            log.write(f"[bold red]Error:[/bold red] {exc}")
            log.write("[dim]Is Ollama running? Check 'ollama serve'.[/dim]\n")

    def action_go_back(self) -> None:
        self.app.pop_screen()


# ---------------------------------------------------------------------------
# Documents Screen
# ---------------------------------------------------------------------------

class DocumentsScreen(Screen):
    """View all ingested documents from the database."""

    BINDINGS = [Binding("escape", "go_back", "Back")]

    def compose(self) -> ComposeResult:
        yield Static("[b]▤ Documents — ScholarCLI[/b]", classes="screen-header")
        with ScrollableContainer(classes="screen-body"):
            yield DataTable(id="docs-table")

    def on_mount(self) -> None:
        table = self.query_one(DataTable)
        table.add_columns("Title", "Course", "Type", "Indexed")
        docs = _get_documents(limit=100)
        if not docs:
            table.add_row("(no documents ingested)", "—", "—", "—")
        else:
            for d in docs:
                table.add_row(
                    d["title"][:50],
                    d["course"],
                    d["file_type"].upper(),
                    _fmt_date(d["indexed_at"]),
                )

    def action_go_back(self) -> None:
        self.app.pop_screen()


# ---------------------------------------------------------------------------
# Search Screen — vector search over LanceDB
# ---------------------------------------------------------------------------

class SearchScreen(Screen):
    """Search through ingested materials using vector similarity."""

    BINDINGS = [Binding("escape", "go_back", "Back")]

    def __init__(self, course: str | None = None) -> None:
        super().__init__()
        self._course = course

    def compose(self) -> ComposeResult:
        yield Static("[b]⌕ Search — ScholarCLI[/b]", classes="screen-header")
        yield RichLog(id="search-results", highlight=True, markup=True, classes="result-log")
        yield Input(
            placeholder="Search your materials…",
            classes="screen-input",
            id="search-input",
        )

    def on_mount(self) -> None:
        log = self.query_one(RichLog)
        log.write("[dim]Type a search query and press Enter. Results ranked by relevance.[/dim]\n")

    async def on_input_submitted(self, event: Input.Submitted) -> None:
        text = event.value.strip()
        if not text:
            return
        event.input.clear()
        log = self.query_one(RichLog)
        log.write(f"[bold cyan]⌕[/bold cyan] Searching: {text}\n")

        try:
            results = await asyncio.to_thread(self._search, text)
            if not results:
                log.write("[yellow]No results found.[/yellow] Try different keywords.\n")
            else:
                for i, r in enumerate(results, 1):
                    dist = r.get("_distance", 0)
                    relevance = max(0, int((1 - dist) * 100))
                    log.write(
                        f"[bold green]#{i}[/bold green] "
                        f"[b]{r.get('title', '?')}[/b] p.{r.get('page', '?')} "
                        f"[dim]({relevance}% match)[/dim]"
                    )
                    heading = r.get("heading", "")
                    if heading:
                        log.write(f"  [#c084fc]§ {heading}[/#c084fc]")
                    # Show text preview (first 200 chars).
                    preview = r.get("text", "")[:200].replace("\n", " ")
                    log.write(f"  [dim]{preview}…[/dim]\n")
        except Exception as exc:
            log.write(f"[bold red]Error:[/bold red] {exc}\n")

    def _search(self, query: str) -> list[dict]:
        from scholarcli.config import get_settings
        from scholarcli.llm import get_embeddings
        from scholarcli.storage.vectors import search

        emb = get_embeddings()
        vec = emb.embed_query(query)
        s = get_settings()
        return search(vec, top_k=s.retrieval.top_k, course=self._course)

    def action_go_back(self) -> None:
        self.app.pop_screen()


# ---------------------------------------------------------------------------
# File Picker Modal
# ---------------------------------------------------------------------------

class StudyResourceTree(DirectoryTree):
    """A DirectoryTree that only shows study resources."""
    
    def filter_paths(self, paths: Iterable[Path]) -> Iterable[Path]:
        allowed_exts = {".pdf", ".md", ".txt", ".ppt", ".pptx"}
        return [
            p for p in paths
            if p.is_dir() or p.suffix.lower() in allowed_exts
        ]

class FilePickerModal(ModalScreen[str]):
    """Modal screen with a directory tree for file selection."""
    
    def compose(self) -> ComposeResult:
        with Vertical(id="picker-dialog"):
            yield Static("[b]Select a Study Resource[/b]", classes="section-title")
            yield StudyResourceTree(os.getcwd(), id="picker-tree")
            with Horizontal(classes="screen-body"):
                yield Button("Cancel", variant="error", id="btn-cancel")
                
    def on_directory_tree_file_selected(self, event: DirectoryTree.FileSelected) -> None:
        self.dismiss(str(event.path))
        
    def on_button_pressed(self, event: Button.Pressed) -> None:
        if event.button.id == "btn-cancel":
            self.dismiss(None)


# ---------------------------------------------------------------------------
# Ingest Screen — ingest files from TUI
# ---------------------------------------------------------------------------

class IngestScreen(Screen):
    """Ingest PDF/Markdown files into the knowledge base."""

    BINDINGS = [Binding("escape", "go_back", "Back")]

    def __init__(self) -> None:
        super().__init__()
        self._course_name: str = ""

    def compose(self) -> ComposeResult:
        yield Static("[b]↓ Ingest — ScholarCLI[/b]", classes="screen-header")
        yield RichLog(id="ingest-log", highlight=True, markup=True, classes="result-log")
        with Horizontal(id="ingest-inputs"):
            yield Input(
                placeholder="Course name (e.g. 'Operating Systems')",
                id="ingest-course",
                classes="screen-input",
            )
        with Horizontal(id="ingest-path-container"):
            yield Input(
                placeholder="File or directory path (e.g. ./pdfs/os-notes.pdf)",
                id="ingest-path",
                classes="screen-input",
            )
            yield Button("Browse...", id="btn-browse")

    def on_button_pressed(self, event: Button.Pressed) -> None:
        if event.button.id == "btn-browse":
            def set_path(path: str | None) -> None:
                if path:
                    self.query_one("#ingest-path", Input).value = path
            self.app.push_screen(FilePickerModal(), set_path)

    def on_mount(self) -> None:
        log = self.query_one("#ingest-log", RichLog)
        log.write("[b]Ingest files into your knowledge base[/b]")
        log.write("[dim]1. Enter a course name above[/dim]")
        log.write("[dim]2. Enter the file or directory path and press Enter[/dim]\n")

    async def on_input_submitted(self, event: Input.Submitted) -> None:
        if event.input.id == "ingest-course":
            self._course_name = event.value.strip()
            log = self.query_one("#ingest-log", RichLog)
            if self._course_name:
                log.write(f"[green]✓[/green] Course: [b]{self._course_name}[/b]")
            # Focus path input.
            self.query_one("#ingest-path", Input).focus()
            return

        if event.input.id == "ingest-path":
            path_str = event.value.strip()
            if not path_str:
                return
            if not self._course_name:
                # Read from course input.
                self._course_name = self.query_one("#ingest-course", Input).value.strip()
            if not self._course_name:
                self.notify("Enter a course name first!", title="Missing Course", severity="warning")
                self.query_one("#ingest-course", Input).focus()
                return

            event.input.clear()
            log = self.query_one("#ingest-log", RichLog)
            log.write(
                f"\n[bold cyan]⧖[/bold cyan] Ingesting [b]{path_str}[/b] "
                f"into [b]{self._course_name}[/b]…"
            )

            try:
                from pathlib import Path
                from scholarcli.ingest.pipeline import ingest_path

                p = Path(path_str).resolve()
                if not p.exists():
                    log.write(f"[bold red]Error:[/bold red] Path not found: {path_str}")
                    return

                results = await asyncio.to_thread(ingest_path, p, self._course_name)
                for r in results:
                    log.write(f"  [green]✓[/green] {r}")
                log.write(
                    f"\n[bold green]Done![/bold green] {len(results)} file(s) processed.\n"
                )
            except Exception as exc:
                log.write(f"[bold red]Error:[/bold red] {exc}")
                log.write("[dim]Is Ollama running for embeddings? Check 'ollama serve'.[/dim]\n")

    def action_go_back(self) -> None:
        self.app.pop_screen()


# ---------------------------------------------------------------------------
# Courses Screen
# ---------------------------------------------------------------------------

class CoursesScreen(Screen):
    """View all courses and document counts."""

    BINDINGS = [Binding("escape", "go_back", "Back")]

    def compose(self) -> ComposeResult:
        yield Static("[b]☰ Courses — ScholarCLI[/b]", classes="screen-header")
        with ScrollableContainer(classes="screen-body"):
            yield DataTable(id="courses-table")

    def on_mount(self) -> None:
        table = self.query_one(DataTable)
        table.add_columns("ID", "Course Name", "Documents")
        courses = _get_courses()
        if not courses:
            table.add_row("—", "(no courses)", "0")
        else:
            for c in courses:
                table.add_row(str(c["id"]), c["name"], str(c["doc_count"]))

    def action_go_back(self) -> None:
        self.app.pop_screen()


# ---------------------------------------------------------------------------
# Study Mode Screen — base class for flashcards, quiz, diagrams, etc.
# ---------------------------------------------------------------------------

class _StudyModeScreen(Screen):
    """Base for study mode screens that send queries through RAG with a forced route."""

    BINDINGS = [Binding("escape", "go_back", "Back")]

    # Subclasses set these.
    _icon: str = "📖"
    _title: str = "Study Mode"
    _route: str = "quick_qa"
    _placeholder: str = "Enter a topic…"

    def __init__(self, course: str | None = None) -> None:
        super().__init__()
        self._course = course

    def compose(self) -> ComposeResult:
        yield Static(
            f"[b]{self._icon} {self._title} — ScholarCLI[/b]",
            classes="screen-header",
        )
        yield RichLog(id="mode-log", highlight=True, markup=True, classes="result-log")
        yield Input(
            placeholder=self._placeholder,
            id="mode-input",
            classes="screen-input",
        )

    def on_mount(self) -> None:
        log = self.query_one(RichLog)
        course_info = f" [dim](course: {self._course})[/dim]" if self._course else ""
        log.write(
            f"[bold green]{self._title}[/bold green]{course_info}"
        )
        log.write(f"[dim]Type a topic and press Enter. Escape to go back.[/dim]\n")

    async def on_input_submitted(self, event: Input.Submitted) -> None:
        text = event.value.strip()
        if not text:
            return
        event.input.clear()
        log = self.query_one(RichLog)
        log.write(f"[bold cyan]⏳[/bold cyan] Generating {self._title.lower()} for: {text}\n")

        try:
            result = await _run_rag(text, self._course, route=self._route)
            answer = result.get("answer", "(no result)")
            grounded = result.get("grounded", False)

            if not grounded:
                log.write(f"[yellow]⚠[/yellow] {answer}\n")
            else:
                self._render_result(log, answer)
        except Exception as exc:
            log.write(f"[bold red]Error:[/bold red] {exc}")
            log.write("[dim]Is Ollama running? Check 'ollama serve'.[/dim]\n")

    def _render_result(self, log: RichLog, answer: str) -> None:
        """Override in subclasses for custom rendering. Default: dump text."""
        log.write(f"[green]✓[/green] Result:\n")
        for line in answer.split("\n"):
            log.write(f"  {line}")
        log.write("")

    def action_go_back(self) -> None:
        self.app.pop_screen()


class FlashcardsScreen(_StudyModeScreen):
    _icon = "☷"
    _title = "Flashcards"
    _route = "flashcards"
    _placeholder = "Topic for flashcards (e.g. 'memory management')…"

    def _render_result(self, log: RichLog, answer: str) -> None:
        from rich.panel import Panel
        from rich.text import Text

        log.write("[bold green]☷ Generated Flashcards:[/bold green]\n")
        # Parse Q:/A: pairs.
        cards = answer.split("\n\n")
        for i, card in enumerate(cards, 1):
            card = card.strip()
            if not card:
                continue
            
            content = Text()
            lines = card.split("\n")
            for j, line in enumerate(lines):
                stripped = line.strip()
                if stripped.startswith("Q:"):
                    content.append(f"{stripped}", style="bold cyan")
                elif stripped.startswith("A:"):
                    content.append(f"{stripped}", style="green")
                else:
                    content.append(f"{stripped}")
                if j < len(lines) - 1:
                    content.append("\n")

            log.write(Panel(content, title=f"[bold]Card {i}[/bold]", border_style="cyan", expand=False))
            log.write("")


class QuizScreen(_StudyModeScreen):
    _icon = "☑"
    _title = "Quiz"
    _route = "quiz"
    _placeholder = "Topic for quiz (e.g. 'process scheduling')…"

    def _render_result(self, log: RichLog, answer: str) -> None:
        log.write("[bold green]☑ Generated Quiz:[/bold green]\n")
        blocks = answer.split("\n\n")
        for block in blocks:
            block = block.strip()
            if not block:
                continue
            for line in block.split("\n"):
                stripped = line.strip()
                if stripped.startswith(("Q1:", "Q2:", "Q3:", "Q4:", "Q5:", "Q6:", "Q7:", "Q8:", "Q9:", "Q10:")):
                    log.write(f"\n  [bold cyan]{stripped}[/bold cyan]")
                elif stripped.startswith(("A)", "B)", "C)", "D)")):
                    log.write(f"    {stripped}")
                elif stripped.startswith("Answer:"):
                    log.write(f"    [bold green]{stripped}[/bold green]")
                else:
                    log.write(f"  {stripped}")
        log.write("")


class DiagramsScreen(_StudyModeScreen):
    _icon = "❖"
    _title = "Diagrams"
    _route = "mermaid"
    _placeholder = "Topic for diagram (e.g. 'OSI model layers')…"

    def __init__(self, course: str | None = None) -> None:
        super().__init__(course)
        self._temp_files: list[str] = []

    def _render_result(self, log: RichLog, answer: str) -> None:
        log.write("[bold green]❖ Generated Mermaid Diagram:[/bold green]\n")
        log.write("[dim]Syntax rendered via mermaid.ink API[/dim]\n")
        log.write("```mermaid\n")
        for line in answer.split("\n"):
            log.write(f"  {line}")
        log.write("```\n")
        
        self.run_worker(self._fetch_and_render_image(log, answer))

    async def _fetch_and_render_image(self, log: RichLog, answer: str) -> None:
        import base64
        import tempfile
        import urllib.request
        import asyncio
        import os
        
        try:
            from textual_image import TextualImage
        except ImportError:
            log.write("[yellow]textual-image not installed. Cannot render image natively.[/yellow]\n")
            return
            
        log.write("[dim]Fetching image from mermaid.ink...[/dim]\n")
        
        syntax = answer.strip()
        if syntax.startswith("```mermaid"):
            syntax = syntax[10:]
        if syntax.endswith("```"):
            syntax = syntax[:-3]
        syntax = syntax.strip()
        
        b64 = base64.urlsafe_b64encode(syntax.encode("utf-8")).decode("ascii")
        url = f"https://mermaid.ink/img/{b64}?theme=dark"
        
        def _fetch():
            req = urllib.request.Request(url, method="GET")
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status == 200:
                    return resp.read()
                return None
                
        try:
            img_data = await asyncio.to_thread(_fetch)
        except Exception as e:
            log.write(f"[red]Failed to fetch diagram image: {e}[/red]\n")
            return
            
        if not img_data:
            log.write("[red]Failed to fetch diagram image.[/red]\n")
            return
            
        fd, path = tempfile.mkstemp(suffix=".png")
        os.write(fd, img_data)
        os.close(fd)
        self._temp_files.append(path)
        
        img = TextualImage(path)
        img.styles.height = "1fr"
        await self.mount(img, before="#mode-input")
        log.write("[green]✓ Image rendered below.[/green]\n")
        
    def on_unmount(self) -> None:
        import os
        for path in getattr(self, "_temp_files", []):
            try:
                os.remove(path)
            except OSError:
                pass


class MindMapScreen(_StudyModeScreen):
    _icon = "☍"
    _title = "Mind Map"
    _route = "mindmap"
    _placeholder = "Topic for mind map (e.g. 'database normalization')…"

    def _render_result(self, log: RichLog, answer: str) -> None:
        log.write("[bold green]☍ Generated Mind Map:[/bold green]\n")
        for line in answer.split("\n"):
            log.write(f"  {line}")
        log.write("")


class StudyNotesScreen(_StudyModeScreen):
    _icon = "✎"
    _title = "Study Notes"
    _route = "study_notes"
    _placeholder = "Topic for study notes (e.g. 'virtual memory')…"

    def _render_result(self, log: RichLog, answer: str) -> None:
        log.write("[bold green]✎ Generated Study Notes:[/bold green]\n")
        for line in answer.split("\n"):
            # Highlight headers and bullets.
            stripped = line.strip()
            if stripped.startswith("##"):
                log.write(f"\n  [bold #c084fc]{stripped}[/bold #c084fc]")
            elif stripped.startswith("**Key Takeaways"):
                log.write(f"\n  [bold #22c55e]{stripped}[/bold #22c55e]")
            elif stripped.startswith("- "):
                log.write(f"  [dim]•[/dim] {stripped[2:]}")
            else:
                log.write(f"  {stripped}")
        log.write("")


# ---------------------------------------------------------------------------
# Main App — Dashboard
# ---------------------------------------------------------------------------

class ScholarApp(App):
    """ScholarCLI dashboard TUI."""

    TITLE = "ScholarCLI"
    CSS = _CSS

    BINDINGS = [
        Binding("a", "open_ask", "Ask", key_display="a"),
        Binding("d", "open_documents", "Documents", key_display="d"),
        Binding("s", "open_search", "Search", key_display="s"),
        Binding("i", "open_ingest", "Ingest", key_display="i"),
        Binding("c", "open_courses", "Courses", key_display="c"),
        Binding("f", "open_flashcards", "Flashcards", show=False),
        Binding("q", "open_quiz", "Quizzes", show=False),
        Binding("g", "open_diagrams", "Diagrams", show=False),
        Binding("m", "open_mindmap", "Mind Map", show=False),
        Binding("n", "open_notes", "Notes", show=False),
        Binding("x", "quit", "Quit", key_display="x"),
    ]

    def __init__(self, course_name: str | None = None) -> None:
        super().__init__()
        self._course = course_name

    # ── compose ──────────────────────────────────────────────

    def compose(self) -> ComposeResult:
        # Header bar
        with Horizontal(id="header-bar"):
            yield Static("[b]⌘ ScholarCLI[/b]", id="hdr-left")
            course_str = f" — {self._course}" if self._course else ""
            yield Static(
                f"[i #8b949e]ScholarCLI – AI Study Assistant{course_str}[/i #8b949e]",
                id="hdr-center",
            )
            yield Static(
                "[dim]● Checking…[/dim]",
                id="hdr-right",
            )

        with Horizontal(id="main-area"):
            # ── Sidebar ──
            with Vertical(id="sidebar"):
                yield Static(
                    " ◆ [b]Dashboard[/b]       [dim]\\[1][/dim]",
                    classes="nav-item nav-active",
                )
                yield Static(
                    " ❯ Ask               [dim]\\[a][/dim]",
                    classes="nav-item",
                )
                yield Static(
                    " ▤ Documents         [dim]\\[d][/dim]",
                    classes="nav-item",
                )
                yield Static(
                    " ☷ Flashcards        [dim]\\[f][/dim]",
                    classes="nav-item",
                )
                yield Static(
                    " ☑ Quizzes           [dim]\\[q][/dim]",
                    classes="nav-item",
                )
                yield Static(
                    " ❖ Diagrams          [dim]\\[g][/dim]",
                    classes="nav-item",
                )
                yield Static(
                    " ⌕ Search            [dim]\\[s][/dim]",
                    classes="nav-item",
                )
                yield Static(
                    " ↓ Ingest            [dim]\\[i][/dim]",
                    classes="nav-item",
                )
                yield Static(
                    " ☰ Courses           [dim]\\[c][/dim]",
                    classes="nav-item",
                )
                yield Static(
                    " ☍ Mind Map          [dim]\\[m][/dim]",
                    classes="nav-item",
                )
                yield Static(
                    " ✎ Study Notes       [dim]\\[n][/dim]",
                    classes="nav-item",
                )
                yield Static("", classes="nav-spacer")
                yield Static(
                    " ✕  Quit              [dim]\\[x][/dim]",
                    classes="nav-item nav-quit",
                )

            # ── Center content ──
            with ScrollableContainer(id="center"):
                yield Static(
                    "[b]Welcome back, [green]Scholar[/green]![/b]\n"
                    "[dim]What would you like to study today?[/dim]",
                    id="welcome",
                )

                # Stats row — populated on mount.
                with Horizontal(classes="stats-row"):
                    yield Static(
                        "▤\n[b]—[/b]\n[dim]Documents[/dim]",
                        id="stat-docs",
                        classes="stat-box",
                    )
                    yield Static(
                        "☰\n[b]—[/b]\n[dim]Courses[/dim]",
                        id="stat-courses",
                        classes="stat-box",
                    )
                    yield Static(
                        "⚙\n[b]—[/b]\n[dim]Ollama[/dim]",
                        id="stat-ollama",
                        classes="stat-box",
                    )

                yield Static(
                    "[b #c084fc]Quick Actions[/b #c084fc]",
                    classes="section-title",
                )

                with Horizontal(id="quick-actions"):
                    yield Static(
                        "❯\n\n[b]Ask Question[/b]\n[dim]Get answers \\[a][/dim]",
                        classes="action-card card-active",
                    )
                    yield Static(
                        "✎\n\n[b]Study Notes[/b]\n[dim]Summaries \\[n][/dim]",
                        classes="action-card",
                    )
                    yield Static(
                        "☷\n\n[b]Flashcards[/b]\n[dim]Create cards \\[f][/dim]",
                        classes="action-card",
                    )
                    yield Static(
                        "☑\n\n[b]Quiz[/b]\n[dim]Generate quiz \\[q][/dim]",
                        classes="action-card",
                    )
                    yield Static(
                        "☍\n\n[b]Mind Map[/b]\n[dim]Concepts \\[m][/dim]",
                        classes="action-card",
                    )

                yield Rule()

                with Horizontal(id="docs-header"):
                    yield Static(
                        "[b #c084fc]Recent Documents[/b #c084fc]",
                        id="docs-title",
                        classes="section-title",
                    )
                    yield Static(
                        "[#c084fc]View all \\[d][/#c084fc]",
                        id="docs-viewall",
                    )

                # Dynamic document rows container.
                yield Vertical(id="docs-list")

            # ── Activity panel ──
            with Vertical(id="activity-panel"):
                yield Static(
                    "[b #e879f9]Recent Activity[/b #e879f9]",
                    classes="section-title",
                )
                yield Vertical(id="activity-list")
                yield Static("", classes="nav-spacer")
                yield Static(
                    "[#e879f9]View all documents \\[d][/#e879f9]",
                    classes="view-all",
                )

        yield Footer()

    # ── on_mount — load real data ────────────────────────────

    async def on_mount(self) -> None:
        # Check Ollama status.
        asyncio.create_task(self._update_ollama_status())
        # Load documents and activity from DB.
        await asyncio.to_thread(self._load_dashboard_data)

    async def _update_ollama_status(self) -> None:
        online = await _check_ollama()
        hdr = self.query_one("#hdr-right", Static)
        stat = self.query_one("#stat-ollama", Static)
        if online:
            hdr.update("[green]● Local (Ollama)[/green]")
            stat.update("⚙\n[b][green]Online[/green][/b]\n[dim]Ollama[/dim]")
        else:
            hdr.update("[red]● Offline[/red]")
            stat.update("⚙\n[b][red]Offline[/red][/b]\n[dim]Ollama[/dim]")

    def _load_dashboard_data(self) -> None:
        docs = _get_documents(limit=5)
        courses = _get_courses()
        # Schedule UI updates on main thread.
        self.call_from_thread(self._populate_dashboard, docs, courses)

    def _populate_dashboard(self, docs: list[dict], courses: list[dict]) -> None:
        # Update stats.
        total_docs = sum(c["doc_count"] for c in courses) if courses else 0
        self.query_one("#stat-docs", Static).update(
            f"📄\n[b]{total_docs}[/b]\n[dim]Documents[/dim]"
        )
        self.query_one("#stat-courses", Static).update(
            f"📚\n[b]{len(courses)}[/b]\n[dim]Courses[/dim]"
        )

        # Populate recent documents.
        docs_list = self.query_one("#docs-list", Vertical)
        docs_list.remove_children()
        if not docs:
            docs_list.mount(
                Static(
                    "  [dim]No documents ingested yet. "
                    "Use \\[i] to ingest files.[/dim]",
                    classes="doc-row",
                )
            )
        else:
            # ponytail: moved outside loop
            _type_colors = {"pdf": "#ef4444", "md": "#60a5fa"}
            for d in docs:
                type_color = _type_colors.get(d["file_type"], "#8b949e")
                docs_list.mount(
                    Static(
                        f"  ▤ {d['title'][:40]}"
                        f"     [{type_color}]{d['file_type'].upper()}[/{type_color}]"
                        f"  [#22c55e]{d['course']}[/#22c55e]"
                        f"  [dim]{_fmt_date(d['indexed_at'])}[/dim]",
                        classes="doc-row",
                    )
                )

        # Populate recent activity from same docs (ingestion events).
        activity_list = self.query_one("#activity-list", Vertical)
        activity_list.remove_children()
        if not docs:
            activity_list.mount(
                Static(
                    " [dim]No activity yet.[/dim]",
                    classes="activity-item",
                )
            )
        else:
            for d in docs:
                activity_list.mount(
                    Static(
                        f" ↓ [b]Ingested[/b]             {_fmt_date(d['indexed_at'])}\n"
                        f"    [dim]{d['title'][:30]}[/dim]",
                        classes="activity-item",
                    )
                )

    # ── actions ──────────────────────────────────────────────

    def action_open_ask(self) -> None:
        self.push_screen(AskScreen(course=self._course))

    def action_open_documents(self) -> None:
        self.push_screen(DocumentsScreen())

    def action_open_search(self) -> None:
        self.push_screen(SearchScreen(course=self._course))

    def action_open_ingest(self) -> None:
        self.push_screen(IngestScreen())

    def action_open_courses(self) -> None:
        self.push_screen(CoursesScreen())

    def action_open_flashcards(self) -> None:
        self.push_screen(FlashcardsScreen(course=self._course))

    def action_open_quiz(self) -> None:
        self.push_screen(QuizScreen(course=self._course))

    def action_open_diagrams(self) -> None:
        self.push_screen(DiagramsScreen(course=self._course))

    def action_open_mindmap(self) -> None:
        self.push_screen(MindMapScreen(course=self._course))

    def action_open_notes(self) -> None:
        self.push_screen(StudyNotesScreen(course=self._course))
