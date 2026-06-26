"""LLM-based document code example extraction.

Scans document chunks for code-like regions and extracts structured
CodeExample payloads (code, language, complexity, explanation, etc.).
"""

from __future__ import annotations

import json
import logging
import re
from typing import Any

from langchain_core.messages import HumanMessage, SystemMessage

from scholarcli.llm import get_llm

logger = logging.getLogger(__name__)

_SYSTEM = """\
You are a code example extractor for academic and engineering documents.
Your task is to scan the provided document text and extract any significant code snippets, pseudocode, algorithms, SQL queries, shell commands, or configuration files.

For each example found, return a JSON object in a list. If no examples are found, return an empty list: `[]`.

Each JSON object MUST have these exact keys:
- "title": A short, descriptive title (e.g., "Bubble Sort in C++").
- "language": The programming language, or "Pseudocode", "SQL", "Shell", "JSON", etc.
- "topic": The general computer science topic (e.g., "Sorting", "Database Management").
- "difficulty": "Beginner", "Intermediate", or "Advanced".
- "example_type": "code", "pseudocode", "sql", "shell", "config", "algorithm", etc.
- "code": The EXACT extracted code/snippet, preserving all original formatting, indentation, and errors. Do not optimize it.
- "explanation": A brief explanation of what the code does.
- "purpose": Why this example exists (what concept it demonstrates).
- "inputs": Description of expected inputs (or empty string).
- "outputs": Description of expected outputs (or empty string).
- "time_complexity": Big-O time complexity if applicable (or empty string).
- "space_complexity": Big-O space complexity if applicable (or empty string).
- "common_mistakes": Common pitfalls related to this concept (or empty string).
- "important_notes": Any other important notes (or empty string).

Output ONLY valid JSON (a list of objects) — no markdown fences, no conversational prose.\
"""

def extract_code_examples(text_chunk: str, course_name: str) -> list[dict[str, Any]]:
    """Extract code examples from a text chunk.
    
    Returns a list of dictionaries matching the JSON schema above.
    """
    if not text_chunk.strip():
        return []

    # Quick heuristic check: only run LLM if we see signs of code (braces, indents, keywords, monospace hints)
    # This avoids expensive LLM calls on pure prose pages.
    code_hints = [
        "```", "def ", "class ", "public class", "public void ", "SELECT * FROM",
        "function ", "import ", "#include", "const ", "let ", "=>"
    ]
    if not any(hint in text_chunk for hint in code_hints):
        return []

    try:
        # Use quick_qa model or a dedicated extraction model if configured
        llm = get_llm("quick_qa")
        resp = llm.invoke([
            SystemMessage(content=_SYSTEM),
            HumanMessage(content=f"Document text (Course: {course_name}):\n\n{text_chunk}"),
        ])
        raw = (getattr(resp, "content", "") or "").strip()
        
        # Strip markdown fences
        if raw.startswith("```"):
            raw = re.sub(r"^```[a-z]*\s*", "", raw, flags=re.MULTILINE)
            raw = raw.rstrip("` \n")
            
        start = raw.find("[")
        end = raw.rfind("]")
        
        if start != -1 and end > start:
            data = json.loads(raw[start:end + 1])
            if isinstance(data, list):
                return data
                
    except Exception as exc:  # noqa: BLE001
        logger.warning("Code extraction failed for chunk: %s", exc)
        
    return []
