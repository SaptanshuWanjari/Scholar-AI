"""Background-job status endpoints (poll ingestion + other async work)."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from scholarcli.api import job_service
from scholarcli.api.schemas import JobOut

router = APIRouter(prefix="/api", tags=["jobs"])


@router.get("/jobs", response_model=list[JobOut])
def list_jobs() -> list[JobOut]:
    return [JobOut(**j) for j in job_service.list_jobs()]


@router.get("/jobs/{job_id}", response_model=JobOut)
def get_job(job_id: str) -> JobOut:
    job = job_service.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobOut(**job)
