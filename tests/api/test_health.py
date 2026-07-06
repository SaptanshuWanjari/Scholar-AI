"""Tests for /api/health."""

from fastapi.testclient import TestClient


def test_health_reports_ollama_reachability(client: TestClient):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data["ollama_reachable"], bool)
    assert data["embed_model"]
    assert isinstance(data["embed_available"], bool)
