import io
import urllib.parse
import zipfile

from fastapi.testclient import TestClient

from scholarai.api.app import create_app
from scholarai.api.export_service import (
    block_to_markdown,
    artifact_payload_to_markdown,
    _slug,
    decode_svg_data_url,
)
from scholarai.storage import get_session, init_db
from scholarai.storage.models import Course, Notebook, Whiteboard


def test_block_heading():
    assert block_to_markdown({"type": "heading", "level": 2, "text": "Hi"}, {}, {}) == "## Hi"


def test_block_callout():
    out = block_to_markdown({"type": "callout", "tone": "warning", "text": "careful"}, {}, {})
    assert out == "> **Warning:** careful"


def test_block_mermaid():
    out = block_to_markdown({"type": "mermaid", "code": "graph TD\n A-->B"}, {}, {})
    assert out == "```mermaid\ngraph TD\n A-->B\n```"


def test_block_table():
    block = {"type": "table", "headers": ["A", "B"], "rows": [["1", "2"], ["3", "4"]]}
    out = block_to_markdown(block, {}, {})
    assert "| A | B |" in out and "| 1 | 2 |" in out


def test_block_flashdeck():
    block = {"type": "flashdeck", "name": "Deck", "cards": [{"front": "Q", "back": "A"}]}
    out = block_to_markdown(block, {}, {})
    assert "## Deck" in out and "**Q** — A" in out


def test_artifact_quiz():
    payload = {"questions": [{"prompt": "What?", "options": ["a", "b"], "answer": "a"}]}
    out = artifact_payload_to_markdown("quiz", payload)
    assert "### Q1. What?" in out and "**Answer:** a" in out


def test_slug():
    assert _slug("  My Course!  ") == "my-course"


def test_decode_svg_data_url():
    svg = "<svg xmlns='http://www.w3.org/2000/svg'></svg>"
    url = "data:image/svg+xml;utf8," + urllib.parse.quote(svg)
    assert decode_svg_data_url(url) == svg.encode("utf-8")


def test_decode_svg_data_url_none():
    assert decode_svg_data_url("") is None
    assert decode_svg_data_url(None) is None


def test_document_to_markdown_annotations(monkeypatch):
    import scholarai.api.export_service as es

    doc = type("D", (), {"id": 7, "title": "Physics"})()
    monkeypatch.setattr(
        es, "get_document_chunks",
        lambda doc_id: [
            {"text": "Newton's laws describe motion.", "page": 1, "heading": "Intro"},
            {"text": "F = ma.", "page": 2, "heading": "Second Law"},
        ],
    )
    highlights = [{"id": "h1", "text": "F = ma.", "page_number": 2}]
    bookmarks = [{"id": "b1", "section": "Intro", "note": "revisit", "page_number": 1}]
    notes = [
        type("N", (), {"id": 3, "page_number": 2, "content": "units matter",
                       "category": "formula"})()
    ]
    out = es.document_to_markdown(doc, highlights, bookmarks, notes, {}, {})
    assert out.startswith("# Physics")
    assert "## Intro" in out
    assert "Newton's laws describe motion." in out
    assert "<mark>F = ma.</mark>" in out   # verbatim highlight wrapped (CommonMark HTML)
    assert "revisit" in out              # bookmark emitted
    assert "units matter" in out         # sticky note emitted
    assert "p.2" in out                  # sticky note carries page number


def test_block_none_text():
    assert block_to_markdown({"type": "text", "text": None}, {}, {}) == ""


def test_block_whiteboard_no_svg():
    out = block_to_markdown(
        {"type": "whiteboard", "whiteboardId": "5", "title": "Diagram"},
        {"5": "diagram-5"}, {}, set(),
    )
    assert ".svg" not in out
    assert "diagram-5.excalidraw" in out


def test_decode_svg_base64():
    import base64
    svg = b"<svg></svg>"
    url = "data:image/svg+xml;base64," + base64.b64encode(svg).decode()
    assert decode_svg_data_url(url) == svg


def test_decode_svg_raw():
    svg = "<svg></svg>"
    assert decode_svg_data_url(svg) == svg.encode("utf-8")


def _seed(session):
    course = Course(name="Physics")
    session.add(course)
    session.flush()
    nb = Notebook(title="Kinematics", course="Physics", blocks=[
        {"type": "heading", "level": 1, "text": "Kinematics"},
        {"type": "mermaid", "code": "graph TD\n A-->B"},
    ])
    session.add(nb)
    svg = "<svg xmlns='http://www.w3.org/2000/svg'></svg>"
    wb = Whiteboard(title="Diagram", course="Physics",
                    thumbnail="data:image/svg+xml;utf8," + urllib.parse.quote(svg),
                    scene={"elements": []})
    session.add(wb)
    session.commit()
    return nb.id, wb.id


def test_export_zip_end_to_end():
    init_db()
    session = get_session()
    nb_id, wb_id = _seed(session)
    session.close()

    client = TestClient(create_app())
    course = get_session()
    cid = course.query(Course).filter(Course.name == "Physics").first().id
    course.close()

    r = client.get(f"/api/export/course/{cid}")
    assert r.status_code == 200, r.text
    assert r.headers["content-type"] == "application/zip"

    z = zipfile.ZipFile(io.BytesIO(r.content))
    names = z.namelist()
    assert any(n.startswith("physics/README.md") for n in names)
    assert any(n.startswith("physics/notebooks/") and n.endswith(".md") for n in names)
    assert any("assets/" in n and n.endswith(".svg") for n in names)
    assert any(n.endswith(".excalidraw") for n in names)

    nb_md = next(n for n in names if "notebooks/" in n)
    assert "Kinematics" in z.read(nb_md).decode()
    assert "```mermaid" in z.read(nb_md).decode()


def test_export_unknown_course_404():
    init_db()
    client = TestClient(create_app())
    r = client.get("/api/export/course/999999")
    assert r.status_code == 404
