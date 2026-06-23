"""Course endpoints."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from scholarcli.api.rag_service import course_code, course_color
from scholarcli.api.schemas import CourseCreate, CourseOut
from scholarcli.storage import get_session
from scholarcli.storage.models import Course

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
        existing = session.query(Course).filter(Course.name == name).first()
        if existing:
            return _serialize(existing)
        course = Course(name=name)
        session.add(course)
        session.commit()
        session.refresh(course)
        return _serialize(course)
    finally:
        session.close()
