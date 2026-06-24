"""Knowledge-graph endpoints — build, fetch graph, inspect concepts."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from scholarcli.api import knowledge_service
from scholarcli.api.schemas import (
    ConceptInspectorOut,
    ConceptMergeRequest,
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


@router.get("/knowledge/sidebar")
def kg_sidebar(course: str | None = None) -> dict:
    return knowledge_service.sidebar(course)


@router.get("/concepts/discover", response_model=list[str])
def discover(conceptId: int) -> list[str]:
    return knowledge_service.discover(conceptId)


@router.get("/concepts/{concept_id}", response_model=ConceptInspectorOut)
def get_concept(concept_id: int) -> ConceptInspectorOut:
    data = knowledge_service.inspector(concept_id)
    if not data:
        raise HTTPException(status_code=404, detail="Concept not found")
    return ConceptInspectorOut(**data)


@router.post("/concepts/merge", response_model=ConceptInspectorOut)
def merge_concepts(req: ConceptMergeRequest) -> ConceptInspectorOut:
    data = knowledge_service.merge_concepts(req.keepId, req.dropId)
    if not data:
        raise HTTPException(status_code=400, detail="Invalid concept ids for merge")
    return ConceptInspectorOut(**data)


@router.delete("/concepts/{concept_id}", status_code=204)
def delete_concept(concept_id: int) -> None:
    if not knowledge_service.delete_concept(concept_id):
        raise HTTPException(status_code=404, detail="Concept not found")
