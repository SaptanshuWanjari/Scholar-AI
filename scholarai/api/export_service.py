"""Course export — serialize a course's artifacts into a portable markdown zip.

The markdown produced here must render in any CommonMark viewer (GitHub,
Obsidian, Typora) with no app-specific dependencies. Whiteboards are written
as SVG (from their cached thumbnail) plus raw .excalidraw JSON.
"""

from __future__ import annotations

import base64
import hashlib
import io
import json
import re
import urllib.parse
import zipfile

from scholarai.storage import get_session
from scholarai.storage.models import (
    Course, Deck, Diagram, DifferenceTable, Document, LearningPackage,
    LearningPath, Mindmap, Notebook, ReadingState, SavedQuiz, SavedRevision,
    StickyNote, Whiteboard,
)
from scholarai.storage.vectors import get_document_chunks


def _slug(name: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "-", (name or "").strip()).strip("-").lower()
    return s or "untitled"


def _safe_int(value, default: int = 1) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _text(value) -> str:
    return str(value) if value else ""


def decode_svg_data_url(url: str | None) -> bytes | None:
    """Decode a whiteboard thumbnail data-URL into raw SVG bytes, or None."""
    if not url or not isinstance(url, str):
        return None
    if url.lstrip().startswith("<"):
        return url.encode("utf-8")
    if "," not in url:
        return None
    header, payload = url.split(",", 1)
    try:
        if ";base64" in header:
            return base64.b64decode(payload)
        return urllib.parse.unquote(payload).encode("utf-8")
    except Exception:
        return None


def block_to_markdown(
    block: dict, wb_slug_map: dict, image_assets: dict, svg_bases: set | None = None
) -> str:
    """Render one notebook block to markdown.

    ``wb_slug_map`` maps whiteboard id (str) -> asset base slug (no extension).
    ``svg_bases`` is the set of bases that have a real SVG asset; whiteboards
    outside it fall back to an Excalidraw link only.
    ``image_assets`` is a mutable dict {filename: bytes} the caller writes to
    the zip; image blocks with data-URLs register their bytes here.
    """
    btype = (block or {}).get("type")
    svg_bases = svg_bases or set()

    if btype == "heading":
        level = max(1, min(6, _safe_int(block.get("level"), 2)))
        return f"{'#' * level} {_text(block.get('text'))}".strip()

    if btype == "text":
        return _text(block.get("text")).strip()

    if btype == "callout":
        tone = _text(block.get("tone")) or "note"
        return f"> **{tone.title()}:** {_text(block.get('text'))}".strip()

    if btype == "code":
        return f"```{_text(block.get('lang'))}\n{_text(block.get('code'))}\n```"

    if btype == "ai-answer":
        q = _text(block.get("question"))
        a = _text(block.get("answer"))
        meta = []
        if block.get("confidence") is not None:
            meta.append(f"confidence {block['confidence']}")
        if block.get("sources"):
            meta.append(f"{block['sources']} sources")
        meta_line = f"\n\n*{' · '.join(meta)}*" if meta else ""
        return f"**Q:** {q}\n\n**A:** {a}{meta_line}"

    if btype == "mermaid":
        return f"```mermaid\n{_text(block.get('code'))}\n```"

    if btype == "table":
        headers = [_text(h) for h in (block.get("headers") or [])]
        rows = block.get("rows") or []
        lines = ["| " + " | ".join(headers) + " |",
                 "| " + " | ".join("---" for _ in headers) + " |"]
        for r in rows:
            if not isinstance(r, list):
                r = [r]
            cells = (list(r) + [""] * len(headers))[:len(headers)]
            lines.append("| " + " | ".join(_text(c) for c in cells) + " |")
        return "\n".join(lines)

    if btype == "flashdeck":
        lines = [f"## {_text(block.get('name')) or 'Flashcards'}"]
        for c in block.get("cards") or []:
            c = c or {}
            front = _text(c.get("front")).strip()
            back = _text(c.get("back")).strip()
            lines.append(f"- **{front}**" + (f" — {back}" if back else ""))
        return "\n".join(lines)

    if btype == "quiz-results":
        return (f"**{_text(block.get('title')) or 'Quiz'}** — "
                f"{block.get('score', 0)}/{block.get('total', 0)}")

    if btype == "whiteboard":
        title = _text(block.get("title")) or "Whiteboard"
        slug = wb_slug_map.get(str(block.get("whiteboardId", "")))
        if not slug:
            return f"*Whiteboard: {title}*"
        if slug in svg_bases:
            return (f"![{title}](../assets/{slug}.svg)\n\n"
                    f"[{title} (Excalidraw)](../assets/{slug}.excalidraw)")
        return f"[{title} (Excalidraw)](../assets/{slug}.excalidraw)"

    if btype == "image":
        alt = _text(block.get("alt")) or "image"
        url = block.get("url")
        if isinstance(url, str) and url.startswith("data:"):
            fname, data = _save_data_url(url)
            if fname:
                image_assets[fname] = data
                return f"![{alt}](../assets/{fname})"
        return f"![{alt}]({_text(url)})"

    # Unknown/legacy block — best-effort text.
    for fld in ("text", "content", "markdown", "value"):
        val = block.get(fld)
        if isinstance(val, str) and val.strip():
            return val.strip()
    return ""


def _save_data_url(url: str) -> tuple[str | None, bytes | None]:
    """Split a data URL into (filename, bytes). Returns (None, None) on failure."""
    if "," not in url:
        return None, None
    header, payload = url.split(",", 1)
    ext = "bin"
    if "image/png" in header:
        ext = "png"
    elif "image/jpeg" in header or "image/jpg" in header:
        ext = "jpg"
    elif "image/svg" in header:
        ext = "svg"
    elif "image/gif" in header:
        ext = "gif"
    try:
        if ";base64" in header:
            data = base64.b64decode(payload)
        else:
            data = urllib.parse.unquote(payload).encode("utf-8")
    except Exception:
        return None, None
    name = f"image-{hashlib.sha256(data).hexdigest()[:12]}.{ext}"
    return name, data


def artifact_payload_to_markdown(key: str, payload: dict) -> str:
    """Render a learning-package / generative artifact payload to markdown."""
    data = payload or {}
    if key == "notes":
        return _text(data.get("markdown")).strip()
    if key == "difference":
        return _text(data.get("content")).strip()
    if key == "mindmap":
        text = _text(data.get("text")).strip()
        return f"```text\n{text}\n```" if text else ""
    if key == "diagram":
        syntax = _text(data.get("syntax")).strip()
        return f"```mermaid\n{syntax}\n```" if syntax else ""
    if key == "flashcards":
        lines = []
        for c in data.get("cards") or []:
            c = c or {}
            front = _text(c.get("front")).strip()
            back = _text(c.get("back")).strip()
            if front or back:
                lines.append(f"- **{front}**" + (f" — {back}" if back else ""))
        return "\n".join(lines)
    if key == "quiz":
        parts = []
        for i, q in enumerate(data.get("questions") or [], 1):
            q = q or {}
            prompt = _text(q.get("prompt")).strip()
            block = [f"### Q{i}. {prompt}"]
            opts = q.get("options") or []
            if opts:
                block.append("\n".join(f"- {_text(o)}" for o in opts))
            answer = _text(q.get("answer")).strip()
            if answer:
                block.append(f"\n**Answer:** {answer}")
            explanation = _text(q.get("explanation")).strip()
            if explanation:
                block.append(f"\n*{explanation}*")
            parts.append("\n".join(block))
        return "\n\n".join(parts)
    return ""


_CATEGORY_META = {
    "insight": ("💡", "Insight"),
    "question": ("❓", "Question"),
    "formula": ("∑", "Formula"),
    "confusing": ("⚠️", "Confusing"),
    "general": ("📝", "General"),
}


def document_to_markdown(
    doc,
    highlights: list[dict],
    bookmarks: list[dict],
    notes: list,
    region_whiteboards: list,
    wb_slug_map: dict,
    svg_bases: set | None = None,
) -> str:
    """Render a document's indexed text with its annotations interleaved by page."""
    svg_bases = svg_bases or set()
    # Group annotations by page number.
    page_notes: dict[int, list[str]] = {}
    for bm in bookmarks or []:
        page = _safe_int(bm.get("page_number") or bm.get("page"))
        note = _text(bm.get("note"))
        section = _text(bm.get("section"))
        page_notes.setdefault(page, []).append(
            f"> 🔖 {note}" + (f" — {section}" if section else "")
        )
    for n in notes or []:
        page = _safe_int(getattr(n, "page_number", None))
        emoji, label = _CATEGORY_META.get(getattr(n, "category", "general"), _CATEGORY_META["general"])
        page_notes.setdefault(page, []).append(
            f"> [{emoji} {label}] {_text(getattr(n, 'content', ''))} — p.{page}"
        )
    for wb in region_whiteboards or []:
        page = _safe_int(getattr(wb, "page_number", None))
        slug = wb_slug_map.get(str(getattr(wb, "id", "")))
        if slug:
            if slug in svg_bases:
                page_notes.setdefault(page, []).append(
                    f"> 🎨 ![Annotation](../assets/{slug}.svg)"
                )
            else:
                page_notes.setdefault(page, []).append(
                    f"> 🎨 [Annotation drawing](../assets/{slug}.excalidraw)"
                )

    # Map page -> highlight texts for best-effort <mark>..</mark> wrapping.
    page_highlights: dict[int, list[str]] = {}
    for h in highlights or []:
        page = _safe_int(h.get("page_number"))
        txt = _text(h.get("text")).strip()
        if txt:
            page_highlights.setdefault(page, []).append(txt)

    chunks = get_document_chunks(doc.id) or []
    lines = [f"# {_text(doc.title)}", ""]
    current_heading: str | None = None
    emitted_pages: set[int] = set()

    def emit_annotations(upto_page: int) -> None:
        for p in sorted(page_notes):
            if p <= upto_page and p not in emitted_pages:
                lines.extend(["", *page_notes[p], ""])
                emitted_pages.add(p)

    for ch in chunks:
        if ch.get("source_type") in ("image", "diagram"):
            continue
        raw = _text(ch.get("heading")).strip()
        heading = raw if raw.strip(" •\t\n\r-*.") else (current_heading or "")
        if heading and heading != current_heading:
            current_heading = heading
            lines.append(f"## {heading}")
            lines.append("")
        page = _safe_int(ch.get("page"))
        emit_annotations(page)
        text = _text(ch.get("text"))
        for htext in page_highlights.get(page, []):
            if htext and htext in text:
                text = text.replace(htext, f"<mark>{htext}</mark>", 1)
        lines.append(text)
        lines.append("")

    # Any remaining annotations (e.g. on pages with no surviving chunk).
    emit_annotations(10**9)
    return "\n".join(lines).strip()


class _ExportError(Exception):
    def __init__(self, kind: str):
        super().__init__(kind)
        self.kind = kind


def _artifact_files(session, course_name: str) -> dict[str, str]:
    """Map relative zip paths -> markdown content for non-notebook artifacts."""
    files: dict[str, str] = {}

    for row in session.query(Diagram).filter(Diagram.course == course_name, Diagram.is_deleted == False).all():
        body = artifact_payload_to_markdown("diagram", {"syntax": row.syntax})
        files[f"diagrams/{_slug(row.title)}-{row.id}.md"] = f"# {row.title}\n\n{body}".strip()

    for row in session.query(Mindmap).filter(Mindmap.course == course_name, Mindmap.is_deleted == False).all():
        body = artifact_payload_to_markdown("mindmap", {"text": row.text})
        files[f"mindmaps/{_slug(row.title)}-{row.id}.md"] = f"# {row.title}\n\n{body}".strip()

    for row in session.query(DifferenceTable).filter(DifferenceTable.course == course_name, DifferenceTable.is_deleted == False).all():
        files[f"difference-tables/{_slug(row.title)}-{row.id}.md"] = f"# {row.title}\n\n{row.content}".strip()

    for row in session.query(Deck).filter(Deck.course == course_name, Deck.is_deleted == False).all():
        body = artifact_payload_to_markdown(
            "flashcards", {"cards": [{"front": c.front, "back": c.back} for c in row.cards]}
        )
        files[f"flashcards/{_slug(row.name)}-{row.id}.md"] = f"# {row.name}\n\n{body}".strip()

    for row in session.query(SavedQuiz).filter(SavedQuiz.course == course_name, SavedQuiz.is_deleted == False).all():
        body = artifact_payload_to_markdown("quiz", {"questions": row.questions or []})
        files[f"quizzes/{_slug(row.title)}-{row.id}.md"] = f"# {row.title}\n\n{body}".strip()

    for row in session.query(SavedRevision).filter(SavedRevision.course == course_name, SavedRevision.is_deleted == False).all():
        files[f"revisions/{_slug(row.title)}-{row.id}.md"] = f"# {row.title}\n\n{row.content}".strip()

    for row in session.query(LearningPackage).filter(LearningPackage.course == course_name, LearningPackage.is_deleted == False).all():
        files[f"learning-packages/{_slug(row.title)}-{row.id}.md"] = _package_md(row)

    for row in session.query(LearningPath).filter(LearningPath.course == course_name, LearningPath.is_deleted == False).all():
        files[f"learning-paths/{_slug(row.title)}-{row.id}.md"] = _path_md(row)

    return files


def _package_md(pkg) -> str:
    lines = [f"# {pkg.title}", "", _text((pkg.overview or {}).get("markdown")).strip()]
    for key in ("notes", "flashcards", "quiz", "mindmap", "diagram", "difference"):
        payload = (pkg.artifacts or {}).get(key)
        if not payload:
            continue
        body = artifact_payload_to_markdown(key, payload)
        if body:
            lines += ["", f"## {key.title()}", "", body]
    return "\n".join(lines).strip()


def _path_md(lp) -> str:
    lines = [f"# {lp.title}", "", _text((lp.overview or {}).get("markdown")).strip()]
    for stage in lp.stages or []:
        stage = stage or {}
        lines += ["", f"## {_text(stage.get('title')) or 'Stage'}"]
        for concept in stage.get("concepts") or []:
            name = concept.get("name", "") if isinstance(concept, dict) else concept
            status = (concept.get("status") if isinstance(concept, dict) else None) or ""
            lines.append(f"- {_text(name)}" + (f" — {_text(status)}" if status else ""))
    return "\n".join(lines).strip()


def _whiteboard_assets(session, course_name: str) -> tuple[dict, dict[str, bytes], set]:
    """Write every course whiteboard's .svg/.excalidraw bytes.

    Returns ``(slug_map, assets, svg_bases)`` where ``slug_map`` maps id -> base
    slug and ``svg_bases`` is the set of bases that actually have an SVG.
    """
    slug_map: dict = {}
    assets: dict[str, bytes] = {}
    svg_bases: set[str] = set()
    rows = session.query(Whiteboard).filter(Whiteboard.course == course_name, Whiteboard.is_deleted == False).all()
    for wb in rows:
        base = f"{_slug(wb.title)}-{wb.id}"
        slug_map[str(wb.id)] = base
        svg = decode_svg_data_url(wb.thumbnail)
        if svg:
            assets[f"assets/{base}.svg"] = svg
            svg_bases.add(base)
        assets[f"assets/{base}.excalidraw"] = json.dumps(
            wb.scene or {}, ensure_ascii=False, indent=2
        ).encode("utf-8")
    return slug_map, assets, svg_bases


def _notebook_md(nb, wb_slug_map: dict, image_assets: dict, svg_bases: set) -> str:
    parts = [f"# {nb.title}", ""]
    if nb.subtitle:
        parts += [f"*{nb.subtitle}*", ""]
    for block in nb.blocks or []:
        if isinstance(block, str):
            parts.append(block)
        elif isinstance(block, dict):
            parts.append(block_to_markdown(block, wb_slug_map, image_assets, svg_bases))
        parts.append("")
    return "\n".join(parts).strip()


def _notebook_files(session, course_name: str, wb_slug_map: dict, image_assets: dict, svg_bases: set) -> dict[str, str]:
    files: dict[str, str] = {}
    for nb in session.query(Notebook).filter(Notebook.course == course_name, Notebook.is_deleted == False, Notebook.is_draft == False).all():
        files[f"notebooks/{_slug(nb.title)}-{nb.id}.md"] = _notebook_md(nb, wb_slug_map, image_assets, svg_bases)
    return files


def _document_files(session, course: Course, wb_slug_map: dict, svg_bases: set) -> dict[str, str]:
    files: dict[str, str] = {}
    for doc in course.documents:
        if doc.is_deleted:
            continue
        state = session.query(ReadingState).filter(ReadingState.document_id == doc.id).first()
        highlights = (state.highlights if state else []) or []
        bookmarks = (state.bookmarks if state else []) or []
        notes = session.query(StickyNote).filter(StickyNote.document_id == doc.id).all()
        region_wbs = (
            session.query(Whiteboard)
            .filter(Whiteboard.document_id == doc.id, Whiteboard.source == "annotation", Whiteboard.is_deleted == False)
            .all()
        )
        files[f"documents/{_slug(doc.title)}-{doc.id}.md"] = document_to_markdown(
            doc, highlights, bookmarks, notes, region_wbs, wb_slug_map, svg_bases
        )
    return files


def _readme(course_name: str, files: dict[str, str], slug_map: dict, svg_bases: set) -> str:
    lines = [f"# {course_name}", "", "Exported from ScholarAI.", ""]
    by_dir: dict[str, list[str]] = {}
    for path in sorted(files):
        d = path.split("/", 1)[0]
        by_dir.setdefault(d, []).append(path)
    for d, paths in by_dir.items():
        lines += [f"## {d.title().replace('-', ' ')}", ""]
        for p in paths:
            title = p.rsplit("/", 1)[-1].rsplit("-", 1)[0].replace("-", " ")
            lines.append(f"- [{title}]({p})")
        lines.append("")
    if slug_map:
        lines += ["## Whiteboards", ""]
        for base in sorted(set(slug_map.values())):
            title = base.rsplit("-", 1)[0].replace("-", " ")
            if base in svg_bases:
                lines.append(f"- {title} ([SVG](assets/{base}.svg), [Excalidraw](assets/{base}.excalidraw))")
            else:
                lines.append(f"- {title} ([Excalidraw](assets/{base}.excalidraw))")
    return "\n".join(lines).strip()


def build_course_zip(course_name: str) -> bytes:
    session = get_session()
    try:
        course = session.query(Course).filter(Course.name == course_name).first()
        if course is None:
            raise _ExportError("not_found")

        wb_slug_map, assets, svg_bases = _whiteboard_assets(session, course_name)
        image_assets: dict[str, bytes] = {}

        files = _notebook_files(session, course_name, wb_slug_map, image_assets, svg_bases)
        files.update(_document_files(session, course, wb_slug_map, svg_bases))
        files.update(_artifact_files(session, course_name))

        if not files and not assets:
            raise _ExportError("empty")

        root = _slug(course_name)
        buf = io.BytesIO()
        # ponytail: in-memory zip; if a course ever exceeds ~100MB, stream to a temp file.
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.writestr(f"{root}/README.md", _readme(course_name, files, wb_slug_map, svg_bases))
            for rel, content in files.items():
                zf.writestr(f"{root}/{rel}", content)
            for rel, data in assets.items():
                zf.writestr(f"{root}/{rel}", data)
            for rel, data in image_assets.items():
                zf.writestr(f"{root}/assets/{rel}", data)
        return buf.getvalue()
    finally:
        session.close()
