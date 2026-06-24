# PYQ: OCR Integration & Manual Edit UI

**Date:** 2026-06-24  
**Status:** Approved  
**Scope:** Fill two gaps identified in `reports/pyq_ingestion_and_generation.md`

---

## Problem

1. **Scanned PYQs fail silently.** When a user uploads a scanned (image-based) PDF as a PYQ, `pyq_service._read_text` returns near-empty text because `load_document` relies on native PDF text extraction. The LLM then finds nothing to extract and the whole upload fails with "Could not extract any questions."

2. **No recovery path for bad extractions.** The LLM sometimes misclassifies questions (wrong topic, wrong type, truncated text). There is no API or UI to fix individual questions after ingestion without re-uploading the whole paper.

---

## Approach: Option A — Minimal, surgical

Both changes are additive and independent. No shared abstractions are introduced beyond what already exists.

---

## Section 1: OCR Integration

### Files changed
- `scholarcli/api/pyq_service.py` — `_read_text()` only

### Logic

`_read_text` currently calls `load_document(path, content_hash)` and joins page texts. For PDFs, we add a per-page OCR fallback:

1. If `path.suffix.lower() != ".pdf"` → existing behaviour (join page texts, return).
2. If PDF: open with `fitz.open(path)`.
3. For each fitz page, extract native text. If `len(text.strip()) < settings.ingest.scanned_min_chars` (default 40), call `scholarcli.ingest.ocr.ocr_page(fitz_page)` and use the returned text instead.
4. Join all page texts (native + OCR-recovered), apply `_MAX_CHARS` cap, return.

The `vision_enabled` guard inside `ocr.ocr_page` means OCR is automatically skipped when the user has turned vision off in settings. No additional config is needed.

### Constraints
- `fitz` (PyMuPDF) is already a project dependency (used by the regular ingest pipeline).
- `ocr.ocr_page` signature: `(page: fitz.Page) -> tuple[str, float | None]` — we take index 0 (the text).
- The `_MAX_CHARS = 16000` cap is unchanged and applied after all pages are joined.

---

## Section 2: Manual Edit UI

### Files changed

**Backend:**
- `scholarcli/api/schemas.py` — add `PyqQuestionPatch`
- `scholarcli/api/routers/pyq.py` — add `PATCH /api/pyq/questions/{question_id}` and `DELETE /api/pyq/questions/{question_id}`

**Frontend:**
- `frontend/src/app/lib/api.ts` — add `patchPyqQuestion`, `deletePyqQuestion`
- `frontend/src/app/pages/PyqAnalysis.tsx` — inline edit row

### Backend schema

```python
class PyqQuestionPatch(BaseModel):
    text: str | None = None
    topic: str | None = None
    subtopics: list[str] | None = None
    difficulty: Literal["Easy", "Medium", "Hard"] | None = None
    qtype: str | None = None
    marks: int | None = None
    year: int | None = None
```

### Backend endpoints

**`PATCH /api/pyq/questions/{question_id}`**
- Loads `PYQQuestion` by id, 404 if missing.
- Applies only the fields present in the patch body (partial update).
- Commits and returns the updated `PyqQuestionOut`.

**`DELETE /api/pyq/questions/{question_id}`**
- Loads `PYQQuestion` by id, 404 if missing.
- Deletes the row and decrements `paper.question_count` to keep it consistent.
- Returns 204.

### Frontend UX

The questions table on the PYQ page gains two icon buttons per row:
- **Edit (pencil):** swaps the row into an inline form. All editable fields become inputs/selects. **Save** calls `PATCH`, **Cancel** reverts without a request.
- **Delete (trash):** shows a single `window.confirm` prompt, then calls `DELETE`. On success, removes the row from local state.

State management: no new Zustand store. The question list is already fetched and held in local component state. On successful save, the updated question replaces the old entry in the array. On delete, the entry is filtered out.

### Error handling
- `PATCH`/`DELETE` failures show a toast (same pattern used elsewhere in the frontend).
- Optimistic updates are not used — wait for server confirmation before mutating state, to avoid stale UI on transient errors.

---

## Out of scope

- Re-extracting an entire paper with OCR after the fact (would discard any manual edits).
- Bulk accept/reject pass after first extraction.
- Persisting OCR'd text to disk for re-use (future optimisation).
