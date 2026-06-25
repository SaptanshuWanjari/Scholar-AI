"""Teach Me — a one-topic learning workspace.

The ``/api/teach/overview`` endpoint generates the learning overview (and
returns the retrieved sources that drive the package's Sources view). The
remaining artifacts reuse the existing generative endpoints (flashcards, quiz,
diagram, mind map, revision notes, differences). ``/api/teach/packages`` saves
and restores a whole generated workspace as a single JSON snapshot.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from scholarcli.api import dependency_service
from scholarcli.api.activity_service import record_activity
from scholarcli.api.rag_service import run_ask
from scholarcli.api.schemas import (
    OverviewOut,
    PackageIn,
    PackageMeta,
    PackageOut,
    SourceOut,
    TeachRequest,
)
from scholarcli.storage import get_session
from scholarcli.storage.models import LearningPackage

router = APIRouter(prefix="/api/teach", tags=["teach"])

_DEPTH_HINT = {
    "quick": "Keep it brief — a short, high-level overview.",
    "standard": "Provide a balanced, exam-ready overview.",
    "deep": "Go in depth with thorough explanations and nuance.",
}


@router.post("/overview", response_model=OverviewOut)
async def generate_overview(req: TeachRequest) -> OverviewOut:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    hint = _DEPTH_HINT.get(req.depth, _DEPTH_HINT["standard"])
    query = (
        f"Write a learning overview for: {topic}. {hint} "
        "Use these markdown sections with '## ' headings, in this order: "
        "Definition, Importance, Prerequisites, Related Topics, "
        "Estimated Study Time, Difficulty."
    )
    result = await run_in_threadpool(run_ask, query, req.course, req.document, "study_notes", topic)
    record_activity("revision", f"Teach overview: {topic}", "")
    return OverviewOut(
        title=topic,
        markdown=result["content"],
        grounded=result["grounded"],
        sources=[SourceOut(**s) for s in result["sources"]],
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
    )


@router.get("/packages", response_model=list[PackageMeta])
def list_packages() -> list[PackageMeta]:
    session = get_session()
    try:
        rows = (
            session.query(LearningPackage)
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
        pkg = LearningPackage(
            title=title,
            course=payload.course or "",
            depth=payload.depth,
            concept_id=dependency_service.resolve_concept(title, payload.course),
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
        session.delete(pkg)
        session.commit()
    finally:
        session.close()
