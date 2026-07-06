"""Tests for the query decomposer node."""

import pytest

from scholarai.rag.nodes.decomposer import decompose
from scholarai.rag.state import GraphState


def test_decompose_disabled_leaves_state_unchanged(monkeypatch):
    from scholarai.config import get_settings

    s = get_settings()
    monkeypatch.setattr(s.multi_hop, "enabled", False)

    state: GraphState = {"query": "What is A and how does it relate to B?"}
    result = decompose(state)
    assert "sub_queries" not in result


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_decompose_multi_hop_query():
    state: GraphState = {
        "query": (
            "Compare how TCP slow start and additive increase multiplicative "
            "decrease both control congestion in computer networks."
        ),
    }
    result = decompose(state)
    assert "sub_queries" in result
    assert len(result["sub_queries"]) >= 2
