"""Verification node — check if retrieved context is actually relevant.

MVP: threshold-based gate (best cosine distance from LanceDB).
Future: add an LLM relevance check for higher precision.
"""

from __future__ import annotations

from scholarcli.config import get_settings
from scholarcli.rag.state import GraphState


def verify(state: GraphState) -> GraphState:
    s = get_settings()
    max_dist = s.retrieval.max_distance
    chunks = state.get("retrieved", [])

    # LanceDB returns _distance (cosine, 0 = identical). Lower = more similar.
    # If the closest chunk is too far, nothing is relevant.
    if not chunks:
        state["grounded"] = False
        return state

    best = min(ch.get("_distance", 1.0) for ch in chunks)
    state["grounded"] = best <= max_dist
    return state
