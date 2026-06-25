"""Mastery rollup for dependency-engine concepts.

Computes a concept's mastery status from the learning signals already produced
across the app — quiz/exam accuracy (``TopicStat``), flashcard ease
(``Card`` via ``Deck``), revision recency (``SavedRevision``) and Teach Me
completion (``LearningPackage``). Signals are linked by ``concept_id`` (stamped
at write time) so the rollup is exact, not a read-time name match.

Status is one of: ``Mastered`` | ``Learning`` | ``Weak`` | ``Needs Revision``
| ``Unknown``.
"""

from __future__ import annotations

from datetime import datetime, timezone

from scholarcli.storage import get_session
from scholarcli.storage.models import (
    Card,
    Deck,
    LearningPackage,
    SavedRevision,
    TopicStat,
)

# Thresholds (tunable).
_MASTER_ACCURACY = 0.8
_WEAK_ACCURACY = 0.5
_MASTER_CARD_RATIO = 0.7
_STALE_DAYS = 21


def _days_since(dt: datetime | None) -> float | None:
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return (datetime.now(timezone.utc) - dt).total_seconds() / 86400.0


def mastery(concept_id: int) -> dict:
    """Return ``{status, score, signals}`` for a dependency concept."""
    session = get_session()
    try:
        # Quiz / exam accuracy (summed across linked topic stats).
        correct = total = 0
        last_attempt: datetime | None = None
        for ts in session.query(TopicStat).filter(TopicStat.concept_id == concept_id).all():
            correct += ts.correct
            total += ts.total
            if ts.last_attempt and (last_attempt is None or ts.last_attempt > last_attempt):
                last_attempt = ts.last_attempt
        accuracy = (correct / total) if total else None

        # Flashcard mastery ratio over linked decks.
        deck_ids = [d.id for d in session.query(Deck).filter(Deck.concept_id == concept_id).all()]
        card_ratio: float | None = None
        if deck_ids:
            cards = session.query(Card).filter(Card.deck_id.in_(deck_ids)).all()
            if cards:
                mastered = sum(1 for c in cards if c.ease == "mastered")
                card_ratio = mastered / len(cards)

        revised = (
            session.query(SavedRevision).filter(SavedRevision.concept_id == concept_id).count() > 0
        )
        taught = (
            session.query(LearningPackage)
            .filter(LearningPackage.concept_id == concept_id)
            .count()
            > 0
        )

        status = _classify(accuracy, card_ratio, revised, taught, last_attempt)
        score = _score(accuracy, card_ratio)
        return {
            "status": status,
            "score": score,
            "signals": {
                "accuracy": round(accuracy, 2) if accuracy is not None else None,
                "cardRatio": round(card_ratio, 2) if card_ratio is not None else None,
                "revised": revised,
                "taught": taught,
                "attempts": total,
            },
        }
    finally:
        session.close()


def _classify(
    accuracy: float | None,
    card_ratio: float | None,
    revised: bool,
    taught: bool,
    last_attempt: datetime | None,
) -> str:
    has_signal = accuracy is not None or card_ratio is not None or revised or taught
    if not has_signal:
        return "Unknown"

    strong = (accuracy is not None and accuracy >= _MASTER_ACCURACY) or (
        card_ratio is not None and card_ratio >= _MASTER_CARD_RATIO
    )
    weak = accuracy is not None and accuracy < _WEAK_ACCURACY

    days = _days_since(last_attempt)
    if strong and days is not None and days > _STALE_DAYS:
        return "Needs Revision"
    if strong:
        return "Mastered"
    if weak:
        return "Weak"
    return "Learning"


def _score(accuracy: float | None, card_ratio: float | None) -> float:
    """A 0-1 blend of available signals (0.0 when no measurable signal)."""
    parts = [p for p in (accuracy, card_ratio) if p is not None]
    return round(sum(parts) / len(parts), 2) if parts else 0.0
