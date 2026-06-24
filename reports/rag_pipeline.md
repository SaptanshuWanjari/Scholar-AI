# RAG Pipeline

## What's Done
- **Ingestion Pipeline**: The RAG ingestion pipeline is fully implemented in `scholarcli/ingest/pipeline.py`. It includes file hashing to prevent redundant ingestion, document loading, chunking (`chunker.py`), and embedding via LangChain embeddings.
- **Vector Storage**: Uses LanceDB for storing vectors (`vectors.py`) and SQLAlchemy for document metadata.
- **LangGraph Integration**: The RAG generation flow uses LangGraph (`rag/graph.py`) to construct a DAG: `router -> retrieve -> verify -> generate`.

## What's Partial
- **Multimodal Extraction**: There are stubs or initial implementations for OCR and Vision (`vision.py`, `ocr.py`), but the vector pipeline mostly handles text chunks currently.
- **Advanced Retrieval**: Currently relies on standard vector similarity search. Advanced techniques like hybrid search (BM25 + Vector) or cross-encoder reranking are not fully integrated into the primary pipeline.

## What's Missing
- **Distributed Processing**: The current pipeline is synchronous and local-first. Ingesting massive datasets will require a background task queue (e.g., Celery/Redis).
- **Automated Metadata Extraction**: Beyond basic titles, it lacks automated tagging or hierarchical document summarization during ingestion.
