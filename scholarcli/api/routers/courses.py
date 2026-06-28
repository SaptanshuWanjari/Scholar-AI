"""Course endpoints."""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, HTTPException, Query
from fastapi.concurrency import run_in_threadpool

from scholarcli.api import job_service
from scholarcli.api.rag_service import course_code, course_color, run_ask
from scholarcli.api.schemas import CourseCreate, CourseOut, CourseStats, ArtifactItem, JobOut, PackageMeta
from scholarcli.storage import get_session
from scholarcli.storage.models import (
    Course, Deck, Card, SavedQuiz, Notebook, Diagram, Mindmap,
    DifferenceTable, SavedRevision, LearningPackage, Whiteboard,
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
        course = session.get(Course, course_id)
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
        course = session.get(Course, course_id)
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
        course = session.get(Course, course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        cname = course.name

        docs = course.documents
        doc_count = len(docs)

        from sqlalchemy import func
        flashcard_count = session.query(func.count(Card.id))\
            .join(Deck, Card.deck_id == Deck.id)\
            .filter(Deck.course == cname)\
            .scalar() or 0
        decks = session.query(Deck).filter(Deck.course == cname).all()
        quiz_count = session.query(SavedQuiz).filter(SavedQuiz.course == cname).count()
        notebook_count = session.query(Notebook).filter(Notebook.course == cname).count()
        diagram_count = session.query(Diagram).filter(Diagram.course == cname).count()
        mindmap_count = session.query(Mindmap).filter(Mindmap.course == cname).count()
        whiteboard_count = session.query(Whiteboard).filter(Whiteboard.course == cname).count()
        diff_count = session.query(DifferenceTable).filter(DifferenceTable.course == cname).count()
        revision_count = session.query(SavedRevision).filter(SavedRevision.course == cname).count()

        try:
            from scholarcli.storage.models import DepConcept
            concept_count = session.query(DepConcept).filter(DepConcept.course == cname).count()
        except Exception:
            concept_count = 0

        total_artifacts = (
            len(decks) + quiz_count + notebook_count +
            diagram_count + mindmap_count + whiteboard_count + diff_count + revision_count
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
            whiteboards=whiteboard_count,
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
        course = session.get(Course, course_id)
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

        if type is None or type == "whiteboard":
            for w in session.query(Whiteboard).filter(Whiteboard.course == cname).all():
                items.append(ArtifactItem(
                    id=str(w.id), title=w.title, type="whiteboard",
                    created_at=w.created_at.isoformat() if w.created_at else "",
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

        if type is None or type == "learning_path":
            from scholarcli.storage.models import LearningPath
            for lp in session.query(LearningPath).filter(LearningPath.course == cname).all():
                items.append(ArtifactItem(
                    id=str(lp.id), title=lp.title, type="learning_path",
                    created_at=lp.created_at.isoformat() if lp.created_at else "",
                ))

        items.sort(key=lambda x: x.created_at, reverse=True)
        return items
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Rebuild course index
# ---------------------------------------------------------------------------

def _reindex_bg(doc_paths: list[tuple[int, str, str]], course_name: str, job_id: str) -> None:
    from scholarcli.ingest.pipeline import ingest_file
    job_service.mark_running(job_id)
    results: dict[str, str] = {}
    failed = 0
    for _doc_id, path_str, title in doc_paths:
        p = Path(path_str)
        if not p.exists():
            results[title] = "missing"
            failed += 1
            continue
        try:
            status = ingest_file(p, course_name)
            results[title] = status
        except Exception as exc:  # noqa: BLE001
            results[title] = f"failed: {exc!s:.100}"
            failed += 1
    if failed:
        job_service.mark_failed(job_id, f"{failed} document(s) failed during reindex")
    else:
        job_service.mark_done(job_id, {"results": results})


@router.post("/{course_id}/reindex", response_model=JobOut, status_code=202)
def reindex_course(course_id: int, background_tasks: BackgroundTasks) -> JobOut:
    session = get_session()
    try:
        course = session.get(Course, course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        doc_paths = [(d.id, d.path, d.title) for d in course.documents]
        cname = course.name
    finally:
        session.close()

    job_id = job_service.create_job(
        "reindex",
        label=f"Rebuilding index for {cname} ({len(doc_paths)} documents)",
        payload={"courseId": course_id, "courseName": cname, "documentCount": len(doc_paths)},
    )
    background_tasks.add_task(_reindex_bg, doc_paths, cname, job_id)

    raw = job_service.get_job(job_id)
    return JobOut(**raw)  # type: ignore[arg-type]


# ---------------------------------------------------------------------------
# Generate course package
# ---------------------------------------------------------------------------

@router.post("/{course_id}/package", response_model=PackageMeta)
async def generate_course_package(course_id: int) -> PackageMeta:
    session = get_session()
    try:
        course = session.get(Course, course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        cname = course.name
    finally:
        session.close()

    query = (
        f"Generate a comprehensive study overview for the course: {cname}. "
        "Include these sections with '## ' headings: "
        "Course Summary, Key Topics, Core Concepts, Learning Objectives, "
        "Study Tips, Exam Focus Areas."
    )
    result = await run_in_threadpool(run_ask, query, cname, None, "study_notes", cname)

    session = get_session()
    try:
        pkg = LearningPackage(
            title=f"{cname} — Course Overview",
            course=cname,
            depth="standard",
            overview={"markdown": result["content"], "grounded": result["grounded"]},
            artifacts={},
            sources=result.get("sources", []),
        )
        session.add(pkg)
        session.commit()
        session.refresh(pkg)
        from scholarcli.api.schemas import PackageMeta as _PackageMeta
        arts = pkg.artifacts or {}
        count = sum(1 for v in arts.values() if v) + (1 if pkg.overview else 0)
        return _PackageMeta(
            id=str(pkg.id),
            title=pkg.title,
            course=pkg.course,
            depth=pkg.depth,
            artifactCount=count,
            createdAt=pkg.created_at.isoformat(),
        )
    finally:
        session.close()
