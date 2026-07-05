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


