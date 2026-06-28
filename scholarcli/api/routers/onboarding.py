"""Onboarding analysis endpoint — returns library stats and heuristic topic/concept extraction."""

from __future__ import annotations

import logging
from collections import Counter

from fastapi import APIRouter

from scholarcli.storage import get_session
from scholarcli.storage.models import Document, Course
from scholarcli.storage.vectors import count_source_type

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["onboarding"])


@router.get("/onboarding/analysis")
def library_analysis() -> dict:
    session = get_session()
    try:
        docs = session.query(Document).filter(Document.status == "indexed").all()

        result: dict = {
            "documents": len(docs),
            "courses": [],
            "concepts": [],
            "topics": [],
            "collections": [],
            "actions": [],
            "stats": {
                "algorithms": 0,
                "tables": count_source_type("table"),
                "diagrams": count_source_type("diagram"),
            },
        }

        if not docs:
            result["actions"] = [
                {"type": "Read", "label": "Import your first document"},
                {"type": "Teach Me", "label": "Take a tour of ScholarAI"},
                {"type": "Review", "label": "Setup your preferences"},
            ]
            return result

        # Aggregate topics and concepts directly from indexed document metadata.
        all_topics: list[str] = []
        all_tags: list[str] = []
        for d in docs:
            all_topics.extend(d.topics or [])
            all_tags.extend(d.tags or [])

        result["topics"] = [t for t, _ in Counter(all_topics).most_common(10)]
        result["concepts"] = [t for t, _ in Counter(all_tags).most_common(15)]

        # Collect existing user-created courses (no AI creation).
        unique_courses: set[str] = set()
        for d in docs:
            if d.course_id:
                c = session.get(Course, d.course_id)
                if c:
                    unique_courses.add(c.name)
        result["courses"] = list(unique_courses)

        result["actions"] = [
            {"type": "Read", "label": "Review imported documents"},
            {"type": "Teach Me", "label": "Explore workspace features"},
        ]

        return result
    finally:
        session.close()
