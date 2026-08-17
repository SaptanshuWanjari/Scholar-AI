"""Course export — serialize a course's artifacts into a portable markdown zip.

The markdown produced here must render in any CommonMark viewer (GitHub,
Obsidian, Typora) with no app-specific dependencies. Whiteboards are written
as SVG (from their cached thumbnail) plus raw .excalidraw JSON.
"""

from __future__ import annotations

import base64
import re
import urllib.parse


def _slug(name: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "-", (name or "").strip()).strip("-").lower()
    return s or "untitled"


def decode_svg_data_url(url: str | None) -> bytes | None:
    """Decode a whiteboard thumbnail data-URL into raw SVG bytes, or None."""
    if not url or not isinstance(url, str):
        return None
    if url.startswith("data:image/svg+xml;base64,"):
        try:
            return base64.b64decode(url.split(",", 1)[1])
        except Exception:
            return None
    if "data:image/svg" in url and "," in url:
        try:
            return urllib.parse.unquote(url.split(",", 1)[1]).encode("utf-8")
        except Exception:
            return None
    # Already raw SVG markup.
    if url.lstrip().startswith("<"):
        return url.encode("utf-8")
    return None


def block_to_markdown(block: dict, wb_slug_map: dict, image_assets: dict) -> str:
    """Render one notebook block to markdown.

    ``wb_slug_map`` maps whiteboard id (str/int) -> asset base slug (without
    extension) so whiteboard blocks can link the exported SVG/JSON.
    ``image_assets`` is a mutable dict {filename: bytes} the caller writes to
    the zip; image blocks with data-URLs register their bytes here.
    """
    btype = (block or {}).get("type")

    if btype == "heading":
        level = max(1, min(6, int(block.get("level", 2) or 2)))
        return f"{'#' * level} {block.get('text', '')}".strip()

    if btype == "text":
        return str(block.get("text", "")).strip()

    if btype == "callout":
        tone = str(block.get("tone", "note")).title()
        return f"> **{tone}:** {block.get('text', '')}".strip()

    if btype == "code":
        return f"```{block.get('lang', '')}\n{block.get('code', '')}\n```"

    if btype == "ai-answer":
        q = block.get("question", "")
        a = block.get("answer", "")
        meta = []
        if block.get("confidence") is not None:
            meta.append(f"confidence {block['confidence']}")
        if block.get("sources"):
            meta.append(f"{block['sources']} sources")
        meta_line = f"\n\n*{' · '.join(meta)}*" if meta else ""
        return f"**Q:** {q}\n\n**A:** {a}{meta_line}"

    if btype == "mermaid":
        return f"```mermaid\n{block.get('code', '')}\n```"

    if btype == "table":
        headers = [str(h) for h in (block.get("headers") or [])]
        rows = block.get("rows") or []
        lines = ["| " + " | ".join(headers) + " |",
                 "| " + " | ".join("---" for _ in headers) + " |"]
        for r in rows:
            if not isinstance(r, list):
                r = [r]
            cells = (list(r) + [""] * len(headers))[:len(headers)]
            lines.append("| " + " | ".join(str(c) for c in cells) + " |")
        return "\n".join(lines)

    if btype == "flashdeck":
        lines = [f"## {block.get('name', 'Flashcards')}"]
        for c in block.get("cards") or []:
            c = c or {}
            front = str(c.get("front", "")).strip()
            back = str(c.get("back", "")).strip()
            lines.append(f"- **{front}** — {back}".strip(" —"))
        return "\n".join(lines)

    if btype == "quiz-results":
        return f"**{block.get('title', 'Quiz')}** — {block.get('score', 0)}/{block.get('total', 0)}"

    if btype == "whiteboard":
        wb_id = str(block.get("whiteboardId", ""))
        title = block.get("title", "Whiteboard")
        slug = wb_slug_map.get(wb_id) or wb_slug_map.get(block.get("whiteboardId"))
        if slug:
            return (f"![{title}](../assets/{slug}.svg)\n\n"
                    f"[{title} (Excalidraw)](../assets/{slug}.excalidraw)")
        return f"*Whiteboard: {title}*"

    if btype == "image":
        alt = block.get("alt", "image")
        url = block.get("url", "")
        if isinstance(url, str) and url.startswith("data:"):
            fname, data = _save_data_url(url)
            if fname:
                image_assets[fname] = data
                return f"![{alt}](../assets/{fname})"
        return f"![{alt}]({url})"

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
    import hashlib
    name = f"image-{hashlib.sha256(data).hexdigest()[:12]}.{ext}"
    return name, data


def artifact_payload_to_markdown(key: str, payload: dict) -> str:
    """Render a learning-package / generative artifact payload to markdown."""
    data = payload or {}
    if key == "notes":
        return str(data.get("markdown", "")).strip()
    if key == "difference":
        return str(data.get("content", "")).strip()
    if key == "mindmap":
        text = str(data.get("text", "")).strip()
        return f"```text\n{text}\n```" if text else ""
    if key == "diagram":
        syntax = str(data.get("syntax", "")).strip()
        return f"```mermaid\n{syntax}\n```" if syntax else ""
    if key == "flashcards":
        lines = []
        for c in data.get("cards") or []:
            c = c or {}
            front = str(c.get("front", "")).strip()
            back = str(c.get("back", "")).strip()
            if front or back:
                lines.append(f"- **{front}** — {back}".strip(" —"))
        return "\n".join(lines)
    if key == "quiz":
        parts = []
        for i, q in enumerate(data.get("questions") or [], 1):
            q = q or {}
            prompt = str(q.get("prompt", "")).strip()
            block = [f"### Q{i}. {prompt}"]
            opts = q.get("options") or []
            if opts:
                block.append("\n".join(f"- {o}" for o in opts))
            answer = str(q.get("answer", "")).strip()
            if answer:
                block.append(f"\n**Answer:** {answer}")
            explanation = str(q.get("explanation", "")).strip()
            if explanation:
                block.append(f"\n*{explanation}*")
            parts.append("\n".join(block))
        return "\n\n".join(parts)
    return ""


from scholarai.storage.vectors import get_document_chunks

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
) -> str:
    """Render a document's indexed text with its annotations interleaved by page."""
    # Group annotations by page number.
    page_notes: dict[int, list[str]] = {}
    for bm in bookmarks or []:
        page = int(bm.get("page_number") or bm.get("page") or 1)
        note = bm.get("note") or ""
        section = bm.get("section") or ""
        page_notes.setdefault(page, []).append(f"> 🔖 {note} — {section}".strip(" —"))
    for n in notes or []:
        page = int(getattr(n, "page_number", 1))
        emoji, label = _CATEGORY_META.get(getattr(n, "category", "general"), _CATEGORY_META["general"])
        page_notes.setdefault(page, []).append(
            f"> [{emoji} {label}] {getattr(n, 'content', '')} — p.{page}"
        )
    for wb in region_whiteboards or []:
        page = int(getattr(wb, "page_number", 1) or 1)
        slug = wb_slug_map.get(str(getattr(wb, "id", "")))
        if slug:
            page_notes.setdefault(page, []).append(
                f"> 🎨 ![Annotation](../assets/{slug}.svg)"
            )

    # Map page -> highlight texts for best-effort ==..== wrapping.
    page_highlights: dict[int, list[str]] = {}
    for h in highlights or []:
        page = int(h.get("page_number") or 1)
        txt = str(h.get("text", "")).strip()
        if txt:
            page_highlights.setdefault(page, []).append(txt)

    chunks = get_document_chunks(doc.id) or []
    lines = [f"# {doc.title}", ""]
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
        raw = (ch.get("heading") or "").strip()
        heading = raw if raw.strip(" •\t\n\r-*.") else (current_heading or "")
        if heading and heading != current_heading:
            current_heading = heading
            lines.append(f"## {heading}")
            lines.append("")
        page = int(ch.get("page") or 1)
        emit_annotations(page)
        text = ch.get("text", "")
        for htext in page_highlights.get(page, []):
            if htext and htext in text:
                text = text.replace(htext, f"=={htext}==", 1)
        lines.append(text)
        lines.append("")

    # Any remaining annotations (e.g. on pages with no surviving chunk).
    emit_annotations(10**9)
    return "\n".join(lines).strip()


import io
import json
import zipfile

from scholarai.storage import get_session
from scholarai.storage.models import (
    Course, Deck, Diagram, DifferenceTable, Document, LearningPackage,
    LearningPath, Mindmap, Notebook, ReadingState, SavedQuiz, SavedRevision,
    StickyNote, Whiteboard,
)


class _ExportError(Exception):
    pass


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
    lines = [f"# {pkg.title}", "", str((pkg.overview or {}).get("markdown", "")).strip()]
    for key in ("notes", "flashcards", "quiz", "mindmap", "diagram", "difference"):
        payload = (pkg.artifacts or {}).get(key)
        if not payload:
            continue
        body = artifact_payload_to_markdown(key, payload)
        if body:
            lines += ["", f"## {key.title()}", "", body]
    return "\n".join(lines).strip()


def _path_md(lp) -> str:
    lines = [f"# {lp.title}", "", str((lp.overview or {}).get("markdown", "")).strip()]
    for stage in lp.stages or []:
        stage = stage or {}
        lines += ["", f"## {stage.get('title', 'Stage')}"]
        for concept in stage.get("concepts") or []:
            name = concept.get("name", "") if isinstance(concept, dict) else concept
            status = (concept.get("status") if isinstance(concept, dict) else None) or ""
            lines.append(f"- {name}" + (f" — {status}" if status else ""))
    return "\n".join(lines).strip()


def _whiteboard_assets(session, course_name: str) -> tuple[dict, dict[str, bytes]]:
    """Write every course whiteboard's .svg/.excalidraw bytes and return slug map."""
    slug_map: dict = {}
    assets: dict[str, bytes] = {}
    rows = session.query(Whiteboard).filter(Whiteboard.course == course_name, Whiteboard.is_deleted == False).all()
    for wb in rows:
        base = f"{_slug(wb.title)}-{wb.id}"
        slug_map[str(wb.id)] = base
        svg = decode_svg_data_url(wb.thumbnail)
        if svg:
            assets[f"assets/{base}.svg"] = svg
        assets[f"assets/{base}.excalidraw"] = json.dumps(
            wb.scene or {}, ensure_ascii=False, indent=2
        ).encode("utf-8")
    return slug_map, assets


def _notebook_md(nb, wb_slug_map: dict, image_assets: dict) -> str:
    parts = [f"# {nb.title}", ""]
    if nb.subtitle:
        parts += [f"*{nb.subtitle}*", ""]
    for block in nb.blocks or []:
        if isinstance(block, str):
            parts.append(block)
        elif isinstance(block, dict):
            parts.append(block_to_markdown(block, wb_slug_map, image_assets))
        parts.append("")
    return "\n".join(parts).strip()


def _notebook_files(session, course_name: str, wb_slug_map: dict, image_assets: dict) -> dict[str, str]:
    files: dict[str, str] = {}
    for nb in session.query(Notebook).filter(Notebook.course == course_name, Notebook.is_deleted == False, Notebook.is_draft == False).all():
        files[f"notebooks/{_slug(nb.title)}-{nb.id}.md"] = _notebook_md(nb, wb_slug_map, image_assets)
    return files


def _document_files(session, course: Course, wb_slug_map: dict) -> dict[str, str]:
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
            doc, highlights, bookmarks, notes, region_wbs, wb_slug_map
        )
    return files


def _readme(course_name: str, files: dict[str, str], slug_map: dict) -> str:
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
            lines.append(f"- {base.split('-')[0]} ([SVG](assets/{base}.svg), [Excalidraw](assets/{base}.excalidraw))")
    return "\n".join(lines).strip()


def build_course_zip(course_name: str) -> bytes:
    session = get_session()
    try:
        course = session.query(Course).filter(Course.name == course_name).first()
        if course is None:
            raise _ExportError("not_found")

        wb_slug_map, assets = _whiteboard_assets(session, course_name)
        image_assets: dict[str, bytes] = {}

        files = _notebook_files(session, course_name, wb_slug_map, image_assets)
        files.update(_document_files(session, course, wb_slug_map))
        files.update(_artifact_files(session, course_name))

        if not files and not assets:
            raise _ExportError("empty")

        root = _slug(course_name)
        buf = io.BytesIO()
        # ponytail: in-memory zip; if a course ever exceeds ~100MB, stream to a temp file.
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.writestr(f"{root}/README.md", _readme(course_name, files, wb_slug_map))
            for rel, content in files.items():
                zf.writestr(f"{root}/{rel}", content)
            for rel, data in assets.items():
                zf.writestr(f"{root}/{rel}", data)
            for rel, data in image_assets.items():
                zf.writestr(f"{root}/assets/{rel}", data)
        return buf.getvalue()
    finally:
        session.close()
