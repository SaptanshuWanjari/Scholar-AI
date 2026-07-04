"""Multi-hop RAG tests — decompose + sequential retrieval."""

from unittest.mock import patch

from scholarai.rag import build_rag
from scholarai.storage import get_session, init_db
from scholarai.storage.models import Course


def _ensure_course(name: str) -> None:
    init_db()
    from scholarai.storage.models import get_course
    session = get_session()
    try:
        if not get_course(session, name):
            session.add(Course(name=name))
            session.commit()
    finally:
        session.close()


class _MockLLM:
    def invoke(self, messages):
        class Resp:
            content = '{"sub_queries": ["What is the OSI model?", "What are the 7 layers of OSI?"], "reason": "decomposition"}'
        return Resp()


class _NullMockLLM:
    def invoke(self, messages):
        class Resp:
            content = '{"sub_queries": null, "reason": "simple"}'
        return Resp()


@patch("scholarai.rag.nodes.verifier.get_llm")
@patch("scholarai.rag.nodes.generator.get_llm")
@patch("scholarai.rag.nodes.router.get_llm")
@patch("scholarai.rag.nodes.decomposer.get_llm")
@patch("scholarai.llm.get_embeddings")
@patch("scholarai.ingest.pipeline.get_embeddings")
def test_decompose_produces_sub_queries(mock_pipe_emb, mock_llm_emb, mock_dec_llm, mock_router_llm, mock_gen_llm, mock_ver_llm, sample_pdf):
    """When decompose returns 2 sub-queries, state carries them and traces."""
    from tests.test_retrieval import _MockEmbeddings
    m = _MockEmbeddings()
    mock_pipe_emb.return_value = m
    mock_llm_emb.return_value = m
    mock_router_llm.return_value.invoke.return_value.content = "quick_qa"
    mock_dec_llm.return_value = _MockLLM()
    mock_gen_llm.return_value.invoke.return_value.content = "Final multi-hop answer."
    mock_ver_llm.return_value.invoke.return_value.content = '{"score": 8}'

    _ensure_course("Networks")
    from scholarai.ingest.pipeline import ingest_file
    ingest_file(sample_pdf, "Networks", embeddings=m)

    rag = build_rag()
    result = rag.invoke({"query": "Explain the OSI model layers", "course": "Networks"})
    assert result.get("sub_queries") is not None
    assert len(result["sub_queries"]) == 2
    assert len(result.get("traces", [])) == 2
    assert result["traces"][0]["hop"] == 1
    assert result["traces"][1]["hop"] == 2


@patch("scholarai.rag.nodes.verifier.get_llm")
@patch("scholarai.rag.nodes.generator.get_llm")
@patch("scholarai.rag.nodes.router.get_llm")
@patch("scholarai.rag.nodes.decomposer.get_llm")
@patch("scholarai.llm.get_embeddings")
@patch("scholarai.ingest.pipeline.get_embeddings")
def test_single_hop_when_decompose_returns_null(mock_pipe_emb, mock_llm_emb, mock_dec_llm, mock_router_llm, mock_gen_llm, mock_ver_llm, sample_pdf):
    """When decompose returns null, single-hop retrieval is used."""
    from tests.test_retrieval import _MockEmbeddings
    m = _MockEmbeddings()
    mock_pipe_emb.return_value = m
    mock_llm_emb.return_value = m
    mock_router_llm.return_value.invoke.return_value.content = "quick_qa"
    mock_dec_llm.return_value = _NullMockLLM()
    mock_gen_llm.return_value.invoke.return_value.content = "Simple answer."
    mock_ver_llm.return_value.invoke.return_value.content = '{"score": 8}'

    _ensure_course("Networks")
    from scholarai.ingest.pipeline import ingest_file
    ingest_file(sample_pdf, "Networks", embeddings=m)

    rag = build_rag()
    result = rag.invoke({"query": "What is slow start?", "course": "Networks"})
    assert result.get("sub_queries") is None
    assert result.get("traces") is None


@patch("scholarai.rag.nodes.verifier.get_llm")
@patch("scholarai.rag.nodes.generator.get_llm")
@patch("scholarai.rag.nodes.router.get_llm")
@patch("scholarai.rag.nodes.decomposer.get_llm")
@patch("scholarai.llm.get_embeddings")
@patch("scholarai.ingest.pipeline.get_embeddings")
def test_multihop_disabled_skips_decompose(mock_pipe_emb, mock_llm_emb, mock_dec_llm, mock_router_llm, mock_gen_llm, mock_ver_llm, sample_pdf):
    """When multi_hop.enabled=False, decompose is a no-op."""
    from scholarai.config import get_settings
    s = get_settings()
    s.multi_hop.enabled = False

    from tests.test_retrieval import _MockEmbeddings
    m = _MockEmbeddings()
    mock_pipe_emb.return_value = m
    mock_llm_emb.return_value = m
    mock_router_llm.return_value.invoke.return_value.content = "quick_qa"
    mock_gen_llm.return_value.invoke.return_value.content = "Disabled answer."
    mock_ver_llm.return_value.invoke.return_value.content = '{"score": 8}'

    _ensure_course("Networks")
    from scholarai.ingest.pipeline import ingest_file
    ingest_file(sample_pdf, "Networks", embeddings=m)

    rag = build_rag()
    result = rag.invoke({"query": "Explain the OSI model", "course": "Networks"})
    assert result.get("sub_queries") is None
    assert result.get("answer") is not None


@patch("scholarai.rag.nodes.verifier.get_llm")
@patch("scholarai.rag.nodes.generator.get_llm")
@patch("scholarai.rag.nodes.router.get_llm")
@patch("scholarai.rag.nodes.decomposer.get_llm")
@patch("scholarai.llm.get_embeddings")
@patch("scholarai.ingest.pipeline.get_embeddings")
def test_multihop_accumulates_chunks_from_both_hops(mock_pipe_emb, mock_llm_emb, mock_dec_llm, mock_router_llm, mock_gen_llm, mock_ver_llm, sample_pdf):
    """Both hops' chunks end up in retrieved and all_retrieved."""
    from tests.test_retrieval import _MockEmbeddings
    m = _MockEmbeddings()
    mock_pipe_emb.return_value = m
    mock_llm_emb.return_value = m
    mock_router_llm.return_value.invoke.return_value.content = "quick_qa"
    mock_dec_llm.return_value = _MockLLM()
    mock_gen_llm.return_value.invoke.return_value.content = "Multi-hop final answer."
    mock_ver_llm.return_value.invoke.return_value.content = '{"score": 8}'

    _ensure_course("Networks")
    from scholarai.ingest.pipeline import ingest_file
    ingest_file(sample_pdf, "Networks", embeddings=m)

    rag = build_rag()
    result = rag.invoke({"query": "Explain the OSI model layers", "course": "Networks"})
    assert len(result.get("all_retrieved", [])) > 0
    assert result["all_retrieved"] == result["retrieved"]
