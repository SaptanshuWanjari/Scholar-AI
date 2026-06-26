"""Document loaders. PDF via PyMuPDF, Markdown via heading-aware splitting.

PDF loading is split into two phases to enable parallelism without PyMuPDF
thread-safety issues:

  Phase 1 (main thread): all fitz.Document / fitz.Page operations — text
    extraction, page rendering, table markdown extraction, image byte reads.

  Phase 2 (ThreadPoolExecutor): all LLM calls — vision transcription, image
    description, table summarisation. Workers operate on plain Python data
    (bytes, dicts, strings) passed from Phase 1.

Each loader returns a list of ``Page`` namedtuples. A ``Page`` may be native
text, OCR output, a table, or an image/diagram description — distinguished by
``source_type``. The ``bbox`` field carries the union bounding-box of all text
blocks for native-text pages (useful for UI source-highlighting); it is None
for OCR, table, and image pages.
"""

from __future__ import annotations

import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from pathlib import Path
from typing import NamedTuple

import fitz  # pymupdf

logger = logging.getLogger(__name__)


class Page(NamedTuple):
    """A page (or section/artifact) extracted from a document."""

    page_number: int  # 1-based
    title: str  # document title (same across pages)
    heading: str  # nearest heading on this page, or ""
    text: str
    source_type: str = "text"  # text | ocr | table | image | diagram
    image_url: str = ""  # served URL for image/diagram artifacts
    bbox: tuple[float, float, float, float] | None = None  # union bbox of text blocks


@dataclass
class _PageJob:
    """Intermediate data extracted from a single PDF page in the main thread.

    Carries all data needed by _process_job so worker threads never touch fitz.
    """

    page_num: int
    heading: str
    is_scanned: bool
    has_images: bool  # from PageInfo — used to route OCR engine
    page_area: float  # page.rect.width * page.rect.height — for background-image filter
    png_bytes: bytes | None  # rendered PNG; set only when is_scanned is True
    text_blocks: list[dict] = field(default_factory=list)  # from page.get_text("dict")
    table_markdowns: list[str] = field(default_factory=list)  # pre-extracted by main thread


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def load_document(path: Path, content_hash: str) -> tuple[list[Page], str]:
    """Load a PDF or Markdown file. Returns (pages, file_type)."""
    suffix = path.suffix.lower()
    if suffix == ".pdf":
        return load_pdf(path, content_hash), "pdf"
    if suffix in (".md", ".markdown"):
        return load_markdown(path, content_hash), "md"
    if suffix in (".txt", ".text"):
        return load_markdown(path, content_hash), "txt"
    raise ValueError(f"Unsupported file type: {suffix}")


# ---------------------------------------------------------------------------
# PDF
# ---------------------------------------------------------------------------

def load_pdf(path: Path, content_hash: str) -> list[Page]:
    """Orchestrate multimodal extraction for a PDF.

    Phase 1 (main thread): PyMuPDF extraction.
    Phase 2 (ThreadPoolExecutor): LLM calls in parallel.
    """
    from scholarcli.config import get_settings
    from scholarcli.ingest.analyze import analyze_page
    from scholarcli.ingest.ocr import _page_image_png
    from scholarcli.ingest.tables import extract_table_markdowns

    cfg = get_settings().ingest
    images_dir = get_settings().paths.resolved_data_dir() / "images" / content_hash

    doc = fitz.open(path)
    title = _pdf_title(doc, path)

    # --- Phase 1: PyMuPDF extraction (main thread) --------------------------
    jobs: list[_PageJob] = []
    for i, page in enumerate(doc):
        page_num = i + 1
        info = analyze_page(page, page_num)
        heading = _pdf_page_heading(page)
        page_area = page.rect.width * page.rect.height

        if cfg.ocr_enabled and info.is_scanned:
            try:
                png = _page_image_png(page)
            except Exception as exc:  # noqa: BLE001
                logger.warning("page render failed p%d: %s — skipping OCR", page_num, exc)
                png = b""
            jobs.append(_PageJob(
                page_num=page_num,
                heading=heading,
                is_scanned=True,
                has_images=info.has_images,
                page_area=page_area,
                png_bytes=png,
            ))
        else:
            blocks = page.get_text("dict", sort=True).get("blocks", [])
            table_mds = extract_table_markdowns(page)
            jobs.append(_PageJob(
                page_num=page_num,
                heading=heading,
                is_scanned=False,
                has_images=info.has_images,
                page_area=page_area,
                png_bytes=None,
                text_blocks=blocks,
                table_markdowns=table_mds,
            ))

    doc.close()

    # --- Phase 2: LLM calls (thread pool) -----------------------------------
    pages_by_num: dict[int, list[Page]] = {}
    with ThreadPoolExecutor(max_workers=cfg.ocr_workers) as executor:
        future_to_page_num = {
            executor.submit(_process_job, job, title, content_hash, images_dir, cfg): job.page_num
            for job in jobs
        }
        for future in as_completed(future_to_page_num):
            page_num = future_to_page_num[future]
            try:
                pages_by_num[page_num] = future.result()
            except Exception as exc:  # noqa: BLE001
                logger.warning("processing failed for page %d: %s", page_num, exc)
                pages_by_num[page_num] = []

    return [p for page_num in sorted(pages_by_num) for p in pages_by_num[page_num]]


def _process_job(
    job: _PageJob,
    title: str,
    content_hash: str,
    images_dir: Path,
    cfg,
) -> list[Page]:
    """Process one page's pre-extracted data; called from a worker thread.

    No PyMuPDF access here — only LLM calls and plain data manipulation.
    """
    pages: list[Page] = []

    # --- Scanned page: OCR ---------------------------------------------------
    if job.is_scanned:
        if not job.png_bytes:
            return pages

        ocr_text = ""
        # Route to Tesseract for pure-text scans (no embedded images/diagrams)
        if cfg.tesseract_fallback and not job.has_images:
            try:
                from scholarcli.ingest.ocr import ocr_page_tesseract_bytes
                ocr_text, _ = ocr_page_tesseract_bytes(job.png_bytes)
            except Exception as exc:  # noqa: BLE001 — tesseract not installed or failed
                logger.warning("Tesseract failed p%d: %s — falling back to vision", job.page_num, exc)

        if not ocr_text:  # vision model (primary for image-heavy pages, or Tesseract fallback)
            from scholarcli.ingest.ocr import ocr_page_bytes
            ocr_text, _ = ocr_page_bytes(job.png_bytes, cache_enabled=cfg.ocr_cache_enabled)

        if ocr_text.strip():
            pages.append(
                Page(job.page_num, title, job.heading, ocr_text.strip(), source_type="ocr")
            )
        return pages

    # --- Native text + inline images -----------------------------------------
    text_parts: list[str] = []
    bbox_union: list[float] | None = None

    for b_idx, b in enumerate(job.text_blocks):
        if b.get("type") == 0:  # text block
            lines = [
                "".join(span.get("text", "") for span in line.get("spans", []))
                for line in b.get("lines", [])
            ]
            block_text = "\n".join(lines).strip()
            if block_text:
                text_parts.append(block_text)
                bx0, by0, bx1, by1 = b["bbox"]
                if bbox_union is None:
                    bbox_union = [bx0, by0, bx1, by1]
                else:
                    bbox_union[0] = min(bbox_union[0], bx0)
                    bbox_union[1] = min(bbox_union[1], by0)
                    bbox_union[2] = max(bbox_union[2], bx1)
                    bbox_union[3] = max(bbox_union[3], by1)
        elif b.get("type") == 1:  # image block
            seg = _handle_image_block(
                b, job.page_num - 1, b_idx, job.page_area,
                content_hash, images_dir, title, job.heading, cfg, pages,
            )
            if seg:
                text_parts.append(seg)

    text = "\n\n".join(text_parts).strip()
    if text:
        bbox_tuple: tuple[float, float, float, float] | None = (
            (bbox_union[0], bbox_union[1], bbox_union[2], bbox_union[3])
            if bbox_union else None
        )
        pages.append(
            Page(job.page_num, title, job.heading, text, source_type="text", bbox=bbox_tuple)
        )

    # --- Tables (LLM summarisation in worker thread) -------------------------
    if job.table_markdowns:
        from scholarcli.ingest.tables import _summarize, TableArtifact
        for md in job.table_markdowns:
            summary = _summarize(md)
            artifact = TableArtifact(markdown=md, summary=summary)
            pages.append(
                Page(job.page_num, title, job.heading, artifact.chunk_text, source_type="table")
            )

    return pages


def _handle_image_block(
    b: dict,
    page_idx: int,
    b_idx: int,
    page_area: float,
    content_hash: str,
    images_dir: Path,
    title: str,
    heading: str,
    cfg,
    pages: list[Page],
) -> str | None:
    """Save an image block, describe it (if enabled), and append an image chunk.

    Returns the inline markdown to embed in the page's text (so it renders in
    Reading mode), or None for background/unsaveable images.

    page_area: pre-extracted from main thread (page.rect.width * height).
    """
    bbox = b.get("bbox")
    if bbox and page_area > 0:
        w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
        if w * h > 0.8 * page_area:
            return None  # full-page background image

    image_bytes = b.get("image")
    if not image_bytes:
        return None
    ext = b.get("ext", "png")
    images_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{page_idx + 1}_{b_idx}.{ext}"
    (images_dir / filename).write_bytes(image_bytes)
    url = f"/api/documents/images/{content_hash}/{filename}"

    description = ""
    source_type = "image"
    if cfg.vision_enabled:
        from scholarcli.ingest import vision
        result = vision.describe_image(image_bytes, ext)
        description = result.get("description", "")
        source_type = "diagram" if result.get("type") == "diagram" else "image"

    if description:
        pages.append(
            Page(
                page_idx + 1,
                title,
                heading,
                description,
                source_type=source_type,
                image_url=url,
            )
        )

    alt = description.replace("]", " ").replace("\n", " ")[:200] if description else "Image"
    return f"![{alt}]({url})"


def _pdf_title(doc, path: Path) -> str:
    meta = doc.metadata
    if meta and meta.get("title"):
        return meta["title"]
    if doc.page_count:
        first_text = doc[0].get_text(sort=True).strip()
        if first_text:
            return first_text.split("\n")[0].strip()[:200]
    return path.stem


def _pdf_page_heading(page) -> str:
    """Heuristic: largest font-size text block on page (its first line)."""
    blocks = page.get_text("dict", sort=True).get("blocks", [])
    best = ""
    best_size = 0.0
    for b in blocks:
        if b.get("type") != 0:
            continue
        for line in b.get("lines", []):
            for span in line.get("spans", []):
                sz = span.get("size", 0)
                if sz > best_size and span.get("text", "").strip():
                    best_size = sz
                    best = span["text"].strip()
    return best


# ---------------------------------------------------------------------------
# Markdown
# ---------------------------------------------------------------------------

def load_markdown(path: Path, content_hash: str) -> list[Page]:
    text = path.read_text(encoding="utf-8")
    title = path.stem
    pages: list[Page] = []

    heading = ""
    page_text: list[str] = []
    page_num = 1

    for line in text.splitlines():
        if line.startswith("# "):
            title = line[2:].strip()
            continue
        if line.startswith("## "):
            _flush_section(pages, page_num, title, heading, page_text)
            heading = line[3:].strip()
            page_text = []
            page_num += 1
            continue
        if line.startswith("### "):
            _flush_section(pages, page_num, title, heading, page_text)
            heading = line[4:].strip()
            page_text = []
            page_num += 1
            continue
        page_text.append(line)

    _flush_section(pages, page_num, title, heading, page_text)
    return pages


def _flush_section(pages, page_num, title, heading, lines):
    joined = "\n".join(lines).strip()
    if joined:
        pages.append(Page(page_number=page_num, title=title, heading=heading, text=joined))
