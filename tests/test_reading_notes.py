"""Tests for reading-mode sticky notes + notebook sync + whiteboard doc link."""

from fastapi.testclient import TestClient

from scholarai.api.app import create_app
from scholarai.storage import get_session, init_db
from scholarai.storage.models import Document


def _make_doc() -> int:
    session = get_session()
    try:
        doc = Document(
            path="/tmp/x.pdf",
            title="Sample Doc",
            file_type="pdf",
            content_hash="abc",
            pages=3,
        )
        session.add(doc)
        session.commit()
        session.refresh(doc)
        return doc.id
    finally:
        session.close()


def test_sticky_note_crud():
    init_db()
    client = TestClient(create_app())
    doc_id = _make_doc()

    # create
    r = client.post(
        f"/api/reading/{doc_id}/notes",
        json={
            "content": "Newton's second law",
            "category": "formula",
            "page_number": 2,
            "bounding_box": {"x": 0.1, "y": 0.2, "width": 0.3, "height": 0.05},
        },
    )
    assert r.status_code == 201, r.text
    note = r.json()
    assert note["category"] == "formula"
    assert note["page_number"] == 2
    assert note["bounding_box"]["x"] == 0.1
    note_id = note["id"]

    # list
    r = client.get(f"/api/reading/{doc_id}/notes")
    assert r.status_code == 200
    assert len(r.json()) == 1

    # patch
    r = client.patch(
        f"/api/reading/{doc_id}/notes/{note_id}",
        json={"category": "confusing", "content": "edited"},
    )
    assert r.status_code == 200
    assert r.json()["category"] == "confusing"
    assert r.json()["content"] == "edited"

    # delete
    r = client.delete(f"/api/reading/{doc_id}/notes/{note_id}")
    assert r.status_code == 204
    r = client.get(f"/api/reading/{doc_id}/notes")
    assert r.json() == []


def test_note_syncs_to_notebook():
    init_db()
    client = TestClient(create_app())
    doc_id = _make_doc()

    r = client.post("/api/notebooks", json={"title": "My NB"})
    assert r.status_code == 201
    nb_id = r.json()["id"]

    r = client.post(
        f"/api/reading/{doc_id}/notes",
        json={
            "content": "Big idea here",
            "category": "insight",
            "page_number": 1,
            "notebook_id": nb_id,
        },
    )
    assert r.status_code == 201

    r = client.get(f"/api/notebooks/{nb_id}")
    assert r.status_code == 200
    blocks = r.json()["blocks"]
    assert len(blocks) == 1
    text = blocks[0]["text"]
    assert "Insight" in text and "💡" in text
    assert "Big idea here" in text
    assert f"#doc{doc_id}-p1" in text


def test_whiteboard_document_link_and_filter():
    init_db()
    client = TestClient(create_app())
    doc_id = _make_doc()

    r = client.post(
        "/api/whiteboards",
        json={
            "title": "Region annotation",
            "source": "annotation",
            "document_id": doc_id,
            "page_number": 2,
        },
    )
    assert r.status_code == 201, r.text

    r = client.get(f"/api/whiteboards?document_id={doc_id}")
    assert r.status_code == 200
    boards = r.json()
    assert len(boards) == 1
    assert boards[0]["documentId"] == str(doc_id)
    assert boards[0]["pageNumber"] == 2

    # filtering by a different doc returns nothing
    r = client.get("/api/whiteboards?document_id=999999")
    assert r.json() == []
