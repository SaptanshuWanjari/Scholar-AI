"""Reading mode — serve a document's text as sections, plus highlights,
bookmarks and adaptive-difficulty ("lens") explanations.

Sections are reconstructed from the chunks already indexed in LanceDB
(grouped by heading), so no re-parsing of the source file is needed.
"""

from __future__ import annotations

from langchain_core.messages import HumanMessage, SystemMessage

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from scholarcli.api.schemas import (
    BookmarkCreate,
    HighlightCreate,
    LensResponse,
    ReadingDocOut,
    ReadingParagraph,
    ReadingSectionOut,
    StickyNoteCreate,
    StickyNoteOut,
    StickyNotePatch,
)
from pydantic import BaseModel

class ProgressUpdate(BaseModel):
    progress: float
from scholarcli.llm import get_llm
from scholarcli.storage import get_session
from scholarcli.storage.models import Document, Notebook, ReadingState, StickyNote
from scholarcli.storage.vectors import get_document_chunks
from .reading_sync import sync_note_across_notebooks

router = APIRouter(prefix="/api/reading", tags=["reading"])

_LENS_SYSTEM = {
    "Beginner": "Explain the passage to a beginner using a simple analogy and plain language. 2-3 sentences.",
    "Intermediate": "Explain the passage to an intermediate student precisely but accessibly. 2-3 sentences.",
    "Expert": "Explain the passage to an expert, including formal notation and nuance where relevant. 2-3 sentences.",
}


def _build_sections(document_id: int, fallback_title: str) -> list[ReadingSectionOut]:
    chunks = get_document_chunks(document_id)
    sections: list[ReadingSectionOut] = []
    current_heading: str | None = None
    paragraphs: list[ReadingParagraph] = []
    number = 0

    def flush(heading: str | None) -> None:
        nonlocal number, paragraphs
        if paragraphs:
            number += 1
            sections.append(
                ReadingSectionOut(
                    id=f"sec{number}",
                    number=str(number),
                    title=(heading or fallback_title or "Section").strip()[:120],
                    paragraphs=paragraphs,
                )
            )
        paragraphs = []

    for ch in chunks:
        # Image/diagram chunks exist for retrieval; the image itself already
        # renders inline (with its description as caption) inside the text
        # chunk, so skip the standalone description here to avoid duplicates.
        if ch.get("source_type") in ("image", "diagram"):
            continue
        
        raw_heading = (ch.get("heading") or "").strip()
        if not raw_heading.strip(" •\t\n\r-*."):
            heading = current_heading if current_heading is not None else ""
        else:
            heading = raw_heading

        if current_heading is None:
            current_heading = heading
        if heading != current_heading:
            flush(current_heading)
            current_heading = heading
        page = ch.get("page")
        paragraphs.append(ReadingParagraph(text=ch.get("text", ""), page=int(page) if page is not None else None))
    flush(current_heading)
    return sections


def _get_state(session, document_id: int) -> ReadingState:
    state = (
        session.query(ReadingState)
        .filter(ReadingState.document_id == document_id)
        .first()
    )
    if state is None:
        state = ReadingState(document_id=document_id, highlights=[], bookmarks=[], progress=0.0)
        session.add(state)
        session.commit()
        session.refresh(state)
    return state


@router.get("/{document_id}", response_model=ReadingDocOut)
def get_reading(document_id: int) -> ReadingDocOut:
    session = get_session()
    try:
        doc = session.get(Document, document_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        state = _get_state(session, document_id)
        return ReadingDocOut(
            id=str(doc.id),
            title=doc.title,
            kind=doc.file_type.upper(),
            pages=doc.pages,
            sections=_build_sections(document_id, doc.title),
            highlights=list(state.highlights or []),
            bookmarks=list(state.bookmarks or []),
            progress=state.progress,
        )
    finally:
        session.close()


@router.post("/{document_id}/highlights", response_model=ReadingDocOut)
def add_highlight(document_id: int, payload: HighlightCreate) -> ReadingDocOut:
    session = get_session()
    try:
        doc = session.get(Document, document_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        state = _get_state(session, document_id)
        hls = list(state.highlights or [])
        hls.append({
            "id": f"hl{len(hls) + 1}",
            "text": payload.text,
            "page_number": payload.page_number,
            "rects": [r.model_dump() for r in payload.rects],
            "annotation": payload.annotation,
        })
        state.highlights = hls
        session.commit()
        return get_reading(document_id)
    finally:
        session.close()


@router.post("/{document_id}/bookmarks", response_model=ReadingDocOut)
def add_bookmark(document_id: int, payload: BookmarkCreate) -> ReadingDocOut:
    session = get_session()
    try:
        doc = session.get(Document, document_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        state = _get_state(session, document_id)
        bms = list(state.bookmarks or [])
        bms.append({
            "id": f"bm{len(bms) + 1}", 
            "section": payload.section, 
            "note": payload.note,
            "rects": [r.model_dump() for r in payload.rects]
        })
        state.bookmarks = bms
        session.commit()
        return get_reading(document_id)
    finally:
        session.close()


@router.delete("/{document_id}/highlights/{highlight_id}", status_code=204)
def remove_highlight(document_id: int, highlight_id: str) -> None:
    session = get_session()
    try:
        state = _get_state(session, document_id)
        hls = list(state.highlights or [])
        state.highlights = [h for h in hls if h.get("id") != highlight_id]
        session.commit()
    finally:
        session.close()


@router.delete("/{document_id}/bookmarks/{bookmark_id}", status_code=204)
def remove_bookmark(document_id: int, bookmark_id: str) -> None:
    session = get_session()
    try:
        state = _get_state(session, document_id)
        bms = list(state.bookmarks or [])
        state.bookmarks = [b for b in bms if b.get("id") != bookmark_id]
        session.commit()
    finally:
        session.close()


@router.patch("/{document_id}/progress", response_model=ReadingDocOut)
def update_progress(document_id: int, payload: ProgressUpdate) -> ReadingDocOut:
    session = get_session()
    try:
        state = _get_state(session, document_id)
        state.progress = payload.progress
        session.commit()
        return get_reading(document_id)
    finally:
        session.close()


@router.get("/{document_id}/lens", response_model=LensResponse)
async def lens(document_id: int, text: str, level: str = "Intermediate") -> LensResponse:
    passage = text.strip()
    if not passage:
        raise HTTPException(status_code=400, detail="text is required")
    system = _LENS_SYSTEM.get(level, _LENS_SYSTEM["Intermediate"])

    def _run() -> str:
        llm = get_llm("quick_qa")
        resp = llm.invoke([SystemMessage(content=system), HumanMessage(content=passage)])
        return getattr(resp, "content", str(resp)).strip()

    explanation = await run_in_threadpool(_run)
    return LensResponse(level=level, text=explanation)


# ---------------------------------------------------------------------------
# Sticky notes (reading-annotations plugin) — work without the Excalidraw plugin
# ---------------------------------------------------------------------------

# emoji + label per category, used for the notebook-sync blockquote.
_CATEGORY_META: dict[str, tuple[str, str]] = {
    "insight": ("💡", "Insight"),
    "question": ("❓", "Question"),
    "formula": ("∑", "Formula"),
    "confusing": ("⚠️", "Confusing"),
    "general": ("📝", "General"),
}


def _fmt_dt(dt) -> str:
    return dt.isoformat() if dt else ""


def _note_out(note: StickyNote) -> StickyNoteOut:
    return StickyNoteOut(
        id=str(note.id),
        document_id=str(note.document_id),
        page_number=note.page_number,
        bounding_box=note.bounding_box,
        content=note.content,
        category=note.category,  # type: ignore[arg-type]
        created_at=_fmt_dt(note.created_at),
        updated_at=_fmt_dt(note.updated_at),
    )


def _sync_note_to_notebook(
    session, notebook_id: str, note: StickyNote, doc_title: str
) -> None:
    """Append the note to a notebook as a colored, anchored markdown blockquote."""
    try:
        nb = session.get(Notebook, int(notebook_id))
    except (TypeError, ValueError):
        nb = None
    if not nb:
        return
    emoji, label = _CATEGORY_META.get(note.category, _CATEGORY_META["general"])
    anchor = f"#{note.document_id}-n{note.id}"
    md = (
        f"> [{emoji} {label}] {note.content}\n>\n"
        f"> — {doc_title}, p.{note.page_number} {anchor}"
    )
    block = {
        "type": "text",
        "text": md,
        "source": {"type": "reading", "id": str(note.id)},
    }
    nb.blocks = [*(nb.blocks or []), block]


@router.get("/{document_id}/notes", response_model=list[StickyNoteOut])
def list_notes(document_id: int) -> list[StickyNoteOut]:
    session = get_session()
    try:
        notes = (
            session.query(StickyNote)
            .filter(StickyNote.document_id == document_id)
            .order_by(StickyNote.page_number, StickyNote.id)
            .all()
        )
        return [_note_out(n) for n in notes]
    finally:
        session.close()


@router.post("/{document_id}/notes", response_model=StickyNoteOut, status_code=201)
def create_note(document_id: int, payload: StickyNoteCreate) -> StickyNoteOut:
    session = get_session()
    try:
        doc = session.get(Document, document_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        note = StickyNote(
            document_id=document_id,
            page_number=payload.page_number,
            bounding_box=payload.bounding_box.model_dump() if payload.bounding_box else None,
            content=payload.content,
            category=payload.category,
        )
        session.add(note)
        session.flush()  # assign note.id before optional notebook sync
        if payload.notebook_id:
            _sync_note_to_notebook(session, payload.notebook_id, note, doc.title)
        session.commit()
        session.refresh(note)
        return _note_out(note)
    finally:
        session.close()


@router.patch("/{document_id}/notes/{note_id}", response_model=StickyNoteOut)
def update_note(document_id: int, note_id: int, payload: StickyNotePatch) -> StickyNoteOut:
    session = get_session()
    try:
        note = session.get(StickyNote, note_id)
        if not note or note.document_id != document_id:
            raise HTTPException(status_code=404, detail="Note not found")
        if payload.content is not None:
            note.content = payload.content
        if payload.category is not None:
            note.category = payload.category
            
        doc = session.get(Document, document_id)
        if doc and (payload.content is not None or payload.category is not None):
            sync_note_across_notebooks(session, note, doc.title)
            
        session.commit()
        session.refresh(note)
        return _note_out(note)
    finally:
        session.close()


@router.delete("/{document_id}/notes/{note_id}", status_code=204)
def delete_note(document_id: int, note_id: int) -> None:
    session = get_session()
    try:
        note = session.get(StickyNote, note_id)
        if note and note.document_id == document_id:
            session.delete(note)
            session.commit()
    finally:
        session.close()
