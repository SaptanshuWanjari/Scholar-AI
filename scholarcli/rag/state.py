"""LangGraph state — the shared dictionary threaded through every node."""

from __future__ import annotations

from typing import TypedDict


class GraphState(TypedDict, total=False):
    query: str  # user's question
    course: str | None  # restrict retrieval to this course, or None
    route: str  # task label set by router
    retrieved: list[dict]  # chunks from LanceDB (with _distance)
    grounded: bool  # True if at least one chunk passes the verifier gate
    answer: str  # final answer with citations
