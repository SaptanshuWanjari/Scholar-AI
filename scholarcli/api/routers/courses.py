"""Course endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from scholarcli.api.rag_service import course_code, course_color
from scholarcli.api.schemas import CourseCreate, CourseOut, CourseStats, ArtifactItem
from scholarcli.storage import get_session
from scholarcli.storage.models import (
    Course, Deck, Card, SavedQuiz, Notebook, Diagram, Mindmap,
    DifferenceTable, SavedRevision,
)

router = APIRouter(prefix="/api/courses", tags=["courses"])


def _serialize(course: Course) -> CourseOut:
    return CourseOut(
        id=str(course.id),
        name=course.name,
        code=course_code(course.name),
        color=course_color(course.id),
        documents=len(course.documents),
        flashcards=0,
        progress=0,
    )


@router.get("", response_model=list[CourseOut])
def list_courses() -> list[CourseOut]:
    session = get_session()
    try:
        rows = session.query(Course).order_by(Course.name).all()
        return [_serialize(c) for c in rows]
    finally:
        session.close()


@router.post("", response_model=CourseOut, status_code=201)
def create_course(payload: CourseCreate) -> CourseOut:
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Course name is required")
    session = get_session()
    try:
        from scholarcli.storage.models import get_or_create_course
        course = get_or_create_course(session, name)
        return _serialize(course)
    finally:
        session.close()

@router.put("/{course_id}", response_model=CourseOut)
def update_course(course_id: int, payload: CourseCreate) -> CourseOut:
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Course name is required")
    session = get_session()
    try:
        course = session.query(Course).get(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        existing = session.query(Course).filter(Course.name == name).first()
        if existing and existing.id != course_id:
            raise HTTPException(status_code=400, detail="Course with this name already exists")
        course.name = name
        session.commit()
        session.refresh(course)
        return _serialize(course)
    finally:
        session.close()

@router.delete("/{course_id}", status_code=204)
def delete_course(course_id: int) -> None:
    session = get_session()
    try:
        course = session.query(Course).get(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        session.delete(course)
        session.commit()
    finally:
        session.close()


@router.get("/{course_id}/stats", response_model=CourseStats)
def get_course_stats(course_id: int) -> CourseStats:
    session = get_session()
    try:
        course = session.query(Course).get(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        cname = course.name

        docs = course.documents
        doc_count = len(docs)

        decks = session.query(Deck).filter(Deck.course == cname).all()
        flashcard_count = sum(
            session.query(Card).filter(Card.deck_id == d.id).count()
            for d in decks
        )
        quiz_count = session.query(SavedQuiz).filter(SavedQuiz.course == cname).count()
        notebook_count = session.query(Notebook).filter(Notebook.course == cname).count()
        diagram_count = session.query(Diagram).filter(Diagram.course == cname).count()
        mindmap_count = session.query(Mindmap).filter(Mindmap.course == cname).count()
        diff_count = session.query(DifferenceTable).filter(DifferenceTable.course == cname).count()
        revision_count = session.query(SavedRevision).filter(SavedRevision.course == cname).count()

        try:
            from scholarcli.storage.models import DepConcept
            concept_count = session.query(DepConcept).filter(DepConcept.course == cname).count()
        except Exception:
            concept_count = 0

        total_artifacts = (
            len(decks) + quiz_count + notebook_count +
            diagram_count + mindmap_count + diff_count + revision_count
        )

        # Compute last_updated from all document indexed_at timestamps
        last_updated = None
        for doc in docs:
            ts = doc.indexed_at.isoformat() if doc.indexed_at else None
            if ts and (last_updated is None or ts > last_updated):
                last_updated = ts

        return CourseStats(
            documents=doc_count,
            flashcards=flashcard_count,
            quizzes=quiz_count,
            notebooks=notebook_count,
            diagrams=diagram_count,
            mindmaps=mindmap_count,
            difference_tables=diff_count,
            revisions=revision_count,
            concepts=concept_count,
            total_artifacts=total_artifacts,
            last_updated=last_updated,
        )
    finally:
        session.close()


@router.get("/{course_id}/artifacts", response_model=list[ArtifactItem])
def get_course_artifacts(
    course_id: int,
    type: str | None = Query(default=None),
) -> list[ArtifactItem]:
    session = get_session()
    try:
        course = session.query(Course).get(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        cname = course.name
        items: list[ArtifactItem] = []

        if type is None or type == "deck":
            for d in session.query(Deck).filter(Deck.course == cname).all():
                items.append(ArtifactItem(
                    id=str(d.id), title=d.name, type="deck",
                    created_at=d.created_at.isoformat() if d.created_at else "",
                ))

        if type is None or type == "quiz":
            for q in session.query(SavedQuiz).filter(SavedQuiz.course == cname).all():
                items.append(ArtifactItem(
                    id=str(q.id), title=q.title, type="quiz",
                    created_at=q.created_at.isoformat() if q.created_at else "",
                ))

        if type is None or type == "notebook":
            for n in session.query(Notebook).filter(Notebook.course == cname).all():
                items.append(ArtifactItem(
                    id=str(n.id), title=n.title, type="notebook",
                    created_at=n.updated_at.isoformat() if n.updated_at else "",
                ))

        if type is None or type == "diagram":
            for d in session.query(Diagram).filter(Diagram.course == cname).all():
                items.append(ArtifactItem(
                    id=str(d.id), title=d.title, type="diagram",
                    created_at=d.created_at.isoformat() if d.created_at else "",
                ))

        if type is None or type == "mindmap":
            for m in session.query(Mindmap).filter(Mindmap.course == cname).all():
                items.append(ArtifactItem(
                    id=str(m.id), title=m.title, type="mindmap",
                    created_at=m.created_at.isoformat() if m.created_at else "",
                ))

        if type is None or type == "difference_table":
            for dt in session.query(DifferenceTable).filter(DifferenceTable.course == cname).all():
                items.append(ArtifactItem(
                    id=str(dt.id), title=dt.title, type="difference_table",
                    created_at=dt.created_at.isoformat() if dt.created_at else "",
                ))

        if type is None or type == "revision":
            for r in session.query(SavedRevision).filter(SavedRevision.course == cname).all():
                items.append(ArtifactItem(
                    id=str(r.id), title=r.title, type="revision",
                    created_at=r.created_at.isoformat() if r.created_at else "",
                ))

        items.sort(key=lambda x: x.created_at, reverse=True)
        return items
    finally:
        session.close()
