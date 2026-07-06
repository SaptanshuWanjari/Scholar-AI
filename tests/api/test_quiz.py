"""API contract tests for quiz generation."""

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from scholarai.api.parsers import parse_quiz
from tests.api.conftest import ingest_sample_pdf


def test_parse_quiz_extracts_json_array():
    text = """Here is the quiz:
[
  {"prompt": "What is 2+2?", "options": ["3", "4", "5"], "answer": "B", "type": "mcq"},
  {"prompt": "Is water wet?", "options": ["Yes", "No"], "answer": "A", "type": "truefalse"}
]
"""
    questions = parse_quiz(text)
    assert len(questions) == 2
    assert questions[0]["prompt"] == "What is 2+2?"
    assert questions[0]["options"] == ["3", "4", "5"]
    assert questions[0]["answer"] == "B"


def test_parse_quiz_extracts_plain_text():
    text = """Q1: What is TCP?
A) A protocol
B) A programming language
C) A database
Answer: A
"""
    questions = parse_quiz(text)
    assert len(questions) == 1
    assert questions[0]["prompt"] == "What is TCP?"
    assert questions[0]["answer"] == "A protocol"


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_generate_quiz(client: TestClient, sample_pdf: Path):
    ingest_sample_pdf(client, sample_pdf, "QuizCourse")

    resp = client.post(
        "/api/quizzes/generate",
        json={"topic": "TCP congestion control", "difficulty": "Medium", "course": "QuizCourse"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "TCP congestion control"
    assert data["difficulty"] == "Medium"
    assert isinstance(data["grounded"], bool)
    assert isinstance(data["questions"], list)


def test_generate_quiz_requires_topic(client: TestClient):
    resp = client.post("/api/quizzes/generate", json={"topic": "  "})
    assert resp.status_code == 400
