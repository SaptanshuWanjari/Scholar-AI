"""Dashboard aggregate + activity feed (derived from real Activity rows)."""

from __future__ import annotations

from fastapi import APIRouter

from scholarai.api import activity_service

router = APIRouter(prefix="/api", tags=["dashboard"])


@router.get("/dashboard")
def get_dashboard() -> dict:
    return activity_service.dashboard()


@router.get("/activity")
def get_activity() -> list:
    return activity_service.dashboard()["activity"]
