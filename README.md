# Scholar AI

A comprehensive, **local-first AI study assistant** that runs entirely on your machine.
It ingests your PDFs and Markdown notes into a local knowledge base (RAG) and provides a full suite of AI-powered study tools via a React frontend and FastAPI backend.

## Features

- **Knowledge Library (RAG)**: Ingest documents with automatic chunking, LLM metadata extraction, and Hybrid Search (BM25 + Vector similarity) using LanceDB.
- **Ask AI**: Chat with your documents. Get grounded answers with exact source citations and view the internal RAG execution trace.
- **Generative Study Tools**: Automatically generate Flashcards, Quizzes, Mindmaps, Diagrams (Mermaid), and Revision Notes from your uploaded courses. Includes draft auto-saving.
- **Exam Mode & PYQ Analysis**: Upload Previous Year Questions (PYQs) to extract and analyze topic frequencies and question patterns. The system generates mock exams mimicking historical trends and provides LLM-based grading for subjective answers.
- **Teach Mode**: Generates complete "Learning Packages" (bundled notes, quizzes, mindmaps) for a specific topic.
- **Reading Mode**: Read documents natively, save highlights and bookmarks.
- **Concept Graph**: Extracts and visualizes semantic relationships between key concepts.
- **Consistency Checker**: Cross-checks user-generated notes against source documents to flag contradictions.

## Tech Stack

**Backend**

- Python 3.12 (managed via `uv`)
- FastAPI
- LangGraph & LangChain
- LanceDB (embedded vector + BM25 search)
- SQLite + SQLAlchemy (metadata & durable artifact persistence)
- Ollama (Local LLMs and embeddings)

**Frontend**

- React + Vite
- TypeScript
- Tailwind CSS
- Zustand (State management)
- React Router

## Setup & Installation

### 1. Ollama (LLM Engine)

Start the local Ollama server and pull the required models:

```bash
ollama serve            # Run in a separate terminal
ollama pull qwen3:8b
ollama pull gemma4:12b
ollama pull nomic-embed-text
```

### 2. Backend

Install dependencies and run the API server using `uv`:

```bash
uv sync
uv run scholar serve
# Or manually: uvicorn scholarcli.api.app:app --reload
```

### 3. Frontend

In a new terminal, install dependencies and start the Vite dev server:

```bash
cd frontend
pnpm install
pnpm run dev
```

Then open `http://localhost:5173` in your browser.

## CLI Usage

You can still use the CLI for batch ingestion and fast terminal queries:

```bash
# Ingest documents
uv run scholar ingest path/to/notes.pdf --course "Operating Systems"

# Ask a grounded question
uv run scholar ask "Explain TCP congestion control." --course "Operating Systems"

# List ingested courses
uv run scholar courses
```
