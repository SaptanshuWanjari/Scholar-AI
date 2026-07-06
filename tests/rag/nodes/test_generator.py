"""Tests for the RAG generator node."""

import pytest

from scholarai.rag.nodes.generator import generate
from scholarai.rag.state import GraphState
from tests.factories import make_chunk


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_ungrounded_still_produces_answer():
    state: GraphState = {
        "query": "What is dark matter?",
        "retrieved": [],
        "grounded": False,
        "route": "quick_qa",
    }
    result = generate(state)
    assert result["answer"]
    assert isinstance(result["answer"], str)


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_grounded_produces_non_empty_answer():
    state: GraphState = {
        "query": "What is TCP slow start?",
        "retrieved": [
            make_chunk(
                "TCP slow start begins with a small congestion window and doubles it each RTT.",
                source="networks.pdf",
                _distance=0.2,
            ),
        ],
        "grounded": True,
        "route": "quick_qa",
    }
    result = generate(state)
    assert result["answer"]
    assert isinstance(result["answer"], str)
    assert len(result["answer"]) > 10


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_route_selects_flashcards_prompt():
    state: GraphState = {
        "query": "Make flashcards about TCP",
        "retrieved": [
            make_chunk(
                "TCP guarantees reliable delivery using sequence numbers and acknowledgments.",
                source="networks.pdf",
                _distance=0.2,
            ),
        ],
        "grounded": True,
        "route": "flashcards",
    }
    result = generate(state)
    assert result["answer"]
    # Flashcard output is typically JSON or markdown with Q/A pairs.
    assert "?" in result["answer"] or "flashcard" in result["answer"].lower()


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_socratic_flag_passed_through():
    state: GraphState = {
        "query": "Explain congestion control",
        "retrieved": [
            make_chunk(
                "Congestion control prevents network collapse by adjusting send rates.",
                source="networks.pdf",
                _distance=0.2,
            ),
        ],
        "grounded": True,
        "route": "quick_qa",
        "socratic": True,
    }
    result = generate(state)
    assert result["answer"]
