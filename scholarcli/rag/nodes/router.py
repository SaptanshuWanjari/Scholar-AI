"""Query router node — classifies the user's query into a task label.

Uses LLM classification when no explicit route is set. Falls back to
quick_qa on errors. All study modes are wired.
"""

from __future__ import annotations

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.llm import get_llm
from scholarcli.rag.prompts import ROUTER_SYSTEM
from scholarcli.rag.state import GraphState

from scholarcli.rag.nodes.generator import _ROUTE_PROMPTS
_WIRED = set(_ROUTE_PROMPTS.keys())


def route_query(state: GraphState) -> GraphState:
    # If route is already set, skip LLM call.
    if state.get("route") and state["route"] in _WIRED:
        return state

    query = state.get("query", "")

    # Classify via LLM.
    try:
        llm = get_llm("quick_qa")
        resp = llm.invoke(
            [SystemMessage(content=ROUTER_SYSTEM), HumanMessage(content=query)]
        )
        task = resp.content.strip().lower().replace(" ", "_")
    except Exception:
        task = "quick_qa"

    # Validate task label.
    if task not in _WIRED:
        task = "quick_qa"

    state["route"] = task
    return state
