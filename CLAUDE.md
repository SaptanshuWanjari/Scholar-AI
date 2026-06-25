# Claude Code Instructions

## Project Context
ScholarCLI is a local-first AI study assistant. It consists of a Python FastAPI/Typer backend and a React/Vite frontend. 
The system provides tools for ingesting study materials, running RAG queries, managing courses/notebooks, and studying.

### Architecture
- **Backend**: Python, FastAPI, Typer (for CLI), SQLAlchemy, LangGraph (for RAG). Located in `scholarcli/`.
- **Frontend**: React, Vite, Tailwind CSS v4, shadcn/ui.

### Important References
For deeper context, refer to the following files in the `context/` directory:
- `context/api_endpoints_context.md`: Documentation on FastAPI routers, endpoints, and data models.
- `context/backend-context.md`: Full structure and code of the backend RAG and storage system.
- `context/frontend_context.md`: Frontend component architecture and UI codebase.

## Development Guidelines

### Backend Guidelines
- **Framework**: Use FastAPI for API endpoints and Typer for CLI commands.
- **Routing**: API endpoints are organized in `scholarcli/api/routers/`. When adding new endpoints, ensure they are registered in `scholarcli/api/app.py`.
- **Database**: We use SQLAlchemy. Models are in `scholarcli/storage/models.py`. Use `get_engine()` from `scholarcli.storage`.
- **Typing**: Use strict Python type hints (`from __future__ import annotations`).
- **RAG**: LangGraph state and nodes are in `scholarcli/rag/`.

### Frontend Guidelines
- **Framework**: React 18+ with Vite.
- **Styling**: Tailwind CSS. We use a customized shadcn theme.
- **Components**: Use modular, functional components with hooks. 

### Commands
- **Backend Setup**: Use `uv` or `pip` to manage Python dependencies.
- **Frontend Setup**: `npm i` to install dependencies.
- **Running Frontend**: `npm run dev` to start the Vite server.
- **Running Backend**: `uvicorn scholarcli.api.app:app --reload` or through the Typer CLI `serve` command.

## General Rules
- Always prioritize reading the context files in `context/` when unsure about the project architecture.
- Follow existing code style and naming conventions.
- Keep components small and focused.
- Ensure all API endpoints handle CORS properly for the frontend development servers.
