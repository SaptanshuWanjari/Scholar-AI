"""SQLAlchemy engine + session factory.

Uses the ``settings.db_path`` (``data/scholar.db``) by default.
"""

from __future__ import annotations

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker

from scholarcli.config import get_settings

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


def reset_engine() -> None:
    """Drop the cached engine + session factory (used in tests)."""
    global _engine, _session_factory
    if _engine is not None:
        _engine.dispose()
    _engine = None
    _session_factory = None


def init_db() -> None:
    """Create all tables if they don't exist (safe to call any time)."""
    from scholarcli.storage.models import Base

    Base.metadata.create_all(bind=get_engine())
    _ensure_columns()


# Columns added after the initial schema. SQLite supports ADD COLUMN, so we
# patch older databases in place rather than requiring a migration framework.
_ADDED_COLUMNS: dict[str, list[tuple[str, str]]] = {
    "documents": [
        ("size_kb", "INTEGER NOT NULL DEFAULT 0"),
        ("pages", "INTEGER NOT NULL DEFAULT 0"),
        ("status", "VARCHAR(16) NOT NULL DEFAULT 'indexed'"),
    ],
    "notebooks": [
        ("tags", "JSON"),
    ],
}


def _ensure_columns() -> None:
    """Add any newly-introduced columns to existing tables (idempotent)."""
    from sqlalchemy import inspect, text

    engine = get_engine()
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())
    with engine.begin() as conn:
        for table, cols in _ADDED_COLUMNS.items():
            if table not in existing_tables:
                continue
            present = {c["name"] for c in inspector.get_columns(table)}
            for name, ddl in cols:
                if name not in present:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {ddl}"))
