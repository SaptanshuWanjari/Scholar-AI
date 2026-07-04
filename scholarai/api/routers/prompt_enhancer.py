"""Prompt quality analysis and enhancement endpoint."""

from __future__ import annotations

import json
import re

from fastapi import APIRouter
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel

from scholarai.llm import get_llm

router = APIRouter(prefix="/api/prompt", tags=["prompt"])

ACTION_VERBS = {
    "teach", "explain", "compare", "generate", "create", "list",
    "describe", "summarize", "show", "define", "discuss", "analyze",
    "illustrate", "outline", "demonstrate", "walk", "write",
}
SCOPE_WORDS = {
    "foundation", "foundations", "basic", "basics", "advanced", "overview",
    "deep", "introduction", "intro", "beginner", "intermediate", "expert",
    "comprehensive", "complete", "full", "detailed", "brief",
}
GOAL_WORDS = {
    "understand", "learn", "study", "prepare", "practice", "exam",
    "interview", "quiz", "notes", "flashcard", "flashcards", "review",
    "master", "memorize", "revise", "revision",
}
COMPARISON_WORDS = {"vs", "versus", "difference", "differences", "compare", "contrast", "between"}

_SUGGEST_SYSTEM = """\
You are a study prompt improvement assistant for a RAG-based study tool.
Students have uploaded their own documents (lecture notes, textbooks, PDFs).
Your job is to clarify HOW to study the given topic — NOT to expand WHAT to study.

CRITICAL RULES:
1. Keep the original topic unchanged. Do NOT add new concepts, technologies, companies, products, or examples that were not already named in the student's input.
2. Only add study framing: specify depth (e.g. "in detail", "at a high level"), format (e.g. "with key definitions", "step by step"), or focus area within the topic itself.
3. Do NOT invent real-world examples, external systems, or related technologies. The student's documents may not cover them, causing retrieval failures.
4. Keep the suggested prompt tight — 1–2 sentences at most. Do not pad it.
5. If the topic is already specific enough (e.g. a named algorithm, theorem, or concept), just add a study goal like "Explain [topic] with key definitions and examples from course materials."

Return a JSON object with exactly two keys:
- "suggested_prompt": a refined prompt (1–2 sentences) that keeps the original topic but adds study framing
- "improvements": a list of 2–3 short strings describing what framing was added

Return only raw JSON. No markdown fences, no extra text.
"""


class AnalyzeRequest(BaseModel):
    topic: str
    course: str | None = None
    route: str | None = None


class AnalyzeResponse(BaseModel):
    score: int
    label: str
    should_enhance: bool
    suggested_prompt: str | None = None
    improvements: list[str] | None = None


def _score_prompt(topic: str) -> int:
    words = topic.strip().split()
    score = 100

    n = len(words)
    # Short technical terms (e.g. "CAP Theorem", "Deadlocks") are specific
    # enough on their own — don't penalise them as heavily as genuinely vague
    # single words like "stuff" or "things".
    has_proper_noun = any(w[0].isupper() for w in words if w)
    if n == 1:
        score -= 20 if has_proper_noun else 40
    elif n < 4:
        score -= 10 if has_proper_noun else 20
    elif n < 7:
        score -= 5

    lower = {w.lower().rstrip(".,!?;:") for w in words}

    if not lower & ACTION_VERBS:
        score -= 10
    if not lower & SCOPE_WORDS:
        score -= 5
    if not lower & GOAL_WORDS:
        score -= 5
    if lower & COMPARISON_WORDS:
        score += 10

    return max(0, min(100, score))


def _label(score: int) -> str:
    if score <= 30:
        return "poor"
    if score <= 55:
        return "fair"
    if score <= 75:
        return "good"
    return "excellent"


def _build_suggestion(topic: str, course: str | None) -> tuple[str, list[str]]:
    domain = f" The course is: {course}." if course else ""
    llm = get_llm("quick_qa")
    resp = llm.invoke([
        SystemMessage(content=_SUGGEST_SYSTEM),
        HumanMessage(content=f"Topic: {topic}.{domain}"),
    ])
    raw = resp.content if hasattr(resp, "content") else str(resp)
    raw = raw.strip() if isinstance(raw, str) else str(raw)
    # strip optional markdown fences the model may add despite instructions
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    try:
        data = json.loads(raw)
        suggested = str(data.get("suggested_prompt", topic))
        improvements = [str(i) for i in data.get("improvements", [])]
    except (json.JSONDecodeError, AttributeError):
        suggested = topic
        improvements = []
    return suggested, improvements


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_prompt(req: AnalyzeRequest) -> AnalyzeResponse:
    topic = req.topic.strip()
    if not topic:
        return AnalyzeResponse(score=0, label="poor", should_enhance=True)

    score = _score_prompt(topic)
    label = _label(score)
    should_enhance = score < 70

    if not should_enhance:
        return AnalyzeResponse(score=score, label=label, should_enhance=False)

    from starlette.concurrency import run_in_threadpool
    suggested, improvements = await run_in_threadpool(_build_suggestion, topic, req.course)
    return AnalyzeResponse(
        score=score,
        label=label,
        should_enhance=True,
        suggested_prompt=suggested,
        improvements=improvements,
    )
