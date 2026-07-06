"""API contract tests for flashcard generation."""

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from tests.api.conftest import ingest_sample_pdf


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_generate_flashcards(client: TestClient, sample_pdf: Path):
    ingest_sample_pdf(client, sample_pdf, "FlashcardCourse")

    resp = client.post(
        "/api/flashcards/generate",
        json={"topic": "TCP congestion control", "count": 3, "course": "FlashcardCourse"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["deck"] == "TCP congestion control"
    assert isinstance(data["grounded"], bool)
    assert len(data["cards"]) > 0
    for card in data["cards"]:
        assert card["front"]
        assert card["back"]


def test_generate_flashcards_requires_topic(client: TestClient):
    resp = client.post("/api/flashcards/generate", json={"topic": "  "})
    assert resp.status_code == 400
