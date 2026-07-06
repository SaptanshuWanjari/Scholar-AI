"""CLI entry point — Typer app exposing serve command."""

from __future__ import annotations

import typer
from rich.console import Console

from scholarai.storage import init_db

app = typer.Typer(name="scholar", help="ScholarAI API server")
console = Console()


@app.callback(invoke_without_command=True)
def _callback(ctx: typer.Context) -> None:
    if ctx.invoked_subcommand is None:
        app.print_help()
        raise typer.Exit()


# ---------------------------------------------------------------------------
# serve
# ---------------------------------------------------------------------------

@app.command()
def serve(
    host: str = typer.Option("127.0.0.1", "--host", help="Bind address"),
    port: int = typer.Option(8000, "--port", "-p", help="Port to listen on"),
    reload: bool = typer.Option(False, "--reload", help="Auto-reload on code changes"),
) -> None:
    """Run the HTTP API server."""
    import uvicorn

    init_db()
    console.print(
        f"[bold green]ScholarAI API[/bold green] → http://{host}:{port}  "
        f"(docs at /docs)"
    )
    uvicorn.run(
        "scholarai.api.app:app", host=host, port=port, reload=reload, factory=False
    )


@app.command()
def ingest(
    path: str = typer.Argument(..., help="File or directory to ingest"),
    course: str = typer.Option("default", "--course", "-c", help="Course name"),
) -> None:
    """Ingest documents into the vector store."""
    typer.echo(f"Ingesting {path} → course '{course}'")
    typer.echo("Use the API server for full ingestion pipeline.")


@app.command()
def reindex(
    course: str = typer.Option("", "--course", "-c", help="Reindex specific course (default: all)"),
) -> None:
    """Reindex all documents in the vector store."""
    typer.echo(f"Reindexing {'all courses' if not course else f'course: {course}'}")
    from scholarai.ingest.pipeline import reindex_all
    if course:
        typer.echo(f"Limiting to course '{course}' not yet supported; reindexing all.")
    results = reindex_all()
    for r in results:
        typer.echo(f"  {r}")
    typer.echo("Reindex complete.")


@app.command()
def export_notes(
    course: str = typer.Option("", "--course", "-c", help="Export specific course (default: all)"),
    outdir: str = typer.Option("./export", "--out", "-o", help="Output directory"),
) -> None:
    """Export study materials as markdown."""
    from pathlib import Path
    out = Path(outdir)
    out.mkdir(parents=True, exist_ok=True)
    typer.echo(f"Exporting to {out}")


@app.command()
def stats(
    course: str = typer.Option("", "--course", "-c", help="Stats for specific course (default: all)"),
) -> None:
    """Show database and vector store statistics."""
    from scholarai.storage import get_session
    from scholarai.storage.vectors import get_stats
    session = get_session()
    try:
        stats_data = get_stats(session, course=course or None)
        for k, v in stats_data.items():
            typer.echo(f"  {k}: {v}")
    finally:
        session.close()


