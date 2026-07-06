"""Plugin-specific API endpoints."""

from __future__ import annotations

import shutil
import subprocess

from fastapi import APIRouter
from pydantic import BaseModel

from scholarai.storage import get_session
from scholarai.storage.models import Diagram

router = APIRouter(prefix="/api", tags=["plugins"])


class PlantUMLRequest(BaseModel):
    plantuml_syntax: str


class PlantUMLResponse(BaseModel):
    svg: str | None = None
    error: str | None = None


class PlantUMLStatus(BaseModel):
    installed: bool
    version: str | None = None


@router.get("/plugins/plantuml/status", response_model=PlantUMLStatus)
def plantuml_status() -> PlantUMLStatus:
    if not shutil.which("plantuml"):
        return PlantUMLStatus(installed=False)
    try:
        result = subprocess.run(
            ["plantuml", "-version"],
            capture_output=True,
            timeout=5,
        )
        raw = (result.stdout + result.stderr).decode(errors="replace")
        version = raw.splitlines()[0].strip() if raw else None
    except Exception:
        version = None
    return PlantUMLStatus(installed=True, version=version)


@router.post("/plugins/plantuml/render", response_model=PlantUMLResponse)
def render_plantuml(payload: PlantUMLRequest) -> PlantUMLResponse:
    if not shutil.which("plantuml"):
        return PlantUMLResponse(
            error=(
                "PlantUML is not installed or not in PATH. "
                "Install: brew install plantuml (macOS) or "
                "sudo apt install plantuml (Ubuntu/Debian). "
                "Requires Java runtime."
            )
        )

    try:
        result = subprocess.run(
            ["plantuml", "-tsvg", "-pipe"],
            input=payload.plantuml_syntax.encode(),
            capture_output=True,
            timeout=5,
        )
    except subprocess.TimeoutExpired:
        return PlantUMLResponse(
            error="PlantUML rendering timed out (>5s). Check your diagram syntax."
        )
    except FileNotFoundError:
        return PlantUMLResponse(
            error=(
                "plantuml binary not found. "
                "Install: brew install plantuml (macOS) or "
                "sudo apt install plantuml (Ubuntu/Debian)."
            )
        )

    if result.returncode != 0:
        stderr = result.stderr.decode(errors="replace")
        return PlantUMLResponse(error=f"PlantUML error: {stderr[:500]}")

    svg = result.stdout.decode(errors="replace")
    return PlantUMLResponse(svg=svg)


class PlantUMLSaveRequest(BaseModel):
    title: str
    plantuml_syntax: str
    course: str | None = None


class PlantUMLSaveResponse(BaseModel):
    id: int


@router.post("/plugins/plantuml/save", response_model=PlantUMLSaveResponse)
def save_plantuml_diagram(payload: PlantUMLSaveRequest) -> PlantUMLSaveResponse:
    session = get_session()
    try:
        row = Diagram(
            title=payload.title.strip() or "PlantUML Diagram",
            course=payload.course or "",
            kind="PlantUML",
            syntax=payload.plantuml_syntax,
        )
        session.add(row)
        session.commit()
        session.refresh(row)
        return PlantUMLSaveResponse(id=row.id)
    finally:
        session.close()
