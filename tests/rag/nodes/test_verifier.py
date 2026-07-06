"""Tests for the CRAG verifier node."""

import pytest

from scholarai.rag.nodes.verifier import verify
from scholarai.rag.state import GraphState
from tests.factories import make_chunk


def test_empty_chunks_ungrounded():
    state: GraphState = {"query": "hello", "retrieved": []}
    result = verify(state)
    assert result["grounded"] is False
    assert result["retrieved"] == []


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_relevant_chunk_kept():
    state: GraphState = {
        "query": "What is TCP slow start?",
        "retrieved": [
            make_chunk(
                "TCP slow start is a congestion control algorithm that begins with a small window.",
                _distance=0.2,
            ),
        ],
    }
    result = verify(state)
    assert result["grounded"] is True
    assert len(result["retrieved"]) >= 1


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_irrelevant_chunk_discarded():
    state: GraphState = {
        "query": "Quantum physics entanglement",
        "retrieved": [
            make_chunk(
                "TCP slow start is a congestion control algorithm that begins with a small window.",
                _distance=0.8,
            ),
        ],
    }
    result = verify(state)
    assert result["grounded"] is False
    assert result["retrieved"] == []
