"""Tests for the reranker node."""

import pytest

from scholarai.rag.nodes.reranker import _parse_scores, rerank
from scholarai.rag.state import GraphState
from tests.factories import make_chunk


def test_parse_scores_extracts_json():
    text = '{"0": 8.5, "1": 3.2, "2": 9.0}'
    scores = _parse_scores(text, 3)
    assert scores == {0: 8.5, 1: 3.2, 2: 9.0}


def test_parse_scores_ignores_out_of_range():
    text = '{"0": 8.5, "5": 3.2}'
    scores = _parse_scores(text, 2)
    assert scores == {0: 8.5}


def test_rerank_disabled_passes_through():
    state: GraphState = {
        "query": "q",
        "retrieved": [
            make_chunk("first", chunk_index=0),
            make_chunk("second", chunk_index=1),
        ],
    }
    result = rerank(state)
    assert len(result["retrieved"]) == 2


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_rerank_reorders_by_relevance(monkeypatch):
    """Force rerank enabled and a small top_k so the LLM relevance pass runs."""
    from scholarai.config import get_settings

    s = get_settings()
    monkeypatch.setattr(s.retrieval, "rerank_enabled", True)
    monkeypatch.setattr(s.retrieval, "top_k", 2)

    state: GraphState = {
        "query": "TCP congestion control",
        "retrieved": [
            make_chunk("The sky is blue today.", chunk_index=0),
            make_chunk(
                "TCP congestion control manages packet flow to prevent collapse.",
                chunk_index=1,
            ),
            make_chunk(
                "Slow start doubles the congestion window each round trip time.",
                chunk_index=2,
            ),
        ],
    }
    result = rerank(state)
    assert len(result["retrieved"]) == 2
    first_text = result["retrieved"][0]["text"].lower()
    assert "tcp" in first_text or "congestion" in first_text or "slow start" in first_text
