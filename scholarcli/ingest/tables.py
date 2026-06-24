"""Table extraction — preserve tables as markdown instead of flattening them.

Uses PyMuPDF's ``page.find_tables()``. Each table becomes a chunk whose text is
a one-line retrieval summary followed by the original markdown table, so the
embedding captures the gist while the reader/renderer still sees the real grid.
"""

from __future__ import annotations

import logging
from typing import NamedTuple

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.config import get_settings
from scholarcli.llm import get_llm

logger = logging.getLogger(__name__)

_SUMMARY_SYSTEM = (
    "You summarise tables from study material. Given a markdown table, reply "
    "with ONE plain sentence (no markdown) stating what the table compares or "
    "lists and its key columns. No preamble."
)


class TableArtifact(NamedTuple):
    markdown: str  # the original table as GFM markdown
    summary: str  # one-line retrieval summary (may be "")

    @property
    def chunk_text(self) -> str:
        return f"{self.summary}\n\n{self.markdown}".strip() if self.summary else self.markdown


def _summarize(markdown: str) -> str:
    """One-line summary of a markdown table via the fast LLM. "" on failure."""
    try:
        llm = get_llm("study_notes")
        resp = llm.invoke(
            [SystemMessage(content=_SUMMARY_SYSTEM), HumanMessage(content=markdown)]
        )
        return (getattr(resp, "content", "") or "").strip().replace("\n", " ")
    except Exception as exc:  # noqa: BLE001 — summary is a nice-to-have
        logger.warning("table summary failed: %s", exc)
        return ""


def extract_tables(page) -> list[TableArtifact]:
    """Return structured table artifacts found on a PyMuPDF page."""
    if not get_settings().ingest.tables_enabled:
        return []
    try:
        finder = page.find_tables()
    except Exception as exc:  # noqa: BLE001 — PyMuPDF table finder is heuristic
        logger.warning("find_tables failed on page: %s", exc)
        return []

    artifacts: list[TableArtifact] = []
    for tbl in getattr(finder, "tables", []) or []:
        try:
            md = tbl.to_markdown().strip()
        except Exception as exc:  # noqa: BLE001
            logger.warning("table to_markdown failed: %s", exc)
            continue
        # Skip trivial/degenerate detections (a single row/cell isn't a table).
        if not md or md.count("\n") < 2:
            continue
        artifacts.append(TableArtifact(markdown=md, summary=_summarize(md)))
    return artifacts
