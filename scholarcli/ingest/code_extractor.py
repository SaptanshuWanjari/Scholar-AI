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

# ---------------------------------------------------------------------------
# Code detection
# ---------------------------------------------------------------------------

try:
    from magika import Magika as _Magika
    _magika: _Magika | None = _Magika()
    _MAGIKA_AVAILABLE = True
except Exception:  # noqa: BLE001
    _magika = None  # type: ignore[assignment]
    _MAGIKA_AVAILABLE = False

# Labels magika returns for plain text / non-code content
_MAGIKA_TEXT_LABELS = {"txt", "unknown"}

# Heuristic fallback: strong markers for code embedded inside prose chunks
# that magika labeled as plain text. Only includes patterns with low false-
# positive rates in natural English.
_CODE_HINTS: list[str] = [
    # Explicit markers
    "```", "#!/",
    # Python (high specificity)
    "def ", "class ", "import ", "yield ", "lambda ",
    # C / C++ / Java (context-specific)
    "#include", "public class", "public void", "printf(", "cout <<",
    # JS / TS
    "function ", "const ", "let ", "=>", "async ", "await ",
    # SQL (ALL CAPS is rare in natural prose)
    "SELECT ", "INSERT INTO", "UPDATE ", "DELETE FROM",
    "CREATE TABLE", "DROP TABLE",
    # Shell (command-like)
    "grep ", "awk ",
    # Code structure (specific contexts)
    "for (", "while (", "if (", "return ",
    "System.out", "console.log(",
]


def _heuristic_has_code(text: str) -> bool:
    if any(hint in text for hint in _CODE_HINTS):
        return True
    # Structural: >30 % of lines are indented (code blocks / pseudocode)
    lines = text.splitlines()
    if len(lines) > 3:
        indented = sum(1 for ln in lines if ln.startswith(("  ", "\t")))
        if indented / len(lines) > 0.30:
            return True
    return False


def _contains_code(text: str) -> bool:
    """Return True if *text* likely contains a code example.

    Uses magika (Google's AI content-type detector) as the primary signal,
    with an expanded heuristic list as a fallback for snippets embedded
    inside prose-heavy chunks that magika labels as plain text.
    """
    if _MAGIKA_AVAILABLE and _magika is not None:
        try:
            res = _magika.identify_bytes(text.encode("utf-8", errors="replace"))
            label = res.output.label
            if label not in _MAGIKA_TEXT_LABELS:
                return True
        except Exception as exc:  # noqa: BLE001
            logger.debug("magika detection failed, falling back to heuristics: %s", exc)
    # Heuristic fallback (also runs when magika labels chunk as plain text,
    # catching inline code snippets buried in prose).
    return _heuristic_has_code(text)

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

    if not _contains_code(text_chunk):
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
