# API Endpoints

## What's Done
- **Comprehensive API Surface**: Dozens of endpoints are defined under `scholarcli/api/routers/`. They are well-segregated by domain:
  - `study.py` for generative studying (flashcards, quizzes, diagrams, mindmaps).
  - `pyq.py` for Previous Year Question analysis and extraction.
  - `exam.py` for full exam generation and evaluation.
  - `library.py` for fetching saved artifacts.
  - `documents.py` for ingestion and library management.
- **Streaming Endpoints**: Support for streaming LLM responses (e.g., `/revision/generate/stream` in `study.py`) using Server-Sent Events (SSE).

## What's Partial
- **Input Validation**: Most endpoints have basic validation, but complex schema validations (using Pydantic features like constraints) are minimal.
- **Pagination**: Endpoints returning lists (e.g., listing questions or library items) lack robust cursor or offset-based pagination.

## What's Missing
- **Rate Limiting**: No API rate-limiting middleware is implemented.
- **OpenAPI Customization**: The auto-generated Swagger UI works, but lacks detailed descriptions and example responses for every endpoint.
