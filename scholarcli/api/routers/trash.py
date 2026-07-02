"""Global bin (trash) CRUD for soft-deleted user artifacts."""

from __future__ import annotations
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from scholarcli.storage import get_session
from scholarcli.storage.models import (
    Course, Document, Deck, Card, SavedQuiz, Notebook,
    Diagram, Mindmap, Whiteboard, DifferenceTable,
    SavedRevision, Prompt, QuestionPaper, PYQQuestion,
    LearningPath, LearningPackage, TrashIndex,
)

router = APIRouter(prefix="/api/trash", tags=["trash"])

ARCHIVE_TTL_DAYS = 10

MODEL_MAP: dict[str, type] = {
    "course": Course,
    "document": Document,
    "deck": Deck,
    "card": Card,
    "quiz": SavedQuiz,
    "notebook": Notebook,
    "diagram": Diagram,
    "mindmap": Mindmap,
    "whiteboard": Whiteboard,
    "difference": DifferenceTable,
    "revision": SavedRevision,
    "prompt": Prompt,
    "pyq_paper": QuestionPaper,
    "pyq_question": PYQQuestion,
    "learning_path": LearningPath,
    "learning_package": LearningPackage,
}


class TrashItemOut(BaseModel):
    id: str
    artifact_type: str
    artifact_id: str
    title: str
    subtitle: str | None = None
    course_id: int | None = None
    course_name: str | None = None
    deleted_at: str
    archived: bool


class TrashListResponse(BaseModel):
    items: list[TrashItemOut]


class ArchiveRequest(BaseModel):
    archived: bool


def _purge_expired() -> int:
    session = get_session()
    try:
        cutoff = datetime.now(timezone.utc) - timedelta(days=ARCHIVE_TTL_DAYS)
        expired = session.query(TrashIndex).filter(
            TrashIndex.deleted_at < cutoff,
            TrashIndex.archived == False,
        ).all()

        if not expired:
            return 0

        # ponytail: global lock via session — fine for single-user SQLite.
        count = 0
        for item in expired:
            model_cls = MODEL_MAP.get(item.artifact_type)
            if model_cls:
                obj = session.get(model_cls, item.artifact_id)
                if obj:
                    session.delete(obj)
            session.delete(item)
            count += 1

        session.commit()
        return count
    finally:
        session.close()


@router.get("", response_model=TrashListResponse)
def list_trash(course_id: int | None = Query(None)) -> TrashListResponse:
    _purge_expired()

    session = get_session()
    try:
        q = session.query(TrashIndex).order_by(TrashIndex.deleted_at.desc())
        if course_id is not None:
            q = q.filter(TrashIndex.course_id == course_id)

        items = [
            TrashItemOut(
                id=item.id,
                artifact_type=item.artifact_type,
                artifact_id=item.artifact_id,
                title=item.title,
                subtitle=item.subtitle,
                course_id=item.course_id,
                course_name=item.course_name,
                deleted_at=item.deleted_at.isoformat(),
                archived=item.archived,
            )
            for item in q.all()
        ]
        return TrashListResponse(items=items)
    finally:
        session.close()


@router.post("/{artifact_type}/{artifact_id}/restore")
def restore_item(artifact_type: str, artifact_id: str):
    if artifact_type not in MODEL_MAP:
        raise HTTPException(status_code=400, detail=f"Unknown artifact type: {artifact_type}")

    session = get_session()
    try:
        trash_entry = session.query(TrashIndex).filter(
            TrashIndex.artifact_type == artifact_type,
            TrashIndex.artifact_id == artifact_id,
        ).first()
        if not trash_entry:
            raise HTTPException(status_code=404, detail="Item not found in trash")

        model_cls = MODEL_MAP[artifact_type]
        obj = session.get(model_cls, artifact_id)
        if obj:
            obj.is_deleted = False
            obj.deleted_at = None
            obj.archived = False

        session.delete(trash_entry)
        session.commit()
        return {"restored": True}
    finally:
        session.close()


@router.delete("/{artifact_type}/{artifact_id}")
def permanent_delete(artifact_type: str, artifact_id: str):
    if artifact_type not in MODEL_MAP:
        raise HTTPException(status_code=400, detail=f"Unknown artifact type: {artifact_type}")

    session = get_session()
    try:
        trash_entry = session.query(TrashIndex).filter(
            TrashIndex.artifact_type == artifact_type,
            TrashIndex.artifact_id == artifact_id,
        ).first()
        if not trash_entry:
            raise HTTPException(status_code=404, detail="Item not found in trash")

        model_cls = MODEL_MAP[artifact_type]
        obj = session.get(model_cls, artifact_id)
        if obj:
            session.delete(obj)

        session.delete(trash_entry)
        session.commit()
        return {"deleted": True}
    finally:
        session.close()


@router.patch("/{artifact_type}/{artifact_id}/archive")
def archive_item(artifact_type: str, artifact_id: str, body: ArchiveRequest):
    if artifact_type not in MODEL_MAP:
        raise HTTPException(status_code=400, detail=f"Unknown artifact type: {artifact_type}")

    session = get_session()
    try:
        trash_entry = session.query(TrashIndex).filter(
            TrashIndex.artifact_type == artifact_type,
            TrashIndex.artifact_id == artifact_id,
        ).first()
        if not trash_entry:
            raise HTTPException(status_code=404, detail="Item not found in trash")

        trash_entry.archived = body.archived

        model_cls = MODEL_MAP[artifact_type]
        obj = session.get(model_cls, artifact_id)
        if obj:
            obj.archived = body.archived

        session.commit()
        return {"archived": body.archived}
    finally:
        session.close()


@router.delete("/purge")
def purge_expired():
    count = _purge_expired()
    return {"purged": count}
