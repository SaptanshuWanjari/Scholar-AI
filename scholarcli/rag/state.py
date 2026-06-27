"""LangGraph state — the shared dictionary threaded through every node."""

from __future__ import annotations

from typing import TypedDict


class GraphState(TypedDict, total=False):
    query: str  # user's question
    search_query: str | None  # query to use for retrieval (if different from query)
    course: str | None  # restrict retrieval to this course, or None
    document_id: int | None  # restrict retrieval to this document, or None
    session_id: str | None
    chat_history: list
    route: str  # task label set by router
    retrieved: list[dict]  # chunks from LanceDB (with _distance)
    grounded: bool  # True if at least one chunk passes the verifier gate
    answer: str  # final answer with citations
    socratic: bool  # guide step-by-step
    loop_count: int  # number of retrieval attempts
