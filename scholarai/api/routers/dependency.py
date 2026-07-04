"""Concept Dependency Engine endpoints — build, inspect, readiness, graph."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from scholarai.api import dependency_service
from scholarai.api.schemas import (
    DepBuildRequest,
    DepBuildResponse,
    DepConceptInspectorOut,
    ReadinessOut,
)

router = APIRouter(prefix="/api", tags=["dependencies"])


@router.post("/dependencies/build", response_model=DepBuildResponse)
async def build(req: DepBuildRequest) -> DepBuildResponse:
    result = await run_in_threadpool(
        dependency_service.build, req.course, req.max_documents
    )
    return DepBuildResponse(**result)


@router.get("/dependencies/concept/{concept_id}", response_model=DepConceptInspectorOut)
def get_concept(concept_id: int) -> DepConceptInspectorOut:
    data = dependency_service.inspector(concept_id)
    if not data:
        raise HTTPException(status_code=404, detail="Concept not found")
    return DepConceptInspectorOut(**data)


@router.get("/dependencies/resolve", response_model=DepConceptInspectorOut)
def resolve(name: str, course: str | None = None) -> DepConceptInspectorOut:
    """Resolve a concept by name → its dependency inspector (used by the UI,
    whose knowledge-graph ids differ from dependency-engine ids)."""
    cid = dependency_service.resolve_concept(name, course)
    if cid is None:
        raise HTTPException(status_code=404, detail="Concept not found")
    data = dependency_service.inspector(cid)
    if not data:
        raise HTTPException(status_code=404, detail="Concept not found")
    return DepConceptInspectorOut(**data)


@router.get("/dependencies/readiness", response_model=ReadinessOut)
def readiness(topic: str, course: str | None = None) -> ReadinessOut:
    return ReadinessOut(**dependency_service.readiness(topic, course))


@router.get("/dependencies/graph")
def get_graph(course: str | None = None) -> dict:
    return dependency_service.graph(course)


@router.get("/dependencies/path/{concept_id}")
def get_learning_path(concept_id: int) -> list[dict]:
    path = dependency_service.learning_path(concept_id)
    if not path:
        raise HTTPException(status_code=404, detail="Concept not found")
    return path
