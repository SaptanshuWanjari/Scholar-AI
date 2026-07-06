"""Test data factories."""

from __future__ import annotations

import hashlib
from pathlib import Path

from scholarai.storage import get_session
from scholarai.storage.models import Course, Document


def create_course(name: str = "Test Course", system_prompt: str | None = None) -> Course:
    session = get_session()
    course = Course(name=name, system_prompt=system_prompt)
    session.add(course)
    session.commit()
    session.refresh(course)
    return course


def create_document(
    path: str | Path = "/tmp/test.pdf",
    title: str = "Test Document",
    file_type: str = "pdf",
    course_name: str = "Test Course",
    size_kb: int = 100,
    pages: int = 10,
    content: bytes | None = None,
) -> Document:
    session = get_session()
    course = session.query(Course).filter(Course.name == course_name).first()
    if course is None:
        course = Course(name=course_name)
        session.add(course)
        session.commit()
        session.refresh(course)

    if content is None:
        content = b"test content"
    content_hash = hashlib.sha256(content).hexdigest()

    doc = Document(
        path=str(path),
        title=title,
        file_type=file_type,
        content_hash=content_hash,
        version=1,
        size_kb=size_kb,
        pages=pages,
        status="indexed",
        course_id=course.id,
    )
    session.add(doc)
    session.commit()
    session.refresh(doc)
    return doc


def make_chunk(
    text: str,
    *,
    page: int = 1,
    heading: str = "Intro",
    chunk_index: int = 0,
    source: str = "test.pdf",
    course: str = "Test Course",
    document_id: int = 1,
    _distance: float = 0.1,
) -> dict:
    return {
        "text": text,
        "page": page,
        "heading": heading,
        "chunk_index": chunk_index,
        "source": source,
        "course": course,
        "document_id": document_id,
        "_distance": _distance,
    }
