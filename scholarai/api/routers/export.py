"""Course export endpoint — returns a portable markdown zip."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from scholarai.api.export_service import _ExportError, _slug, build_course_zip
from scholarai.storage import get_session
from scholarai.storage.models import Course

router = APIRouter(prefix="/api/export", tags=["export"])


@router.get("/course/{course_id}")
def export_course(course_id: int) -> Response:
    session = get_session()
    try:
        course = session.get(Course, course_id)
        if course is None:
            raise HTTPException(status_code=404, detail="Course not found")
        name = course.name
    finally:
        session.close()

    try:
        data = build_course_zip(name)
    except _ExportError as exc:
        if exc.kind == "empty":
            raise HTTPException(status_code=404, detail="Nothing to export for this course")
        raise HTTPException(status_code=404, detail="Course not found")

    return Response(
        content=data,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{_slug(name)}.zip"'},
    )
