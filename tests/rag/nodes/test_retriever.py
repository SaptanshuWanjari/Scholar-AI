"""Tests for the retrieval node."""

import pytest

from scholarai.rag.nodes.retriever import retrieve
from scholarai.rag.state import GraphState
from scholarai.storage import get_session
from scholarai.storage.models import Course, Document, ReadingState
from tests.factories import create_course


def test_highlights_only_path():
    session = get_session()
    course = create_course("Highlights")
    doc = Document(
        path="/tmp/hl.pdf",
        title="Highlight Doc",
        file_type="pdf",
        content_hash="abc",
        version=1,
        size_kb=1,
        pages=1,
        status="indexed",
        course_id=course.id,
    )
    session.add(doc)
    session.commit()
    session.refresh(doc)

    rstate = ReadingState(
        document_id=doc.id,
        highlights=[{"id": "h1", "page_number": 2, "text": "important quote"}],
    )
    session.add(rstate)
    session.commit()

    state: GraphState = {
        "query": "important",
        "course": "Highlights",
        "document_id": doc.id,
        "highlights_only": True,
    }
    result = retrieve(state)
    assert len(result["retrieved"]) == 1
    assert result["retrieved"][0]["text"] == "important quote"


@pytest.mark.ollama
@pytest.mark.usefixtures("required_embed_skip_if_missing")
def test_vector_search_returns_related_chunks(sample_pdf):
    from scholarai.ingest.pipeline import ingest_file

    course = create_course("RetrievalNetworks")
    status = ingest_file(sample_pdf, "RetrievalNetworks")
    assert status in ("indexed", "up-to-date")

    state: GraphState = {
        "query": "What is TCP slow start?",
        "course": "RetrievalNetworks",
    }
    result = retrieve(state)
    assert len(result["retrieved"]) > 0
    texts = " ".join(ch["text"] for ch in result["retrieved"])
    assert "slow start" in texts.lower() or "congestion" in texts.lower()
