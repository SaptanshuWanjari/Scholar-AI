"""Retrieval node — embed the user query and search LanceDB."""

from __future__ import annotations

from scholarcli.config import get_settings
import scholarcli.llm
from scholarcli.rag.state import GraphState
from scholarcli.storage.vectors import search


def retrieve(state: GraphState) -> GraphState:
    s = get_settings()
    emb = scholarcli.llm.get_embeddings()
    query = state["query"]
    course = state.get("course")

    # embed_query returns list[float].
    query_vector: list[float] = emb.embed_query(query)
    results = search(query_vector, top_k=s.retrieval.top_k, course=course)
    state["retrieved"] = results
    return state
