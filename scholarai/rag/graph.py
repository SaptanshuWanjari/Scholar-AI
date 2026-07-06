"""LangGraph wiring — assembles the router → retrieve → verify → generate pipeline
with conditional edges so future study modes slot in cleanly.
"""

from __future__ import annotations

from langgraph.graph import END, StateGraph

from scholarai.rag.nodes.decomposer import decompose
from scholarai.rag.nodes.generator import generate
from scholarai.rag.nodes.reranker import rerank
from scholarai.rag.nodes.retriever import retrieve
from scholarai.rag.nodes.router import route_query
from scholarai.rag.nodes.verifier import verify
from scholarai.rag.nodes.rewriter import rewrite
from scholarai.rag.state import GraphState

# Routes that produce creative/generative output without needing document retrieval.
_SKIP_RETRIEVAL_ROUTES = {"mermaid", "mindmap", "plantuml"}


def _should_retrieve(state: GraphState) -> str:
    route = state.get("route", "")
    if route in _SKIP_RETRIEVAL_ROUTES:
        return "generate"
    return "retrieve"


def _should_generate(state: GraphState) -> str:
    """After verification: decide whether to rewrite query or generate."""
    if state.get("grounded"):
        return "generate"
    if state.get("loop_count", 0) < 3:
        return "rewrite"
    return "generate"


def build_graph() -> StateGraph:
    """Build and return (not compile) the LangGraph state graph.

    The caller compiles it to get a runnable.
    """
    builder = StateGraph(GraphState)

    builder.add_node("router", route_query)
    builder.add_node("decompose", decompose)
    builder.add_node("retrieve", retrieve)
    builder.add_node("rerank", rerank)
    builder.add_node("verify", verify)
    builder.add_node("rewrite", rewrite)
    builder.add_node("generate", generate)

    builder.set_entry_point("router")

    # Router → decompose → retrieve (or direct to generate).
    builder.add_conditional_edges(
        "router",
        _should_retrieve,
        {"retrieve": "decompose", "generate": "generate"},
    )

    builder.add_edge("decompose", "retrieve")
    builder.add_edge("retrieve", "rerank")
    builder.add_edge("rerank", "verify")
    
    # Verification CRAG loop
    builder.add_conditional_edges(
        "verify",
        _should_generate,
        {"generate": "generate", "rewrite": "rewrite"},
    )
    builder.add_edge("rewrite", "retrieve")
    
    builder.add_edge("generate", END)

    return builder


_compiled_app = None

def get_rag_app():
    """Return a compiled LangGraph runnable (cached per process)."""
    global _compiled_app
    if _compiled_app is None:
        _compiled_app = build_graph().compile()
    return _compiled_app
