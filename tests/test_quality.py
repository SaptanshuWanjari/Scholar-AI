"""Unit tests for the objective artifact quality scoring engine."""

from scholarcli.api.quality import (
    balance_entropy,
    grounding,
    lexical_coverage,
    redundancy,
    score_artifact,
)

# Synthetic source chunks (two documents) used across the artifact tests.
CHUNKS = [
    {
        "text": "A process is a program in execution. A thread is a lightweight unit "
                "of a process. The scheduler assigns CPU time to threads.",
        "_distance": 0.18,
        "document_id": 1,
    },
    {
        "text": "A deadlock occurs when processes wait on each other forever. "
                "Memory paging splits the address space into fixed pages.",
        "_distance": 0.30,
        "document_id": 2,
    },
]


# --- helpers ---------------------------------------------------------------

def test_lexical_coverage_bounds():
    assert lexical_coverage("anything", []) == 0.0
    kps = ["process", "thread", "scheduler"]
    assert lexical_coverage("the process and the thread", kps) == 2 / 3
    assert lexical_coverage("process thread scheduler", kps) == 1.0


def test_balance_entropy():
    assert balance_entropy([5]) == 0.0          # single bucket → no balance
    assert balance_entropy([3, 3]) == 1.0       # perfectly even → 1.0
    assert 0.0 < balance_entropy([9, 1]) < 1.0  # skewed → between


def test_redundancy_detects_duplicates():
    same = {"what", "process"}
    assert redundancy([same, same, same]) == 1.0
    assert redundancy([{"a", "b"}, {"c", "d"}]) == 0.0
    assert redundancy([{"only"}]) == 0.0        # <2 items


def test_grounding_empty_is_zero():
    score, chunks, docs = grounding([], "text")
    assert score == 0.0 and chunks == 0 and docs == 0


def test_grounding_counts_chunks_and_docs():
    score, chunks, docs = grounding(CHUNKS, "process thread scheduler")
    assert chunks == 2 and docs == 2
    assert score > 0.0


# --- per-artifact ----------------------------------------------------------

def test_flashcards_flags_redundancy_and_missing():
    cards = [
        {"front": "What is a process?", "back": "A program in execution"},
        {"front": "What is a process?", "back": "program execution"},  # duplicate
    ]
    q = score_artifact("flashcards", cards, CHUNKS, True)
    assert 0 <= q.overall <= 100
    assert q.redundancy and q.redundancy > 0
    assert q.sourceChunks == 2 and q.documents == 2


def test_quiz_flags_only_mcqs():
    questions = [
        {"type": "mcq", "prompt": "What is a process?", "options": ["a", "b", "c", "d"], "answer": "a"},
        {"type": "mcq", "prompt": "What is a thread?", "options": ["a", "b", "c", "d"], "answer": "b"},
    ]
    q = score_artifact("quiz", questions, CHUNKS, True)
    assert "Only MCQs" in q.notes
    assert q.diversity is not None and q.balance is not None


def test_mindmap_depth_not_flat():
    text = "Operating Systems\n├── Process\n│   ├── Thread\n│   └── Scheduling\n└── Memory\n    └── Paging"
    q = score_artifact("mindmap", text, CHUNKS, True)
    assert "Flat map" not in q.notes
    assert q.structure is not None and q.structure > 0


def test_mindmap_flat_is_flagged():
    q = score_artifact("mindmap", "Topic\n- one\n- two", CHUNKS, True)
    assert "Flat map" in q.notes


def test_diagram_connected_vs_orphan():
    good = "flowchart TD\n  A[Process] --> B[Thread]\n  B --> C[Scheduling]"
    qg = score_artifact("mermaid", good, CHUNKS, True)
    assert "Disconnected nodes" not in qg.notes
    assert "No logical flow" not in qg.notes

    orphan = "flowchart TD\n  A[Start]\n  B[Lonely]"
    qo = score_artifact("mermaid", orphan, CHUNKS, True)
    assert "No logical flow" in qo.notes


def test_difference_missing_contrasts():
    thin = "| Feature | Process | Thread |\n|---|---|---|\n| Memory | separate | shared |"
    q = score_artifact("differences", thin, CHUNKS, True)
    assert "Missing key contrasts" in q.notes  # only one data row


def test_ungrounded_has_zero_grounding():
    content = "| Feature | A | B |\n|---|---|---|\n| x | 1 | 2 |\n| y | 3 | 4 |"
    q = score_artifact("differences", content, [], False)
    assert q.grounding == 0
    assert q.sourceChunks == 0


def test_notes_structure_signals():
    md = ("# Process\n- A **process** is a program in execution.\n"
          "- Example: running a browser.\n## Thread\n- A **thread** is lightweight. "
          + "word " * 80)
    q = score_artifact("study_notes", md, CHUNKS, True)
    assert q.structure == 100  # headings + bullets + bold + example + length
    assert q.coverage is not None and q.grounding is not None
