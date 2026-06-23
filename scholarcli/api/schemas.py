"""Pydantic request/response models.

Field names use the exact camelCase keys the React frontend expects
(``sizeKb``, ``addedAt``) so responses serialize without extra aliasing.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel


# ---------------------------------------------------------------------------
# Sources / Ask
# ---------------------------------------------------------------------------

class SourceOut(BaseModel):
    id: str
    title: str
    page: int
    course: str
    snippet: str
    similarity: float


class AskRequest(BaseModel):
    question: str
    course: str | None = None
    document: str | None = None
    route: str | None = None  # force a study mode; None = let the router decide


class AskResponse(BaseModel):
    id: str
    role: Literal["assistant"] = "assistant"
    content: str
    sources: list[SourceOut] = []
    confidence: float | None = None
    grounded: bool = False
    route: str | None = None


# ---------------------------------------------------------------------------
# Courses
# ---------------------------------------------------------------------------

class CourseOut(BaseModel):
    id: str
    name: str
    code: str
    color: str
    documents: int
    flashcards: int
    progress: int


class CourseCreate(BaseModel):
    name: str


# ---------------------------------------------------------------------------
# Documents
# ---------------------------------------------------------------------------

class DocumentOut(BaseModel):
    id: str
    title: str
    type: str  # pdf | docx | markdown | text
    course: str
    sizeKb: int
    pages: int
    addedAt: str
    status: str  # indexed | processing | failed


# ---------------------------------------------------------------------------
# Trace
# ---------------------------------------------------------------------------

class TraceChunk(BaseModel):
    id: str
    source: str
    page: int
    similarity: float
    tokens: int
    text: str


class TraceOut(BaseModel):
    query: str | None = None
    route: str | None = None
    grounded: bool = False
    embeddingModel: str = ""
    vectorStore: str = "LanceDB"
    topK: int = 0
    documents: int = 0
    retrievedChunks: int = 0
    avgSimilarity: float = 0.0
    chunks: list[TraceChunk] = []


# ---------------------------------------------------------------------------
# Settings / Models
# ---------------------------------------------------------------------------

class SettingsOut(BaseModel):
    fastModel: str
    reasoningModel: str
    embeddingModel: str
    temperature: float
    topK: int
    similarityThreshold: float
    streaming: bool
    citationsInline: bool
    accent: str
    density: str
    industry: str = ""
    role: str = ""
    goals: str = ""
    interests: str = ""
    learningPreferences: str = ""


class SettingsPatch(BaseModel):
    fastModel: str | None = None
    reasoningModel: str | None = None
    embeddingModel: str | None = None
    temperature: float | None = None
    topK: int | None = None
    similarityThreshold: float | None = None
    streaming: bool | None = None
    citationsInline: bool | None = None
    accent: str | None = None
    density: str | None = None
    industry: str | None = None
    role: str | None = None
    goals: str | None = None
    interests: str | None = None
    learningPreferences: str | None = None


class ModelsList(BaseModel):
    fastModels: list[str]
    reasoningModels: list[str]
    embeddingModels: list[str]


# ---------------------------------------------------------------------------
# Generative study features
# ---------------------------------------------------------------------------

class GenerateFlashcardsRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None
    count: int = 8


class FlashcardOut(BaseModel):
    id: str
    type: Literal["basic", "cloze"] = "basic"
    front: str
    back: str
    deck: str
    due: str = "Today"
    ease: Literal["new", "learning", "mastered"] = "new"


class FlashcardSet(BaseModel):
    deck: str
    course: str | None = None
    grounded: bool = True
    cards: list[FlashcardOut] = []


class GenerateQuizRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None
    difficulty: Literal["Easy", "Medium", "Hard"] = "Medium"


class QuizQuestionOut(BaseModel):
    id: str
    type: Literal["mcq", "truefalse", "short"] = "mcq"
    prompt: str
    options: list[str] | None = None
    answer: str
    explanation: str = ""


class QuizOut(BaseModel):
    id: str
    title: str
    course: str
    difficulty: str
    grounded: bool = True
    questions: list[QuizQuestionOut] = []


class GenerateDiagramRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None
    type: str | None = None  # flowchart | decision_tree | concept_map


class DiagramOut(BaseModel):
    id: str
    title: str
    course: str
    kind: str
    mermaid: str
    grounded: bool = True


class GenerateMindmapRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None


class MindmapOut(BaseModel):
    id: str
    title: str
    course: str
    text: str
    grounded: bool = True


class GenerateRevisionRequest(BaseModel):
    topic: str | None = None
    course: str | None = None
    document: str | None = None
    format: Literal["notes", "concepts", "formulas", "summary"] = "notes"


class RevisionOut(BaseModel):
    title: str
    markdown: str
    grounded: bool = True


class SearchResultOut(BaseModel):
    id: str
    group: str
    title: str
    snippet: str
    course: str


# ---------------------------------------------------------------------------
# Persistence: decks / cards / quizzes
# ---------------------------------------------------------------------------

class DeckOut(BaseModel):
    id: str
    name: str
    course: str
    color: str
    cards: int
    mastered: int


class SaveDeckRequest(BaseModel):
    name: str
    course: str | None = None
    color: str | None = None
    cards: list[FlashcardOut] = []


class CardReview(BaseModel):
    ease: Literal["new", "learning", "mastered"]
    due: str | None = None


class SaveQuizRequest(BaseModel):
    title: str
    course: str | None = None
    difficulty: str = "Medium"
    questions: list[QuizQuestionOut] = []


# ---------------------------------------------------------------------------
# Notebooks
# ---------------------------------------------------------------------------

class NotebookMetaOut(BaseModel):
    id: str
    name: str
    course: str
    color: str
    notes: int
    lastEdited: str


class NotebookOut(BaseModel):
    id: str
    title: str
    subtitle: str
    course: str
    color: str
    blocks: list = []
    tags: list[str] = []
    updated: str


class CollectionOut(BaseModel):
    id: str
    name: str
    count: int


class NotebookCreate(BaseModel):
    title: str
    course: str | None = None
    subtitle: str | None = None
    color: str | None = None
    tags: list[str] | None = None


class NotebookPatch(BaseModel):
    title: str | None = None
    subtitle: str | None = None
    blocks: list | None = None
    color: str | None = None
    tags: list[str] | None = None


class NotebookAssistRequest(BaseModel):
    action: Literal["explain", "summarize", "improve"] = "explain"
    text: str
    course: str | None = None


class NotebookAssistResponse(BaseModel):
    text: str


# ---------------------------------------------------------------------------
# Reading
# ---------------------------------------------------------------------------

class ReadingSectionOut(BaseModel):
    id: str
    number: str
    title: str
    paragraphs: list[str]


class ReadingDocOut(BaseModel):
    id: str
    title: str
    author: str = ""
    kind: str = ""
    pages: int = 0
    sections: list[ReadingSectionOut] = []
    highlights: list[dict] = []
    bookmarks: list[dict] = []
    progress: float = 0.0


class HighlightCreate(BaseModel):
    text: str
    section: str = ""


class BookmarkCreate(BaseModel):
    section: str
    note: str = ""


class LensResponse(BaseModel):
    level: str
    text: str


# ---------------------------------------------------------------------------
# Exam
# ---------------------------------------------------------------------------

class ExamGenerateRequest(BaseModel):
    topic: str | None = None
    course: str | None = None
    document: str | None = None
    difficulty: Literal["Easy", "Medium", "Hard"] = "Medium"
    count: int = 8
    types: list[Literal["mcq", "truefalse", "short", "long"]] = ["mcq"]


class ExamQuestionOut(BaseModel):
    id: str
    type: Literal["mcq", "truefalse", "short", "long"] = "mcq"
    topic: str
    difficulty: str
    prompt: str
    options: list[str] | None = None
    answer: str | None = None


class ExamSessionOut(BaseModel):
    sessionId: str
    questions: list[ExamQuestionOut]
    grounded: bool = True


class ExamSubmitRequest(BaseModel):
    answers: dict[str, str] = {}
    timeSpent: int | None = None


class ExamResultOut(BaseModel):
    score: int
    correct: int
    total: int
    topicPerformance: list[dict] = []
    difficultyAnalysis: list[dict] = []
    review: list[dict] = []
    recommendedRevisions: list[str] = []


# ---------------------------------------------------------------------------
# Knowledge graph
# ---------------------------------------------------------------------------

class KGBuildRequest(BaseModel):
    course: str | None = None
    max_documents: int = 8


class KGBuildResponse(BaseModel):
    concepts: int
    edges: int


class KGNode(BaseModel):
    id: str
    label: str
    description: str
    size: Literal["large", "medium", "small"]
    refCount: int
    sourceCount: int
    cluster: str


class KGEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str


class KGGraphOut(BaseModel):
    nodes: list[KGNode] = []
    edges: list[KGEdge] = []


class ConceptInspectorOut(BaseModel):
    id: str
    name: str
    confidence: float
    refCount: int
    sourceCount: int
    description: str
    definition: str
    aiSummary: str
    relatedConcepts: list[str] = []
    referencedIn: dict = {}
    citations: list[dict] = []
