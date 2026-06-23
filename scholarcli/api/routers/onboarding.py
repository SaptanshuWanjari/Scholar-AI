"""Onboarding analysis endpoint — returns library stats and heuristic topic/concept extraction."""

from __future__ import annotations

from fastapi import APIRouter

from scholarcli.storage import get_session
from scholarcli.storage.models import Document

router = APIRouter(prefix="/api", tags=["onboarding"])

_STOP_WORDS = {
    "the", "and", "for", "with", "this", "that", "from", "your", "have",
    "into", "will", "about", "more", "also", "been", "each", "when", "they",
    "then", "some", "such", "their", "there", "these", "which", "where",
    "other", "using", "based", "used", "over", "under", "after", "before",
}


def _extract_concepts(titles: list[str]) -> list[str]:
    seen: set[str] = set()
    concepts: list[str] = []
    for title in titles:
        cleaned = title.replace("-", " ").replace("_", " ")
        for part in cleaned.split():
            word = part.strip(".,()[]")
            if len(word) > 4 and word.lower() not in _STOP_WORDS and word.isalpha():
                key = word.lower()
                if key not in seen:
                    seen.add(key)
                    concepts.append(word)
    return concepts[:12]


@router.get("/onboarding/analysis")
def library_analysis() -> dict:
    session = get_session()
    try:
        docs = session.query(Document).filter(Document.status == "indexed").all()
        total_pages = sum(d.pages or 0 for d in docs)

        # Topics: unique document titles (without extension)
        seen_topics: set[str] = set()
        topics: list[str] = []
        for d in docs:
            topic = d.title.rsplit(".", 1)[0].strip()
            if topic and topic.lower() not in seen_topics:
                seen_topics.add(topic.lower())
                topics.append(topic)

        concepts = _extract_concepts([d.title for d in docs])

        return {
            "documents": len(docs),
            "pages": total_pages,
            "topics": topics[:8],
            "concepts": concepts[:10],
            "sources": len(docs),
        }
    finally:
        session.close()
