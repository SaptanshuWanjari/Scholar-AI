"""Ask / chat endpoints (one-shot + SSE streaming) and chat-history CRUD."""

from __future__ import annotations

import json

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import StreamingResponse

from scholarcli.api import chat_service, rag_service
from scholarcli.api.activity_service import record_activity
from scholarcli.api.schemas import (
    AskRequest,
    AskResponse,
    ChatSessionCreate,
    ChatSessionMeta,
    ChatSessionOut,
    SourceOut,
)

router = APIRouter(prefix="/api", tags=["ask"])


@router.post("/ask", response_model=AskResponse)
async def ask(payload: AskRequest) -> AskResponse:
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="question is required")
    if payload.sessionId:
        chat_service.append_message(payload.sessionId, "user", question)
    result = await run_in_threadpool(
        rag_service.run_ask, question, payload.course, payload.document, payload.route,
        payload.search_query, payload.rag_mode, payload.socratic
    )
    record_activity("ask", f"Asked: {question}", payload.course or "")
    if payload.sessionId:
        chat_service.append_message(
            payload.sessionId, "assistant", result["content"], result["sources"]
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
    record_activity("ask", f"Asked: {question}", payload.course or "")
    session_id = payload.sessionId
    if session_id:
        chat_service.append_message(session_id, "user", question)

    def event_stream():
        parts: list[str] = []
        final_sources: list = []
        try:
            for event in rag_service.stream_ask(
                question, payload.course, payload.document, payload.route,
                payload.search_query, payload.rag_mode, payload.socratic
            ):
                if event.get("type") == "token":
                    parts.append(event.get("value", ""))
                elif event.get("type") == "done":
                    final_sources = event.get("sources", []) or []
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as exc:  # noqa: BLE001 — report errors over the stream
            err = {"type": "error", "value": str(exc)}
            yield f"data: {json.dumps(err)}\n\n"
        finally:
            if session_id and parts:
                chat_service.append_message(
                    session_id, "assistant", "".join(parts), final_sources
                )

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ---------------------------------------------------------------------------
# Chat history
# ---------------------------------------------------------------------------

@router.get("/chat/sessions", response_model=list[ChatSessionMeta])
def list_chat_sessions() -> list[ChatSessionMeta]:
    return [ChatSessionMeta(**s) for s in chat_service.list_sessions()]


@router.post("/chat/sessions", response_model=ChatSessionMeta, status_code=201)
def create_chat_session(payload: ChatSessionCreate) -> ChatSessionMeta:
    return ChatSessionMeta(**chat_service.create_session(payload.course, payload.title))


@router.get("/chat/sessions/{session_id}", response_model=ChatSessionOut)
def get_chat_session(session_id: str) -> ChatSessionOut:
    data = chat_service.get_session_detail(session_id)
    if not data:
        raise HTTPException(status_code=404, detail="Chat session not found")
    return ChatSessionOut(**data)


@router.delete("/chat/sessions/{session_id}", status_code=204)
def delete_chat_session(session_id: str) -> None:
    if not chat_service.delete_session(session_id):
        raise HTTPException(status_code=404, detail="Chat session not found")
