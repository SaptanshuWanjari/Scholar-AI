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
    if filter not in ("all", "documents", "whiteboards"):
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Filter type not yet supported")

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

    if filter in ("all", "whiteboards"):
        from scholarcli.storage import get_session
        from scholarcli.storage.models import Whiteboard

        session = get_session()
        try:
            rows = (
                session.query(Whiteboard)
                .filter(Whiteboard.title.ilike(f"%{query}%"))
                .order_by(Whiteboard.updated_at.desc())
                .limit(max(1, min(limit, 20)))
                .all()
            )
            for wb in rows:
                results.append(
                    SearchResultOut(
                        id=str(wb.id),
                        group="Whiteboards",
                        title=wb.title,
                        snippet=(wb.course or "Whiteboard"),
                        course=wb.course,
                    )
                )
        finally:
            session.close()

    return results
