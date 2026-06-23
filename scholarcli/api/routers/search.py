"""Global semantic search endpoint.

v1 searches indexed document chunks (vector search). Flashcards/quizzes/etc.
will join in once those are persisted (see persistence task).
"""

from __future__ import annotations

import scholarcli.llm
from fastapi import APIRouter

from scholarcli.api.rag_service import serialize_chunks
from scholarcli.api.schemas import SearchResultOut
from scholarcli.storage.vectors import search

router = APIRouter(prefix="/api", tags=["search"])


@router.get("/search", response_model=list[SearchResultOut])
def global_search(q: str, filter: str = "all", limit: int = 10) -> list[SearchResultOut]:
    query = q.strip()
    if not query:
        return []

    results: list[SearchResultOut] = []
    if filter in ("all", "documents"):
        emb = scholarcli.llm.get_embeddings()
        vector = emb.embed_query(query)
        for s in serialize_chunks(search(vector, top_k=max(1, min(limit, 20)))):
            results.append(
                SearchResultOut(
                    id=s["id"],
                    group="Documents",
                    title=s["title"],
                    snippet=s["snippet"],
                    course=s["course"],
                )
            )
    return results
