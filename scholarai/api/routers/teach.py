"""Teach Me — a one-topic learning workspace.

Phase 1: POST /api/teach/overview — RAG retrieval + draft notes. Returns a
         ``session_id`` (LangGraph thread ID) so Phase 2 can resume.
Phase 2: POST /api/teach/{session_id}/resume — inject approved notes, generate
         all downstream artifacts from student-edited context.

Saved packages (``/api/teach/packages``) snapshot a completed workspace.
"""

from __future__ import annotations

import asyncio
from collections import defaultdict
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from scholarai.api import dependency_service
from scholarai.api.activity_service import record_activity
from scholarai.api.schemas import (
    PackageIn,
    PackageMeta,
    PackageOut,
    SourceOut,
    TeachArtifactsOut,
    TeachDraftOut,
    TeachRequest,
    TeachResumeRequest,
)
from scholarai.storage import get_session
from scholarai.storage.models import LearningPackage, TrashIndex

router = APIRouter(prefix="/api/teach", tags=["teach"])

_session_locks: dict[str, asyncio.Lock] = defaultdict(asyncio.Lock)


# ---------------------------------------------------------------------------
# Phase 1: draft overview with HITL interrupt
# ---------------------------------------------------------------------------

@router.post("/overview", response_model=TeachDraftOut)
async def generate_overview(req: TeachRequest) -> TeachDraftOut:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")

    from scholarai.rag.teach_graph import get_teach_graph, new_thread_id

    thread_id = new_thread_id()
    doc_id = int(req.document) if req.document and req.document.isdigit() else None

    state = {
        "topic": topic,
        "depth": req.depth,
        "course": req.course,
        "document_id": doc_id,
    }
    config = {"configurable": {"thread_id": thread_id}}

    async with _session_locks[thread_id]:
        raw = await run_in_threadpool(get_teach_graph().invoke, state, config)
    result: dict = raw  # type: ignore[assignment]

    record_activity("revision", f"Teach draft: {topic}", req.course or "")
    return TeachDraftOut(
        session_id=thread_id,
        title=topic,
        draft_markdown=result.get("draft_notes", ""),
        grounded=result.get("grounded", False),
        sources=[SourceOut(**s) for s in result.get("sources", [])],
    )


# ---------------------------------------------------------------------------
# Phase 2: resume with approved notes
# ---------------------------------------------------------------------------

@router.post("/{session_id}/resume", response_model=TeachArtifactsOut)
async def resume_teach(session_id: str, req: TeachResumeRequest) -> TeachArtifactsOut:
    if not req.approved_notes_markdown.strip():
        raise HTTPException(status_code=400, detail="approved_notes_markdown is required")

    from langgraph.types import Command
    from scholarai.rag.teach_graph import get_teach_graph

    resume_value = {
        "approved_notes": req.approved_notes_markdown,
        "artifacts_to_generate": req.artifacts_to_generate,
    }
    config = {"configurable": {"thread_id": session_id}}

    try:
        async with _session_locks[session_id]:
            raw2 = await run_in_threadpool(
                get_teach_graph().invoke,
                Command(resume=resume_value),
                config,
            )
        result: dict = raw2  # type: ignore[assignment]
    except Exception as exc:
        raise HTTPException(status_code=404, detail=f"Session not found or expired: {exc}") from exc

    artifacts: dict = result.get("artifacts", {})
    record_activity("revision", f"Teach artifacts generated (session {session_id[:8]})", "")
    return TeachArtifactsOut(
        notes=artifacts.get("notes"),
        flashcards=artifacts.get("flashcards"),
        quiz=artifacts.get("quiz"),
        mindmap=artifacts.get("mindmap"),
        diagram=artifacts.get("diagram"),
        difference=artifacts.get("difference"),
    )


# ---------------------------------------------------------------------------
# Saved packages
# ---------------------------------------------------------------------------

def _artifact_count(pkg: LearningPackage) -> int:
    arts = pkg.artifacts or {}
    count = sum(1 for v in arts.values() if v)
    if pkg.overview:
        count += 1
    return count


def _meta(pkg: LearningPackage) -> PackageMeta:
    return PackageMeta(
        id=str(pkg.id),
        title=pkg.title,
        course=pkg.course,
        depth=pkg.depth,
        artifactCount=_artifact_count(pkg),
        createdAt=pkg.created_at.isoformat(),
        notebookId=str(pkg.notebook_id) if pkg.notebook_id else None,
    )


def _full(pkg: LearningPackage) -> PackageOut:
    return PackageOut(
        id=str(pkg.id),
        title=pkg.title,
        course=pkg.course,
        depth=pkg.depth,
        overview=pkg.overview or {},
        artifacts=pkg.artifacts or {},
        sources=pkg.sources or [],
        createdAt=pkg.created_at.isoformat(),
        updatedAt=pkg.updated_at.isoformat(),
        notebookId=str(pkg.notebook_id) if pkg.notebook_id else None,
    )


@router.get("/packages", response_model=list[PackageMeta])
def list_packages() -> list[PackageMeta]:
    session = get_session()
    try:
        rows = (
            session.query(LearningPackage)
            .filter(LearningPackage.is_deleted == False)
            .order_by(LearningPackage.created_at.desc())
            .all()
        )
        return [_meta(p) for p in rows]
    finally:
        session.close()


@router.get("/packages/{package_id}", response_model=PackageOut)
def get_package(package_id: int) -> PackageOut:
    session = get_session()
    try:
        pkg = session.get(LearningPackage, package_id)
        if not pkg:
            raise HTTPException(status_code=404, detail="Package not found")
        return _full(pkg)
    finally:
        session.close()


@router.post("/packages", response_model=PackageOut, status_code=201)
def save_package(payload: PackageIn) -> PackageOut:
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="title is required")
    session = get_session()
    try:
        notebook_id = int(payload.notebookId) if payload.notebookId else None
        pkg = LearningPackage(
            title=title,
            course=payload.course or "",
            depth=payload.depth,
            concept_id=dependency_service.resolve_concept(title, payload.course),
            notebook_id=notebook_id,
            overview=payload.overview,
            artifacts=payload.artifacts,
            sources=payload.sources,
        )
        session.add(pkg)
        session.commit()
        session.refresh(pkg)
        record_activity("note", f"Saved learning package: {title}", pkg.course)
        return _full(pkg)
    finally:
        session.close()


@router.delete("/packages/{package_id}", status_code=204)
def delete_package(package_id: int) -> None:
    session = get_session()
    try:
        pkg = session.get(LearningPackage, package_id)
        if not pkg:
            raise HTTPException(status_code=404, detail="Package not found")
        pkg.is_deleted = True
        pkg.deleted_at = datetime.now(timezone.utc)
        ti = TrashIndex(
            id=str(uuid4()),
            artifact_type="learning_package",
            artifact_id=str(pkg.id),
            title=pkg.title,
            subtitle=None,
            course_name=pkg.course if pkg.course else None,
            deleted_at=datetime.now(timezone.utc),
        )
        session.add(ti)
        session.commit()
    finally:
        session.close()
