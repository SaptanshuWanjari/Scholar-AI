"""Code Examples API routes."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from scholarcli.api.schemas import PaginatedResponse
from scholarcli.storage import get_session
from scholarcli.storage.models import CodeExample, Document

router = APIRouter(prefix="/code-examples", tags=["library", "code"])


@router.get("", response_model=PaginatedResponse)
def list_code_examples(
    course: str | None = None,
    language: str | None = None,
    topic: str | None = None,
    difficulty: str | None = None,
    example_type: str | None = None,
    sort_by: str = Query("recent", description="recent | alphabetical"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    session: Session = Depends(get_session),
) -> dict:
    """List and filter extracted code examples."""
    q = session.query(CodeExample)

    if course:
        q = q.filter(CodeExample.course == course)
    if language:
        q = q.filter(CodeExample.language.ilike(f"%{language}%"))
    if topic:
        q = q.filter(CodeExample.topic.ilike(f"%{topic}%"))
    if difficulty:
        q = q.filter(CodeExample.difficulty.ilike(difficulty))
    if example_type:
        q = q.filter(CodeExample.example_type.ilike(example_type))

    if sort_by == "alphabetical":
        q = q.order_by(CodeExample.title.asc())
    else:
        q = q.order_by(CodeExample.created_at.desc())

    total = q.count()
    examples = q.offset(skip).limit(limit).all()

    # Serialize items
    items = []
    for ex in examples:
        items.append({
            "id": ex.id,
            "document_id": ex.document_id,
            "course": ex.course,
            "title": ex.title,
            "language": ex.language,
            "topic": ex.topic,
            "difficulty": ex.difficulty,
            "example_type": ex.example_type,
            "page_number": ex.page_number,
            "code": ex.code,
            "explanation": ex.explanation,
            "purpose": ex.purpose,
            "inputs": ex.inputs,
            "outputs": ex.outputs,
            "time_complexity": ex.time_complexity,
            "space_complexity": ex.space_complexity,
            "common_mistakes": ex.common_mistakes,
            "important_notes": ex.important_notes,
            "related_concepts": ex.related_concepts,
            "used_in_quiz": ex.used_in_quiz,
            "used_in_pyq": ex.used_in_pyq,
            "created_at": ex.created_at.isoformat(),
        })

    return {"items": items, "total": total}


@router.get("/{example_id}")
def get_code_example(
    example_id: int, session: Session = Depends(get_session)
) -> dict:
    """Get a specific code example by ID."""
    ex = session.get(CodeExample, example_id)
    if not ex:
        raise HTTPException(status_code=404, detail="Code example not found")
        
    doc = session.get(Document, ex.document_id)

    return {
        "id": ex.id,
        "document_id": ex.document_id,
        "document_title": doc.title if doc else "Unknown",
        "course": ex.course,
        "title": ex.title,
        "language": ex.language,
        "topic": ex.topic,
        "difficulty": ex.difficulty,
        "example_type": ex.example_type,
        "page_number": ex.page_number,
        "code": ex.code,
        "explanation": ex.explanation,
        "purpose": ex.purpose,
        "inputs": ex.inputs,
        "outputs": ex.outputs,
        "time_complexity": ex.time_complexity,
        "space_complexity": ex.space_complexity,
        "common_mistakes": ex.common_mistakes,
        "important_notes": ex.important_notes,
        "related_concepts": ex.related_concepts,
        "used_in_quiz": ex.used_in_quiz,
        "used_in_pyq": ex.used_in_pyq,
        "created_at": ex.created_at.isoformat(),
    }
