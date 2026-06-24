"""Parse the LLM's text output (per prompts.py formats) into structured data.

The generator prompts ask for specific plain-text layouts (Q:/A: flashcards,
``Q1: ... A) ... Answer: B`` quizzes, raw Mermaid, indented mind maps). These
helpers turn that text into the dicts the frontend's typed models expect. They
are deliberately forgiving — models drift from the format, so we parse what we
can and skip the rest.
"""

from __future__ import annotations

import re


def _slug(prefix: str, i: int) -> str:
    return f"{prefix}-{i}"


def parse_flashcards(text: str, deck: str) -> list[dict]:
    """Parse ``Q: ... / A: ...`` pairs into flashcard dicts."""
    cards: list[dict] = []
    q: str | None = None
    a_lines: list[str] = []

    def flush() -> None:
        nonlocal q, a_lines
        if q and a_lines:
            front = q.strip()
            back = " ".join(a_lines).strip()
            cards.append(
                {
                    "id": _slug("fc", len(cards) + 1),
                    "type": "cloze" if "{{" in front else "basic",
                    "front": front,
                    "back": back,
                    "deck": deck,
                    "due": "Today",
                    "ease": "new",
                }
            )
        q, a_lines = None, []

    for raw in text.splitlines():
        line = raw.strip()
        if re.match(r"^Q[\d\.\):]*\s*[:\-]", line, re.IGNORECASE) or line.upper().startswith("Q:"):
            flush()
            q = re.sub(r"^Q[\d\.\):]*\s*[:\-]\s*", "", line, flags=re.IGNORECASE)
        elif re.match(r"^A[\d\.\):]*\s*[:\-]", line, re.IGNORECASE) or line.upper().startswith("A:"):
            a_lines = [re.sub(r"^A[\d\.\):]*\s*[:\-]\s*", "", line, flags=re.IGNORECASE)]
        elif line and a_lines:
            a_lines.append(line)
    flush()
    return cards


_OPT_RE = re.compile(r"^([A-D])[\)\.\:]\s*(.+)$")
_ANS_RE = re.compile(r"^Answer\s*[:\-]\s*([A-D])", re.IGNORECASE)
_Q_RE = re.compile(r"^Q\d*\s*[:\-\.]?\s*(.+)$", re.IGNORECASE)


def parse_quiz(text: str) -> list[dict]:
    """Parse the ``Q1: ... A) ... Answer: B`` quiz layout into question dicts."""
    import json
    # Try finding the first [ and last ] to extract JSON array
    start = text.find('[')
    end = text.rfind(']')
    if start != -1 and end != -1 and end > start:
        json_str = text[start:end+1]
        try:
            parsed = json.loads(json_str)
            if isinstance(parsed, list):
                questions = []
                for i, q in enumerate(parsed):
                    questions.append({
                        "id": _slug("qq", i + 1),
                        "type": q.get("type", "mcq"),
                        "prompt": q.get("prompt", ""),
                        "options": q.get("options", []),
                        "answer": q.get("answer", ""),
                        "explanation": q.get("explanation", ""),
                        "topic": q.get("topic", ""),  # carried through for PYQ-tagged exams
                    })
                if questions:
                    return questions
        except Exception:
            pass

    questions: list[dict] = []
    prompt: str | None = None
    options: dict[str, str] = {}
    answer_letter: str | None = None

    def flush() -> None:
        nonlocal prompt, options, answer_letter
        if prompt and options:
            opts = [options[k] for k in sorted(options)]
            ans_text = options.get(answer_letter or "", opts[0] if opts else "")
            questions.append(
                {
                    "id": _slug("qq", len(questions) + 1),
                    "type": "mcq",
                    "prompt": prompt.strip(),
                    "options": opts,
                    "answer": ans_text,
                    "explanation": "",
                }
            )
        prompt, options, answer_letter = None, {}, None

    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        opt = _OPT_RE.match(line)
        ans = _ANS_RE.match(line)
        if ans:
            answer_letter = ans.group(1).upper()
        elif opt:
            options[opt.group(1).upper()] = opt.group(2).strip()
        elif line.lower().startswith("q") and _Q_RE.match(line):
            # New question begins — flush the previous one.
            if prompt is not None:
                flush()
            prompt = _Q_RE.match(line).group(1)  # type: ignore[union-attr]
    flush()
    return questions


_DIFFICULTIES = {"easy": "Easy", "medium": "Medium", "hard": "Hard"}
_QTYPES = {
    "definition", "explanation", "comparison", "advantages", "architecture",
    "case_study", "numerical", "problem_solving", "short_answer", "long_answer", "other",
}
# Tolerate common synonyms the model may emit for the richer taxonomy.
_QTYPE_ALIASES = {
    "define": "definition", "definitions": "definition",
    "explain": "explanation", "explanations": "explanation", "describe": "explanation",
    "compare": "comparison", "comparisons": "comparison", "difference": "comparison",
    "advantage": "advantages", "advantages/disadvantages": "advantages",
    "pros_cons": "advantages", "merits": "advantages",
    "architecture": "architecture", "diagram": "architecture",
    "case": "case_study", "case study": "case_study", "casestudy": "case_study",
    "numerical": "numerical", "numericals": "numerical", "calculation": "numerical",
    "problem": "problem_solving", "problem solving": "problem_solving",
    "short": "short_answer", "short note": "short_answer", "short notes": "short_answer",
    "long": "long_answer", "essay": "long_answer",
}


def parse_pyq(text: str) -> list[dict]:
    """Parse an extracted-questions JSON array into PYQ question dicts.

    Forgiving like ``parse_quiz``: grab the first ``[`` … last ``]``, ``json.loads``,
    and skip/normalize bad items. Each item may carry ``text``/``question``,
    ``topic``, ``difficulty``, ``type``, ``marks``, ``year``.
    """
    import json

    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1 or end <= start:
        return []
    try:
        parsed = json.loads(text[start : end + 1])
    except Exception:
        return []
    if not isinstance(parsed, list):
        return []

    out: list[dict] = []
    for q in parsed:
        if not isinstance(q, dict):
            continue
        body = str(q.get("text") or q.get("question") or "").strip()
        if not body:
            continue
        diff = _DIFFICULTIES.get(str(q.get("difficulty", "")).strip().lower(), "Medium")
        qtype = str(q.get("type") or q.get("qtype") or "other").strip().lower().replace("-", "_")
        qtype = _QTYPE_ALIASES.get(qtype, qtype)
        if qtype not in _QTYPES:
            qtype = "other"
        subs = q.get("subtopics") or []
        if isinstance(subs, str):
            subs = [s.strip() for s in subs.split(",") if s.strip()]
        subtopics = [str(s).strip()[:128] for s in subs if str(s).strip()][:8] if isinstance(subs, list) else []
        marks = q.get("marks")
        try:
            marks = int(marks) if marks not in (None, "") else None
        except (TypeError, ValueError):
            marks = None
        year = q.get("year")
        try:
            year = int(year) if year not in (None, "") else None
        except (TypeError, ValueError):
            year = None
        out.append(
            {
                "text": body,
                "topic": str(q.get("topic") or "General").strip()[:256] or "General",
                "subtopics": subtopics,
                "difficulty": diff,
                "type": qtype,
                "marks": marks,
                "year": year,
            }
        )
    return out


def strip_mermaid_fences(text: str) -> str:
    """Remove ```mermaid fences and stray prose, returning bare diagram source."""
    t = text.strip()
    fence = re.search(r"```(?:mermaid)?\s*(.+?)```", t, re.DOTALL)
    if fence:
        return fence.group(1).strip()
    # Drop leading prose lines before the first diagram keyword.
    lines = t.splitlines()
    for i, line in enumerate(lines):
        if re.match(r"^\s*(graph|flowchart|sequenceDiagram|classDiagram|mindmap|erDiagram|stateDiagram)", line):
            return "\n".join(lines[i:]).strip()
    return t
