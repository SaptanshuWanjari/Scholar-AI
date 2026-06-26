"""Service layer bridging the HTTP API and the existing RAG pipeline.

Reuses the LangGraph app (``get_rag_app``) for one-shot answers and the
individual nodes (``retrieve``/``verify``) plus a direct LLM stream for
token-by-token streaming. Also keeps the most recent retrieval trace in
memory so the frontend's Trace panel can inspect it.
"""

from __future__ import annotations

from typing import Any, Iterator

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.config import get_settings
from scholarcli.llm import get_llm
from scholarcli.rag.graph import get_rag_app
from scholarcli.rag.nodes.generator import _ROUTE_PROMPTS
from scholarcli.api.prompt_service import active_body
from scholarcli.rag.nodes.reranker import rerank
from scholarcli.rag.nodes.retriever import retrieve
from scholarcli.rag.nodes.router import route_query
from scholarcli.rag.nodes.verifier import verify
from scholarcli.rag.prompts import GENERATOR_SYSTEM, NOT_GROUNDED, QA_PROMPT_TEMPLATE
from scholarcli.rag.state import GraphState

# A small, stable palette so each course gets a consistent accent colour.
_PALETTE = ["#4f4d7a", "#3f6b6f", "#3f7a4e", "#a3771f", "#6b3f6f", "#3f5a7a"]

# Most recent retrieval, surfaced by GET /api/trace/last.
_last_trace: dict[str, Any] = {}


def course_code(name: str) -> str:
    """Derive a short course code (e.g. 'Machine Learning' -> 'ML')."""
    words = [w for w in name.split() if w]
    if not words:
        return "??"
    if len(words) == 1:
        return words[0][:2].upper()
    return "".join(w[0] for w in words[:3]).upper()


def course_color(course_id: int) -> str:
    return _PALETTE[course_id % len(_PALETTE)]


def _similarity(distance: float | None) -> float:
    """Map LanceDB cosine distance (lower = closer) to a 0..1 similarity."""
    if distance is None:
        return 0.0
    return round(max(0.0, min(1.0, 1.0 - distance)), 4)


def serialize_chunks(retrieved: list[dict]) -> list[dict]:
    """Turn raw LanceDB rows into Source dicts for the frontend."""
    sources: list[dict] = []
    for ch in retrieved:
        text = ch.get("text", "")
        snippet = text.strip().replace("\n", " ")
        if len(snippet) > 320:
            snippet = snippet[:317] + "…"
        sources.append(
            {
                "id": str(ch.get("id", "")),
                "title": ch.get("title", "Untitled"),
                "page": int(ch.get("page") or 0),
                "course": ch.get("course", ""),
                "snippet": snippet,
                "similarity": _similarity(ch.get("_distance")),
                "sourceType": ch.get("source_type", "text") or "text",
                "imageUrl": ch.get("image_url", "") or "",
            }
        )
    return sources


def _confidence(retrieved: list[dict], grounded: bool) -> float | None:
    if not retrieved or not grounded:
        return None
    return max(_similarity(ch.get("_distance")) for ch in retrieved)


def _record_trace(query: str, route: str | None, retrieved: list[dict], grounded: bool) -> None:
    s = get_settings()
    sims = [_similarity(ch.get("_distance")) for ch in retrieved]
    chunks = [
        {
            "id": str(ch.get("id", ""))[:12] or f"chk_{i}",
            "source": ch.get("title", "Untitled"),
            "page": int(ch.get("page") or 0),
            "similarity": _similarity(ch.get("_distance")),
            "tokens": max(1, len(ch.get("text", "")) // 4),
            "text": ch.get("text", ""),
        }
        for i, ch in enumerate(retrieved)
    ]
    _last_trace.clear()
    _last_trace.update(
        {
            "query": query,
            "route": route,
            "grounded": grounded,
            "embeddingModel": s.models.embedding,
            "vectorStore": "LanceDB",
            "topK": s.retrieval.top_k,
            "documents": len({ch.get("document_id") for ch in retrieved}),
            "retrievedChunks": len(retrieved),
            "avgSimilarity": round(sum(sims) / len(sims), 4) if sims else 0.0,
            "chunks": chunks,
        }
    )


def get_last_trace() -> dict[str, Any]:
    return dict(_last_trace)


_STRICT_NOT_FOUND = (
    "I couldn't find sufficient information in your ingested documents to answer this question. "
    "Try switching to AI Fallback mode if you want the model to use its own knowledge."
)

_SOCRATIC_PREFIX = (
    "You are a Socratic tutor. Do NOT give the direct answer. "
    "Instead, guide the student step-by-step using probing questions and short hints. "
    "Only reveal the answer if the user explicitly says they are stuck or asks you to. "
    "Acknowledge what the student says before asking the next guiding question.\n\n"
)


def run_ask(
    question: str,
    course: str | None = None,
    document: str | None = None,
    route: str | None = None,
    search_query: str | None = None,
    rag_mode: str = "fallback",
    socratic: bool = False,
) -> dict:
    """One-shot RAG answer. Returns answer, sources, confidence, grounded, route."""
    doc_id = int(document) if document and document.isdigit() else None
    state: GraphState = {"query": question, "course": course, "document_id": doc_id}
    if search_query:
        state["search_query"] = search_query
    if route:
        state["route"] = route
    result = get_rag_app().invoke(state)

    retrieved = result.get("retrieved", []) or []
    grounded = bool(result.get("grounded", False))
    used_route = result.get("route", route)
    _record_trace(question, used_route, retrieved, grounded)
    confidence = _confidence(retrieved, grounded)
    from scholarcli.api import trace_service
    trace_service.log_weak_generation(question, retrieved, grounded, confidence)

    # Strict mode: refuse to answer if not grounded in documents.
    if rag_mode == "strict" and not grounded:
        return {
            "content": _STRICT_NOT_FOUND,
            "sources": [],
            "retrieved": [],
            "confidence": None,
            "grounded": False,
            "route": used_route,
        }

    return {
        "content": result.get("answer", "(no answer)"),
        "sources": serialize_chunks(retrieved),
        "retrieved": retrieved,  # raw chunks (text/_distance/document_id) for quality scoring
        "confidence": _confidence(retrieved, grounded),
        "grounded": grounded,
        "route": used_route,
    }


def _build_generation_prompt(state: GraphState, socratic: bool = False) -> tuple[str, str]:
    """Mirror generator.generate's prompt assembly. Returns (system, user)."""
    route = state.get("route", "quick_qa")
    chunks = state["retrieved"]

    context_parts: list[str] = []
    citations: list[str] = []
    seen: set[str] = set()
    for ch in chunks:
        st = ch.get("source_type", "text")
        kind = "" if st in ("text", None) else f", {st}"
        context_parts.append(f"[Source: {ch['title']}, p.{ch['page']}{kind}]\n{ch['text']}")
        cite = f"[{ch['title']}, p.{ch['page']}]"
        if cite not in seen:
            seen.add(cite)
            citations.append(cite)

    context = "\n\n---\n\n".join(context_parts)
    user = QA_PROMPT_TEMPLATE.format(context=context, query=state["query"])
    user = f"Available sources: {', '.join(citations)}\n\n{user}"
    system = active_body(route) or _ROUTE_PROMPTS.get(route, GENERATOR_SYSTEM)
    if socratic:
        system = _SOCRATIC_PREFIX + system
    return system, user


def stream_ask(
    question: str,
    course: str | None = None,
    document: str | None = None,
    route: str | None = None,
    search_query: str | None = None,
    rag_mode: str = "fallback",
    socratic: bool = False,
) -> Iterator[dict]:
    """Yield streaming events for the Ask endpoint.

    Event dicts:
      {"type": "token", "value": str}
      {"type": "done", "sources": [...], "confidence": float|None, "grounded": bool, "route": str}
    """
    doc_id = int(document) if document and document.isdigit() else None
    state: GraphState = {"query": question, "course": course, "document_id": doc_id}
    if search_query:
        state["search_query"] = search_query
    if route:
        state["route"] = route

    # Router (LLM classify unless route forced) → retrieve → rerank → verify.
    state = route_query(state)
    state = retrieve(state)
    state = rerank(state)
    state = verify(state)

    retrieved = state.get("retrieved", []) or []
    grounded = bool(state.get("grounded", False))
    used_route = state.get("route", route)
    _record_trace(question, used_route, retrieved, grounded)

    sources = serialize_chunks(retrieved)
    confidence = _confidence(retrieved, grounded)
    from scholarcli.api import trace_service
    trace_service.log_weak_generation(question, retrieved, grounded, confidence)

    if not grounded:
        # Strict mode: refuse to answer from AI knowledge.
        not_found_msg = _STRICT_NOT_FOUND if rag_mode == "strict" else NOT_GROUNDED
        yield {"type": "token", "value": not_found_msg}
        yield {
            "type": "done",
            "sources": [],
            "retrieved": retrieved,
            "confidence": None,
            "grounded": False,
            "route": used_route,
        }
        return

    system, user = _build_generation_prompt(state, socratic=socratic)
    llm = get_llm(used_route or "quick_qa")
    for chunk in llm.stream(
        [SystemMessage(content=system), HumanMessage(content=user)]
    ):
        piece = getattr(chunk, "content", "") or ""
        if piece:
            yield {"type": "token", "value": piece}

    yield {
        "type": "done",
        "sources": sources,
        "retrieved": retrieved,
        "confidence": confidence,
        "grounded": True,
        "route": used_route,
    }
