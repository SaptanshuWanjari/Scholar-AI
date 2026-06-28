"""Retrieval node — embed the user query and search LanceDB.

Supports multi-hop: if ``state.sub_queries`` is set, runs sequential
retrievals for each sub-query and accumulates all chunks.
"""

from __future__ import annotations

import logging

from scholarcli.config import get_settings
import scholarcli.llm
from scholarcli.rag.state import GraphState
from scholarcli.storage.vectors import hybrid_search, search
from scholarcli.storage import get_session
from scholarcli.storage.models import get_cached_embedding, set_cached_embedding

logger = logging.getLogger(__name__)


def _swap_table_payload(results: list[dict]) -> None:
    """MVR payload swap: table chunks were embedded using their LLM summary,
    but the generation LLM should receive the raw Markdown table instead."""
    for r in results:
        if r.get("source_type") == "table" and r.get("original_payload"):
            r["text"] = r["original_payload"]


def _execute_retrieval(query: str, state: GraphState, emb, s) -> list[dict]:
    """Run a single retrieval for *query* and return chunk dicts."""
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

    _swap_table_payload(results)
    return results


def retrieve(state: GraphState) -> GraphState:
    s = get_settings()
    emb = scholarcli.llm.get_embeddings()

    if state.get("highlights_only"):
        doc_id = state.get("document_id")
        if doc_id:
            from scholarcli.storage.models import ReadingState
            session = get_session()
            try:
                rstate = session.query(ReadingState).filter(ReadingState.document_id == doc_id).first()
                retrieved = []
                if rstate and rstate.highlights:
                    for idx, h in enumerate(rstate.highlights):
                        retrieved.append({
                            "id": f"hl_{h.get('id', idx)}",
                            "title": f"Highlight on Page {h.get('page_number', '?')}",
                            "page": h.get("page_number", 0),
                            "course": state.get("course") or "",
                            "source_type": "text",
                            "text": h.get("text", ""),
                            "_distance": 0.0,
                            "document_id": doc_id
                        })
                state["retrieved"] = retrieved
                return state
            finally:
                session.close()

    sub_queries = state.get("sub_queries")
    if sub_queries:
        all_chunks: list[dict] = []
        hop_traces: list[dict] = []
        for i, sub_q in enumerate(sub_queries):
            chunks = _execute_retrieval(sub_q, state, emb, s)
            all_chunks.extend(chunks)
            hop_traces.append({
                "hop": i + 1,
                "sub_query": sub_q,
                "chunk_count": len(chunks),
            })
            logger.info("Hop %d: '%s' → %d chunks", i + 1, sub_q, len(chunks))
        state["all_retrieved"] = all_chunks
        state["retrieved"] = all_chunks
        state["traces"] = hop_traces
    else:
        query = state.get("search_query") or state["query"]
        results = _execute_retrieval(query, state, emb, s)
        state["retrieved"] = results

    return state
