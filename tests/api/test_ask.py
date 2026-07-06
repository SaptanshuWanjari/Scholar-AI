"""API contract tests for /api/ask and chat sessions."""

import pytest
from fastapi.testclient import TestClient


def test_ask_requires_question(client: TestClient):
    resp = client.post("/api/ask", json={"question": "  "})
    assert resp.status_code == 400


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_ask_returns_answer(client: TestClient):
    resp = client.post(
        "/api/ask",
        json={"question": "What is TCP slow start?"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["role"] == "assistant"
    assert data["content"]
    assert isinstance(data["grounded"], bool)
    assert data["route"]


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_ask_stream(client: TestClient):
    resp = client.post(
        "/api/ask/stream",
        json={"question": "Say 'hello'"},
    )
    assert resp.status_code == 200
    body = resp.text
    assert body.startswith("data:")
    assert "token" in body or "done" in body


def test_chat_session_crud(client: TestClient):
    create_resp = client.post("/api/chat/sessions", json={"title": "Test Session"})
    assert create_resp.status_code == 201
    session_id = create_resp.json()["id"]

    list_resp = client.get("/api/chat/sessions")
    assert list_resp.status_code == 200
    assert any(s["id"] == session_id for s in list_resp.json())

    get_resp = client.get(f"/api/chat/sessions/{session_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == session_id

    delete_resp = client.delete(f"/api/chat/sessions/{session_id}")
    assert delete_resp.status_code == 204

    get_after = client.get(f"/api/chat/sessions/{session_id}")
    assert get_after.status_code == 404


def test_chat_session_not_found(client: TestClient):
    resp = client.get("/api/chat/sessions/nonexistent-id")
    assert resp.status_code == 404
