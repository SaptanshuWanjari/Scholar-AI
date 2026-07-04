"""Rerank node — an LLM relevance pass over retrieved chunks.

A lightweight, Ollama-only alternative to a torch cross-encoder: the LLM scores
each candidate chunk 0-10 for relevance to the query in a single batched call,
and we reorder + truncate to ``top_k``. Best-effort: any failure leaves the
original retrieval order untouched.
"""

from __future__ import annotations

import json
import re

from langchain_core.messages import HumanMessage, SystemMessage

from scholarai.config import get_settings
from scholarai.llm import get_llm
from scholarai.rag.prompts import RERANKER_SYSTEM
from scholarai.rag.state import GraphState

# Keep each chunk preview short so the rerank prompt stays cheap.
_PREVIEW_CHARS = 500


def _parse_scores(text: str, n: int) -> dict[int, float]:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return {}
    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError:
        return {}
    scores: dict[int, float] = {}
    if isinstance(data, dict):
        for k, v in data.items():
            try:
                idx = int(str(k).strip())
                if 0 <= idx < n:
                    scores[idx] = float(v)
            except (TypeError, ValueError):
                continue
    return scores


def rerank(state: GraphState) -> GraphState:
    s = get_settings()
    retrieved = state.get("retrieved") or []
    top_k = s.retrieval.top_k
    if not s.retrieval.rerank_enabled or len(retrieved) <= 1:
        state["retrieved"] = retrieved[:top_k]
        return state

    query = state.get("search_query") or state["query"]
    listing = "\n\n".join(
        f"[{i}] {(ch.get('text') or '').strip()[:_PREVIEW_CHARS]}"
        for i, ch in enumerate(retrieved)
    )
    human = f"Question: {query}\n\nChunks:\n{listing}"
    try:
        llm = get_llm("quick_qa")
        resp = llm.invoke(
            [SystemMessage(content=RERANKER_SYSTEM), HumanMessage(content=human)]
        )
        scores = _parse_scores(getattr(resp, "content", str(resp)), len(retrieved))
    except Exception:  # noqa: BLE001 — never let rerank break retrieval
        scores = {}

    if not scores:
        state["retrieved"] = retrieved[:top_k]
        return state

    # Stable sort by score desc; chunks without a score keep their relative order
    # at the back (default score -1).
    order = sorted(
        range(len(retrieved)),
        key=lambda i: scores.get(i, -1.0),
        reverse=True,
    )
    state["retrieved"] = [retrieved[i] for i in order[:top_k]]
    return state
