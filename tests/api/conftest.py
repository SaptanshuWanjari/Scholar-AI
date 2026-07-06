"""Fixtures for API contract tests."""

import time
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from scholarai.api.app import create_app


@pytest.fixture
def client():
    app = create_app()
    with TestClient(app) as c:
        yield c


def ingest_sample_pdf(client: TestClient, sample_pdf: Path, course_name: str) -> None:
    """Upload a sample PDF and block until ingestion finishes."""
    client.post("/api/courses", json={"name": course_name})
    with sample_pdf.open("rb") as f:
        upload_resp = client.post(
            "/api/documents/upload",
            files={"file": ("sample.pdf", f, "application/pdf")},
            data={"course": course_name},
        )
    upload_resp.raise_for_status()
    job_id = upload_resp.json()["jobId"]

    status = "queued"
    for _ in range(30):
        job_resp = client.get(f"/api/jobs/{job_id}")
        status = job_resp.json().get("status")
        if status in ("done", "failed"):
            break
        time.sleep(1)
    if status != "done":
        raise RuntimeError(f"Ingestion did not finish: {job_resp.json()}")
