"""Durable background-job tracking.

FastAPI ``BackgroundTasks`` already runs ingestion off the request path, but its
state lived only in memory. These helpers persist each job in the BackgroundJob
table so the UI can poll progress (and see it after a reload). Best-effort:
status updates never raise into the caller.
"""

from __future__ import annotations

import secrets

from scholarcli.storage import get_session
from scholarcli.storage.models import BackgroundJob


def create_job(kind: str, label: str = "", payload: dict | None = None) -> str:
    job_id = secrets.token_hex(8)
    session = get_session()
    try:
        session.add(
            BackgroundJob(
                id=job_id, kind=kind, status="queued", label=label, payload=payload
            )
        )
        session.commit()
    finally:
        session.close()
    return job_id


def _update(job_id: str, **fields) -> None:
    session = get_session()
    try:
        job = session.get(BackgroundJob, job_id)
        if job:
            for k, v in fields.items():
                setattr(job, k, v)
            session.commit()
    except Exception:  # noqa: BLE001 — status tracking must never break the task
        pass
    finally:
        session.close()


def mark_running(job_id: str) -> None:
    _update(job_id, status="running")


def mark_done(job_id: str, result: dict | None = None) -> None:
    _update(job_id, status="done", result=result, error=None)


def mark_failed(job_id: str, error: str) -> None:
    _update(job_id, status="failed", error=error[:500])


def _job_out(job: BackgroundJob) -> dict:
    return {
        "id": job.id,
        "kind": job.kind,
        "status": job.status,
        "label": job.label,
        "result": job.result,
        "error": job.error,
        "createdAt": job.created_at.isoformat() if job.created_at else "",
        "updatedAt": job.updated_at.isoformat() if job.updated_at else "",
    }


def list_jobs(limit: int = 50, offset: int = 0) -> list[dict]:
    session = get_session()
    try:
        rows = (
            session.query(BackgroundJob)
            .order_by(BackgroundJob.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
        return [_job_out(j) for j in rows]
    finally:
        session.close()


def get_job(job_id: str) -> dict | None:
    session = get_session()
    try:
        job = session.get(BackgroundJob, job_id)
        return _job_out(job) if job else None
    finally:
        session.close()


def delete_job(job_id: str) -> None:
    session = get_session()
    try:
        job = session.get(BackgroundJob, job_id)
        if job:
            session.delete(job)
            session.commit()
    finally:
        session.close()
