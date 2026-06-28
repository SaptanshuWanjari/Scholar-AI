"""Stateful HITL LangGraph workflow for Teach Me.

Phase 1 (retrieve_and_draft): RAG retrieval + draft revision notes generation.
              Graph interrupts here to let the student review and edit.
Phase 2 (generate_artifacts): Uses student-approved notes as context to generate
              flashcards, quiz, mind map, diagram, and difference table.
"""

from __future__ import annotations

import uuid
from typing import Any, TypedDict

from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import interrupt

from scholarcli.api import parsers
from scholarcli.llm import get_llm
from scholarcli.rag.prompts import (
    DIFFERENCES_SYSTEM,
    FLASHCARDS_SYSTEM,
    MINDMAP_SYSTEM,
    MERMAID_SYSTEM,
    QUIZ_SYSTEM,
    STUDY_NOTES_SYSTEM,
)


class TeachState(TypedDict, total=False):
    topic: str
    depth: str  # quick | standard | deep
    course: str | None
    document_id: int | None
    retrieved: list[dict]
    draft_notes: str
    grounded: bool
    sources: list[dict]
    # Populated after resume:
    approved_notes: str
    artifacts_to_generate: list[str]
    artifacts: dict[str, Any]


# ---------------------------------------------------------------------------
# Node 1: retrieve_and_draft
# ---------------------------------------------------------------------------

def retrieve_and_draft(state: TeachState) -> dict:
    """Retrieve relevant chunks and generate draft revision notes."""
    from scholarcli.api.rag_service import run_ask, serialize_chunks

    topic = state.get("topic", "")
    depth_hint = {
        "quick": "Keep it brief — concise bullet-point notes.",
        "standard": "Provide balanced, exam-ready revision notes.",
        "deep": "Go in depth with thorough explanations and nuance.",
    }.get(state.get("depth", "standard"), "Provide balanced, exam-ready revision notes.")

    query = f"Create concise revision notes for: {topic}. {depth_hint}"
    doc_id = state.get("document_id")
    result = run_ask(
        query,
        state.get("course"),
        str(doc_id) if doc_id else None,
        "study_notes",
    )

    return {
        "draft_notes": result["content"],
        "retrieved": result.get("retrieved", []),
        "grounded": result.get("grounded", False),
        "sources": serialize_chunks(result.get("retrieved", [])),
    }


# ---------------------------------------------------------------------------
# Node 2: generate_artifacts
# ---------------------------------------------------------------------------

_DEPTH_COUNT = {"quick": 6, "standard": 8, "deep": 12}
_DEPTH_DIFFICULTY = {"quick": "Easy", "standard": "Medium", "deep": "Hard"}

_ROUTE_MAP = {
    "notes": "study_notes",
    "flashcards": "flashcards",
    "quiz": "quiz",
    "mindmap": "mindmap",
    "diagram": "mermaid",
    "difference": "differences",
}

_SYSTEM_MAP = {
    "notes": STUDY_NOTES_SYSTEM,
    "flashcards": FLASHCARDS_SYSTEM,
    "quiz": QUIZ_SYSTEM,
    "mindmap": MINDMAP_SYSTEM,
    "diagram": MERMAID_SYSTEM,
    "difference": DIFFERENCES_SYSTEM,
}


def _generate_one(key: str, topic: str, approved_notes: str, depth: str) -> dict:
    """Generate a single artifact from approved notes via direct LLM call."""
    system = _SYSTEM_MAP.get(key, STUDY_NOTES_SYSTEM)
    route = _ROUTE_MAP.get(key, "study_notes")

    count = _DEPTH_COUNT.get(depth, 8)
    difficulty = _DEPTH_DIFFICULTY.get(depth, "Medium")
    extra = ""
    if key == "flashcards":
        extra = f" Generate exactly {count} flashcards."
    elif key == "quiz":
        extra = f" Use {difficulty} difficulty. Generate {count} questions."

    messages = [
        SystemMessage(content=f"{system}\n\nStudent's approved study notes:\n{approved_notes}"),
        HumanMessage(content=f"Generate the above artifact for topic: {topic}.{extra}"),
    ]
    llm = get_llm(route)
    response = llm.invoke(messages)
    raw = response.content if hasattr(response, "content") else str(response)
    content = raw if isinstance(raw, str) else str(raw)

    stable_id = lambda prefix: f"{prefix}-{abs(hash(topic + key)) % 10_000_000}"

    if key == "flashcards":
        cards = parsers.parse_flashcards(content, deck=topic)
        from scholarcli.api.schemas import FlashcardOut, FlashcardSet
        return FlashcardSet(
            deck=topic,
            grounded=True,
            cards=[FlashcardOut(**c) for c in cards],
        ).model_dump()

    if key == "quiz":
        questions = parsers.parse_quiz(content)
        from scholarcli.api.schemas import QuizOut, QuizQuestionOut
        return QuizOut(
            id=stable_id("quiz"),
            title=topic,
            course="",
            difficulty=difficulty,
            grounded=True,
            questions=[QuizQuestionOut(**q) for q in questions],
        ).model_dump()

    if key == "diagram":
        mermaid = parsers.strip_mermaid_fences(content)
        from scholarcli.api.schemas import DiagramOut
        return DiagramOut(
            id=stable_id("dg"),
            title=topic,
            course="",
            kind="flowchart",
            mermaid=mermaid,
            grounded=True,
        ).model_dump()

    if key == "mindmap":
        from scholarcli.api.schemas import MindmapOut
        return MindmapOut(
            id=stable_id("mm"),
            title=topic,
            course="",
            text=content,
            grounded=True,
        ).model_dump()

    if key == "difference":
        from scholarcli.api.schemas import DifferenceOut
        return DifferenceOut(title=topic, content=content, grounded=True).model_dump()

    # key == "notes"
    from scholarcli.api.schemas import RevisionOut
    return RevisionOut(title=topic, markdown=content, grounded=True).model_dump()


def generate_artifacts(state: TeachState) -> dict:
    """Resume after human approval. Generate all requested artifacts."""
    human_input: dict = interrupt("awaiting_student_approval")

    approved_notes: str = human_input.get("approved_notes", state.get("draft_notes", ""))
    keys_to_generate: list[str] = human_input.get("artifacts_to_generate", [])
    topic = state.get("topic", "")
    depth = state.get("depth", "standard")

    artifacts: dict[str, Any] = {}
    for key in keys_to_generate:
        try:
            artifacts[key] = _generate_one(key, topic, approved_notes, depth)
        except Exception as exc:
            artifacts[key] = {"error": str(exc)}

    return {
        "approved_notes": approved_notes,
        "artifacts_to_generate": keys_to_generate,
        "artifacts": artifacts,
    }


# ---------------------------------------------------------------------------
# Graph construction
# ---------------------------------------------------------------------------

_teach_graph = None


def get_teach_graph():
    """Return (and cache) the compiled teach LangGraph with MemorySaver."""
    global _teach_graph
    if _teach_graph is None:
        builder: StateGraph = StateGraph(TeachState)
        builder.add_node("retrieve_and_draft", retrieve_and_draft)
        builder.add_node("generate_artifacts", generate_artifacts)
        builder.add_edge(START, "retrieve_and_draft")
        builder.add_edge("retrieve_and_draft", "generate_artifacts")
        builder.add_edge("generate_artifacts", END)
        _teach_graph = builder.compile(
            checkpointer=MemorySaver(),
            interrupt_before=["generate_artifacts"],
        )
    return _teach_graph


def new_thread_id() -> str:
    return str(uuid.uuid4())
