"""Tests for the query rewriter node."""

import pytest

from scholarai.rag.nodes.rewriter import rewrite
from scholarai.rag.state import GraphState


@pytest.mark.ollama
@pytest.mark.usefixtures("required_llm_skip_if_missing")
def test_rewrite_makes_query_more_specific():
    state: GraphState = {"query": "Tell me about it", "loop_count": 0}
    result = rewrite(state)
    assert result["search_query"]
    assert result["search_query"] != "Tell me about it"
    assert result["loop_count"] == 1
