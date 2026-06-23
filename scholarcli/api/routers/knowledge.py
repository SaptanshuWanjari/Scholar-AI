"""Knowledge-graph endpoints — build, fetch graph, inspect concepts."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from scholarcli.api import knowledge_service
from scholarcli.api.schemas import (
    ConceptInspectorOut,
    KGBuildRequest,
    KGBuildResponse,
    KGGraphOut,
)

router = APIRouter(prefix="/api", tags=["knowledge"])


@router.post("/knowledge/build", response_model=KGBuildResponse)
async def build(req: KGBuildRequest) -> KGBuildResponse:
    result = await run_in_threadpool(
        knowledge_service.build_graph, req.course, req.max_documents
    )
    return KGBuildResponse(**result)


@router.get("/knowledge-graph", response_model=KGGraphOut)
def get_graph(course: str | None = None) -> KGGraphOut:
    return KGGraphOut(**knowledge_service.graph(course))


@router.get("/concepts/discover", response_model=list[str])
def discover(conceptId: int) -> list[str]:
    return knowledge_service.discover(conceptId)


@router.get("/concepts/{concept_id}", response_model=ConceptInspectorOut)
def get_concept(concept_id: int) -> ConceptInspectorOut:
    data = knowledge_service.inspector(concept_id)
    if not data:
        raise HTTPException(status_code=404, detail="Concept not found")
    return ConceptInspectorOut(**data)
