# Persistence of Artifacts While Generation

## What's Done
- **In-Memory Sessions for Multi-Step Tasks**: The exam generation module (`exam.py`) successfully uses an in-memory dictionary (`_sessions`) to persist exam states (questions, topics) across the `generate`, `take`, and `submit` phases without cluttering the database with abandoned attempts.
- **Relational Models**: SQLAlchemy models are defined for all core artifacts (`Card`, `SavedQuiz`, `Deck`, `Diagram`, `Mindmap`) in `models.py`.

## What's Partial
- **Background Persistence**: Some artifacts (like Mindmaps and Diagrams) are saved to the database immediately upon generation in `study.py` (if they are grounded). However, Quizzes and Flashcards rely on explicit client calls to `/library` endpoints to be saved.
- **Draft States**: There is no persistence for "draft" artifacts if the generation process is interrupted mid-stream.

## What's Missing
- **Redis / External Cache**: In-memory dictionaries (`_sessions`) will reset if the Fastapi server restarts. A Redis or Memcached backend is missing for durable session state management during multi-step generation.
