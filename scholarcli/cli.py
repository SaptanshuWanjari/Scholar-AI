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
    try:
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
    finally:
        session.close()


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


