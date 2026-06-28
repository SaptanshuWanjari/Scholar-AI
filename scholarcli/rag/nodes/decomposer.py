"""Decomposer node — decides if multi-hop helps, produces sub-queries."""

from __future__ import annotations

import json
import logging

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.config import get_settings
from scholarcli.llm import get_llm
from scholarcli.rag.prompts import DECOMPOSER_SYSTEM
from scholarcli.rag.state import GraphState

logger = logging.getLogger(__name__)


def decompose(state: GraphState) -> GraphState:
    s = get_settings()
    if not s.multi_hop.enabled:
        return state

    query = state.get("query", "")
    llm = get_llm("quick_qa")
    try:
        resp = llm.invoke([
            SystemMessage(content=DECOMPOSER_SYSTEM),
            HumanMessage(content=query),
        ])
        parsed = json.loads(resp.content.strip())
        sub = parsed.get("sub_queries")
        if sub and len(sub) > 1:
            state["sub_queries"] = sub[:s.multi_hop.max_hops]
            logger.info("Decomposed query into: %s", sub)
    except Exception:
        pass

    return state
