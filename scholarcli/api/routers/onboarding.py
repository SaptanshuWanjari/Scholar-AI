"""Onboarding analysis endpoint — returns library stats and heuristic topic/concept extraction."""

from __future__ import annotations

import json
import logging
import re
from fastapi import APIRouter, BackgroundTasks
from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.llm import get_llm
from scholarcli.storage import get_session
from scholarcli.storage.models import Document, Course, CodeExample
from scholarcli.storage.vectors import count_source_type, update_document_course

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["onboarding"])

_SYSTEM = """\
You are an intelligent academic library analyzer. You are given a list of documents (titles, tags, and summaries).
Your task is to analyze these documents and group them into logical courses, extract top concepts, top topics, collections, and recommend first actions.

Return ONLY a JSON object with this exact structure:
{
  "courses": [
    {
      "name": "Course Name (e.g. Operating Systems)",
      "document_ids": [1, 2, ...]
    }
  ],
  "concepts": ["Concept 1", "Concept 2", ...],
  "topics": ["Topic 1", "Topic 2", ...],
  "collections": ["Collection 1", ...],
  "actions": [
    {
      "type": "Read",
      "label": "Action label"
    }
  ]
}

Ensure all document IDs are placed into at least one course. Do not hallucinate IDs.
Output valid JSON only — no prose, no markdown fences.\
"""

def _do_background_prep():
    # Placeholder for async prep (e.g. caching, hierarchy gen).
    pass

@router.get("/onboarding/analysis")
def library_analysis(background_tasks: BackgroundTasks) -> dict:
    session = get_session()
    try:
        docs = session.query(Document).filter(Document.status == "indexed").all()
        
        doc_list_str = ""
        for d in docs:
            tags = ", ".join(d.tags) if d.tags else "None"
            topics = ", ".join(d.topics) if d.topics else "None"
            summary = d.summary or "No summary"
            doc_list_str += f"ID: {d.id} | Title: {d.title} | Tags: {tags} | Topics: {topics} | Summary: {summary}\n"

        result = {
            "documents": len(docs),
            "courses": [],
            "concepts": [],
            "topics": [],
            "collections": [],
            "actions": [],
            "stats": {
                "algorithms": session.query(CodeExample).count(),
                "tables": count_source_type("table"),
                "diagrams": count_source_type("diagram")
            }
        }

        if not docs:
            result["actions"] = [
                {"type": "Read", "label": "Import your first document"},
                {"type": "Teach Me", "label": "Take a tour of ScholarAI"},
                {"type": "Review", "label": "Setup your preferences"},
                {"type": "Explore", "label": "Connect external data sources"}
            ]
            return result

        try:
            llm = get_llm("quick_qa")
            resp = llm.invoke([
                SystemMessage(content=_SYSTEM),
                HumanMessage(content=f"Documents:\n{doc_list_str}")
            ])
            raw = (getattr(resp, "content", "") or "").strip()
            if raw.startswith("```"):
                raw = re.sub(r"^```[a-z]*\s*", "", raw, flags=re.MULTILINE)
                raw = raw.rstrip("` \n")
            start, end = raw.find("{"), raw.rfind("}")
            if start != -1 and end > start:
                data = json.loads(raw[start:end + 1])
                
                courses = data.get("courses", [])
                result["concepts"] = data.get("concepts", [])[:15]
                result["topics"] = data.get("topics", [])[:10]
                result["collections"] = data.get("collections", [])[:5]
                result["actions"] = data.get("actions", [])[:5]
                
                for c in courses:
                    cname = c.get("name", "General Library")
                    doc_ids = set(c.get("document_ids", []))
                    if not doc_ids:
                        continue
                        
                    from scholarcli.storage.models import get_or_create_course
                    course_obj = get_or_create_course(session, cname)
                    
                    docs_to_update = [d for d in docs if d.id in doc_ids]
                    for d in docs_to_update:
                        d.course_id = course_obj.id
                        update_document_course(d.id, course_obj.name)
                        
                    result["courses"].append(cname)
                session.commit()
                
        except Exception as exc:
            logger.warning("onboarding LLM analysis failed: %s", exc)

        if not result["courses"]:
            unique_courses = set()
            for d in docs:
                c = session.get(Course, d.course_id)
                if c:
                    unique_courses.add(c.name)
            result["courses"] = list(unique_courses)
            
        if not result["actions"]:
            result["actions"] = [
                {"type": "Read", "label": "Review imported documents"},
                {"type": "Teach Me", "label": "Explore workspace features"}
            ]

        background_tasks.add_task(_do_background_prep)

        return result
    finally:
        session.close()
