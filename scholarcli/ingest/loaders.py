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
    original_payload: str | None = None  # raw content (e.g. markdown table) preserved for retrieval


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
        page_dict = page.get_text("dict", sort=True)
        info = analyze_page(page, page_num, page_dict)
        heading = _pdf_page_heading(page_dict)
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
            blocks = page_dict.get("blocks", [])
            table_mds = extract_table_markdowns(page)
            
            try:
                tables_res = page.find_tables()
                table_bboxes = [fitz.Rect(t.bbox) for t in getattr(tables_res, "tables", [])] if tables_res else []
            except Exception:
                table_bboxes = []
                
            try:
                drawings = page.get_drawings()
            except Exception:
                drawings = []
                
            bboxes = []
            for d in drawings:
                r = d["rect"]
                if r.width > 20 and r.height > 20:
                    bboxes.append(r)
                    
            merged = []
            for r in bboxes:
                found = False
                for j, m in enumerate(merged):
                    inflated = fitz.Rect(r.x0 - 10, r.y0 - 10, r.x1 + 10, r.y1 + 10)
                    if inflated.intersects(m):
                        merged[j] = m | r
                        found = True
                        break
                if not found:
                    merged.append(r)
                    
            changed = True
            while changed:
                changed = False
                new_merged = []
                while merged:
                    current = merged.pop(0)
                    j = 0
                    while j < len(merged):
                        inflated = fitz.Rect(current.x0 - 20, current.y0 - 20, current.x1 + 20, current.y1 + 20)
                        if inflated.intersects(merged[j]):
                            current = current | merged.pop(j)
                            changed = True
                        else:
                            j += 1
                    new_merged.append(current)
                merged = new_merged
                
            diagrams = []
            for m in merged:
                if m.width > 50 and m.height > 50:
                    is_table = False
                    for tbox in table_bboxes:
                        intersect = fitz.Rect(m).intersect(tbox)
                        if intersect.width > 0 and intersect.height > 0:
                            if (intersect.width * intersect.height) > 0.5 * (m.width * m.height):
                                is_table = True
                                break
                    if not is_table:
                        diagrams.append(m)
                        
            filtered_blocks = []
            for b in blocks:
                if b.get("type") == 0:
                    bx0, by0, bx1, by1 = b["bbox"]
                    b_rect = fitz.Rect(bx0, by0, bx1, by1)
                    original_area = b_rect.width * b_rect.height
                    in_diagram = False
                    for dbox in diagrams:
                        intersect = b_rect & dbox
                        if intersect.width > 0 and intersect.height > 0:
                            if (intersect.width * intersect.height) > 0.7 * original_area:
                                in_diagram = True
                                break
                    if not in_diagram:
                        filtered_blocks.append(b)
                else:
                    filtered_blocks.append(b)
                    
            blocks = filtered_blocks
            
            for dbox in diagrams:
                try:
                    pix = page.get_pixmap(clip=dbox, dpi=300)
                    blocks.append({
                        "type": 1,
                        "bbox": [dbox.x0, dbox.y0, dbox.x1, dbox.y1],
                        "ext": "png",
                        "image": pix.tobytes("png")
                    })
                except Exception as exc:
                    logger.warning("failed to render diagram bbox %s: %s", dbox, exc)
                    
            blocks.sort(key=lambda x: x["bbox"][1])
            
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
        jobs.clear()  # release PNG bytes held in _PageJob list
        for future in as_completed(future_to_page_num):
            page_num = future_to_page_num[future]
            try:
                pages_by_num[page_num] = future.result()
            except Exception as exc:  # noqa: BLE001
                logger.warning("processing failed for page %d: %s", page_num, exc)
                pages_by_num[page_num] = []
            del future_to_page_num[future]  # release completed future's captured PNG bytes

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
        use_tesseract = cfg.tesseract_fallback and not job.has_images
        if use_tesseract:
            try:
                from scholarcli.ingest.ocr import ocr_page_tesseract_bytes
                ocr_text = ocr_page_tesseract_bytes(job.png_bytes)
            except Exception as exc:  # noqa: BLE001 — tesseract not installed or failed
                logger.warning("Tesseract failed p%d: %s — falling back to vision", job.page_num, exc)
                use_tesseract = False  # mark failed so vision handles it

        if not use_tesseract:  # vision model: primary for image-heavy pages, or Tesseract fallback
            from scholarcli.ingest.ocr import ocr_page_bytes
            ocr_text = ocr_page_bytes(job.png_bytes, cache_enabled=cfg.ocr_cache_enabled)

        if ocr_text.strip():
            pages.append(
                Page(job.page_num, title, job.heading, ocr_text.strip(), source_type="ocr")
            )
        return pages

    # --- Native text + inline images -----------------------------------------
    text_parts: list[str] = []
    bbox_union: list[float] | None = None

    from collections import Counter
    size_counts = Counter()
    for b in job.text_blocks:
        if b.get("type") == 0:
            for line in b.get("lines", []):
                for span in line.get("spans", []):
                    size_counts[span.get("size", 0)] += len(span.get("text", "").strip())
    base_size = size_counts.most_common(1)[0][0] if size_counts else 0

    for b_idx, b in enumerate(job.text_blocks):
        if b.get("type") == 0:  # text block
            block_lines = []
            for line in b.get("lines", []):
                line_text = ""
                max_size = 0
                for span in line.get("spans", []):
                    line_text += span.get("text", "")
                    sz = span.get("size", 0)
                    if sz > max_size and span.get("text", "").strip():
                        max_size = sz
                
                line_text_stripped = line_text.strip()
                if line_text_stripped:
                    if base_size > 0:
                        ratio = max_size / base_size
                        if ratio >= 1.4:
                            line_text = f"# {line_text_stripped}"
                        elif ratio >= 1.2:
                            line_text = f"## {line_text_stripped}"
                        elif ratio >= 1.1:
                            line_text = f"### {line_text_stripped}"
                        elif set(line_text_stripped) <= {"-", "=", "_"} and len(line_text_stripped) >= 3:
                            line_text = f"\\{line_text_stripped}"
                        else:
                            line_text = line_text_stripped
                    else:
                        line_text = line_text_stripped
                    block_lines.append(line_text)
            
            block_text = "\n".join(block_lines).strip()
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
        from scholarcli.ingest.tables import _summarize
        for md in job.table_markdowns:
            summary = _summarize(md)
            pages.append(
                Page(
                    job.page_num, title, job.heading,
                    text=summary if summary else md,
                    source_type="table",
                    original_payload=md,
                )
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


def _pdf_page_heading(page_dict: dict) -> str:
    """Heuristic: text of the block containing the largest font-size on the page."""
    blocks = page_dict.get("blocks", [])
    best_block_text = ""
    best_size = 0.0

    for b in blocks:
        if b.get("type") != 0:
            continue
        
        block_has_larger = False
        block_text_parts = []
        for line in b.get("lines", []):
            for span in line.get("spans", []):
                sz = span.get("size", 0)
                text = span.get("text", "").strip()
                if text:
                    block_text_parts.append(text)
                    if sz > best_size:
                        best_size = sz
                        block_has_larger = True
        
        if block_has_larger and block_text_parts:
            # Re-assemble the block text.
            best_block_text = " ".join(block_text_parts)

    # Sometimes a block might just be a giant number, but it's part of a chapter title.
    # Joining the block text fixes the "split heading" issue.
    return best_block_text


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
