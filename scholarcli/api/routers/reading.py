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
    ReadingSectionOut,
)
from scholarcli.llm import get_llm
from scholarcli.storage import get_session
from scholarcli.storage.models import Document, ReadingState
from scholarcli.storage.vectors import get_document_chunks

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
    paragraphs: list[str] = []
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
        paragraphs.append(ch.get("text", ""))
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
        hls.append({"id": f"hl{len(hls) + 1}", "text": payload.text, "section": payload.section})
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
        bms.append({"id": f"bm{len(bms) + 1}", "section": payload.section, "note": payload.note})
        state.bookmarks = bms
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
