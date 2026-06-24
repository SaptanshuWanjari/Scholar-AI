"""Tests for auto-save: model columns, notebook draft, quiz session endpoints."""

from sqlalchemy import inspect

from scholarcli.storage import get_engine, init_db


def test_init_db_adds_auto_save_columns():
    init_db()
    inspector = inspect(get_engine())
    nb_cols = {c["name"] for c in inspector.get_columns("notebooks")}
    assert "is_draft" in nb_cols
    quiz_cols = {c["name"] for c in inspector.get_columns("quizzes")}
    assert "session_answers" in quiz_cols
    assert "session_current_question" in quiz_cols
    assert "session_started_at" in quiz_cols


def test_notebook_is_draft_round_trip():
    from fastapi.testclient import TestClient
    from scholarcli.api.app import create_app
    init_db()
    client = TestClient(create_app())
    r = client.post("/api/notebooks", json={"title": "Draft NB"})
    assert r.status_code == 201
    nb_id = r.json()["id"]
    assert r.json()["is_draft"] is False

    r = client.put(f"/api/notebooks/{nb_id}", json={"is_draft": True, "blocks": []})
    assert r.status_code == 200
    assert r.json()["is_draft"] is True

    r = client.put(f"/api/notebooks/{nb_id}", json={"is_draft": False})
    assert r.status_code == 200
    assert r.json()["is_draft"] is False


def test_quiz_session_patch_and_clear():
    from fastapi.testclient import TestClient
    from scholarcli.api.app import create_app
    init_db()
    client = TestClient(create_app())

    r = client.post("/api/quizzes", json={"title": "Bio Quiz", "questions": [], "difficulty": "Medium"})
    assert r.status_code == 201
    qid = r.json()["id"]
    assert r.json()["session_answers"] is None

    r = client.patch(
        f"/api/quizzes/{qid}/session",
        json={"session_answers": {"q1": "A"}, "session_current_question": 1},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["session_answers"] == {"q1": "A"}
    assert body["session_current_question"] == 1
    assert body["session_started_at"] is not None

    # Second PATCH must not overwrite session_started_at
    first_ts = body["session_started_at"]
    r = client.patch(
        f"/api/quizzes/{qid}/session",
        json={"session_answers": {"q1": "A", "q2": "B"}, "session_current_question": 2},
    )
    assert r.json()["session_started_at"] == first_ts

    r = client.delete(f"/api/quizzes/{qid}/session")
    assert r.status_code == 204

    quizzes = client.get("/api/quizzes").json()
    quiz = next(q for q in quizzes if q["id"] == qid)
    assert quiz["session_answers"] is None
    assert quiz["session_current_question"] is None
    assert quiz["session_started_at"] is None
