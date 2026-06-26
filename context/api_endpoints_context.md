# ScholarCLI Backend API Context

This document provides a comprehensive overview of the `scholarcli` backend API. It is designed to act as a single-file reference for AI agents to understand the API architecture, endpoints, routing, and data models without needing to traverse the entire API directory structure.

## Application Architecture

- **Framework**: FastAPI
- **Entry Point**: `scholarcli.api.app:create_app()`
- **Core Components**:
  - `scholarcli.api.app` registers all routers and middleware.
  - CORS is preconfigured to support frontend vite development servers (`localhost:5173`, `127.0.0.1:5173`, `localhost:3000`).
  - Application lifespan handles DB initialization (`init_db()`) and prompt seeding (`seed_prompts()`).

---

## API Routers & Endpoints

The API is modularized into several routing files located in `scholarcli/api/routers/`. Below is a functional breakdown of the endpoints across these domains.

### 📚 Courses (`routers/courses.py`)
Manages the taxonomy of courses.
- `GET /courses` - List all courses (includes documents/flashcards count & progress).
- `POST /courses` - Create a new course.
- `PUT /courses/{course_id}` - Update a course.
- `DELETE /courses/{course_id}` - Delete a course.

### 📝 Notebooks (`routers/notebooks.py`)
Handles user notes, collections, and tags.
- `GET /notebooks` - List all notebooks.
- `POST /notebooks` - Create a new notebook.
- `GET /notebooks/collections` - Get organized notebook collections.
- `GET /notebooks/tags` - List tags used across notebooks.
- `GET /notebooks/{notebook_id}` - Fetch a specific notebook.
- `PUT /notebooks/{notebook_id}` - Update a notebook.
- `DELETE /notebooks/{notebook_id}` - Delete a notebook.

### 🗃️ Library (`routers/library.py`)
Manages persistent learning artifacts.
- **Decks/Flashcards**: 
  - `GET /library/decks`, `POST /library/decks`, `DELETE /library/decks/{deck_id}`
  - `GET /library/flashcards`, `PUT /library/flashcards/{card_id}` (for reviews), `DELETE /library/flashcards/{card_id}`
- **Quizzes**: `GET /library/quizzes`, `POST /library/quizzes`, `DELETE /library/quizzes/{quiz_id}`
- **Diagrams**: `GET /library/diagrams`, `DELETE /library/diagrams/{diagram_id}`
- **Mindmaps**: `GET /library/mindmaps`, `DELETE /library/mindmaps/{mindmap_id}`

### 📄 Documents (`routers/documents.py`)
Manages ingested study materials (PDFs, docs).
- `GET /documents` - List uploaded documents.
- `PATCH /documents/{document_id}` - Update metadata (e.g., move to another course).
- `DELETE /documents/{document_id}` - Delete a document.
- `GET /documents/images/{content_hash}/{filename}` - Serve extracted images.
- `GET /sources/search` - Search specific sources for chunks.

### 🔍 Search & Trace (`routers/search.py`, `routers/trace.py`)
- `GET /search` - Global cross-workspace search.
- `GET /trace/last` - Fetches detailed debug tracing for the last RAG/Ask request.

### 📊 Dashboard & Activity (`routers/dashboard.py`)
- `GET /dashboard` - System-wide dashboard statistics.
- `GET /activity` - Recent user interactions and activity feed.

### ⚙️ Settings (`routers/settings.py`)
User preferences and LLM configurations.
- `GET /settings`, `PUT /settings` - Manage UI/LLM preferences (e.g., active models, temperature).
- `GET /models/list` - Fetch available backend models across categories (fast, reasoning, embedding, vision).

### 🧠 Knowledge Graph (`routers/knowledge.py`)
- `GET /knowledge-graph` - Retrieve nodes and edges for rendering a course's knowledge graph.
- `GET /knowledge/sidebar` - Contextual sidebar data.
- `GET /concepts/discover` - Discover unmapped or related concepts.
- `GET /concepts/{concept_id}` - Detailed concept inspector (definitions, references, citations).

### 💬 Prompts (`routers/prompts.py`)
- `GET /prompts/categories` - List available system prompt categories.
- `GET /prompts`, `POST /prompts`, `DELETE /prompts/{prompt_id}` - Manage custom prompts.
- `PUT /prompts/{prompt_id}/activate` - Set a prompt as active.

### 👨‍🏫 Teach Me (`routers/teach.py`)
Generates comprehensive learning packages.
- `GET /teach/packages`, `POST /teach/packages` - Save and list complete study packages.
- `GET /teach/packages/{package_id}`, `DELETE /teach/packages/{package_id}` - Manage a specific package.

### 📜 PYQ Analysis (`routers/pyq.py`)
Previous year question paper ingestion and analytics.
- `GET /pyq/papers` - List processed past papers.
- `DELETE /pyq/papers/{paper_id}` - Remove a paper.
- `GET /pyq/questions` - Fetch extracted questions, mapped by topic and difficulty.

### ⚖️ Differences (`routers/differences.py`)
Comparative tables (e.g., "Mitosis vs Meiosis").
- `GET /differences/suggestions` - Auto-suggest topics for comparison.
- `GET /differences`, `POST /differences`, `DELETE /differences/{table_id}` - Manage stored differences.

### 📖 Reading Mode (`routers/reading.py`)
- `GET /reading/{document_id}` - Retrieve a document organized by readable sections.
- `POST /reading/{document_id}/highlights` - Save text highlights.
- `POST /reading/{document_id}/bookmarks` - Save section bookmarks.

### 🚀 Onboarding (`routers/onboarding.py`)
- `GET /onboarding/analysis` - Automated analysis of a user's library setup.

---

## Data Models & Schemas

The `scholarcli/api/schemas.py` file defines the request and response shapes using Pydantic `BaseModel`s. 

> [!NOTE] 
> **Important Design Decision**: Field names in Pydantic models explicitly use `camelCase` (e.g., `sizeKb`, `addedAt`, `sourceType`) instead of snake_case. This is intentionally done to match the React frontend's expectations natively without needing mapping layers.

### Key Schema Groupings

- **RAG / Ask**: 
  - `AskRequest` (question, course filter, doc filter, override route)
  - `AskResponse` (content, sources array, confidence, grounded flag)
  - `SourceOut` (source snippets with titles, pages, similarity, and `sourceType`)
- **Tracing**: `TraceOut`, `TraceChunk` captures detailed metrics on vector retrieval, embedding models, token usage, and similarities for the UI trace viewer.
- **Generative Study Tools**: Standardized pair of Requests (`Generate*Request`) and Outputs (`*Out`) for:
  - **Flashcards** (`GenerateFlashcardsRequest` -> `FlashcardSet`)
  - **Quizzes** (`GenerateQuizRequest` -> `QuizOut` with `QuizQuestionOut`)
  - **Diagrams** (`GenerateDiagramRequest` -> `DiagramOut` containing `mermaid` string)
  - **Mindmaps** (`GenerateMindmapRequest` -> `MindmapOut`)
  - **Revisions** (`GenerateRevisionRequest` -> `RevisionOut`)
- **Exams**: `ExamGenerateRequest` supports biasing generation toward historical PYQ distributions. Responses yield `ExamSessionOut` and submission uses `ExamSubmitRequest` ending in `ExamResultOut` (with detailed topic performance and risk metrics).
- **Settings**: `SettingsOut` holds configuration for core LLMs (`fastModel`, `reasoningModel`, `embeddingModel`, `visionModel`), generation params (`temperature`, `topK`), and user profiles (`industry`, `goals`, `learningPreferences`).
- **PYQ**: Models represent papers (`PyqPaperOut`), individual questions (`PyqQuestionOut` mapping subtopics, difficulty, and year), and heavy statistical breakdowns (`PyqAnalysisOut` for frequency/patterns/readiness).
