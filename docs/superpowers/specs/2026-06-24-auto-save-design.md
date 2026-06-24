# Auto-Save Draft Storage

**Date:** 2026-06-24
**Scope:** Notebooks and quiz/exam sessions
**Approach:** Thin backend (new columns + PATCH endpoints), thick frontend (debounce hook + restore banner)

---

## Problem

If a user is editing a notebook or mid-exam, closing the page loses all unsaved progress. No periodic or change-based save mechanism exists.

---

## Architecture

### Backend

#### Model changes (`scholarcli/storage/models.py`)

**Notebook** — add one column:
- `is_draft: bool = False` — `True` on auto-save, `False` on explicit save

**SavedQuiz** — add three columns:
- `session_answers: JSON | None = None` — `{question_index: chosen_answer}` map
- `session_current_question: int | None = None` — last question the user was on
- `session_started_at: datetime | None = None` — written by backend on first session PATCH

#### New endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `PATCH` | `/api/notebooks/{id}` | Partial update — accepts `{blocks, is_draft}` |
| `PATCH` | `/api/library/quizzes/{id}/session` | Save in-progress exam state `{session_answers, session_current_question}` |
| `DELETE` | `/api/library/quizzes/{id}/session` | Clear session on completion or discard |

Existing `GET` responses for notebooks and quizzes include the new fields so the frontend can determine draft/session status on load.

#### Schema additions (`scholarcli/api/schemas.py`)

- `NotebookUpdate` — extend with optional `is_draft: bool | None`
- `QuizSessionPatch` — new schema: `session_answers: dict`, `session_current_question: int`
- `NotebookOut` / `SavedQuizOut` — include new fields in responses

---

### Frontend

#### Shared hook: `useAutoSave(saveFn, delay = 2000)`

- On each call: clears previous timer, sets new `delay`ms timer
- On timer fire: calls `saveFn()`
- Returns `{ saving: bool, lastSaved: Date | null }` for UI feedback

#### Notebook editor

- On each block change → `autoSave({ blocks, is_draft: true })`
- Explicit save (if button exists) → PATCH with `is_draft: false`
- On mount: if `notebook.is_draft === true` → show informational banner:
  > "Auto-saved changes from your last session have been restored."
  > `[Got it]` — dismisses, PATCHes `is_draft: false`

#### Quiz page

- On each answer selection → `autoSave({ session_answers, session_current_question })`
- On mount: if `quiz.session_answers !== null` → show restore banner:
  > "You have an in-progress exam from [session_started_at]. Resume?"
  > `[Resume]` — populates answered questions in frontend state, dismisses
  > `[Start fresh]` — calls `DELETE /session`, clears local state, starts from question 0
- On quiz completion → calls `DELETE /session`

---

## Data Flow

```
user types/answers
    → useAutoSave resets 2s timer
    → timer fires → PATCH request sent
    → success: update lastSaved in UI ("Saved 3s ago")
    → failure: silent retry after 3s → if still failing, show subtle toast "Auto-save failed"
```

**On navigation away / page close:** if debounce timer is pending, flush immediately via `beforeunload` / router leave guard.

---

## Error Handling

- Auto-save failures are non-blocking — never interrupt the user
- One silent retry after 3s on failure; show toast only if retry also fails
- No optimistic rollback — the user's in-memory state is always ahead of the server

---

## Constraints & Non-Goals

- **Last write wins** — no multi-tab or multi-device conflict resolution (single-user app)
- **No version history** — only the latest auto-saved state is kept, no rollback to prior explicit save for notebooks
- **No new tables** — all state lives on existing models via new nullable columns
- **Migration** — new columns are nullable or have defaults; no data migration required for existing rows
