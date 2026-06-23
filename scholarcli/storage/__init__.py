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
