# PYQ OCR Integration & Manual Edit UI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire OCR into PYQ text extraction so scanned PDFs work, and add PATCH/DELETE question endpoints with inline edit/delete UI.

**Architecture:** Backend-first — OCR added to `pyq_service._read_text` by opening PDFs with fitz directly and calling `ocr.ocr_page` for sparse pages. Edit endpoints added to the PYQ router using a new `PyqQuestionPatch` schema. Frontend adds two API methods, two store actions, and converts the question card into an inline-editable component.

**Tech Stack:** Python/FastAPI (backend), React/TypeScript + Zustand (frontend), PyMuPDF (fitz), pytest + FastAPI TestClient.

## Global Constraints

- Pydantic v2: use `model_dump(exclude_unset=True)` for partial updates, NOT `dict()`.
- All field names in Pydantic schemas use camelCase for frontend-facing responses.
- `PYQQuestion.qtype` maps to `type` in `PyqQuestionOut` and `PyqQuestionPatch` — apply field rename in the endpoint, not the model.
- The `_MAX_CHARS = 16000` cap in `pyq_service.py` must remain unchanged.
- Do not add OCR logic to `load_document` or `load_pdf` — only to `_read_text`.
- Frontend: no new Zustand store; use the existing `usePyqStore`.
- Frontend: wait for server response before updating local state (no optimistic updates).
- Run backend tests with: `pytest tests/ -v`
- Run frontend type-check with: `cd frontend && npx tsc --noEmit`

---

## File Map

| File | Change |
|------|--------|
| `scholarcli/api/pyq_service.py` | Split `_read_text` → add `_read_pdf_text` helper with per-page OCR fallback |
| `scholarcli/api/schemas.py` | Add `PyqQuestionPatch` after `PyqQuestionOut` |
| `scholarcli/api/routers/pyq.py` | Add `PATCH /api/pyq/questions/{id}` and `DELETE /api/pyq/questions/{id}` |
| `tests/test_pyq_ocr.py` | New: OCR fallback unit tests |
| `tests/test_pyq_edit.py` | New: PATCH + DELETE endpoint tests via TestClient |
| `frontend/src/app/lib/api.ts` | Add `patchPyqQuestion` and `deletePyqQuestion` |
| `frontend/src/app/stores/usePyqStore.ts` | Add `updateQuestion` and `deleteQuestion` actions |
| `frontend/src/app/pages/PyqAnalysis.tsx` | Add inline edit/delete to `QuestionExplorer` |

---

## Task 1: OCR fallback in `_read_text`

**Files:**
- Modify: `scholarcli/api/pyq_service.py`
- Create: `tests/test_pyq_ocr.py`

**Interfaces:**
- Produces: `_read_text(path: Path) -> str` — unchanged signature, new PDF branch calls `_read_pdf_text`
- Produces: `_read_pdf_text(path: Path) -> str` — internal helper, opens fitz, OCRs sparse pages

---

- [ ] **Step 1: Write the failing tests**

Create `tests/test_pyq_ocr.py`:

```python
"""Tests for pyq_service._read_text OCR fallback."""
from __future__ import annotations

from pathlib import Path
from unittest.mock import MagicMock, call, patch


def _make_mock_doc(pages_text: list[str]):
    """Return a mock fitz document whose pages yield the given texts."""
    mock_pages = []
    for text in pages_text:
        p = MagicMock()
        p.get_text.return_value = text
        mock_pages.append(p)

    doc = MagicMock()
    doc.__iter__ = MagicMock(return_value=iter(mock_pages))
    doc.close = MagicMock()
    return doc, mock_pages


def test_read_text_uses_ocr_for_sparse_page(tmp_path):
    """A page with < scanned_min_chars native text triggers ocr_page."""
    pdf = tmp_path / "scanned.pdf"
    pdf.write_bytes(b"%PDF-1.4 fake")

    doc, pages = _make_mock_doc(["   "])  # page has no text

    with patch("fitz.open", return_value=doc):
        with patch("scholarcli.ingest.ocr.ocr_page", return_value=("Q1. What is an OS?", None)) as mock_ocr:
            from scholarcli.api import pyq_service
            result = pyq_service._read_text(pdf)

    mock_ocr.assert_called_once_with(pages[0])
    assert "Q1. What is an OS?" in result


def test_read_text_skips_ocr_for_rich_page(tmp_path):
    """A page with enough native text does NOT call ocr_page."""
    pdf = tmp_path / "native.pdf"
    pdf.write_bytes(b"%PDF-1.4 fake")
    rich_text = "x" * 100  # well above scanned_min_chars default of 40

    doc, pages = _make_mock_doc([rich_text])

    with patch("fitz.open", return_value=doc):
        with patch("scholarcli.ingest.ocr.ocr_page") as mock_ocr:
            from scholarcli.api import pyq_service
            result = pyq_service._read_text(pdf)

    mock_ocr.assert_not_called()
    assert rich_text in result


def test_read_text_mixes_native_and_ocr(tmp_path):
    """Multi-page PDF: sparse pages OCR'd, rich pages use native text."""
    pdf = tmp_path / "mixed.pdf"
    pdf.write_bytes(b"%PDF-1.4 fake")

    doc, pages = _make_mock_doc(["x" * 100, "  "])  # page1 rich, page2 sparse

    with patch("fitz.open", return_value=doc):
        with patch("scholarcli.ingest.ocr.ocr_page", return_value=("OCR content", None)) as mock_ocr:
            from scholarcli.api import pyq_service
            result = pyq_service._read_text(pdf)

    mock_ocr.assert_called_once_with(pages[1])
    assert "x" * 100 in result
    assert "OCR content" in result


def test_read_text_non_pdf_unchanged(tmp_path):
    """Markdown files go through load_document, not fitz."""
    md = tmp_path / "paper.md"
    md.write_text("# Q1\nDefine deadlock.")

    with patch("scholarcli.ingest.ocr.ocr_page") as mock_ocr:
        from scholarcli.api import pyq_service
        result = pyq_service._read_text(md)

    mock_ocr.assert_not_called()
    assert "deadlock" in result
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_pyq_ocr.py -v
```

Expected: All 4 tests fail — `_read_text` doesn't have the OCR branch yet.

- [ ] **Step 3: Implement `_read_pdf_text` and update `_read_text`**

In `scholarcli/api/pyq_service.py`, add the `get_settings` import and the new helper. Find the existing imports block at the top of the file and add:

```python
from scholarcli.config import get_settings
```

Then replace the existing `_read_text` function (currently lines ~1586–1590):

```python
def _read_text(path: Path) -> str:
    """Load a document's plain text (joined pages) for extraction."""
    content_hash = hashlib.sha256(path.read_bytes()).hexdigest()
    pages, _ = load_document(path, content_hash)
    return "\n\n".join(p.text for p in pages).strip()
```

with:

```python
def _read_text(path: Path) -> str:
    """Load a document's plain text for extraction.

    PDFs use a direct fitz pass with per-page OCR fallback for sparse pages,
    bypassing the full ingest pipeline (which filters full-page background
    images and would miss typical scanned exam papers).
    """
    if path.suffix.lower() == ".pdf":
        return _read_pdf_text(path)
    content_hash = hashlib.sha256(path.read_bytes()).hexdigest()
    pages, _ = load_document(path, content_hash)
    return "\n\n".join(p.text for p in pages).strip()


def _read_pdf_text(path: Path) -> str:
    """Extract text from a PDF with per-page OCR for sparse pages."""
    import fitz
    from scholarcli.ingest import ocr as ocr_mod

    min_chars = get_settings().ingest.scanned_min_chars
    parts: list[str] = []
    doc = fitz.open(str(path))
    try:
        for page in doc:
            text = page.get_text("text").strip()
            if len(text) < min_chars:
                ocr_text, _ = ocr_mod.ocr_page(page)
                if ocr_text.strip():
                    parts.append(ocr_text.strip())
            else:
                parts.append(text)
    finally:
        doc.close()
    return "\n\n".join(parts)[:_MAX_CHARS]
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pytest tests/test_pyq_ocr.py -v
```

Expected: All 4 tests pass.

- [ ] **Step 5: Run the full test suite to check for regressions**

```bash
pytest tests/ -v
```

Expected: All existing tests still pass.

- [ ] **Step 6: Commit**

```bash
git add scholarcli/api/pyq_service.py tests/test_pyq_ocr.py
git commit -m "feat: add OCR fallback for scanned PYQ PDFs in _read_text"
```

---

## Task 2: PATCH + DELETE question endpoints

**Files:**
- Modify: `scholarcli/api/schemas.py:616` (after `PyqQuestionOut`)
- Modify: `scholarcli/api/routers/pyq.py`
- Create: `tests/test_pyq_edit.py`

**Interfaces:**
- Consumes: `PyqQuestionOut` (already defined in `schemas.py:616`)
- Produces: `PyqQuestionPatch` schema — `PATCH /api/pyq/questions/{id}` request body
- Produces: `PATCH /api/pyq/questions/{id}` → `PyqQuestionOut` (updated question)
- Produces: `DELETE /api/pyq/questions/{id}` → 204

---

- [ ] **Step 1: Write the failing tests**

Create `tests/test_pyq_edit.py`:

```python
"""Tests for PATCH and DELETE /api/pyq/questions/{id}."""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from scholarcli.api.app import app
from scholarcli.storage import get_session, init_db
from scholarcli.storage.models import PYQQuestion, QuestionPaper


@pytest.fixture
def client():
    init_db()
    with TestClient(app) as c:
        yield c


@pytest.fixture
def paper_with_question(client):
    """Insert a paper + one question into the test DB, return (paper_id, question_id)."""
    session = get_session()
    try:
        paper = QuestionPaper(
            course="TestCourse",
            title="Test Paper 2024",
            year=2024,
            source_document="test.pdf",
            question_count=1,
        )
        session.add(paper)
        session.flush()

        q = PYQQuestion(
            paper_id=paper.id,
            course="TestCourse",
            year=2024,
            text="Define deadlock.",
            topic="Deadlocks",
            subtopics=["Prevention"],
            difficulty="Easy",
            qtype="definition",
            marks=5,
        )
        session.add(q)
        session.commit()
        return paper.id, q.id
    finally:
        session.close()


def test_patch_question_updates_fields(client, paper_with_question):
    """PATCH with a partial body updates only the provided fields."""
    _, qid = paper_with_question

    resp = client.patch(
        f"/api/pyq/questions/{qid}",
        json={"topic": "OS Concepts", "difficulty": "Medium"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["topic"] == "OS Concepts"
    assert data["difficulty"] == "Medium"
    assert data["text"] == "Define deadlock."  # untouched


def test_patch_question_returns_404_for_missing(client):
    """PATCH on a non-existent question returns 404."""
    resp = client.patch("/api/pyq/questions/99999", json={"topic": "X"})
    assert resp.status_code == 404


def test_patch_question_clears_marks(client, paper_with_question):
    """PATCH can set marks to null to clear the value."""
    _, qid = paper_with_question

    resp = client.patch(f"/api/pyq/questions/{qid}", json={"marks": None})
    assert resp.status_code == 200
    assert resp.json()["marks"] is None


def test_delete_question_removes_row_and_decrements_count(client, paper_with_question):
    """DELETE removes the question and decrements the paper's question_count."""
    paper_id, qid = paper_with_question

    resp = client.delete(f"/api/pyq/questions/{qid}")
    assert resp.status_code == 204

    # Question is gone.
    session = get_session()
    try:
        assert session.get(PYQQuestion, qid) is None
        paper = session.get(QuestionPaper, paper_id)
        assert paper.question_count == 0
    finally:
        session.close()


def test_delete_question_returns_404_for_missing(client):
    """DELETE on a non-existent question returns 404."""
    resp = client.delete("/api/pyq/questions/99999")
    assert resp.status_code == 404
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_pyq_edit.py -v
```

Expected: All 5 tests fail — endpoints don't exist yet.

- [ ] **Step 3: Add `PyqQuestionPatch` to `schemas.py`**

In `scholarcli/api/schemas.py`, insert after `PyqQuestionOut` (after line 624):

```python
class PyqQuestionPatch(BaseModel):
    text: str | None = None
    topic: str | None = None
    subtopics: list[str] | None = None
    difficulty: Literal["Easy", "Medium", "Hard"] | None = None
    type: str | None = None  # maps to PYQQuestion.qtype
    marks: int | None = None
    year: int | None = None
```

`Literal` is already imported at the top of `schemas.py`.

- [ ] **Step 4: Add PATCH and DELETE endpoints to `routers/pyq.py`**

In `scholarcli/api/routers/pyq.py`, add the import for `PyqQuestionPatch` in the existing import block:

```python
from scholarcli.api.schemas import (
    PyqAnalysisOut,
    PyqDifferenceSuggestion,
    PyqPaperOut,
    PyqQuestionOut,
    PyqQuestionPatch,        # ← add this
    PyqUploadResponse,
)
```

Then append the two new endpoints at the bottom of `routers/pyq.py`:

```python
_QUESTION_FIELD_MAP = {"type": "qtype"}


@router.patch("/questions/{question_id}", response_model=PyqQuestionOut)
def patch_question(question_id: int, body: PyqQuestionPatch) -> PyqQuestionOut:
    session = get_session()
    try:
        q = session.get(PYQQuestion, question_id)
        if not q:
            raise HTTPException(status_code=404, detail="Question not found")
        for field, value in body.model_dump(exclude_unset=True).items():
            setattr(q, _QUESTION_FIELD_MAP.get(field, field), value)
        session.commit()
        session.refresh(q)
        return PyqQuestionOut(
            id=q.id,
            text=q.text,
            topic=q.topic,
            subtopics=q.subtopics or [],
            difficulty=q.difficulty,
            type=q.qtype,
            marks=q.marks,
            year=q.year,
        )
    finally:
        session.close()


@router.delete("/questions/{question_id}", status_code=204)
def delete_question(question_id: int) -> None:
    session = get_session()
    try:
        q = session.get(PYQQuestion, question_id)
        if not q:
            raise HTTPException(status_code=404, detail="Question not found")
        paper = session.get(QuestionPaper, q.paper_id)
        session.delete(q)
        if paper and paper.question_count > 0:
            paper.question_count -= 1
        session.commit()
    finally:
        session.close()
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
pytest tests/test_pyq_edit.py -v
```

Expected: All 5 tests pass.

- [ ] **Step 6: Run the full test suite**

```bash
pytest tests/ -v
```

Expected: All tests pass.

- [ ] **Step 7: Commit**

```bash
git add scholarcli/api/schemas.py scholarcli/api/routers/pyq.py tests/test_pyq_edit.py
git commit -m "feat: add PATCH and DELETE endpoints for PYQ questions"
```

---

## Task 3: Frontend API client + store actions

**Files:**
- Modify: `frontend/src/app/lib/api.ts`
- Modify: `frontend/src/app/stores/usePyqStore.ts`

**Interfaces:**
- Consumes: `PyqQuestion` interface (already in `api.ts:162`)
- Produces: `api.patchPyqQuestion(id, patch) → Promise<PyqQuestion>`
- Produces: `api.deletePyqQuestion(id) → Promise<void>`
- Produces: `usePyqStore.updateQuestion(id, patch) → Promise<void>`
- Produces: `usePyqStore.deleteQuestion(id) → Promise<void>`

---

- [ ] **Step 1: Add API methods to `api.ts`**

In `frontend/src/app/lib/api.ts`, find the PYQ section (around line 678) and add two methods after `getPyqDifferenceSuggestions`:

```typescript
  patchPyqQuestion(id: number, patch: Partial<Omit<PyqQuestion, "id">>): Promise<PyqQuestion> {
    return request<PyqQuestion>(`/api/pyq/questions/${id}`, { ...json(patch), method: "PATCH" });
  },
  deletePyqQuestion(id: number): Promise<void> {
    return request<void>(`/api/pyq/questions/${id}`, { method: "DELETE" });
  },
```

- [ ] **Step 2: Add store actions to `usePyqStore.ts`**

In `frontend/src/app/stores/usePyqStore.ts`, add two new actions to the `PyqState` interface and the store implementation.

In the `interface PyqState` block, add after `deletePaper`:

```typescript
  updateQuestion: (id: number, patch: Partial<Omit<import('../lib/api').PyqQuestion, 'id'>>) => Promise<void>;
  deleteQuestion: (id: number) => Promise<void>;
```

Since `PyqQuestion` is already imported at the top as `import { api, type PyqAnalysis, type PyqDifferenceSuggestion, type PyqPaper, type PyqQuestion } from "../lib/api";`, simplify the interface addition to:

```typescript
  updateQuestion: (id: number, patch: Partial<Omit<PyqQuestion, 'id'>>) => Promise<void>;
  deleteQuestion: (id: number) => Promise<void>;
```

In the `create<PyqState>((set, get) => ({...}))` object, add after the `deletePaper` implementation:

```typescript
  updateQuestion: async (id, patch) => {
    try {
      const updated = await api.patchPyqQuestion(id, patch);
      set((s) => ({ questions: s.questions.map((q) => (q.id === id ? updated : q)) }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update question");
    }
  },

  deleteQuestion: async (id) => {
    try {
      await api.deletePyqQuestion(id);
      set((s) => ({ questions: s.questions.filter((q) => q.id !== id) }));
      toast.success("Question removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete question");
    }
  },
```

- [ ] **Step 3: Type-check the frontend**

```bash
cd frontend && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/lib/api.ts frontend/src/app/stores/usePyqStore.ts
git commit -m "feat: add patchPyqQuestion/deletePyqQuestion to API client and store"
```

---

## Task 4: Inline edit/delete UI in `QuestionExplorer`

**Files:**
- Modify: `frontend/src/app/pages/PyqAnalysis.tsx`

**Interfaces:**
- Consumes: `usePyqStore.updateQuestion` and `usePyqStore.deleteQuestion` (from Task 3)
- Consumes: `PyqQuestion` (from `api.ts`)

---

- [ ] **Step 1: Add missing icon imports and `PyqQuestion` type to `PyqAnalysis.tsx`**

Find the existing lucide-react import block at the top of `PyqAnalysis.tsx` and add `Pencil`, `Save`, `X` (`Trash2` is already present):

```typescript
import {
  Upload,
  RefreshCw,
  GraduationCap,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Layers,
  ListChecks,
  NotebookPen,
  Search,
  AlertTriangle,
  Trash2,
  BookOpen,
  FileSearch,
  Columns2,
  Pencil,
  Save,
  X,
} from "lucide-react";
```

Also add `PyqQuestion` to the existing `api` import line. The current import is:
```typescript
import { api } from "../lib/api";
import type { PyqTopicFreq } from "../lib/api";
```

Change it to:
```typescript
import { api } from "../lib/api";
import type { PyqQuestion, PyqTopicFreq } from "../lib/api";
```

- [ ] **Step 2: Add `QuestionCard` component with inline edit/delete**

In `PyqAnalysis.tsx`, add the `QuestionCard` component immediately before the `QuestionExplorer` function definition (i.e., just before `function QuestionExplorer()`):

```typescript
const QTYPES = [
  "definition", "explanation", "comparison", "advantages", "architecture",
  "case_study", "numerical", "problem_solving", "short_answer", "long_answer", "other",
];

function QuestionCard({ q }: { q: PyqQuestion }) {
  const updateQuestion = usePyqStore((s) => s.updateQuestion);
  const deleteQuestion = usePyqStore((s) => s.deleteQuestion);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...q });

  const handleSave = async () => {
    await updateQuestion(q.id, {
      text: draft.text,
      topic: draft.topic,
      subtopics: draft.subtopics,
      difficulty: draft.difficulty,
      type: draft.type,
      marks: draft.marks,
      year: draft.year,
    });
    setEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Remove this question?")) {
      deleteQuestion(q.id);
    }
  };

  if (editing) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
        <textarea
          className="w-full rounded border border-border bg-background p-2 text-sm resize-none"
          rows={3}
          value={draft.text}
          onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}
        />
        <div className="flex flex-wrap gap-2">
          <input
            className="rounded border border-border bg-background px-2 py-1 text-xs w-36"
            placeholder="Topic"
            value={draft.topic}
            onChange={(e) => setDraft((d) => ({ ...d, topic: e.target.value }))}
          />
          <select
            className="rounded border border-border bg-background px-2 py-1 text-xs"
            value={draft.difficulty}
            onChange={(e) => setDraft((d) => ({ ...d, difficulty: e.target.value }))}
          >
            {["Easy", "Medium", "Hard"].map((v) => <option key={v}>{v}</option>)}
          </select>
          <select
            className="rounded border border-border bg-background px-2 py-1 text-xs"
            value={draft.type}
            onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}
          >
            {QTYPES.map((v) => <option key={v}>{v}</option>)}
          </select>
          <input
            className="rounded border border-border bg-background px-2 py-1 text-xs w-20"
            type="number"
            placeholder="Marks"
            value={draft.marks ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, marks: e.target.value ? Number(e.target.value) : null }))}
          />
          <input
            className="rounded border border-border bg-background px-2 py-1 text-xs w-20"
            type="number"
            placeholder="Year"
            value={draft.year ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, year: e.target.value ? Number(e.target.value) : null }))}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-1 rounded px-2 py-1 text-xs bg-primary text-primary-foreground hover:opacity-90"
            onClick={handleSave}
          >
            <Save className="size-3" /> Save
          </button>
          <button
            className="flex items-center gap-1 rounded px-2 py-1 text-xs border border-border hover:bg-muted"
            onClick={() => { setDraft({ ...q }); setEditing(false); }}
          >
            <X className="size-3" /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-lg border border-border p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm flex-1">{q.text}</p>
        <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Edit question"
            onClick={() => { setDraft({ ...q }); setEditing(true); }}
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-danger"
            title="Delete question"
            onClick={handleDelete}
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
        <Badge variant="outline">{q.topic}</Badge>
        {q.subtopics?.map((st) => <Badge key={st} variant="outline" className="text-violet">{st}</Badge>)}
        <Badge variant="secondary">{q.difficulty}</Badge>
        <Badge variant="outline">{q.type.replace(/_/g, " ")}</Badge>
        {q.marks != null && <Badge variant="outline">{q.marks} marks</Badge>}
        {q.year != null && <Badge variant="outline">{q.year}</Badge>}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update `QuestionExplorer` to use `QuestionCard`**

In the `QuestionExplorer` function, find the question rendering loop (around line 630):

```typescript
        {questions.map((q) => (
          <div key={q.id} className="rounded-lg border border-border p-3">
            <p className="text-sm">{q.text}</p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
              <Badge variant="outline">{q.topic}</Badge>
              {q.subtopics?.map((st) => <Badge key={st} variant="outline" className="text-violet">{st}</Badge>)}
              <Badge variant="secondary">{q.difficulty}</Badge>
              <Badge variant="outline">{q.type.replace(/_/g, " ")}</Badge>
              {q.marks != null && <Badge variant="outline">{q.marks} marks</Badge>}
              {q.year != null && <Badge variant="outline">{q.year}</Badge>}
            </div>
          </div>
        ))}
```

Replace it with:

```typescript
        {questions.map((q) => (
          <QuestionCard key={q.id} q={q} />
        ))}
```

- [ ] **Step 4: Type-check**

```bash
cd frontend && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/pages/PyqAnalysis.tsx
git commit -m "feat: add inline edit and delete to PYQ question cards"
```
