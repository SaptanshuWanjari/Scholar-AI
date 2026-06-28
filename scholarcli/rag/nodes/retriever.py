"""Retrieval node — embed the user query and search LanceDB."""

from __future__ import annotations

from scholarcli.config import get_settings
import scholarcli.llm
from scholarcli.rag.state import GraphState
from scholarcli.storage.vectors import hybrid_search, search
from scholarcli.storage import get_session
from scholarcli.storage.models import get_cached_embedding, set_cached_embedding


def retrieve(state: GraphState) -> GraphState:
    s = get_settings()
    emb = scholarcli.llm.get_embeddings()
    query = state.get("search_query") or state["query"]
    course = state.get("course")

    session = get_session()
    try:
        query_vector = get_cached_embedding(session, query)
        if query_vector is None:
            query_vector = emb.embed_query(query)
            set_cached_embedding(session, query, query_vector)
    finally:
        session.close()


    if s.retrieval.hybrid_search:
        results = hybrid_search(
            query_text=query,
            query_vector=query_vector,
            top_k=s.retrieval.top_k,
            course=course,
            document_id=state.get("document_id"),
        )
    else:
        results = search(query_vector, top_k=s.retrieval.top_k, course=course, document_id=state.get("document_id"))

    # MVR payload swap: table chunks were embedded using their LLM summary, but
    # the generation LLM should receive the raw Markdown table instead.
    for r in results:
        if r.get("source_type") == "table" and r.get("original_payload"):
            r["text"] = r["original_payload"]

    state["retrieved"] = results
    return state
