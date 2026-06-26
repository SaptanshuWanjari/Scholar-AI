"""Generator node — produce a grounded answer with citations.

Route-aware: picks the correct system prompt based on state["route"].
"""

from __future__ import annotations

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.llm import get_llm
from scholarcli.api.prompt_service import active_body
from scholarcli.rag.prompts import (
    DIFFERENCES_SYSTEM,
    FLASHCARDS_SYSTEM,
    GENERATOR_SYSTEM,
    LEARNING_PATH_SYSTEM,
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
    "differences": DIFFERENCES_SYSTEM,
    "learning_path": LEARNING_PATH_SYSTEM,
}


def generate(state: GraphState) -> GraphState:
    if not state.get("grounded"):
        state["answer"] = NOT_GROUNDED
        return state

    route = state.get("route", "quick_qa")
    llm = get_llm(route)
    chunks = state["retrieved"]

    from scholarcli.api.rag_service import _build_generation_prompt
    system_prompt, user_prompt = _build_generation_prompt(state, socratic=state.get("socratic", False))

    response = llm.invoke(
        [SystemMessage(content=system_prompt), HumanMessage(content=user_prompt)]
    )
    # response is an AIMessage; .content is str.
    answer: str = response.content if hasattr(response, "content") else str(response)
    state["answer"] = answer.strip()
    return state
