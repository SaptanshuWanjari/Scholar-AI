# Saving of Generated Artifacts

## What's Done
- **Selective Auto-Saving**: Generated Mindmaps and Diagrams are automatically persisted to the database inside their respective `POST` generation handlers (`scholarcli/api/routers/study.py`) if they are deemed "grounded" by the LLM.
- **Explicit Saving for Library Items**: Quizzes and Decks (Flashcards) are saved explicitly via dedicated routes (`POST /api/library/decks` and `POST /api/library/quizzes`) in `library.py`, allowing the user to review the generated content on the frontend before committing it to storage.

## What's Partial
- **Quality Scoring Integration**: Artifacts are assigned a quality score upon generation, which is saved alongside the artifact in the database. However, there may not be robust cleanup or filtering mechanisms to discard low-quality artifacts later.
- **Version Control**: While documents have a `version` field, generated artifacts like decks and quizzes do not have built-in versioning if the user modifies them.

## What's Missing
- **Auto-Save Drafts**: If a user is taking an exam or editing a notebook, there is no periodic auto-save mechanism implemented on the backend.
- **Bulk Export**: No API endpoint exists to export all saved artifacts for offline backup (e.g., to a zip archive or JSON dump).
