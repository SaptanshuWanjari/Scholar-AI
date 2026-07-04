"""Vision-model helpers (qwen2.5vl via Ollama).

Two jobs:
  * ``describe_image`` — a short academic description of an image/diagram,
    used as a retrievable chunk.
  * ``transcribe`` — verbatim OCR recovery for pages where Surya was unsure.

Both lazily build a ``ChatOllama`` bound to the configured vision model, so
nothing here runs (or imports heavy deps) unless multimodal ingest is enabled.
"""

from __future__ import annotations

import base64
import json
import logging

from langchain_core.messages import HumanMessage

from scholarai.llm import get_vision_llm

logger = logging.getLogger(__name__)

# Description kept short — it's an embedding target, not prose for the reader.
_DESCRIBE_PROMPT = (
    "You are analysing a figure from an engineering/CS study document. "
    "Reply with ONLY a JSON object, no markdown fences:\n"
    '{"type": "image|diagram|chart", "description": "..."}\n'
    "Pick \"diagram\" for flowcharts, architecture/UML/sequence/network "
    "diagrams or concept maps; \"chart\" for plots/graphs; else \"image\". "
    "The description (<=80 words) must name the key components, labels and "
    "relationships so the figure is findable by a text search."
)

_TRANSCRIBE_PROMPT = (
    "Transcribe ALL text in this page image exactly, preserving reading "
    "order, headings and lists. If there are tables, extract them and "
    "convert them into clean, valid Markdown format using `|` for column "
    "separators and `---` for the header separator. For multi-line cell "
    "content, use `<br>` to separate lines. Output only the transcribed "
    "text — no commentary, no markdown fences."
)

_VALID_TYPES = {"image", "diagram", "chart"}


def _data_url(image_bytes: bytes, ext: str = "png") -> str:
    mime = "jpeg" if ext.lower() in ("jpg", "jpeg") else ext.lower()
    b64 = base64.b64encode(image_bytes).decode("ascii")
    return f"data:image/{mime};base64,{b64}"


def _invoke(prompt: str, image_bytes: bytes, ext: str) -> str:
    llm = get_vision_llm()
    msg = HumanMessage(
        content=[
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": _data_url(image_bytes, ext)},
        ]
    )
    resp = llm.invoke([msg])
    return (getattr(resp, "content", "") or "").strip()


def _strip_json(raw: str) -> str:
    """Pull a JSON object out of a model reply that may be fenced."""
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1] if raw.count("```") >= 2 else raw.strip("`")
        if raw.lstrip().startswith("json"):
            raw = raw.lstrip()[4:]
    start, end = raw.find("{"), raw.rfind("}")
    if start != -1 and end != -1 and end > start:
        return raw[start : end + 1]
    return raw


def describe_image(image_bytes: bytes, ext: str = "png") -> dict:
    """Return ``{"type": ..., "description": ...}`` for an image/diagram.

    Falls back to ``{"type": "image", "description": ""}`` on any failure so
    the caller can decide whether to keep the artifact.
    """
    try:
        raw = _invoke(_DESCRIBE_PROMPT, image_bytes, ext)
        data = json.loads(_strip_json(raw))
        kind = str(data.get("type", "image")).lower()
        if kind not in _VALID_TYPES:
            kind = "image"
        desc = str(data.get("description", "")).strip()
        return {"type": kind, "description": desc}
    except Exception as exc:  # noqa: BLE001 — degrade gracefully, never break ingest
        logger.warning("vision.describe_image failed: %s", exc)
        return {"type": "image", "description": ""}


def transcribe(image_bytes: bytes, ext: str = "png") -> str:
    """Return verbatim text transcribed from a page image (OCR recovery)."""
    try:
        return _invoke(_TRANSCRIBE_PROMPT, image_bytes, ext)
    except Exception as exc:  # noqa: BLE001
        logger.warning("vision.transcribe failed: %s", exc)
        return ""
