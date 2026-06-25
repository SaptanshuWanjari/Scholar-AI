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
