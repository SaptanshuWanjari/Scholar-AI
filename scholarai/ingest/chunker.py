"""Structural chunker — preserves document hierarchy within a token budget.

The chunker respects page/heading boundaries: it tries to keep text from
the same page+heading together, and never splits a page+heading section
unless the section itself exceeds the chunk budget (in which case it
falls back to a simple sliding window for that section).
"""

from __future__ import annotations

from scholarai.config import get_settings
from scholarai.ingest.loaders import Page


def chunk_pages(pages: list[Page]) -> list[dict]:
    """Convert pages into chunk dicts ready for embedding + storage.

    Returns a list of dicts with keys:
        page, heading, chunk_index, text, source_type, image_url, original_payload, csv_path
    """
    s = get_settings()
    budget = s.chunking.chunk_size
    overlap = s.chunking.chunk_overlap
    chunks: list[dict] = []

    for page in pages:
        source_type = getattr(page, "source_type", "text")
        image_url = getattr(page, "image_url", "")
        original_payload = getattr(page, "original_payload", None)
        csv_path = getattr(page, "csv_path", None)

        if source_type != "text":
            page_chunks = [page.text]
        else:
            page_chunks = _token_budget_chunks(
                page.text, budget=budget, overlap=overlap
            )

        for ci, chunk_text in enumerate(page_chunks):
            chunks.append(
                {
                    "page": page.page_number,
                    "heading": page.heading,
                    "chunk_index": ci,
                    "text": chunk_text,
                    "source_type": source_type,
                    "image_url": image_url,
                    "original_payload": original_payload,
                    "csv_path": csv_path,
                }
            )

    # Assign global chunk_index within the document.
    for i, ch in enumerate(chunks):
        ch["chunk_index"] = i
    return chunks


def _token_budget_chunks(text: str, budget: int, overlap: int) -> list[str]:
    """Split text into chunks, trying paragraph boundaries first.

    ``budget`` and ``overlap`` are in approximate characters (4 chars ≈ 1 token
    for English text). Real tokenization would come from the embedding model;
    this approximation is fine for the MVP.
    """
    paragraphs = text.split("\n\n")
    chunks: list[str] = []
    current: list[str] = []
    current_len = 0

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        plen = len(para)
        if current_len + plen <= budget:
            current.append(para)
            current_len += plen
        else:
            if current:
                chunks.append("\n\n".join(current))
                current = []
                current_len = 0
            # If a single paragraph exceeds the budget, break it further.
            if plen > budget:
                for sub in _sliding_window(para, budget, overlap):
                    chunks.append(sub)
            else:
                current.append(para)
                current_len = plen

    if current:
        chunks.append("\n\n".join(current))
    return chunks


def _sliding_window(text: str, size: int, overlap: int) -> list[str]:
    step = max(1, size - overlap)
    out: list[str] = []
    for i in range(0, len(text), step):
        out.append(text[i : i + size])
    return out
