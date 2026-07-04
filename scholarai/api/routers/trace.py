"""RAG retrieval trace endpoint."""

from __future__ import annotations

from fastapi import APIRouter

from scholarai.api import rag_service, trace_service
from scholarai.api.schemas import (
    TraceAnalyticsOut,
    TraceFeedbackRequest,
    TraceOut,
)

router = APIRouter(prefix="/api", tags=["trace"])


@router.get("/trace/last", response_model=TraceOut)
def last_trace() -> TraceOut:
    data = rag_service.get_last_trace()
    if not data:
        from scholarai.config import get_settings

        s = get_settings()
        return TraceOut(embeddingModel=s.models.embedding, topK=s.retrieval.top_k)
    return TraceOut(**data)


@router.get("/trace/analytics", response_model=TraceAnalyticsOut)
def trace_analytics() -> TraceAnalyticsOut:
    return TraceAnalyticsOut(**trace_service.analytics())


@router.post("/trace/feedback", status_code=204)
def trace_feedback(req: TraceFeedbackRequest) -> None:
    trace_service.record_feedback(req.chunkId, req.source, req.query, req.similarity)
