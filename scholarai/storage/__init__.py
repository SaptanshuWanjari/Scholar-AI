"""SQLAlchemy engine + session factory.

Uses the ``settings.db_path`` (``data/scholar.db``) by default.
"""

from __future__ import annotations

from typing import Generator

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker

from scholarai.config import get_settings

_engine: Engine | None = None
_session_factory: sessionmaker[Session] | None = None


def get_engine() -> Engine:
    global _engine
    if _engine is None:
        s = get_settings()
        _engine = create_engine(f"sqlite:///{s.db_path}", echo=False)
    return _engine


def get_session() -> Session:
    global _session_factory
    if _session_factory is None:
        _session_factory = sessionmaker(bind=get_engine())
    return _session_factory()


def get_db() -> Generator[Session, None, None]:
    session = get_session()
    try:
        yield session
    finally:
        session.close()


def reset_engine() -> None:
    """Drop the cached engine + session factory (used in tests)."""
    global _engine, _session_factory
    if _engine is not None:
        _engine.dispose()
    _engine = None
    _session_factory = None


def init_db() -> None:
    """Create all tables if they don't exist (safe to call any time)."""
    from scholarai.storage.models import Base

    Base.metadata.create_all(bind=get_engine())
    _ensure_columns()


# Columns added after the initial schema. SQLite supports ADD COLUMN, so we
# patch older databases in place rather than requiring a migration framework.
# Column renames (old_name -> new_name) when a column was renamed in the model.
_RENAMED_COLUMNS: dict[str, dict[str, str]] = {
    "diagrams": {"mermaid": "syntax"},
}


_ADDED_COLUMNS: dict[str, list[tuple[str, str]]] = {
    "courses": [
        ("system_prompt", "TEXT"),
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("deleted_at", "TEXT"),
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
    ],
    "documents": [
        ("size_kb", "INTEGER NOT NULL DEFAULT 0"),
        ("pages", "INTEGER NOT NULL DEFAULT 0"),
        ("status", "VARCHAR(16) NOT NULL DEFAULT 'indexed'"),
        ("error", "TEXT"),
        ("summary", "TEXT"),
        ("tags", "JSON"),
        ("topics", "JSON"),
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("deleted_at", "TEXT"),
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
    ],
    "notebooks": [
        ("tags", "JSON"),
        ("is_draft", "INTEGER NOT NULL DEFAULT 0"),
        ("last_opened_at", "DATETIME DEFAULT '2025-01-01 00:00:00'"),
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("deleted_at", "TEXT"),
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
    ],
    "cards": [
        ("interval", "INTEGER NOT NULL DEFAULT 0"),
        ("sm2_ease", "FLOAT NOT NULL DEFAULT 2.5"),
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("deleted_at", "TEXT"),
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
    ],
    "pyq_questions": [
        ("subtopics", "JSON"),
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("deleted_at", "TEXT"),
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
    ],
    # Concept Dependency Engine — link signal rows to dep_concepts.id.
    "topic_stats": [("concept_id", "INTEGER")],
    "revisions": [
        ("concept_id", "INTEGER"),
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("deleted_at", "TEXT"),
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
    ],
    "learning_packages": [
        ("concept_id", "INTEGER"),
        ("notebook_id", "INTEGER"),
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("deleted_at", "TEXT"),
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
    ],
    # Artifact quality scores (api/quality.py), added per artifact table.
    "decks": [
        ("quality_score", "JSON"),
        ("concept_id", "INTEGER"),
        ("source", "VARCHAR(256)"),
        ("last_opened_at", "DATETIME DEFAULT '2025-01-01 00:00:00'"),
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("deleted_at", "TEXT"),
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
    ],
    "quizzes": [
        ("quality_score", "JSON"),
        ("session_answers", "JSON"),
        ("session_current_question", "INTEGER"),
        ("session_started_at", "TEXT"),
        ("source", "VARCHAR(256)"),
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("deleted_at", "TEXT"),
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
    ],
    "diagrams": [
        ("quality_score", "JSON"),
        ("last_opened_at", "DATETIME DEFAULT '2025-01-01 00:00:00'"),
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("deleted_at", "TEXT"),
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
    ],
    "mindmaps": [
        ("quality_score", "JSON"),
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("deleted_at", "TEXT"),
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
    ],
    "difference_tables": [
        ("quality_score", "JSON"),
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("deleted_at", "TEXT"),
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
    ],
    "prompts": [
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("deleted_at", "TEXT"),
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
    ],
    "whiteboards": [
        ("deleted_at", "TEXT"),
        ("document_id", "INTEGER"),
        ("page_number", "INTEGER"),
        ("last_opened_at", "DATETIME DEFAULT '2025-01-01 00:00:00'"),
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
    ],
    "learning_paths": [
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("deleted_at", "TEXT"),
    ],
    "question_papers": [
        ("is_deleted", "BOOLEAN NOT NULL DEFAULT 0"),
        ("deleted_at", "TEXT"),
        ("archived", "BOOLEAN NOT NULL DEFAULT 0"),
    ],
    "exam_sessions": [
        ("duration_minutes", "INTEGER NOT NULL DEFAULT 0"),
        ("expires_at", "TEXT"),
    ],
    "provider_configs": [
        ("base_url", "TEXT"),
    ],
}


def _ensure_columns() -> None:
    """Add any newly-introduced columns to existing tables (idempotent).

    All ALTER TABLE statements run inside a single transaction via
    ``engine.begin()`` — SQLite supports transactional DDL, so any
    failure rolls back every ALTER in the loop, keeping the schema
    consistent.
    """
    from sqlalchemy import inspect, text

    engine = get_engine()
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())
    with engine.begin() as conn:
        for table, renames in _RENAMED_COLUMNS.items():
            if table not in existing_tables:
                continue
            present = {c["name"] for c in inspector.get_columns(table)}
            for old_name, new_name in renames.items():
                if old_name in present and new_name not in present:
                    conn.execute(text(f"ALTER TABLE {table} RENAME COLUMN {old_name} TO {new_name}"))
        for table, cols in _ADDED_COLUMNS.items():
            if table not in existing_tables:
                continue
            present = {c["name"] for c in inspector.get_columns(table)}
            for name, ddl in cols:
                if name not in present:
                    try:
                        conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {ddl}"))
                    except Exception:
                        import logging
                        logging.getLogger(__name__).exception(
                            "ALTER TABLE %s ADD COLUMN %s failed", table, name
                        )
                        raise
