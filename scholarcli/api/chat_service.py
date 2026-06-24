"""Cross-session chat history persistence.

Each Ask conversation can be tied to a ChatSession; user + assistant turns are
stored as ChatMessage rows so history survives reloads and restarts. All
helpers are self-contained (own session, commit, close).
"""

from __future__ import annotations

import secrets

from scholarcli.storage import get_session
from scholarcli.storage.models import ChatMessage, ChatSession


def _title_from(text: str) -> str:
    t = " ".join((text or "").split())
    return (t[:60] + "…") if len(t) > 60 else (t or "New chat")


def create_session(course: str | None = None, title: str | None = None) -> dict:
    session = get_session()
    try:
        row = ChatSession(
            id=secrets.token_hex(8),
            title=title or "New chat",
            course=course,
        )
        session.add(row)
        session.commit()
        session.refresh(row)
        return _session_meta(row, 0)
    finally:
        session.close()


def list_sessions() -> list[dict]:
    session = get_session()
    try:
        rows = (
            session.query(ChatSession)
            .order_by(ChatSession.updated_at.desc())
            .all()
        )
        return [_session_meta(r, len(r.messages)) for r in rows]
    finally:
        session.close()


def get_session_detail(session_id: str) -> dict | None:
    session = get_session()
    try:
        row = session.get(ChatSession, session_id)
        if not row:
            return None
        msgs = sorted(row.messages, key=lambda m: m.id)
        return {
            **_session_meta(row, len(msgs)),
            "messages": [_message_out(m) for m in msgs],
        }
    finally:
        session.close()


def delete_session(session_id: str) -> bool:
    session = get_session()
    try:
        row = session.get(ChatSession, session_id)
        if not row:
            return False
        session.delete(row)
        session.commit()
        return True
    finally:
        session.close()


def append_message(
    session_id: str, role: str, content: str, sources: list | None = None
) -> None:
    """Append a message; first user turn (re)names an untitled session."""
    session = get_session()
    try:
        row = session.get(ChatSession, session_id)
        if not row:
            return
        session.add(
            ChatMessage(
                session_id=session_id,
                role=role,
                content=content,
                sources=sources,
            )
        )
        if role == "user" and (not row.title or row.title == "New chat"):
            row.title = _title_from(content)
        session.commit()
    finally:
        session.close()


def _session_meta(row: ChatSession, count: int) -> dict:
    return {
        "id": row.id,
        "title": row.title,
        "course": row.course or "",
        "messageCount": count,
        "updatedAt": row.updated_at.isoformat() if row.updated_at else "",
    }


def _message_out(m: ChatMessage) -> dict:
    return {
        "id": str(m.id),
        "role": m.role,
        "content": m.content,
        "sources": m.sources or [],
        "createdAt": m.created_at.isoformat() if m.created_at else "",
    }
