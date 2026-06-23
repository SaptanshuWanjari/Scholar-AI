# ScholarCLI

Terminal-first, **local-first** AI study assistant. Ingest your PDFs and Markdown
notes into a local knowledge base, then ask questions and get **grounded answers
with source citations** — all running locally via [Ollama](https://ollama.com).

This is the **MVP vertical slice**: ingest → chunk → embed → retrieve → verify →
answer-with-citations, exposed via a CLI and a minimal Textual chat view. The
LangGraph skeleton (router → retrieve → verify → generate) is built so additional
study modes (flashcards, quiz, diagrams, mind maps, notes) slot in later.

## Stack

- **Python 3.12** (pinned via [uv](https://docs.astral.sh/uv/))
- **LanceDB** — embedded vector store (no server)
- **SQLite + SQLAlchemy** — course/document metadata + versioning
- **Ollama** — local LLMs + embeddings, task-routed:
  - quick Q&A → `qwen3:8b`
  - flashcards / diagrams / notes / etc. → `gemma4:12b`
  - embeddings → `nomic-embed-text`
- **Typer + Rich** CLI, **Textual** TUI, **LangGraph** orchestration

## Setup

```bash
# 1. Ollama: start the server and pull models
ollama serve            # in a separate terminal
ollama pull qwen3:8b
ollama pull gemma4:12b
ollama pull nomic-embed-text
ollama list             # confirm tags; edit config/default.toml if they differ

# 2. Install (uv creates a Python 3.12 venv automatically)
uv sync
```

## Usage

```bash
# Ingest a file or a directory of PDFs/Markdown into a course
uv run scholar ingest path/to/notes.pdf --course "Operating Systems"
uv run scholar ingest path/to/folder/   --course "Operating Systems"

# Ask a grounded question
uv run scholar ask "Explain TCP congestion control." --course "Operating Systems"

# List ingested courses + documents
uv run scholar courses

# Launch the interactive TUI chat
uv run scholar tui --course "Operating Systems"
```

## Tests

```bash
uv run pytest        # LLM/embeddings are mocked; no Ollama required
```
