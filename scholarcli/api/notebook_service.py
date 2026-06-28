import numpy as np
from fastapi import APIRouter, HTTPException
from scholarcli.api.schemas import NotebookDeduplicateRequest, NotebookDeduplicateResponse
from scholarcli.storage import get_session
from scholarcli.storage.models import Notebook
from scholarcli.llm import get_embeddings

router = APIRouter(prefix="/api/notebooks", tags=["notebooks-deduplicate"])

def cosine_similarity(a: list[float], b: list[float]) -> float:
    a_vec = np.array(a)
    b_vec = np.array(b)
    dot = np.dot(a_vec, b_vec)
    norm_a = np.linalg.norm(a_vec)
    norm_b = np.linalg.norm(b_vec)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(dot / (norm_a * norm_b))

@router.post("/deduplicate", response_model=NotebookDeduplicateResponse)
def deduplicate_block(req: NotebookDeduplicateRequest):
    session = get_session()
    try:
        nb = session.get(Notebook, req.notebook_id)
        if not nb:
            raise HTTPException(status_code=404, detail="Notebook not found")
        
        existing_texts = []
        for b in nb.blocks:
            b_type = b.get("type")
            if b_type in ("text", "callout", "heading"):
                existing_texts.append(b.get("text", ""))
            elif b_type == "ai-answer":
                existing_texts.append(b.get("answer", ""))
            elif b_type in ("code", "mermaid"):
                existing_texts.append(b.get("code", ""))
            else:
                existing_texts.append("")
                
        if not existing_texts:
            return NotebookDeduplicateResponse(
                redundant=False,
                similarity=0.0,
                existing_block_index=None,
                flagged_content=None
            )

        embed_model = get_embeddings()
        
        new_vec = embed_model.embed_query(req.text)
        
        non_empty_indices = [i for i, t in enumerate(existing_texts) if t.strip()]
        if not non_empty_indices:
             return NotebookDeduplicateResponse(
                redundant=False,
                similarity=0.0,
                existing_block_index=None,
                flagged_content=None
            )
            
        texts_to_embed = [existing_texts[i] for i in non_empty_indices]
        existing_vecs = embed_model.embed_documents(texts_to_embed)
        
        max_sim = 0.0
        max_idx = None
        
        for vec, orig_idx in zip(existing_vecs, non_empty_indices):
            sim = cosine_similarity(new_vec, vec)
            if sim > max_sim:
                max_sim = sim
                max_idx = orig_idx
                
        if max_sim > 0.85:
            return NotebookDeduplicateResponse(
                redundant=True,
                similarity=max_sim,
                existing_block_index=max_idx,
                flagged_content=req.text
            )
            
        return NotebookDeduplicateResponse(
            redundant=False,
            similarity=max_sim,
            existing_block_index=None,
            flagged_content=None
        )
    finally:
        session.close()
