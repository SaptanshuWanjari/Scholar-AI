"""Notebook CRUD + AI writing assistance."""

from __future__ import annotations
import logging
from datetime import datetime

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

logger = logging.getLogger(__name__)

from scholarcli.api.activity_service import record_activity
from scholarcli.api.rag_service import run_ask
from scholarcli.api.notebook_service import SIMILARITY_THRESHOLD, most_similar, resolve_notebook_citations
from scholarcli.api.schemas import (
    CollectionOut,
    NotebookAppendRequest,
    NotebookAppendResponse,
    NotebookAssistRequest,
    NotebookAssistResponse,
    NotebookCreate,
    NotebookMetaOut,
    NotebookOut,
    NotebookPatch,
)
from scholarcli.llm import get_embeddings
from scholarcli.storage import get_session
from scholarcli.storage.models import Notebook
from scholarcli.storage.vectors import add_notebook_chunks, delete_notebook_chunks, notebook_block_text

def _reindex_notebook_chunks(nb: Notebook) -> None:
    """Re-index all blocks of a notebook into the notebook_chunks LanceDB table."""
    try:
        blocks = nb.blocks or []
        texts = [notebook_block_text(b) for b in blocks]
        valid = [(b, t) for b, t in zip(blocks, texts) if t.strip()]
        if not valid:
            delete_notebook_chunks(nb.id)
            return
        embed_model = get_embeddings()
        vectors = embed_model.embed_documents([t for _, t in valid])
        add_notebook_chunks(
            nb.id, nb.course or "", nb.title,
            [b for b, _ in valid], vectors,
        )
    except Exception as exc:
        logger.warning("Failed to re-index notebook chunks: %s", exc)


router = APIRouter(prefix="/api/notebooks", tags=["notebooks"])

_COLORS = ["#4f4d7a", "#3f6b6f", "#a3771f", "#3f7a4e", "#9f3a36"]


def _fmt_updated(nb: Notebook) -> str:
    return nb.updated_at.strftime("%Y-%m-%d %H:%M") if nb.updated_at else ""


def _meta(nb: Notebook) -> NotebookMetaOut:
    blocks = nb.blocks or []
    return NotebookMetaOut(
        id=str(nb.id),
        name=nb.title,
        course=nb.course,
        color=nb.color,
        notes=len(blocks),
        lastEdited=_fmt_updated(nb),
    )


def _full(nb: Notebook) -> NotebookOut:
    blocks = nb.blocks or []
    return NotebookOut(
        id=str(nb.id),
        title=nb.title,
        subtitle=nb.subtitle,
        course=nb.course,
        color=nb.color,
        blocks=blocks,
        tags=nb.tags or [],
        updated=_fmt_updated(nb),
        is_draft=nb.is_draft,
        resolvedCitations=resolve_notebook_citations(blocks),
    )


@router.get("", response_model=list[NotebookMetaOut])
def list_notebooks() -> list[NotebookMetaOut]:
    session = get_session()
    try:
        return [_meta(nb) for nb in session.query(Notebook).order_by(Notebook.last_opened_at.desc()).all()]
    finally:
        session.close()


@router.post("", response_model=NotebookOut, status_code=201)
def create_notebook(payload: NotebookCreate) -> NotebookOut:
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title is required")
    session = get_session()
    try:
        nb = Notebook(
            title=title,
            subtitle=payload.subtitle or "",
            course=payload.course or "",
            color=payload.color or _COLORS[hash(title) % len(_COLORS)],
            blocks=[],
            tags=payload.tags or [],
        )
        session.add(nb)
        session.commit()
        session.refresh(nb)
        record_activity("note", f"Created notebook: {nb.title}", nb.course)
        return _full(nb)
    finally:
        session.close()


@router.get("/collections", response_model=list[CollectionOut])
def notebook_collections() -> list[CollectionOut]:
    """Collections = notebooks grouped by course."""
    session = get_session()
    try:
        counts: dict[str, int] = {}
        for nb in session.query(Notebook).all():
            key = nb.course or "Uncategorized"
            counts[key] = counts.get(key, 0) + 1
        return [
            CollectionOut(id=f"col-{i}", name=name, count=n)
            for i, (name, n) in enumerate(sorted(counts.items()))
        ]
    finally:
        session.close()


@router.get("/tags", response_model=list[str])
def notebook_tags() -> list[str]:
    """Distinct tags across all notebooks."""
    session = get_session()
    try:
        seen = set()
        for nb in session.query(Notebook).all():
            for t in (nb.tags or []):
                seen.add(t)
        return sorted(list(seen))
    finally:
        session.close()


@router.get("/{notebook_id}", response_model=NotebookOut)
def get_notebook(notebook_id: int) -> NotebookOut:
    session = get_session()
    try:
        nb = session.get(Notebook, notebook_id)
        if not nb:
            raise HTTPException(status_code=404, detail="Notebook not found")
        nb.last_opened_at = datetime.now()
        session.commit()
        return _full(nb)
    finally:
        session.close()


@router.put("/{notebook_id}", response_model=NotebookOut)
def update_notebook(notebook_id: int, patch: NotebookPatch) -> NotebookOut:
    session = get_session()
    try:
        nb = session.get(Notebook, notebook_id)
        if not nb:
            raise HTTPException(status_code=404, detail="Notebook not found")
        if patch.title is not None:
            nb.title = patch.title
        if patch.subtitle is not None:
            nb.subtitle = patch.subtitle
        if patch.blocks is not None:
            nb.blocks = patch.blocks
        if patch.color is not None:
            nb.color = patch.color
        if patch.tags is not None:
            nb.tags = patch.tags
        if patch.is_draft is not None:
            nb.is_draft = patch.is_draft
        session.commit()
        session.refresh(nb)
        nb.last_opened_at = datetime.now()
        session.commit()
        _reindex_notebook_chunks(nb)
        return _full(nb)
    finally:
        session.close()


@router.delete("/{notebook_id}", status_code=204)
def delete_notebook(notebook_id: int) -> None:
    session = get_session()
    try:
        nb = session.get(Notebook, notebook_id)
        if not nb:
            raise HTTPException(status_code=404, detail="Notebook not found")
        session.delete(nb)
        session.commit()
        delete_notebook_chunks(notebook_id)
    finally:
        session.close()


@router.post("/assist", response_model=NotebookAssistResponse)
async def assist(req: NotebookAssistRequest) -> NotebookAssistResponse:
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    instruction = {
        "explain": f"Explain the following in clear study notes:\n\n{text}",
        "summarize": f"Summarize the following concisely:\n\n{text}",
        "improve": f"Improve the clarity and structure of the following notes:\n\n{text}",
    }[req.action]
    result = await run_in_threadpool(run_ask, instruction, req.course, None, "study_notes")
    return NotebookAssistResponse(text=result["content"])


@router.post("/{notebook_id}/append", response_model=NotebookAppendResponse)
async def append_block(notebook_id: int, req: NotebookAppendRequest) -> NotebookAppendResponse:
    """Append a serialized artifact as a text block, with semantic dedup."""
    content = req.markdown_content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="markdown_content is required")
    session = get_session()
    try:
        nb = session.get(Notebook, notebook_id)
        if not nb:
            raise HTTPException(status_code=404, detail="Notebook not found")

        if not req.force:
            max_sim, max_idx = await run_in_threadpool(most_similar, nb, content)
            if max_sim > SIMILARITY_THRESHOLD:
                return NotebookAppendResponse(
                    appended=False,
                    redundant=True,
                    similarity=max_sim,
                    existing_block_index=max_idx,
                    block_index=None,
                )
        else:
            max_sim = 0.0

        block = {
            "type": "text",
            "text": content,
            "source": {"type": req.artifact_type, "id": req.source_id},
        }
        # Reassign a new list so SQLAlchemy detects the JSON column change.
        nb.blocks = [*(nb.blocks or []), block]
        session.commit()
        session.refresh(nb)
        record_activity("note", f"Added {req.artifact_type} to notebook: {nb.title}", nb.course)
        _reindex_notebook_chunks(nb)
        return NotebookAppendResponse(
            appended=True,
            redundant=False,
            similarity=max_sim,
            existing_block_index=None,
            block_index=len(nb.blocks) - 1,
        )
    finally:
        session.close()
