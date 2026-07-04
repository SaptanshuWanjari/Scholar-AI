"""Activity logging + dashboard aggregation.

``record_activity`` is best-effort (never raises into the request path).
``dashboard`` derives the homepage stats from real Activity / Deck / Document
rows instead of mock data.
"""

from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timedelta, timezone

from scholarai.storage import get_session
from scholarai.storage.models import Activity, Card, Deck, Document, SavedQuiz, ReadingState, Diagram, Mindmap, SavedRevision, Whiteboard

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
        flashcards_due = 0
        for c in session.query(Card).all():
            if c.ease != "mastered":
                if c.due == "Today" or str(c.due) <= now.isoformat():
                    flashcards_due += 1
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

        # Recent bookmarks
        recent_bookmarks = []
        rstates = session.query(ReadingState).all()
        all_bmarks = []
        for rs in rstates:
            if not rs.bookmarks:
                continue
            doc = session.get(Document, rs.document_id)
            doc_title = doc.title if doc else "Unknown Document"
            for bm in rs.bookmarks:
                all_bmarks.append({
                    "id": bm.get("id", ""),
                    "section": bm.get("section", ""),
                    "note": bm.get("note", ""),
                    "docTitle": doc_title,
                    "docId": str(rs.document_id)
                })
        # Since we don't have created_at on bookmarks, we just reverse to get the last appended
        recent_bookmarks = all_bmarks[::-1][:5]

        # Recent Artifacts
        raw_artifacts = []
        for q in session.query(SavedQuiz).order_by(SavedQuiz.created_at.desc()).limit(3).all():
            raw_artifacts.append({"id": str(q.id), "title": q.title, "type": "quiz", "url": f"/quiz/{q.id}", "time": _ago(q.created_at or now, now), "stamp": q.created_at or now})
        for r in session.query(SavedRevision).order_by(SavedRevision.created_at.desc()).limit(3).all():
            raw_artifacts.append({"id": str(r.id), "title": r.title, "type": "revision", "url": f"/revision/{r.id}", "time": _ago(r.created_at or now, now), "stamp": r.created_at or now})
        for d in session.query(Diagram).order_by(Diagram.created_at.desc()).limit(3).all():
            raw_artifacts.append({"id": str(d.id), "title": d.title, "type": "diagram", "url": f"/diagram/{d.id}", "time": _ago(d.created_at or now, now), "stamp": d.created_at or now})
        for m in session.query(Mindmap).order_by(Mindmap.created_at.desc()).limit(3).all():
            raw_artifacts.append({"id": str(m.id), "title": m.title, "type": "mindmap", "url": f"/mindmap/{m.id}", "time": _ago(m.created_at or now, now), "stamp": m.created_at or now})
        for w in session.query(Whiteboard).order_by(Whiteboard.created_at.desc()).limit(3).all():
            raw_artifacts.append({"id": str(w.id), "title": w.title, "type": "whiteboard", "url": f"/whiteboard/{w.id}", "time": _ago(w.created_at or now, now), "stamp": w.created_at or now})
            
        raw_artifacts.sort(key=lambda x: x["stamp"], reverse=True)
        recent_artifacts = [{"id": x["id"], "title": x["title"], "type": x["type"], "url": x["url"], "time": x["time"]} for x in raw_artifacts[:3]]

        return {
            "metrics": {
                "documents": documents,
                "flashcards": flashcards,
                "flashcardsDue": flashcards_due,
                "quizzesTaken": quizzes_taken,
                "studySessions": study_sessions,
            },
            "studyActivity": study_activity,
            "recentSessions": recent_sessions,
            "recentArtifacts": recent_artifacts,
            "activity": activity,
            "weakTopics": weak_topics[:4],
            "suggestedRevision": suggested[:3],
            "recentBookmarks": recent_bookmarks,
        }
    finally:
        session.close()
