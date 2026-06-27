"""Data Analyzer Node — answers quantitative questions using Pandas & CSVs."""

from __future__ import annotations

import logging
from pathlib import Path

try:
    import pandas as pd
except ImportError:
    pd = None

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.llm import get_llm
from scholarcli.rag.prompts import DATA_QA_SYSTEM, NOT_GROUNDED
from scholarcli.rag.state import GraphState

logger = logging.getLogger(__name__)

def analyze_data(state: GraphState) -> GraphState:
    """Read related CSV tables via Pandas and query the LLM deterministically."""
    if pd is None:
        logger.error("pandas is not installed; cannot perform data analysis.")
        state["answer"] = "Data Analysis requires the `pandas` library, which is not installed."
        return state

    chunks = state.get("retrieved", [])
    csv_paths = []
    # Use dict to deduplicate if the same CSV is in multiple chunks
    seen = set()
    for chunk in chunks:
        if chunk.get("source_type") == "table" and chunk.get("csv_path"):
            cp = chunk["csv_path"]
            if cp not in seen:
                seen.add(cp)
                csv_paths.append(cp)

    if not csv_paths:
        state["answer"] = NOT_GROUNDED
        return state

    # Load and format the CSVs
    data_context = ""
    for idx, cp in enumerate(csv_paths):
        try:
            path = Path(cp)
            if not path.exists():
                continue
            df = pd.read_csv(path)
            data_context += f"--- Table {idx + 1} ---\n{df.to_markdown(index=False)}\n\n"
        except Exception as exc:  # noqa: BLE001
            logger.warning("Failed to load csv %s: %s", cp, exc)

    if not data_context.strip():
        state["answer"] = NOT_GROUNDED
        return state

    query = state.get("query", "")
    user_prompt = f"Data:\n{data_context}\nQuestion: {query}\nAnswer:"

    # We use quick_qa as our fast model per requirements
    llm = get_llm("quick_qa")
    
    try:
        response = llm.invoke(
            [SystemMessage(content=DATA_QA_SYSTEM), HumanMessage(content=user_prompt)]
        )
        answer: str = response.content if hasattr(response, "content") else str(response)
        state["answer"] = answer.strip()
    except Exception as exc:  # noqa: BLE001
        logger.error("Data QA failed: %s", exc)
        state["answer"] = "Error performing data analysis."
        
    return state
