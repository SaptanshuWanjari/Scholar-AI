"""Activity logging + dashboard aggregation.

``record_activity`` is best-effort (never raises into the request path).
``dashboard`` derives the homepage stats from real Activity / Deck / Document
rows instead of mock data.
"""

from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timedelta, timezone

from scholarcli.storage import get_session
from scholarcli.storage.models import Activity, Card, Deck, Document, SavedQuiz

# Rough per-event time estimates (minutes) when a caller doesn't pass one.
_DEFAULT_MINUTES = {"ask": 3, "quiz": 10, "exam": 20, "diagram": 2, "flashcard": 1, "note": 4}
_SESSION_KINDS = {"ask", "quiz", "exam"}
_KIND_TITLE = {
    "ask": "Q&A session",
    "quiz": "Quiz",
    "exam": "Exam",
    "flashcard": "Flashcard review",
    "diagram": "Diagram",
    "document": "Document",
    "note": "Notebook",
}


def record_activity(
    kind: str, text: str, course: str = "", minutes: int | None = None, cards: int = 0
) -> None:
    try:
        session = get_session()
        try:
            session.add(
                Activity(
                    kind=kind,
                    text=text[:512],
                    course=course or "",
                    minutes=minutes if minutes is not None else _DEFAULT_MINUTES.get(kind, 2),
                    cards=cards,
                )
            )
            session.commit()
        finally:
            session.close()
    except Exception:
        # Never let logging break the real request.
        pass


def _ago(then: datetime, now: datetime) -> str:
    if then.tzinfo is None:
        then = then.replace(tzinfo=timezone.utc)
    secs = (now - then).total_seconds()
    if secs < 60:
        return "just now"
    if secs < 3600:
        return f"{int(secs // 60)}m ago"
    if secs < 86400:
        return f"{int(secs // 3600)}h ago"
    days = int(secs // 86400)
    return "Yesterday" if days == 1 else f"{days}d ago"


def dashboard() -> dict:
    session = get_session()
    try:
        now = datetime.now(timezone.utc)
        acts = session.query(Activity).order_by(Activity.created_at.desc()).all()
        decks = session.query(Deck).all()

        documents = session.query(Document).count()
        flashcards = session.query(Card).count()
        quizzes_taken = sum(1 for a in acts if a.kind in ("quiz", "exam")) + session.query(SavedQuiz).count()
        study_sessions = sum(1 for a in acts if a.kind in _SESSION_KINDS)

        # 7-day study-activity series (oldest → newest).
        per_day_minutes: dict[str, int] = defaultdict(int)
        per_day_cards: dict[str, int] = defaultdict(int)
        for a in acts:
            created = a.created_at or now
            if created.tzinfo is None:
                created = created.replace(tzinfo=timezone.utc)
            key = created.date().isoformat()
            per_day_minutes[key] += a.minutes
            per_day_cards[key] += a.cards
        study_activity = []
        for i in range(6, -1, -1):
            d = (now - timedelta(days=i)).date()
            key = d.isoformat()
            study_activity.append(
                {"day": d.strftime("%a"), "minutes": per_day_minutes.get(key, 0), "cards": per_day_cards.get(key, 0)}
            )

        # Recent sessions (study-kind activities).
        recent_sessions = [
            {
                "id": f"ss{a.id}",
                "title": (a.text or _KIND_TITLE.get(a.kind, "Session"))[:60],
                "course": a.course or "—",
                "duration": f"{a.minutes}m",
                "date": _ago(a.created_at or now, now),
            }
            for a in acts
            if a.kind in _SESSION_KINDS
        ][:4]

        # Activity feed.
        activity = [
            {"id": f"a{a.id}", "kind": a.kind, "text": a.text or _KIND_TITLE.get(a.kind, a.kind), "time": _ago(a.created_at or now, now)}
            for a in acts[:6]
        ]

        # Weak topics + suggested revision derived from deck mastery.
        weak_topics = []
        suggested = []
        for d in decks:
            total = len(d.cards)
            if total == 0:
                continue
            mastered = sum(1 for c in d.cards if c.ease == "mastered")
            mastery = round(100 * mastered / total)
            if mastery < 70:
                weak_topics.append({"id": f"w{d.id}", "topic": d.name, "course": d.course or "—", "mastery": mastery})
                suggested.append(
                    {"id": f"r{d.id}", "topic": d.name, "reason": f"{total - mastered} cards to master", "course": d.course or "—"}
                )
        weak_topics.sort(key=lambda w: w["mastery"])

        return {
            "metrics": {
                "documents": documents,
                "flashcards": flashcards,
                "quizzesTaken": quizzes_taken,
                "studySessions": study_sessions,
            },
            "studyActivity": study_activity,
            "recentSessions": recent_sessions,
            "activity": activity,
            "weakTopics": weak_topics[:4],
            "suggestedRevision": suggested[:3],
        }
    finally:
        session.close()
