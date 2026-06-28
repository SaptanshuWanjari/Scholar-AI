"""Whiteboard (Excalidraw) CRUD, revisions, and AI assist.

A whiteboard is a first-class visual artifact storing a full Excalidraw scene
as JSON. AI generation reuses the existing ``mermaid`` RAG route — the frontend
converts the returned Mermaid into editable Excalidraw elements.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from scholarcli.api import parsers
from scholarcli.api.activity_service import record_activity
from scholarcli.api.rag_service import run_ask
from scholarcli.api.schemas import (
    WhiteboardAssistRequest,
    WhiteboardAssistResponse,
    WhiteboardCreate,
    WhiteboardGenerateRequest,
    WhiteboardGenerateResponse,
    WhiteboardMeta,
    WhiteboardOut,
    WhiteboardPatch,
    WhiteboardRevisionCreate,
    WhiteboardRevisionOut,
)
from scholarcli.storage import get_session
from scholarcli.storage.models import Whiteboard, WhiteboardRevision

router = APIRouter(prefix="/api/whiteboards", tags=["whiteboards"])

# Cap on retained revisions per whiteboard. Old snapshots are pruned on each new
# save so version history doesn't grow the database without bound.
MAX_REVISIONS = 30


def _fmt(dt) -> str:
    return dt.strftime("%Y-%m-%d %H:%M") if dt else ""


def _meta(wb: Whiteboard) -> WhiteboardMeta:
    return WhiteboardMeta(
        id=str(wb.id),
        title=wb.title,
        course=wb.course,
        source=wb.source,
        status=wb.status,
        thumbnail=wb.thumbnail,
        revisions=len(wb.revisions or []),
        updated=_fmt(wb.updated_at),
        createdAt=_fmt(wb.created_at),
    )


def _full(wb: Whiteboard) -> WhiteboardOut:
    return WhiteboardOut(
        id=str(wb.id),
        title=wb.title,
        course=wb.course,
        scene=wb.scene or {},
        thumbnail=wb.thumbnail,
        source=wb.source,
        status=wb.status,
        quality=None,
        updated=_fmt(wb.updated_at),
        createdAt=_fmt(wb.created_at),
    )


def _revision(rev: WhiteboardRevision) -> WhiteboardRevisionOut:
    return WhiteboardRevisionOut(
        id=str(rev.id),
        whiteboardId=str(rev.whiteboard_id),
        revisionNumber=rev.revision_number,
        changeSummary=rev.change_summary,
        scene=rev.scene or {},
        createdAt=_fmt(rev.created_at),
    )


# ---------------------------------------------------------------------------
# CRUD
# ---------------------------------------------------------------------------

@router.get("", response_model=list[WhiteboardMeta])
def list_whiteboards(course: str | None = None) -> list[WhiteboardMeta]:
    session = get_session()
    try:
        q = session.query(Whiteboard)
        if course:
            q = q.filter(Whiteboard.course == course)
        return [_meta(wb) for wb in q.order_by(Whiteboard.updated_at.desc()).all()]
    finally:
        session.close()


@router.post("", response_model=WhiteboardOut, status_code=201)
def create_whiteboard(payload: WhiteboardCreate) -> WhiteboardOut:
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title is required")
    session = get_session()
    try:
        wb = Whiteboard(
            title=title,
            course=payload.course or "",
            scene=payload.scene or {},
            thumbnail=payload.thumbnail,
            source=payload.source or "manual",
        )
        session.add(wb)
        session.commit()
        session.refresh(wb)
        record_activity("whiteboard", f"Created whiteboard: {wb.title}", wb.course)
        return _full(wb)
    finally:
        session.close()


@router.get("/{whiteboard_id}", response_model=WhiteboardOut)
def get_whiteboard(whiteboard_id: int) -> WhiteboardOut:
    session = get_session()
    try:
        wb = session.get(Whiteboard, whiteboard_id)
        if not wb:
            raise HTTPException(status_code=404, detail="Whiteboard not found")
        return _full(wb)
    finally:
        session.close()


@router.put("/{whiteboard_id}", response_model=WhiteboardOut)
def update_whiteboard(whiteboard_id: int, patch: WhiteboardPatch) -> WhiteboardOut:
    session = get_session()
    try:
        wb = session.get(Whiteboard, whiteboard_id)
        if not wb:
            raise HTTPException(status_code=404, detail="Whiteboard not found")
        if patch.title is not None:
            wb.title = patch.title
        if patch.course is not None:
            wb.course = patch.course
        if patch.scene is not None:
            wb.scene = patch.scene
        if patch.thumbnail is not None:
            wb.thumbnail = patch.thumbnail
        if patch.status is not None:
            wb.status = patch.status
        session.commit()
        session.refresh(wb)
        return _full(wb)
    finally:
        session.close()


@router.delete("/{whiteboard_id}", status_code=204)
def delete_whiteboard(whiteboard_id: int) -> None:
    session = get_session()
    try:
        wb = session.get(Whiteboard, whiteboard_id)
        if not wb:
            raise HTTPException(status_code=404, detail="Whiteboard not found")
        session.delete(wb)
        session.commit()
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Revisions (version history)
# ---------------------------------------------------------------------------

@router.get("/{whiteboard_id}/revisions", response_model=list[WhiteboardRevisionOut])
def list_revisions(whiteboard_id: int) -> list[WhiteboardRevisionOut]:
    session = get_session()
    try:
        wb = session.get(Whiteboard, whiteboard_id)
        if not wb:
            raise HTTPException(status_code=404, detail="Whiteboard not found")
        revs = (
            session.query(WhiteboardRevision)
            .filter(WhiteboardRevision.whiteboard_id == whiteboard_id)
            .order_by(WhiteboardRevision.revision_number.desc())
            .all()
        )
        return [_revision(r) for r in revs]
    finally:
        session.close()


@router.post("/{whiteboard_id}/revisions", response_model=WhiteboardRevisionOut, status_code=201)
def save_revision(whiteboard_id: int, payload: WhiteboardRevisionCreate) -> WhiteboardRevisionOut:
    session = get_session()
    try:
        wb = session.get(Whiteboard, whiteboard_id)
        if not wb:
            raise HTTPException(status_code=404, detail="Whiteboard not found")
        last = (
            session.query(WhiteboardRevision)
            .filter(WhiteboardRevision.whiteboard_id == whiteboard_id)
            .order_by(WhiteboardRevision.revision_number.desc())
            .first()
        )
        next_number = (last.revision_number + 1) if last else 1
        # Snapshot the supplied scene (fall back to the whiteboard's current scene).
        scene = payload.scene or wb.scene or {}
        rev = WhiteboardRevision(
            whiteboard_id=whiteboard_id,
            revision_number=next_number,
            scene=scene,
            change_summary=payload.change_summary or "",
        )
        # Keep the live whiteboard in sync with the snapshotted scene.
        wb.scene = scene
        session.add(rev)
        # Prune the oldest revisions beyond the retention cap to free space.
        cutoff = next_number - MAX_REVISIONS
        if cutoff > 0:
            session.query(WhiteboardRevision).filter(
                WhiteboardRevision.whiteboard_id == whiteboard_id,
                WhiteboardRevision.revision_number <= cutoff,
            ).delete(synchronize_session=False)
        session.commit()
        session.refresh(rev)
        return _revision(rev)
    finally:
        session.close()


@router.post("/{whiteboard_id}/restore/{revision_number}", response_model=WhiteboardOut)
def restore_revision(whiteboard_id: int, revision_number: int) -> WhiteboardOut:
    session = get_session()
    try:
        wb = session.get(Whiteboard, whiteboard_id)
        if not wb:
            raise HTTPException(status_code=404, detail="Whiteboard not found")
        rev = (
            session.query(WhiteboardRevision)
            .filter(
                WhiteboardRevision.whiteboard_id == whiteboard_id,
                WhiteboardRevision.revision_number == revision_number,
            )
            .first()
        )
        if not rev:
            raise HTTPException(status_code=404, detail="Revision not found")
        wb.scene = rev.scene or {}
        session.commit()
        session.refresh(wb)
        return _full(wb)
    finally:
        session.close()


# ---------------------------------------------------------------------------
# AI assist — reuses the existing RAG pipeline
# ---------------------------------------------------------------------------

@router.post("/generate", response_model=WhiteboardGenerateResponse)
async def generate_whiteboard(req: WhiteboardGenerateRequest) -> WhiteboardGenerateResponse:
    """Generate an initial diagram as Mermaid; the client converts to Excalidraw."""
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    kind = (req.type or "flowchart").replace("_", " ")
    query = f"Generate a {kind} diagram about: {topic}"
    result = await run_in_threadpool(
        run_ask, query, req.course, req.document, "mermaid", topic, req.rag_mode
    )
    mermaid = parsers.strip_mermaid_fences(result["content"])
    record_activity("whiteboard", f"Generated whiteboard: {topic}", req.course or "")
    return WhiteboardGenerateResponse(
        title=topic,
        mermaid=mermaid,
        grounded=result["grounded"],
    )


@router.post("/assist", response_model=WhiteboardAssistResponse)
async def assist_whiteboard(req: WhiteboardAssistRequest) -> WhiteboardAssistResponse:
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    if req.action == "explain":
        instruction = (
            "Explain this whiteboard diagram. The labels and relationships are:\n\n"
            f"{text}\n\nProvide a clear explanation of the concepts and how they connect."
        )
        result = await run_in_threadpool(
            run_ask, instruction, req.course, req.document, "study_notes"
        )
        return WhiteboardAssistResponse(text=result["content"])
    # action == "expand": grow related concepts around a node as a Mermaid sub-graph.
    instruction = f"Generate a flowchart diagram of concepts directly related to: {text}"
    result = await run_in_threadpool(
        run_ask, instruction, req.course, req.document, "mermaid", text
    )
    mermaid = parsers.strip_mermaid_fences(result["content"])
    return WhiteboardAssistResponse(mermaid=mermaid)
