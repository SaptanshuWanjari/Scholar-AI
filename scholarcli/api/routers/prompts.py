"""CRUD router for the prompt library."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from scholarcli.api.prompt_service import CATEGORIES, active_body, seed_prompts
from scholarcli.storage import get_session
from scholarcli.storage.models import Prompt

router = APIRouter(prefix="/api/prompts", tags=["prompts"])


# ── schemas ────────────────────────────────────────────────────────────────────

class PromptOut(BaseModel):
    id: int
    category: str
    name: str
    style: str
    body: str
    built_in: bool
    active: bool

    model_config = {"from_attributes": True}


class PromptCreate(BaseModel):
    category: str
    name: str
    style: str = ""
    body: str


# ── endpoints ──────────────────────────────────────────────────────────────────

@router.get("/categories")
def list_categories():
    return CATEGORIES


@router.get("/", response_model=list[PromptOut])
def list_prompts(category: str | None = None):
    session = get_session()
    try:
        q = session.query(Prompt)
        if category:
            q = q.filter(Prompt.category == category)
        return q.order_by(Prompt.category, Prompt.id).all()
    finally:
        session.close()


@router.post("/", response_model=PromptOut, status_code=201)
def create_prompt(body: PromptCreate):
    session = get_session()
    try:
        p = Prompt(
            category=body.category,
            name=body.name,
            style=body.style,
            body=body.body,
            built_in=False,
            active=False,
        )
        session.add(p)
        session.commit()
        session.refresh(p)
        return p
    finally:
        session.close()


@router.put("/{prompt_id}/activate", response_model=PromptOut)
def activate_prompt(prompt_id: int):
    session = get_session()
    try:
        target = session.get(Prompt, prompt_id)
        if not target:
            raise HTTPException(404, "Prompt not found")
        # Deactivate all in same category
        session.query(Prompt).filter(Prompt.category == target.category).update({"active": False})
        target.active = True
        session.commit()
        session.refresh(target)
        return target
    finally:
        session.close()


@router.delete("/{prompt_id}", status_code=204)
def delete_prompt(prompt_id: int):
    session = get_session()
    try:
        target = session.get(Prompt, prompt_id)
        if not target:
            raise HTTPException(404, "Prompt not found")
        if target.built_in:
            raise HTTPException(400, "Cannot delete built-in prompts")
        session.delete(target)
        session.commit()
    finally:
        session.close()
