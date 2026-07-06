"""API contract tests for /api/documents."""

import time
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


def test_list_documents_empty(client: TestClient):
    resp = client.get("/api/documents")
    assert resp.status_code == 200
    assert resp.json() == []


def test_upload_pdf(client: TestClient, sample_pdf: Path):
    # Create course first because upload requires existing course.
    client.post("/api/courses", json={"name": "DocUpload"})

    with sample_pdf.open("rb") as f:
        resp = client.post(
            "/api/documents/upload",
            files={"file": ("sample.pdf", f, "application/pdf")},
            data={"course": "DocUpload"},
        )
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"]
    assert data["type"] == "pdf"
    assert data["jobId"]


def test_upload_without_course(client: TestClient, sample_pdf: Path):
    with sample_pdf.open("rb") as f:
        resp = client.post(
            "/api/documents/upload",
            files={"file": ("sample.pdf", f, "application/pdf")},
        )
    assert resp.status_code == 201
    assert resp.json()["course"] == ""


def test_upload_unsupported_type(client: TestClient):
    resp = client.post(
        "/api/documents/upload",
        files={"file": ("bad.exe", b"data", "application/octet-stream")},
    )
    assert resp.status_code == 400


def test_delete_document(client: TestClient, sample_pdf: Path):
    client.post("/api/courses", json={"name": "DocDelete"})
    with sample_pdf.open("rb") as f:
        upload_resp = client.post(
            "/api/documents/upload",
            files={"file": ("sample.pdf", f, "application/pdf")},
            data={"course": "DocDelete"},
        )
    doc_id = upload_resp.json()["id"]

    resp = client.delete(f"/api/documents/{doc_id}")
    assert resp.status_code == 204

    list_resp = client.get("/api/documents")
    ids = [d["id"] for d in list_resp.json()]
    assert doc_id not in ids


@pytest.mark.ollama
@pytest.mark.usefixtures("required_embed_skip_if_missing")
def test_search_sources(client: TestClient, sample_pdf: Path):
    client.post("/api/courses", json={"name": "DocSearch"})
    with sample_pdf.open("rb") as f:
        upload_resp = client.post(
            "/api/documents/upload",
            files={"file": ("sample.pdf", f, "application/pdf")},
            data={"course": "DocSearch"},
        )
    job_id = upload_resp.json()["jobId"]

    # Poll for ingestion completion.
    for _ in range(30):
        job_resp = client.get(f"/api/jobs/{job_id}")
        status = job_resp.json().get("status")
        if status in ("done", "failed"):
            break
        time.sleep(1)
    assert status == "done", f"Ingestion failed: {job_resp.json()}"

    resp = client.get("/api/sources/search", params={"q": "slow start", "course": "DocSearch"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] > 0
    assert len(data["sources"]) > 0
