"""Tests for the query router node."""

import pytest

from scholarai.rag.nodes.router import route_query
from scholarai.rag.state import GraphState


def test_explicit_valid_route_preserved():
    state: GraphState = {"query": "make flashcards", "route": "flashcards"}
    result = route_query(state)
    assert result["route"] == "flashcards"


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_study_mode_keywords_route_correctly():
    cases = [
        ("Create flashcards about TCP", "flashcards"),
        ("Generate a quiz on OS", "quiz"),
        ("Draw a diagram of a neural network", "mermaid"),
        ("Explain TCP slow start deeply", "deep_analysis"),
    ]
    for query, expected in cases:
        state: GraphState = {"query": query}
        result = route_query(state)
        assert result["route"] == expected, f"{query!r} routed to {result['route']!r}"


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_unknown_llm_output_falls_back():
    state: GraphState = {"query": "something weird"}
    result = route_query(state)
    assert result["route"] in {
        "quick_qa",
        "deep_analysis",
        "flashcards",
        "quiz",
        "mermaid",
        "mindmap",
        "study_notes",
        "differences",
        "learning_path",
        "data_qa",
        "plantuml",
    }
