"""Table extraction — preserve tables as markdown instead of flattening them.

Uses PyMuPDF's ``page.find_tables()``. Each table becomes a chunk whose text is
a one-line retrieval summary followed by the original markdown table, so the
embedding captures the gist while the reader/renderer still sees the real grid.
"""

from __future__ import annotations

import logging
from typing import NamedTuple

from langchain_core.messages import HumanMessage, SystemMessage

from scholarai.config import get_settings
from scholarai.llm import get_llm

logger = logging.getLogger(__name__)

_SUMMARY_SYSTEM = (
    "You summarise tables from study material. Given a markdown table, write a "
    "detailed semantic description (2-4 sentences) covering: (1) the table's purpose "
    "and what it compares or lists, (2) its key columns and what each measures, "
    "(3) any notable trends, ranges, or relationships visible in the data. "
    "Reply in plain text only, no markdown formatting."
)


class TableArtifact(NamedTuple):
    markdown: str  # the original table as GFM markdown
    summary: str  # one-line retrieval summary (may be "")
    csv_path: str | None = None

    @property
    def chunk_text(self) -> str:
        return f"{self.summary}\n\n{self.markdown}".strip() if self.summary else self.markdown


def _summarize(markdown: str) -> str:
    """One-line summary of a markdown table via the fast LLM. "" on failure."""
    try:
        llm = get_llm("quick_qa")
        resp = llm.invoke(
            [SystemMessage(content=_SUMMARY_SYSTEM), HumanMessage(content=markdown)]
        )
        return (getattr(resp, "content", "") or "").strip().replace("\n", " ")
    except Exception as exc:  # noqa: BLE001 — summary is a nice-to-have
        logger.warning("table summary failed: %s", exc)
        return ""


def extract_tables(page, content_hash: str) -> list[dict]:
    """Return raw markdown strings and csv paths for all tables on a page.

    Call this from the main thread before handing off to workers. Combine with
    _summarize() in a worker thread to produce TableArtifact objects.
    """
    if not get_settings().ingest.tables_enabled:
        return []
    try:
        finder = page.find_tables()
    except Exception as exc:  # noqa: BLE001
        logger.warning("find_tables failed: %s", exc)
        return []

    import csv
    import hashlib
    tables: list[dict] = []
    for idx, tbl in enumerate(getattr(finder, "tables", []) or []):
        try:
            extracted = tbl.extract()
            non_empty = [c for row in extracted for c in row if c is not None and str(c).strip()]
            if len(non_empty) < 4:
                continue
            
            md = tbl.to_markdown().strip()
            
            if md and md.count("\n") >= 2:
                # Save as CSV
                tables_dir = get_settings().paths.tables_dir
                md_hash = hashlib.md5(md.encode("utf-8")).hexdigest()[:8]
                csv_filename = f"{content_hash}_{page.number}_{idx}_{md_hash}.csv"
                csv_path = tables_dir / csv_filename
                
                with csv_path.open("w", newline="", encoding="utf-8") as f:
                    writer = csv.writer(f)
                    writer.writerows(extracted)
                
                tables.append({"markdown": md, "csv_path": str(csv_path)})
        except Exception as exc:  # noqa: BLE001
            logger.warning("table extraction failed: %s", exc)
            continue
    return tables
