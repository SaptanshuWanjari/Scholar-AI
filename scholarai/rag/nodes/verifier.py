"""Verification node — check if retrieved context is actually relevant.

Uses CRAG methodology: batch-scores chunks with a single LLM call, applies
sentence-level refinement for Ambiguous/Correct chunks in a second batched
call, and strips out Incorrect chunks.
"""

from __future__ import annotations
import copy
import json
import re

from scholarai.llm import get_llm
from scholarai.rag.prompts import CRAG_VERIFIER_SYSTEM, CRAG_REFINER_SYSTEM
from scholarai.rag.state import GraphState


BATCHED_VERIFIER_SYSTEM = """\
You are a retrieval evaluator. Given a student's query and a numbered list of retrieved context chunks, score each chunk's relevance for answering the query from 0 to 10.
Output ONLY a JSON object mapping chunk index (as string) to score (int).
Example: {"0": 8, "1": 2, "2": 5}
No prose, no markdown fences.\
"""

BATCHED_REFINER_SYSTEM = """\
You are a noise filter for study materials. Given a user query and numbered sentences grouped by chunk, score each sentence's relevance to the query from 0 to 10.
Output ONLY a JSON object mapping chunk index to a sub-object of sentence index → score.
Example: {"0": {"0": 9, "1": 2}, "1": {"0": 5, "1": 8}}
No prose, no markdown fences.\
"""


def _split_into_sentences(text: str) -> list[str]:
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return [s for s in sentences if s.strip()]


def _parse_json(content: str) -> dict:
    content = content.strip()
    if content.startswith("```json"):
        content = content[7:-3].strip()
    elif content.startswith("```"):
        content = content[3:-3].strip()
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {}


def verify(state: GraphState) -> GraphState:
    chunks = state.get("retrieved", [])
    query = state.get("search_query") or state.get("query", "")

    if not chunks:
        state["grounded"] = False
        return state

    llm = get_llm("quick_qa", temperature=0.0)

    # 1. Batch-score all chunks in one LLM call.
    listing = "\n\n".join(
        f"[{i}] {(ch.get('text') or '').strip()[:800]}"
        for i, ch in enumerate(chunks)
    )
    resp = llm.invoke([
        {"role": "system", "content": BATCHED_VERIFIER_SYSTEM},
        {"role": "user", "content": f"Query: {query}\n\nChunks:\n{listing}"},
    ])
    scores = _parse_json(resp.content)
    if not scores:
        state["grounded"] = False
        state["retrieved"] = []
        return state

    # 2. Classify: keep chunks with score >= 3.0.
    candidates: list[tuple[int, dict, float]] = []
    for i, ch in enumerate(chunks):
        s = float(scores.get(str(i), 0))
        if s >= 3.0:
            candidates.append((i, ch, s))

    if not candidates:
        state["grounded"] = False
        state["retrieved"] = []
        return state

    # 3. Batch sentence-level refinement for all surviving chunks.
    all_sentences_parts: list[str] = []
    chunk_sentence_map: dict[int, list[str]] = {}  # chunk_idx → list of sentences
    for chunk_idx, ch, _score in candidates:
        text = ch.get("text", "")
        sentences = _split_into_sentences(text)
        if not sentences:
            continue
        chunk_sentence_map[chunk_idx] = sentences
        numbered = "\n".join(f"{si}: {s}" for si, s in enumerate(sentences))
        all_sentences_parts.append(f"Chunk {chunk_idx} sentences:\n{numbered}")

    if chunk_sentence_map:
        refiner_prompt = "Query: {}\n\n{}".format(query, "\n\n".join(all_sentences_parts))
        ref_resp = llm.invoke([
            {"role": "system", "content": BATCHED_REFINER_SYSTEM},
            {"role": "user", "content": refiner_prompt},
        ])
        all_scores = _parse_json(ref_resp.content)
    else:
        all_scores = {}

    # 4. Build refined chunks with deep copy.
    refined_chunks = []
    for chunk_idx, ch, cr_score in candidates:
        chunk_scores = all_scores.get(str(chunk_idx), {})
        kept_sentences = []
        sentences = chunk_sentence_map.get(chunk_idx, [])
        if sentences and chunk_scores:
            for si, sentence in enumerate(sentences):
                s_score = float(chunk_scores.get(str(si), 0))
                if s_score >= 5.0:
                    kept_sentences.append(sentence)

        new_chunk = copy.deepcopy(ch)
        if kept_sentences:
            new_chunk["text"] = " ".join(kept_sentences)
        elif cr_score >= 8.0:
            pass  # keep original text
        else:
            continue  # skip ambiguous chunks without surviving sentences

        refined_chunks.append(new_chunk)

    state["retrieved"] = refined_chunks
    state["grounded"] = len(refined_chunks) > 0
    return state
