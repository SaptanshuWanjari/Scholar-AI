"""Tests for auto-save: model columns, notebook draft, quiz session endpoints."""

from sqlalchemy import inspect

from scholarcli.storage import get_engine, init_db


def test_init_db_adds_auto_save_columns():
    init_db()
    inspector = inspect(get_engine())
    nb_cols = {c["name"] for c in inspector.get_columns("notebooks")}
    assert "is_draft" in nb_cols
    quiz_cols = {c["name"] for c in inspector.get_columns("quizzes")}
    assert "session_answers" in quiz_cols
    assert "session_current_question" in quiz_cols
    assert "session_started_at" in quiz_cols
