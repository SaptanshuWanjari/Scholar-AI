"""Difference-table endpoints — generate, save, list, delete."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.api.activity_service import record_activity
from scholarcli.api.prompt_service import active_body
from scholarcli.api.rag_service import run_ask
from scholarcli.api.schemas import (
    DifferenceOut,
    DifferenceTableItem,
    GenerateDifferenceRequest,
    SaveDifferenceRequest,
)
from scholarcli.llm import get_llm
from scholarcli.rag.prompts import DIFFERENCES_SYSTEM
from scholarcli.storage import get_session
from scholarcli.storage.models import Concept, DifferenceTable

router = APIRouter(prefix="/api/differences", tags=["differences"])

_FALLBACK_SUGGESTIONS = [
    "Process vs Thread",
    "REST vs gRPC",
    "Paging vs Segmentation",
    "Monolith vs Microservices",
    "RAG vs Fine-Tuning",
    "Deadlock Prevention vs Deadlock Avoidance",
    "TCP vs UDP",
    "Stack vs Heap",
]


def _direct_generate(topic: str) -> str:
    """Direct LLM call — no RAG grounding gate. Used when documents don't cover the topic."""
    system = active_body("differences") or DIFFERENCES_SYSTEM
    llm = get_llm("differences")
    resp = llm.invoke([
        SystemMessage(content=system),
        HumanMessage(content=f"Compare and contrast: {topic}"),
    ])
    content = resp.content if hasattr(resp, "content") else str(resp)
    return content if isinstance(content, str) else str(content)


@router.post("/generate", response_model=DifferenceOut)
async def generate_difference(req: GenerateDifferenceRequest) -> DifferenceOut:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    query = f"Compare and contrast: {topic}"
    result = await run_in_threadpool(run_ask, query, req.course, req.document, "differences")

    if result["grounded"]:
        content = result["content"]
        grounded = True
    else:
        content = await run_in_threadpool(_direct_generate, topic)
        grounded = False

    record_activity("difference", f"Generated difference table: {topic}", req.course or "")
    return DifferenceOut(
        title=topic,
        content=content,
        grounded=grounded,
    )


@router.get("/suggestions", response_model=list[str])
def get_suggestions() -> list[str]:
    session = get_session()
    try:
        concepts = (
            session.query(Concept.name)
            .order_by(Concept.ref_count.desc())
            .limit(10)
            .all()
        )
    finally:
        session.close()
    names = [c.name for c in concepts]
    pairs = [f"{names[i]} vs {names[i + 1]}" for i in range(0, len(names) - 1, 2)]
    seen = set(pairs)
    for fb in _FALLBACK_SUGGESTIONS:
        if len(pairs) >= 5:
            break
        if fb not in seen:
            pairs.append(fb)
            seen.add(fb)
    return pairs[:5]


@router.get("", response_model=list[DifferenceTableItem])
def list_differences() -> list[DifferenceTableItem]:
    session = get_session()
    try:
        rows = (
            session.query(DifferenceTable)
            .order_by(DifferenceTable.created_at.desc())
            .all()
        )
        return [
            DifferenceTableItem(
                id=r.id,
                title=r.title,
                course=r.course,
                content=r.content,
                createdAt=r.created_at.isoformat(),
            )
            for r in rows
        ]
    finally:
        session.close()


@router.post("", response_model=DifferenceTableItem, status_code=201)
def save_difference(req: SaveDifferenceRequest) -> DifferenceTableItem:
    session = get_session()
    try:
        row = DifferenceTable(
            title=req.title,
            content=req.content,
            course=req.course or "",
        )
        session.add(row)
        session.commit()
        session.refresh(row)
        return DifferenceTableItem(
            id=row.id,
            title=row.title,
            course=row.course,
            content=row.content,
            createdAt=row.created_at.isoformat(),
        )
    finally:
        session.close()


@router.delete("/{table_id}")
def delete_difference(table_id: int) -> dict:
    session = get_session()
    try:
        row = session.get(DifferenceTable, table_id)
        if not row:
            raise HTTPException(status_code=404, detail="not found")
        session.delete(row)
        session.commit()
    finally:
        session.close()
    return {"ok": True}
