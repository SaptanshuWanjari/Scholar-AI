"""Persistence for generated study artifacts: decks, flashcards, quizzes."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import Response

from scholarcli.api.activity_service import record_activity
from scholarcli.api.schemas import (
    CardReview,
    DeckOut,
    DiagramOut,
    FlashcardOut,
    MindmapOut,
    QualityScore,
    QuizOut,
    QuizQuestionOut,
    QuizSessionPatch,
    SaveDeckRequest,
    SaveQuizRequest,
    SaveRevisionRequest,
    SavedRevisionOut,
)
from scholarcli.storage import get_session
from scholarcli.storage.models import Card, Deck, Diagram, Mindmap, SavedQuiz, SavedRevision

router = APIRouter(prefix="/api", tags=["library"])

_DECK_COLORS = ["#4f4d7a", "#3f6b6f", "#3f7a4e", "#a3771f", "#6b3f6f", "#9f3a36"]


def _quality(stored: dict | None) -> QualityScore | None:
    """Map a persisted quality_score JSON blob back to a QualityScore."""
    return QualityScore(**stored) if stored else None


# ---------------------------------------------------------------------------
# Decks + flashcards
# ---------------------------------------------------------------------------

def _deck_out(deck: Deck) -> DeckOut:
    cards = deck.cards
    return DeckOut(
        id=str(deck.id),
        name=deck.name,
        course=deck.course,
        color=deck.color,
        cards=len(cards),
        mastered=sum(1 for c in cards if c.ease == "mastered"),
        quality=_quality(deck.quality_score),
    )


@router.get("/decks", response_model=list[DeckOut])
def list_decks() -> list[DeckOut]:
    session = get_session()
    try:
        return [_deck_out(d) for d in session.query(Deck).order_by(Deck.created_at.desc()).all()]
    finally:
        session.close()


@router.post("/decks", response_model=DeckOut, status_code=201)
def save_deck(payload: SaveDeckRequest) -> DeckOut:
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Deck name is required")
    session = get_session()
    try:
        color = payload.color or _DECK_COLORS[hash(name) % len(_DECK_COLORS)]
        deck = Deck(
            name=name, course=payload.course or "", color=color,
            quality_score=payload.quality.model_dump() if payload.quality else None,
        )
        for c in payload.cards:
            deck.cards.append(
                Card(type=c.type, front=c.front, back=c.back, due=c.due, ease=c.ease)
            )
        session.add(deck)
        session.commit()
        session.refresh(deck)
        return _deck_out(deck)
    finally:
        session.close()


@router.delete("/decks/{deck_id}", status_code=204)
def delete_deck(deck_id: int) -> None:
    session = get_session()
    try:
        deck = session.get(Deck, deck_id)
        if not deck:
            raise HTTPException(status_code=404, detail="Deck not found")
        session.delete(deck)
        session.commit()
    finally:
        session.close()


@router.get("/flashcards", response_model=list[FlashcardOut])
def list_flashcards(deck: str | None = None, course: str | None = None) -> list[FlashcardOut]:
    session = get_session()
    try:
        q = session.query(Card, Deck).join(Deck, Card.deck_id == Deck.id)
        if deck:
            q = q.filter(Deck.name == deck)
        if course:
            q = q.filter(Deck.course == course)
        return [
            FlashcardOut(
                id=str(card.id),
                type=card.type,  # type: ignore[arg-type]
                front=card.front,
                back=card.back,
                deck=d.name,
                due=card.due,
                ease=card.ease,  # type: ignore[arg-type]
            )
            for card, d in q.all()
        ]
    finally:
        session.close()


@router.put("/flashcards/{card_id}", response_model=FlashcardOut)
def review_card(card_id: int, review: CardReview) -> FlashcardOut:
    session = get_session()
    try:
        card = session.get(Card, card_id)
        if not card:
            raise HTTPException(status_code=404, detail="Card not found")
        card.ease = review.ease
        if review.due:
            card.due = review.due
        session.commit()
        session.refresh(card)
        deck = session.get(Deck, card.deck_id)
        record_activity("flashcard", f"Reviewed card in {deck.name if deck else 'deck'}", deck.course if deck else "", cards=1)
        return FlashcardOut(
            id=str(card.id),
            type=card.type,  # type: ignore[arg-type]
            front=card.front,
            back=card.back,
            deck=deck.name if deck else "",
            due=card.due,
            ease=card.ease,  # type: ignore[arg-type]
        )
    finally:
        session.close()


@router.delete("/flashcards/{card_id}", status_code=204)
def delete_card(card_id: int) -> None:
    session = get_session()
    try:
        card = session.get(Card, card_id)
        if not card:
            raise HTTPException(status_code=404, detail="Card not found")
        session.delete(card)
        session.commit()
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Saved quizzes
# ---------------------------------------------------------------------------

def _quiz_out(q: SavedQuiz) -> QuizOut:
    return QuizOut(
        id=str(q.id),
        title=q.title,
        course=q.course,
        difficulty=q.difficulty,
        grounded=True,
        questions=[QuizQuestionOut(**qq) for qq in q.questions],
        quality=_quality(q.quality_score),
        session_answers=q.session_answers,
        session_current_question=q.session_current_question,
        session_started_at=q.session_started_at.isoformat() if q.session_started_at else None,
    )


@router.get("/quizzes", response_model=list[QuizOut])
def list_quizzes() -> list[QuizOut]:
    session = get_session()
    try:
        return [_quiz_out(q) for q in session.query(SavedQuiz).order_by(SavedQuiz.created_at.desc()).all()]
    finally:
        session.close()


@router.post("/quizzes", response_model=QuizOut, status_code=201)
def save_quiz(payload: SaveQuizRequest) -> QuizOut:
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Quiz title is required")
    session = get_session()
    try:
        quiz = SavedQuiz(
            title=title,
            course=payload.course or "",
            difficulty=payload.difficulty,
            questions=[qq.model_dump() for qq in payload.questions],
            quality_score=payload.quality.model_dump() if payload.quality else None,
        )
        session.add(quiz)
        session.commit()
        session.refresh(quiz)
        return _quiz_out(quiz)
    finally:
        session.close()


@router.delete("/quizzes/{quiz_id}", status_code=204)
def delete_quiz(quiz_id: int) -> None:
    session = get_session()
    try:
        quiz = session.get(SavedQuiz, quiz_id)
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        session.delete(quiz)
        session.commit()
    finally:
        session.close()


@router.patch("/quizzes/{quiz_id}/session", response_model=QuizOut)
def patch_quiz_session(quiz_id: int, payload: QuizSessionPatch) -> QuizOut:
    session = get_session()
    try:
        quiz = session.get(SavedQuiz, quiz_id)
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        quiz.session_answers = payload.session_answers
        quiz.session_current_question = payload.session_current_question
        if quiz.session_started_at is None:
            quiz.session_started_at = datetime.now(timezone.utc)
        session.commit()
        session.refresh(quiz)
        return _quiz_out(quiz)
    finally:
        session.close()


@router.delete("/quizzes/{quiz_id}/session", status_code=204)
def clear_quiz_session(quiz_id: int) -> None:
    session = get_session()
    try:
        quiz = session.get(SavedQuiz, quiz_id)
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        quiz.session_answers = None
        quiz.session_current_question = None
        quiz.session_started_at = None
        session.commit()
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Saved diagrams
# ---------------------------------------------------------------------------

@router.get("/diagrams", response_model=list[DiagramOut])
def list_diagrams() -> list[DiagramOut]:
    session = get_session()
    try:
        return [
            DiagramOut(
                id=str(d.id),
                title=d.title,
                course=d.course,
                kind=d.kind,
                mermaid=d.mermaid,
                grounded=True,
                quality=_quality(d.quality_score),
            )
            for d in session.query(Diagram).order_by(Diagram.created_at.desc()).all()
        ]
    finally:
        session.close()


@router.delete("/diagrams/{diagram_id}", status_code=204)
def delete_diagram(diagram_id: int) -> None:
    session = get_session()
    try:
        d = session.get(Diagram, diagram_id)
        if not d:
            raise HTTPException(status_code=404, detail="Diagram not found")
        session.delete(d)
        session.commit()
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Mind maps
# ---------------------------------------------------------------------------

@router.get("/mindmaps", response_model=list[MindmapOut])
def list_mindmaps() -> list[MindmapOut]:
    session = get_session()
    try:
        return [
            MindmapOut(
                id=str(m.id), title=m.title, course=m.course, text=m.text, grounded=True,
                quality=_quality(m.quality_score),
            )
            for m in session.query(Mindmap).order_by(Mindmap.created_at.desc()).all()
        ]
    finally:
        session.close()


@router.delete("/mindmaps/{mindmap_id}", status_code=204)
def delete_mindmap(mindmap_id: int) -> None:
    session = get_session()
    try:
        m = session.get(Mindmap, mindmap_id)
        if not m:
            raise HTTPException(status_code=404, detail="Mind map not found")
        session.delete(m)
        session.commit()
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Saved revisions
# ---------------------------------------------------------------------------

@router.get("/revisions", response_model=list[SavedRevisionOut])
def list_revisions() -> list[SavedRevisionOut]:
    session = get_session()
    try:
        return [
            SavedRevisionOut(
                id=str(r.id),
                title=r.title,
                topic=r.topic,
                course=r.course,
                format=r.format,
                content=r.content,
                quality=_quality(r.quality_score),
                timestamp=r.created_at.timestamp() * 1000,
            )
            for r in session.query(SavedRevision).order_by(SavedRevision.created_at.desc()).all()
        ]
    finally:
        session.close()


@router.post("/revisions", response_model=SavedRevisionOut, status_code=201)
def save_revision(payload: SaveRevisionRequest) -> SavedRevisionOut:
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title is required")
    session = get_session()
    try:
        rev = SavedRevision(
            title=title,
            topic=payload.topic,
            course=payload.course or "",
            format=payload.format,
            content=payload.content,
            quality_score=payload.quality.model_dump() if payload.quality else None,
        )
        session.add(rev)
        session.commit()
        session.refresh(rev)
        return SavedRevisionOut(
            id=str(rev.id),
            title=rev.title,
            topic=rev.topic,
            course=rev.course,
            format=rev.format,
            content=rev.content,
            quality=_quality(rev.quality_score),
            timestamp=rev.created_at.timestamp() * 1000,
        )
    finally:
        session.close()


@router.delete("/revisions/{revision_id}", status_code=204)
def delete_revision(revision_id: int) -> None:
    session = get_session()
    try:
        rev = session.get(SavedRevision, revision_id)
        if not rev:
            raise HTTPException(status_code=404, detail="Revision not found")
        session.delete(rev)
        session.commit()
    finally:
        session.close()
