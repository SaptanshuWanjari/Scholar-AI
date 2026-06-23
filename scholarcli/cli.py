"""CLI entry point — Typer app exposing ingest, ask, courses, tui."""

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
) -> None:
    """Ask a question grounded in your uploaded materials."""
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
# tui
# ---------------------------------------------------------------------------

@app.command()
def tui(
    course: str = typer.Option(
        None, "--course", "-c", help="Restrict retrieval to this course"
    ),
) -> None:
    """Launch the interactive Terminal UI chat."""
    from scholarcli.tui import ScholarApp

    init_db()
    app_instance = ScholarApp(course_name=course)
    app_instance.run()
