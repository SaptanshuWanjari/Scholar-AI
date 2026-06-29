import re

content = """\"\"\"Global semantic search endpoint.

v1 searches indexed document chunks (vector search). Flashcards/quizzes/etc.
will join in once those are persisted (see persistence task).
\"\"\"

from __future__ import annotations

import scholarcli.llm
from fastapi import APIRouter, Query

from scholarcli.api.rag_service import serialize_chunks
from scholarcli.api.schemas import SearchResultOut
from scholarcli.storage.vectors import search, hybrid_search

router = APIRouter(prefix="/api", tags=["search"])


@router.get("/search", response_model=list[SearchResultOut])
def global_search(
    q: str, 
    type: str = "all", 
    course: str = "all", 
    topic: str = "all",
    limit: int = 10
) -> list[SearchResultOut]:
    query = q.strip()
    if not query:
        return []

    results: list[SearchResultOut] = []
    
    # Map frontend plural types to backend types if necessary
    type = type.lower()
    if type == "documents": type = "document"
    if type == "flashcards": type = "flashcard"
    if type == "quizzes": type = "quiz"
    if type == "diagrams": type = "diagram"

    from scholarcli.storage import get_session
    from scholarcli.storage.models import Whiteboard, Deck, SavedQuiz, Diagram, Concept
    session = get_session()

    try:
        if type in ("all", "document"):
            emb = scholarcli.llm.get_embeddings()
            vector = emb.embed_query(query)
            c = course if course != "all" else None
            # vectors.search supports course filter
            for s in serialize_chunks(search(vector, top_k=max(1, min(limit, 20)), course=c)):
                # If topic filtering is needed for documents, we might have to skip if it doesn't match, 
                # but chunks don't have topic natively in lancedb yet, so we ignore topic for now
                results.append(
                    SearchResultOut(
                        id=s["id"],
                        group="Documents",
                        title=s["title"],
                        snippet=s["snippet"],
                        course=s["course"],
                    )
                )

        if type in ("all", "whiteboards", "whiteboard"):
            q_wb = session.query(Whiteboard).filter(Whiteboard.title.ilike(f"%{query}%"))
            if course != "all": q_wb = q_wb.filter(Whiteboard.course.ilike(course))
            for wb in q_wb.order_by(Whiteboard.updated_at.desc()).limit(limit).all():
                results.append(
                    SearchResultOut(
                        id=str(wb.id),
                        group="Whiteboards",
                        title=wb.title,
                        snippet=(wb.course or "Whiteboard"),
                        course=wb.course,
                    )
                )

        if type in ("all", "flashcard"):
            q_deck = session.query(Deck).filter(Deck.name.ilike(f"%{query}%"))
            if course != "all": q_deck = q_deck.filter(Deck.course.ilike(course))
            for deck in q_deck.order_by(Deck.created_at.desc()).limit(limit).all():
                results.append(
                    SearchResultOut(
                        id=str(deck.id),
                        group="Flashcards",
                        title=deck.name,
                        snippet=f"Deck with cards",
                        course=deck.course,
                    )
                )

        if type in ("all", "quiz"):
            q_quiz = session.query(SavedQuiz).filter(SavedQuiz.title.ilike(f"%{query}%"))
            if course != "all": q_quiz = q_quiz.filter(SavedQuiz.course.ilike(course))
            for quiz in q_quiz.order_by(SavedQuiz.created_at.desc()).limit(limit).all():
                results.append(
                    SearchResultOut(
                        id=str(quiz.id),
                        group="Quizzes",
                        title=quiz.title,
                        snippet=f"Difficulty: {quiz.difficulty}",
                        course=quiz.course,
                    )
                )
                
        if type in ("all", "diagram"):
            q_diag = session.query(Diagram).filter(Diagram.title.ilike(f"%{query}%"))
            if course != "all": q_diag = q_diag.filter(Diagram.course.ilike(course))
            for diag in q_diag.order_by(Diagram.created_at.desc()).limit(limit).all():
                results.append(
                    SearchResultOut(
                        id=str(diag.id),
                        group="Diagrams",
                        title=diag.title,
                        snippet=diag.kind,
                        course=diag.course,
                    )
                )

        if type in ("all", "concept"):
            q_concept = session.query(Concept).filter(Concept.name.ilike(f"%{query}%"))
            if course != "all": q_concept = q_concept.filter(Concept.course.ilike(course))
            for concept in q_concept.limit(limit).all():
                results.append(
                    SearchResultOut(
                        id=str(concept.id),
                        group="Concepts",
                        title=concept.name,
                        snippet=concept.summary[:100],
                        course=concept.course,
                    )
                )

    finally:
        session.close()

    # Sort results to have exact matches first, etc if needed, but for now just return them
    return results[:limit*2]
"""

with open("scholarcli/api/routers/search.py", "w") as f:
    f.write(content)

