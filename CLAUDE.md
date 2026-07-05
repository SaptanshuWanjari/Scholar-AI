# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

ScholarAI is a local-first AI study assistant with a Python FastAPI/Typer backend and React/Vite frontend. It ingests study materials (PDFs, markdown) into a local vector database (LanceDB) and provides RAG-powered tools: document chat, flashcard/quiz generation, exam mode, reading mode, and concept graphs.

### Architecture

- **Backend**: Python 3.12, FastAPI (REST API), Typer (CLI), SQLAlchemy (SQLite), LangGraph (RAG orchestration). Located in `scholarai/`.
- **Frontend**: React 18+, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, Zustand.
- **LLM Integration**: Ollama (local models). Task-specific model routing via `config/default.toml`.
- **Storage**: SQLite (metadata/artifacts in `.data/scholar.db`), LanceDB (vector search in `.data/lancedb/`).

### Key Directories

- `scholarai/api/`: FastAPI app and route handlers
- `scholarai/rag/`: LangGraph state machines and RAG nodes
- `scholarai/storage/`: Database models, session management, LanceDB integration
- `scholarai/ingest/`: Document chunking and ingestion pipeline
- `scholarai/llm/`: Ollama model factory and task routing
- `config/`: Model configuration (default.toml)
- `.data/`: Local database and vector store (git-ignored)
- `frontend/`: React application (separate dev server)

### Important Context Files

Refer to `context/` directory for detailed architecture:

- `api_endpoints_context.md`: FastAPI routers, endpoints, request/response models
- `backend-context.md`: Full RAG pipeline, storage layer, data models
- `frontend_context.md`: React components, state management, UI architecture

## Quick Start

### Prerequisites

1. **Ollama**: Install and start locally (`ollama serve` in separate terminal)
2. **Python 3.12**: Managed via `uv`
3. **Node.js/npm**: For frontend

### Setup & Running

**Backend**:

```bash
uv sync                                    # Install dependencies
uv run scholar serve                       # Start API on port 8000
# Or: uvicorn scholarai.api.app:app --reload
```

**Frontend**:

```bash
cd frontend
npm install
npm run dev                               # Starts on http://localhost:5173
```

**CLI** (start API server):

```bash
uv run scholar serve
```

## Development Guidelines

### Backend

- **Framework**: FastAPI for REST endpoints, Typer for CLI commands
- **Routing**: Endpoints organized in `scholarai/api/routers/`. Register new routes in `scholarai/api/app.py`
- **Database**: SQLAlchemy ORM; models in `scholarai/storage/models.py`. Always use `get_session()` for database access
- **RAG**: LangGraph state definitions in `scholarai/rag/`; node implementations in `scholarai/rag/nodes/`
- **Type hints**: Use `from __future__ import annotations` and strict type hints
- **LLM/Embeddings**: Use `get_llm(task)` to route to task-specific models, `get_embeddings()` for embeddings
- **Database init**: Happens automatically via `init_db()` on first run; SQLite created in `.data/scholar.db`

### Frontend

- **Framework**: React 18+ with Vite (HMR enabled)
- **Styling**: Tailwind CSS v4 with shadcn/ui component library
- **State**: Zustand for global state; keep components small and focused
- **TypeScript**: Strict mode enabled; use type-safe patterns

### Testing

```bash
uv run pytest                              # Run all tests
uv run pytest tests/test_chunker.py        # Run single test file
uv run pytest tests/test_chunker.py::test_name  # Run single test
uv run pytest -v                           # Verbose output
uv run pytest -k keyword                   # Run tests matching keyword
```

Test fixtures in `tests/fixtures/` and `tests/conftest.py` for database setup.

## Configuration

### Ollama Models (config/default.toml)

Task-specific model routing. Before running, ensure models are pulled:

```bash
ollama pull qwen3:8b         # Main reasoning/generation model
ollama pull gemma4:12b       # Alternate reasoning model
ollama pull nomic-embed-text # Embeddings model
```

Model assignments in `config/default.toml` control which model handles which task (e.g., RAG retrieval vs. quiz generation).

## Common Tasks

### Adding an API Endpoint

1. Create route handler in `scholarai/api/routers/new_router.py`
2. Import and register in `scholarai/api/app.py`
3. Test via `http://localhost:8000/docs` (auto-generated Swagger UI)

### Ingesting Documents

Documents are ingested via the web UI ("Documents" page), which calls the `/api/documents/upload` endpoint.
Internally: text extraction → chunking → embedding → vector DB storage.

### Debugging RAG Pipeline

- Check LanceDB retrieval: inspect `.data/lancedb/` files
- View trace: frontend's "Ask AI" mode shows LangGraph execution trace
- SQL queries: SQLite in `.data/scholar.db` has ingestion metadata

### Building Frontend

```bash
cd frontend
npm run build  # Creates dist/ folder (served by backend if needed)
```

## Architecture Notes

**Two-Tier Frontend**:

- Vite dev server (`npm run dev`) for local development
- Backend can serve built frontend for production

**RAG Workflow**:
Documents → Chunking (recursive) → Embedding (Ollama) → LanceDB (vector + BM25) → Retrieval → LLM generation

**Database**:

- SQLite stores: courses, ingested documents, bookmarks, highlights, auto-saved drafts
- LanceDB stores: document chunks, embeddings, BM25 index

## General Rules

- Always read context files in `context/` before major architectural changes
- Follow existing naming conventions (snake_case for Python, camelCase for TypeScript)
- Keep components focused; split large RAG flows into separate LangGraph nodes
- Ensure FastAPI endpoints return proper CORS headers for frontend dev servers
- Test database interactions with actual SQLite (not mocks) to catch schema issues
- Commit model changes to `config/default.toml` carefully — affects all RAG tasks
