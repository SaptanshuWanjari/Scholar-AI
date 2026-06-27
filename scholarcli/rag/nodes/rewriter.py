"""Rewriter node — generates a better search query if retrieval fails."""

from __future__ import annotations

from scholarcli.llm import get_llm
from scholarcli.rag.prompts import CRAG_REWRITER_SYSTEM
from scholarcli.rag.state import GraphState


def rewrite(state: GraphState) -> GraphState:
    query = state.get("query", "")
    
    # We want a slightly higher temperature for creative rewriting
    llm = get_llm("quick_qa", temperature=0.7)
    messages = [
        {"role": "system", "content": CRAG_REWRITER_SYSTEM},
        {"role": "user", "content": f"Original query: {query}"},
    ]
    
    response = llm.invoke(messages)
    rewritten_query = response.content.strip()
    
    state["search_query"] = rewritten_query
    state["loop_count"] = state.get("loop_count", 0) + 1
    
    return state
