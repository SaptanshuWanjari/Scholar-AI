"""RAG retrieval trace endpoint."""

from __future__ import annotations

from fastapi import APIRouter

from scholarcli.api import rag_service
from scholarcli.api.schemas import TraceOut

router = APIRouter(prefix="/api", tags=["trace"])


@router.get("/trace/last", response_model=TraceOut)
def last_trace() -> TraceOut:
    data = rag_service.get_last_trace()
    if not data:
        from scholarcli.config import get_settings

        s = get_settings()
        return TraceOut(embeddingModel=s.models.embedding, topK=s.retrieval.top_k)
    return TraceOut(**data)
