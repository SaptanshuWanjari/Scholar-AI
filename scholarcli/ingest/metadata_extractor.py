"""LLM-based document metadata extraction: summary, tags, topics.

Runs a single inference pass over the first ~4 k chars of a document's
chunk text and returns structured metadata. Gated by
``ingest.metadata_extraction`` in config — set to false to skip on slow
machines.
"""

from __future__ import annotations

import json
import logging
import re

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.llm import get_llm

logger = logging.getLogger(__name__)

_SYSTEM = """\
You are a metadata extractor for academic study documents. Given a sample of \
document text, return ONLY a JSON object with these keys:
- "summary": a 2-3 sentence plain-language description of what the document covers
- "tags": a list of 5-8 short keyword tags (lowercase, 1-3 words each)
- "topics": a list of 3-5 main topic names (Title Case, 1-4 words each)

Output valid JSON only — no prose, no markdown fences, no explanation.\
"""


def extract(text_sample: str) -> dict:
    """Return {"summary": str, "tags": list[str], "topics": list[str]}.

    Never raises — falls back to empty values so ingestion is never blocked.
    """
    try:
        llm = get_llm("quick_qa")
        resp = llm.invoke([
            SystemMessage(content=_SYSTEM),
            HumanMessage(content=f"Document text:\n\n{text_sample[:4000]}"),
        ])
        raw = (getattr(resp, "content", "") or "").strip()
        # Strip markdown fences the model may add despite instructions.
        if raw.startswith("```"):
            raw = re.sub(r"^```[a-z]*\s*", "", raw, flags=re.MULTILINE)
            raw = raw.rstrip("` \n")
        start, end = raw.find("{"), raw.rfind("}")
        if start != -1 and end > start:
            data = json.loads(raw[start:end + 1])
            return {
                "summary": str(data.get("summary", "")).strip(),
                "tags": [str(t).strip().lower() for t in data.get("tags", []) if t][:10],
                "topics": [str(t).strip() for t in data.get("topics", []) if t][:8],
            }
    except Exception as exc:  # noqa: BLE001
        logger.warning("metadata extraction failed: %s", exc)
    return {"summary": "", "tags": [], "topics": []}
