import re

import numpy as np
from fastapi import APIRouter, HTTPException
from scholarcli.api.schemas import NotebookDeduplicateRequest, NotebookDeduplicateResponse
from scholarcli.storage import get_session
from scholarcli.storage.models import Document, Notebook
from scholarcli.llm import get_embeddings

router = APIRouter(prefix="/api/notebooks", tags=["notebooks-deduplicate"])

SIMILARITY_THRESHOLD = 0.85

# [[cite:doc_id:page]] — inline source citation syntax.
# Page is optional: [[cite:3:12]] or [[cite:3]].
CITE_RE = re.compile(r"\[\[cite:(\d+)(?::(\d+))?\]\]")


def resolve_notebook_citations(blocks: list[dict]) -> list[dict]:
    """Parse all blocks for ``[[cite:...]]`` references and resolve them.

    Returns a list of ``{doc_id, doc_title, page, raw}`` dicts sorted by
    occurrence in the block text. References to deleted documents return
    ``doc_title: "Unknown Source"``.
    """
    resolved: list[dict] = []
    seen: set[str] = set()

    def resolve(raw: str, doc_id: int, page: int | None) -> dict:
        key = f"{doc_id}:{page}" if page else str(doc_id)
        if key in seen:
            return {}
        seen.add(key)
        session = get_session()
        try:
            doc = session.get(Document, doc_id)
            title = doc.title if doc else "Unknown Source"
        finally:
            session.close()
        return {
            "raw": raw,
            "docId": doc_id,
            "docTitle": title,
            "page": page,
        }

    for block in blocks:
        if not isinstance(block, dict):
            continue
        text = block.get("text", "")
        if not text:
            continue
        for m in CITE_RE.finditer(text):
            doc_id = int(m.group(1))
            page = int(m.group(2)) if m.group(2) else None
            ref = resolve(m.group(0), doc_id, page)
            if ref:
                resolved.append(ref)
    return resolved


def render_citations_in_text(text: str, resolved: list[dict]) -> str:
    """Replace ``[[cite:...]]`` tokens with display-safe placeholders.

    The frontend uses these placeholder tokens to render styled badges.
    """
    for ref in resolved:
        raw = ref.get("raw", "")
        page_str = f", p.{ref['page']}" if ref.get("page") else ""
        replacement = f"{{{{cite:{ref['docId']}:{ref['docTitle']}{page_str}}}}}"
        text = text.replace(raw, replacement, 1)
    return text


def cosine_similarity(a: list[float], b: list[float]) -> float:
    a_vec = np.array(a)
    b_vec = np.array(b)
    dot = np.dot(a_vec, b_vec)
    norm_a = np.linalg.norm(a_vec)
    norm_b = np.linalg.norm(b_vec)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(dot / (norm_a * norm_b))


def block_texts(nb: Notebook) -> list[str]:
    """Extract comparable text for each block, indexed by block position."""
    texts: list[str] = []
    for b in nb.blocks or []:
        b_type = b.get("type")
        if b_type in ("text", "callout", "heading"):
            texts.append(b.get("text", ""))
        elif b_type == "ai-answer":
            texts.append(b.get("answer", ""))
        elif b_type in ("code", "mermaid"):
            texts.append(b.get("code", ""))
        else:
            texts.append("")
    return texts


def most_similar(nb: Notebook, text: str) -> tuple[float, int | None]:
    """Return (max cosine similarity, block index) of the most similar existing block."""
    existing_texts = block_texts(nb)
    non_empty_indices = [i for i, t in enumerate(existing_texts) if t.strip()]
    if not non_empty_indices:
        return 0.0, None

    embed_model = get_embeddings()
    new_vec = embed_model.embed_query(text)
    existing_vecs = embed_model.embed_documents(
        [existing_texts[i] for i in non_empty_indices]
    )

    max_sim = 0.0
    max_idx: int | None = None
    for vec, orig_idx in zip(existing_vecs, non_empty_indices):
        sim = cosine_similarity(new_vec, vec)
        if sim > max_sim:
            max_sim = sim
            max_idx = orig_idx
    return max_sim, max_idx


@router.post("/deduplicate", response_model=NotebookDeduplicateResponse)
def deduplicate_block(req: NotebookDeduplicateRequest):
    session = get_session()
    try:
        nb = session.get(Notebook, req.notebook_id)
        if not nb:
            raise HTTPException(status_code=404, detail="Notebook not found")

        max_sim, max_idx = most_similar(nb, req.text)
        if max_sim > SIMILARITY_THRESHOLD:
            return NotebookDeduplicateResponse(
                redundant=True,
                similarity=max_sim,
                existing_block_index=max_idx,
                flagged_content=req.text,
            )
        return NotebookDeduplicateResponse(
            redundant=False,
            similarity=max_sim,
            existing_block_index=None,
            flagged_content=None,
        )
    finally:
        session.close()
