import numpy as np
from fastapi import APIRouter, HTTPException
from scholarcli.api.schemas import NotebookDeduplicateRequest, NotebookDeduplicateResponse
from scholarcli.storage import get_session
from scholarcli.storage.models import Notebook
from scholarcli.llm import get_embeddings

router = APIRouter(prefix="/api/notebooks", tags=["notebooks-deduplicate"])

SIMILARITY_THRESHOLD = 0.85


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
