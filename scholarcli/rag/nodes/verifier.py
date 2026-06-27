"""Verification node — check if retrieved context is actually relevant.

Uses CRAG methodology: grades chunks with an LLM, applies sentence-level 
refinement for Ambiguous/Correct chunks, and strips out Incorrect chunks.
"""

from __future__ import annotations
import json
import re

from scholarcli.llm import get_llm
from scholarcli.rag.prompts import CRAG_VERIFIER_SYSTEM, CRAG_REFINER_SYSTEM
from scholarcli.rag.state import GraphState


def _split_into_sentences(text: str) -> list[str]:
    # Simple heuristic regex for sentence splitting
    # Matches a period, exclamation, or question mark followed by space or end of string.
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return [s for s in sentences if s.strip()]


def verify(state: GraphState) -> GraphState:
    chunks = state.get("retrieved", [])
    query = state.get("search_query") or state.get("query", "")
    
    if not chunks:
        state["grounded"] = False
        return state

    llm = get_llm("quick_qa", temperature=0.0)
    
    refined_chunks = []
    
    for chunk in chunks:
        # 1. Chunk Scoring
        chunk_text = chunk.get("text", "")
        if not chunk_text:
            continue
            
        messages = [
            {"role": "system", "content": CRAG_VERIFIER_SYSTEM},
            {"role": "user", "content": f"Query: {query}\n\nContext:\n{chunk_text}"},
        ]
        
        response = llm.invoke(messages)
        try:
            # try to parse JSON
            content = response.content.strip()
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()
                
            result = json.loads(content)
            score = float(result.get("score", 0))
        except Exception:
            score = 0.0
            
        # 2. Classification
        if score < 3.0:
            # Incorrect - discard
            continue
            
        # Correct (>= 8.0) or Ambiguous (>= 3.0 and < 8.0)
        # 3. Sentence-Level Refinement
        sentences = _split_into_sentences(chunk_text)
        if not sentences:
            if score >= 8.0:
                refined_chunks.append(chunk)
            continue
            
        # Prepare sentences for refiner
        numbered_sentences = "\n".join(f"{i}: {s}" for i, s in enumerate(sentences))
        refiner_messages = [
            {"role": "system", "content": CRAG_REFINER_SYSTEM},
            {"role": "user", "content": f"Query: {query}\n\nSentences:\n{numbered_sentences}"},
        ]
        
        refiner_response = llm.invoke(refiner_messages)
        try:
            ref_content = refiner_response.content.strip()
            if ref_content.startswith("```json"):
                ref_content = ref_content[7:-3].strip()
            elif ref_content.startswith("```"):
                ref_content = ref_content[3:-3].strip()
                
            sentence_scores = json.loads(ref_content)
        except Exception:
            sentence_scores = {}
            
        # Filter sentences >= 5.0
        kept_sentences = []
        for i, sentence in enumerate(sentences):
            idx_str = str(i)
            s_score = float(sentence_scores.get(idx_str, 0))
            if s_score >= 5.0:
                kept_sentences.append(sentence)
                
        # Merge passing sentences
        if kept_sentences:
            refined_text = " ".join(kept_sentences)
            new_chunk = chunk.copy()
            new_chunk["text"] = refined_text
            refined_chunks.append(new_chunk)
        elif score >= 8.0:
            # Safety Override
            refined_chunks.append(chunk)

    state["retrieved"] = refined_chunks
    state["grounded"] = len(refined_chunks) > 0
    return state
