"""Learning Path — an AI-generated, dependency-ordered study roadmap.

``POST /api/learning-paths/generate`` runs the RAG pipeline with the
``learning_path`` route (which selects the matching system prompt), parses the
JSON roadmap into stages of concepts, and persists it as one snapshot row.
Per-concept ``status`` lives inside the stored ``stages`` JSON; the next-concept
recommendation, progress and analytics are computed server-side on read.
"""

from __future__ import annotations

import copy
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from sqlalchemy import func

from scholarcli.api import mastery_service, parsers
from scholarcli.api.activity_service import record_activity
from scholarcli.api.parsers import _VALID_STATUS
from scholarcli.api.rag_service import run_ask
from scholarcli.api.schemas import (
    GenerateLearningPathRequest,
    LearningAnalytics,
    LearningPathMeta,
    LearningPathOut,
    LearningPathOverview,
    LearningPathStage,
    LearningProgress,
    NextRecommendation,
    SourceOut,
    UpdateConceptStatusRequest,
)
from scholarcli.storage import get_session
from scholarcli.storage.models import DepConcept, LearningPath, SavedRevision, TopicStat

router = APIRouter(prefix="/api/learning-paths", tags=["learning-path"])


# ---------------------------------------------------------------------------
# Derived fields computed from the stored ``stages`` JSON.
# ---------------------------------------------------------------------------

def _concepts(stages: list[dict]) -> list[dict]:
    """Flatten all concepts across stages, preserving order."""
    return [c for st in stages for c in (st.get("concepts") or [])]


def _completed_titles(stages: list[dict]) -> set[str]:
    return {
        str(c.get("title", "")).lower()
        for c in _concepts(stages)
        if c.get("status") == "completed"
    }


def _recommend_next(stages: list[dict]) -> NextRecommendation | None:
    """First not-completed concept whose prerequisites are all completed."""
    done = _completed_titles(stages)
    for c in _concepts(stages):
        if c.get("status") == "completed":
            continue
        prereqs = [str(p).lower() for p in (c.get("prerequisites") or [])]
        # Only consider prerequisites that actually exist in this roadmap.
        known = {str(x.get("title", "")).lower() for x in _concepts(stages)}
        pending = [p for p in prereqs if p in known and p not in done]
        if pending:
            continue
        reason = (
            "Foundational — start here"
            if not [p for p in prereqs if p in known]
            else "All prerequisites complete"
        )
        return NextRecommendation(
            conceptTitle=str(c.get("title", "")),
            reason=reason,
            estimatedMinutes=int(c.get("estimatedMinutes") or 0),
        )
    return None


def _progress(stages: list[dict]) -> LearningProgress:
    concepts = _concepts(stages)
    total = len(concepts)
    done = sum(1 for c in concepts if c.get("status") == "completed")
    mins_total = sum(int(c.get("estimatedMinutes") or 0) for c in concepts)
    mins_done = sum(
        int(c.get("estimatedMinutes") or 0) for c in concepts if c.get("status") == "completed"
    )
    return LearningProgress(
        conceptsDone=done,
        conceptsTotal=total,
        studyHoursDone=round(mins_done / 60, 1),
        studyHoursTotal=round(mins_total / 60, 1),
        percent=round(100 * done / total) if total else 0,
    )


def _analytics(stages: list[dict], course: str) -> LearningAnalytics:
    concepts = _concepts(stages)

    # Strongest / weakest stage by completion percentage.
    stage_pct: list[tuple[str, float]] = []
    for st in stages:
        cs = st.get("concepts") or []
        if not cs:
            continue
        done = sum(1 for c in cs if c.get("status") == "completed")
        stage_pct.append((str(st.get("title", "")), 100 * done / len(cs)))
    strongest = max(stage_pct, key=lambda x: x[1])[0] if stage_pct else None
    weakest = min(stage_pct, key=lambda x: x[1])[0] if stage_pct else None

    # Concepts skipped = still-not-started concepts that sit before the last
    # completed concept in learning order.
    last_done = -1
    for i, c in enumerate(concepts):
        if c.get("status") == "completed":
            last_done = i
    skipped = sum(
        1 for i, c in enumerate(concepts) if i < last_done and c.get("status") == "not_started"
    )

    completed_mins = [
        int(c.get("estimatedMinutes") or 0) for c in concepts if c.get("status") == "completed"
    ]
    avg_completion = round(sum(completed_mins) / len(completed_mins)) if completed_mins else 0

    # Best-effort links to existing performance data (matched by concept title).
    titles = {str(c.get("title", "")).lower() for c in concepts}
    most_revised = _most_revised_topic(titles, course)
    highest_mistake = _highest_mistake_topic(titles, course)

    return LearningAnalytics(
        strongestStage=strongest,
        weakestStage=weakest,
        mostRevisedTopic=most_revised,
        highestMistakeTopic=highest_mistake,
        conceptsSkipped=skipped,
        avgCompletionMinutes=avg_completion,
    )


def _most_revised_topic(titles: set[str], course: str) -> str | None:
    """Concept revised most often, matched against saved revisions (or None)."""
    session = get_session()
    try:
        q = session.query(SavedRevision)
        if course:
            q = q.filter(SavedRevision.course == course)
        counts: dict[str, int] = {}
        for r in q.all():
            label = (r.topic or r.title or "").lower()
            for t in titles:
                if t and (t == label or t in label):
                    counts[t] = counts.get(t, 0) + 1
        if not counts:
            return None
        return max(counts, key=lambda k: counts[k]).title()
    finally:
        session.close()


def _highest_mistake_topic(titles: set[str], course: str) -> str | None:
    """Concept with the worst answer accuracy from TopicStat (or None)."""
    session = get_session()
    try:
        q = session.query(TopicStat)
        if course:
            q = q.filter(TopicStat.course == course)
        worst: tuple[str, float] | None = None
        for s in q.all():
            if not s.total:
                continue
            label = (s.topic or "").lower()
            if not any(t and (t == label or t in label) for t in titles):
                continue
            miss = (s.total - s.correct) / s.total
            if worst is None or miss > worst[1]:
                worst = (s.topic, miss)
        return worst[0] if worst else None
    finally:
        session.close()


def _out(row: LearningPath) -> LearningPathOut:
    stages = row.stages or []
    return LearningPathOut(
        id=str(row.id),
        title=row.title,
        course=row.course,
        document=row.document,
        overview=LearningPathOverview(**(row.overview or {})),
        stages=[LearningPathStage(**st) for st in stages],
        sources=[SourceOut(**s) for s in (row.sources or [])],
        grounded=row.grounded,
        archived=row.archived,
        nextRecommendation=_recommend_next(stages),
        progress=_progress(stages),
        analytics=_analytics(stages, row.course),
        createdAt=row.created_at.isoformat(),
    )


def _meta(row: LearningPath) -> LearningPathMeta:
    return LearningPathMeta(
        id=str(row.id),
        title=row.title,
        course=row.course,
        conceptCount=len(_concepts(row.stages or [])),
        archived=row.archived,
        createdAt=row.created_at.isoformat(),
    )


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/generate", response_model=LearningPathOut)
async def generate_learning_path(req: GenerateLearningPathRequest) -> LearningPathOut:
    topic = req.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")
    query = f"Generate a dependency-ordered learning roadmap for: {topic}"
    result = await run_in_threadpool(
        run_ask, query, req.course, req.document, "learning_path", topic, req.rag_mode
    )
    parsed = parsers.parse_learning_path(result["content"])
    stages = parsed["stages"]
    overview = parsed["overview"]
    sources = result["sources"]
    grounded = bool(result["grounded"])

    if not stages:
        raise HTTPException(
            status_code=422,
            detail="Couldn't build a roadmap from your material for this topic. "
            "Try a broader topic, a different course/document, or AI Fallback mode.",
        )

    session = get_session()
    try:
        row = LearningPath(
            title=topic,
            course=req.course or "",
            document=req.document or "",
            overview=overview,
            stages=stages,
            sources=sources,
            grounded=grounded,
        )
        session.add(row)
        session.commit()
        session.refresh(row)
        record_activity("note", f"Generated learning path: {topic}", req.course or "")
        return _out(row)
    finally:
        session.close()


@router.get("", response_model=list[LearningPathMeta])
def list_paths() -> list[LearningPathMeta]:
    session = get_session()
    try:
        rows = session.query(LearningPath).order_by(LearningPath.created_at.desc()).all()
        return [_meta(r) for r in rows]
    finally:
        session.close()


@router.get("/{path_id}", response_model=LearningPathOut)
def get_path(path_id: int) -> LearningPathOut:
    session = get_session()
    try:
        row = session.get(LearningPath, path_id)
        if not row:
            raise HTTPException(status_code=404, detail="Learning path not found")
        return _out(row)
    finally:
        session.close()


@router.patch("/{path_id}/concepts/{concept_title}", response_model=LearningPathOut)
def update_concept_status(
    path_id: int, concept_title: str, req: UpdateConceptStatusRequest
) -> LearningPathOut:
    status = req.status.strip().lower()
    if status not in _VALID_STATUS:
        raise HTTPException(status_code=400, detail=f"invalid status: {req.status}")
    session = get_session()
    try:
        row = session.get(LearningPath, path_id)
        if not row:
            raise HTTPException(status_code=404, detail="Learning path not found")
        # Rebuild the stages list so SQLAlchemy detects the JSON column change.
        stages = [dict(st) for st in (row.stages or [])]
        found = False
        for st in stages:
            new_concepts = []
            for c in st.get("concepts") or []:
                c = dict(c)
                if str(c.get("title", "")).lower() == concept_title.strip().lower():
                    c["status"] = status
                    found = True
                new_concepts.append(c)
            st["concepts"] = new_concepts
        if not found:
            raise HTTPException(status_code=404, detail="Concept not found in path")
        row.stages = stages
        session.commit()
        session.refresh(row)
        return _out(row)
    finally:
        session.close()


@router.delete("/{path_id}", status_code=204)
def delete_path(path_id: int) -> None:
    session = get_session()
    try:
        row = session.get(LearningPath, path_id)
        if not row:
            raise HTTPException(status_code=404, detail="Learning path not found")
        session.delete(row)
        session.commit()
    finally:
        session.close()


@router.patch("/{path_id}/archive", response_model=LearningPathOut)
def archive_path(path_id: int, archived: bool = True) -> LearningPathOut:
    session = get_session()
    try:
        row = session.get(LearningPath, path_id)
        if not row:
            raise HTTPException(status_code=404, detail="Learning path not found")
        row.archived = archived
        session.commit()
        session.refresh(row)
        return _out(row)
    finally:
        session.close()
