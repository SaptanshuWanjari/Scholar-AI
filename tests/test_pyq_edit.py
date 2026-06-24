"""Tests for PATCH and DELETE /api/pyq/questions/{id}."""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from scholarcli.api.app import app
from scholarcli.storage import get_session, init_db
from scholarcli.storage.models import PYQQuestion, QuestionPaper


@pytest.fixture
def client():
    init_db()
    with TestClient(app) as c:
        yield c


@pytest.fixture
def paper_with_question(client):
    """Insert a paper + one question into the test DB, return (paper_id, question_id)."""
    session = get_session()
    try:
        paper = QuestionPaper(
            course="TestCourse",
            title="Test Paper 2024",
            year=2024,
            source_document="test.pdf",
            question_count=1,
        )
        session.add(paper)
        session.flush()

        q = PYQQuestion(
            paper_id=paper.id,
            course="TestCourse",
            year=2024,
            text="Define deadlock.",
            topic="Deadlocks",
            subtopics=["Prevention"],
            difficulty="Easy",
            qtype="definition",
            marks=5,
        )
        session.add(q)
        session.commit()
        return paper.id, q.id
    finally:
        session.close()


def test_patch_question_updates_fields(client, paper_with_question):
    """PATCH with a partial body updates only the provided fields."""
    _, qid = paper_with_question

    resp = client.patch(
        f"/api/pyq/questions/{qid}",
        json={"topic": "OS Concepts", "difficulty": "Medium"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["topic"] == "OS Concepts"
    assert data["difficulty"] == "Medium"
    assert data["text"] == "Define deadlock."  # untouched


def test_patch_question_returns_404_for_missing(client):
    """PATCH on a non-existent question returns 404."""
    resp = client.patch("/api/pyq/questions/99999", json={"topic": "X"})
    assert resp.status_code == 404


def test_patch_question_clears_marks(client, paper_with_question):
    """PATCH can set marks to null to clear the value."""
    _, qid = paper_with_question

    resp = client.patch(f"/api/pyq/questions/{qid}", json={"marks": None})
    assert resp.status_code == 200
    assert resp.json()["marks"] is None


def test_delete_question_removes_row_and_decrements_count(client, paper_with_question):
    """DELETE removes the question and decrements the paper's question_count."""
    paper_id, qid = paper_with_question

    resp = client.delete(f"/api/pyq/questions/{qid}")
    assert resp.status_code == 204

    # Question is gone.
    session = get_session()
    try:
        assert session.get(PYQQuestion, qid) is None
        paper = session.get(QuestionPaper, paper_id)
        assert paper.question_count == 0
    finally:
        session.close()


def test_delete_question_returns_404_for_missing(client):
    """DELETE on a non-existent question returns 404."""
    resp = client.delete("/api/pyq/questions/99999")
    assert resp.status_code == 404
