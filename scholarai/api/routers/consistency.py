"""Cross-artifact consistency endpoints — analyze-only.

Two entry points share one core service (``consistency_service``):
- ``/api/consistency/analyze``  : in-memory Teach Me Package artifacts.
- ``/api/consistency/library``  : saved artifacts for a course (DB-backed).
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from scholarai.api import consistency_service
from scholarai.api.schemas import (
    ConsistencyApplyRequest,
    ConsistencyApplyResponse,
    ConsistencyLibraryRequest,
    ConsistencyReport,
    ConsistencyRequest,
)

router = APIRouter(prefix="/api/consistency", tags=["consistency"])


@router.post("/analyze", response_model=ConsistencyReport)
async def analyze(req: ConsistencyRequest) -> ConsistencyReport:
    if not req.sourceText.strip():
        raise HTTPException(status_code=400, detail="sourceText is required")
    report = await run_in_threadpool(
        consistency_service.build_report, req.sourceText, req.artifacts
    )
    return ConsistencyReport(**report)


@router.post("/library", response_model=ConsistencyReport)
async def library(req: ConsistencyLibraryRequest) -> ConsistencyReport:
    if not req.course.strip():
        raise HTTPException(status_code=400, detail="course is required")
    report = await run_in_threadpool(
        consistency_service.build_library_report, req.course, req.document
    )
    return ConsistencyReport(**report)


@router.post("/apply", response_model=ConsistencyApplyResponse)
async def apply(req: ConsistencyApplyRequest) -> ConsistencyApplyResponse:
    if not req.course.strip():
        raise HTTPException(status_code=400, detail="course is required")
    result = await run_in_threadpool(
        consistency_service.apply_correction, req.course, req.artifactType, req.concepts
    )
    return ConsistencyApplyResponse(**result)
