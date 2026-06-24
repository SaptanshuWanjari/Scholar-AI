"""Retrieval node — embed the user query and search LanceDB."""

from __future__ import annotations

from scholarcli.config import get_settings
import scholarcli.llm
from scholarcli.rag.state import GraphState
from scholarcli.storage.vectors import hybrid_search, search


def retrieve(state: GraphState) -> GraphState:
    s = get_settings()
    emb = scholarcli.llm.get_embeddings()
    query = state.get("search_query") or state["query"]
    course = state.get("course")

    query_vector: list[float] = emb.embed_query(query)

    if s.retrieval.hybrid_search:
        results = hybrid_search(
            query_text=query,
            query_vector=query_vector,
            top_k=s.retrieval.top_k,
            course=course,
            document=state.get("document"),
        )
    else:
        results = search(query_vector, top_k=s.retrieval.top_k, course=course, document=state.get("document"))

    state["retrieved"] = results
    return state
