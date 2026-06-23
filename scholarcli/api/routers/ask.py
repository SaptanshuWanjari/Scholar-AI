"""Ask / chat endpoints (one-shot + SSE streaming)."""

from __future__ import annotations

import json

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import StreamingResponse

from scholarcli.api import rag_service
from scholarcli.api.schemas import AskRequest, AskResponse, SourceOut

router = APIRouter(prefix="/api", tags=["ask"])


@router.post("/ask", response_model=AskResponse)
async def ask(payload: AskRequest) -> AskResponse:
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="question is required")
    result = await run_in_threadpool(
        rag_service.run_ask, question, payload.course, payload.route
    )
    return AskResponse(
        id=f"a-{abs(hash(question)) % 10_000_000}",
        content=result["content"],
        sources=[SourceOut(**s) for s in result["sources"]],
        confidence=result["confidence"],
        grounded=result["grounded"],
        route=result["route"],
    )


@router.post("/ask/stream")
async def ask_stream(payload: AskRequest) -> StreamingResponse:
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="question is required")

    def event_stream():
        try:
            for event in rag_service.stream_ask(
                question, payload.course, payload.route
            ):
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as exc:  # noqa: BLE001 — report errors over the stream
            err = {"type": "error", "value": str(exc)}
            yield f"data: {json.dumps(err)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
