"""Retrieval tests — verify LanceDB search returns expected chunks.

Uses mock embeddings API so no Ollama server required.
"""

from unittest.mock import patch

from scholarai.ingest.pipeline import ingest_file
from scholarai.rag import build_rag
from scholarai.storage import get_session, init_db
from scholarai.storage.models import Course
from scholarai.storage.vectors import search


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


class _MockEmbeddings:
    """Deterministic mock: returns different pseudo-vectors per text."""

    _dim = 384

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return [self._pseudo_vec(t) for t in texts]

    def embed_query(self, text: str) -> list[float]:
        return self._pseudo_vec(text)

    def _pseudo_vec(self, text: str) -> list[float]:
        """Hash-based pseudo vector so same text → same vector."""
        if "Quantum" in text:
            # Orthogonal vector for off-topic queries to ensure distance > threshold
            return [0.0] * (self._dim - 1) + [1.0]
        import hashlib
        h = hashlib.sha256(text.encode()).digest()
        # Repeat hash bytes into list of floats.
        vals = [(b / 255.0) for b in h * ((self._dim // len(h)) + 1)]
        return vals[:self._dim]


@patch("scholarai.llm.get_embeddings")
@patch("scholarai.ingest.pipeline.get_embeddings")
def test_search_returns_chunks(mock_pipe_emb, mock_llm_emb, sample_pdf):
    """After ingestion, search for a known term returns the matching chunk."""
    m = _MockEmbeddings()
    mock_pipe_emb.return_value = m
    mock_llm_emb.return_value = m

    _ensure_course("Networks")
    ingest_file(sample_pdf, "Networks", embeddings=m)

    # Search for 'slow start'.
    qvec = m.embed_query("What is slow start?")
    results = search(qvec, top_k=3, course="Networks")
    assert len(results) > 0
    # At least one result should contain 'Slow Start'.
    texts = [r["text"] for r in results]
    assert any("Slow Start" in t for t in texts)


@patch("scholarai.rag.nodes.generator.get_llm")
@patch("scholarai.rag.nodes.router.get_llm")
@patch("scholarai.llm.get_embeddings")
@patch("scholarai.ingest.pipeline.get_embeddings")
def test_grounding_off_topic(mock_pipe_emb, mock_llm_emb, mock_router_llm, mock_gen_llm, sample_pdf):
    """A query unrelated to any chunk returns grounded=False."""
    m = _MockEmbeddings()
    mock_pipe_emb.return_value = m
    mock_llm_emb.return_value = m
    
    mock_router_llm.return_value.invoke.return_value.content = "quick_qa"
    mock_gen_llm.return_value.invoke.return_value.content = "Answer is that it's not covered in your uploaded materials."

    _ensure_course("Networks")
    ingest_file(sample_pdf, "Networks", embeddings=m)

    rag = build_rag()
    result = rag.invoke({"query": "Quantum physics entanglement theory", "course": "Networks"})
    assert result.get("grounded") is False
    assert "not covered in your uploaded materials" in result.get("answer", "")
