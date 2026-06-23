"""Generator node — produce a grounded answer with citations.

Route-aware: picks the correct system prompt based on state["route"].
"""

from __future__ import annotations

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.llm import get_llm
from scholarcli.api.prompt_service import active_body
from scholarcli.rag.prompts import (
    FLASHCARDS_SYSTEM,
    GENERATOR_SYSTEM,
    MERMAID_SYSTEM,
    MINDMAP_SYSTEM,
    NOT_GROUNDED,
    QA_PROMPT_TEMPLATE,
    QUIZ_SYSTEM,
    STUDY_NOTES_SYSTEM,
)
from scholarcli.rag.state import GraphState

# Map route → system prompt. Anything not listed falls back to GENERATOR_SYSTEM.
_ROUTE_PROMPTS: dict[str, str] = {
    "quick_qa": GENERATOR_SYSTEM,
    "deep_analysis": GENERATOR_SYSTEM,
    "flashcards": FLASHCARDS_SYSTEM,
    "quiz": QUIZ_SYSTEM,
    "mermaid": MERMAID_SYSTEM,
    "mindmap": MINDMAP_SYSTEM,
    "study_notes": STUDY_NOTES_SYSTEM,
}


def generate(state: GraphState) -> GraphState:
    if not state.get("grounded"):
        state["answer"] = NOT_GROUNDED
        return state

    route = state.get("route", "quick_qa")
    llm = get_llm(route)
    chunks = state["retrieved"]

    # Build context block with source tags.
    context_parts: list[str] = []
    citations: list[str] = []
    seen = set()
    for ch in chunks:
        ctx = f"[Source: {ch['title']}, p.{ch['page']}]\n{ch['text']}"
        context_parts.append(ctx)
        cite = f"[{ch['title']}, p.{ch['page']}]"
        if cite not in seen:
            seen.add(cite)
            citations.append(cite)

    context = "\n\n---\n\n".join(context_parts)
    prompt = QA_PROMPT_TEMPLATE.format(context=context, query=state["query"])
    # Prepend citation list so the model knows what sources to reference.
    prompt = f"Available sources: {', '.join(citations)}\n\n{prompt}"

    # ponytail: user's active_body overrides hard-coded default
    system_prompt = active_body(route) or _ROUTE_PROMPTS.get(route, GENERATOR_SYSTEM)

    response = llm.invoke(
        [SystemMessage(content=system_prompt), HumanMessage(content=prompt)]
    )
    # response is an AIMessage; .content is str.
    answer: str = response.content if hasattr(response, "content") else str(response)
    state["answer"] = answer.strip()
    return state
