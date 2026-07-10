# Scholar AI

A **local-first AI study assistant** that runs on your machine and ingests PDFs, Markdown notes, and more into a local RAG knowledge base. Use local LLMs via Ollama (recommended - you data stays with you)  or connect cloud providers 

## Features

### Knowledge Base

- **Document Ingestion**: PDF (including scanned/OCR), Markdown, CSV, XLSX. Automatic recursive chunking, LLM-based metadata extraction, table extraction, and diagram description generation.
- **Hybrid Search**: BM25 + vector similarity via LanceDB. Reranking, CRAG verification loops, and query rewriting for retrieval quality.

### Ask AI

- **RAG Chat**: Ask grounded questions across your courses, with exact source citations and a full LangGraph execution trace viewer.

### Generative Study Tools

- **Flashcards**: SM-2 spaced repetition, auto-generated from your materials.
- **Quizzes**: Auto-generated with answer validation and scoring.
- **Mindmaps**: AI-extracted concept maps from documents.
- **Diagrams**: Mermaid-based auto-generated diagrams.
- **Revision Notes**: Condensed study notes from course content.
- **Comparisons**: AI-generated difference tables across topics.

### Exam Mode

- **PYQ Analysis**: Upload previous year question papers. Extracts topic frequencies, question patterns, and generates mock exams mimicking historical trends.
- **Timed Sessions**: Built-in exam timer with auto-submit. LLM-based grading for subjective answers.

### Reading Mode

- **Native Reader**: In-browser document reader. Highlights, bookmarks, sticky notes, and progress tracking synced across sessions.

### Teach Mode

- **Learning Packages**: Human-in-the-loop LangGraph workflow. Draft → review → approve → generate bundled artifacts (notes, quizzes, flash cards, mindmaps, diagrams).

### Concept Graph

- **Knowledge Graph**: Extracts semantic relationships between concepts from your documents.
- **Learning Paths**: Prerequisite-based dependency engine generates ordered study roadmaps with mastery scoring and progress tracking.

### Notebooks

- **Custom Artifact**: Create and maintain your own personalized notebook.
- **Embedding Artifacts**: Embed other AI-generate artifacts and your custom data.

### Quality & Analytics

- **Cross-Artifact Validation**: Flags contradictions between user-generated notes and source documents. Also checks consistency across flashcards, quizzes, and revision notes.
- **Artifact Quality Scoring**: Objective quality metrics (coverage, grounding, structure, balance) for generated study artifacts.
- **Artifact Recommendations**: LLM-based suggestions for which study artifact to create next for a given topic.

### Plugin System

Extend ScholarAI with optional plugins — install/uninstall from the UI:

- **Excalidraw Whiteboards**: Collaborative-style whiteboarding with mermaid-to-excalidraw import.
- **PlantUML Diagrams**: Render PlantUML diagrams (requires system `plantuml` binary).
- **Reading Annotations**: Sticky notes and region annotations on documents.
- **Cloud Model Providers**: Connect Gemini, Groq. Per-task routing, automatic fallback, and monthly spend budgets.

### Search & Prompt Library

- **Cross-Artifact Search**: Full-text search across documents, notes, flashcards, quizzes, diagrams, concepts, and whiteboards.
- **Retrieval Analytics**: Trace feedback and quality metrics for retrieval pipeline debugging.
- **Custom Prompts**: Per-category RAG prompt management and prompt enhancement coaching.
- **Prompt Enhancer**: For when your prompts are not sufficient enough.

### Administration

- **Background Jobs**: Durable job queue for async ingestion and reindexing, survives restarts.
- **Token Usage & Budget**: Per-provider token tracking with monthly spend budgets and auto-fallback to local models.
- **Provider Routing**: Manual per-task provider/model assignment or auto capability-based selection.
- **Backup System**: Manual and scheduled LanceDB backups.
- **System Health**: Endpoint checking Ollama connectivity and model availability per role.

## Quick Install

Download the latest archive for your platform from [GitHub Releases](https://github.com/SaptanshuWanjari/Scholar-AI/releases), extract it, and run:

### Linux / macOS
```bash
tar xzf ScholarAI-*-Linux.tar.gz   # or *-macOS.tar.gz
cd ScholarAI-*
chmod +x setup.sh start.sh update.sh   # one-time: make scripts executable
./setup.sh          # first run: install dependencies
./start.sh          # subsequent runs: just launch
```

### macOS
```bash
tar xzf ScholarAI-*-macOS.tar.gz
cd ScholarAI-*
chmod +x setup.sh start.sh update.sh   # one-time: make scripts executable
./setup.sh          # first run: install dependencies
./start.sh          # subsequent runs: just launch

```

### Windows (PowerShell)
```powershell
Expand-Archive ScholarAI-*-windows.zip
cd ScholarAI-*
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass   # bypass signing requirement for this session
.\setup.ps1         # first run: install dependencies
.\start.ps1         # subsequent runs: just launch
```

**Recommended**: [Ollama](https://ollama.ai) with the following models for full local operation:

```bash
ollama pull qwen3:8b
ollama pull gemma4:12b
ollama pull qwen3-embedding:0.6b
```

**Ollama free cloud models**: 

```bash
ollama signin
ollama pull minimax-m3:cloud
```

You can also connect cloud providers (Gemini, Groq) during onboarding or from the Settings page.

### Updating

```bash
# Linux / macOS
./update.sh
```

```powershell
# Windows
.\update.ps1
```

Your data in `data/` is preserved across updates.

Then open `http://localhost:8000` in your browser.

## Privacy

ScholarAI **does not collect telemetry or user data**. Everything runs locally on your machine:

- **Local-only**: Documents, embeddings, vector index, chat history, and study artifacts all live in `data/` — never sent to an external server.
- **Cloud providers**: If you connect a cloud LLM provider (OpenAI, Gemini, etc.), only prompt text is sent to that provider's API. No document contents or metadata are shared beyond what the LLM call requires.
- **No accounts, no tracking**: No sign-up, no analytics, no telemetry. Your study data is yours.

## Tech Stack

**Backend**

- Python 3.12 (managed via `uv`)
- FastAPI
- LangGraph & LangChain
- LanceDB (embedded vector + BM25 search)
- SQLite + SQLAlchemy (metadata & artifact persistence)
- Ollama

**Frontend**

- React + Vite
- TypeScript
- Tailwind CSS + paper-ui
- Zustand
- React Router

## Development Setup

### 1. LLM Engine

ScholarAI defaults to **Ollama** for local inference. Pull the recommended models:

```bash
ollama serve
ollama pull qwen3:8b
ollama pull gemma4:12b
ollama pull qwen3-embedding:0.6b
```

A lightweight vision model (`qwen2.5vl:3b`) handles diagram descriptions and scanned-page OCR recovery.

If you don't have a GPU, skip Ollama and connect a cloud provider from the Settings page after startup.

### 2. Backend

```bash
uv sync
uv run scholar serve
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```
