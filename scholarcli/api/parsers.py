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
