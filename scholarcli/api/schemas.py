"""Pydantic request/response models.

Field names use the exact camelCase keys the React frontend expects
(``sizeKb``, ``addedAt``) so responses serialize without extra aliasing.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel


# ---------------------------------------------------------------------------
# Artifact quality
# ---------------------------------------------------------------------------

class QualityScore(BaseModel):
    """Objective quality estimate for a generated artifact (see api/quality.py).

    Sub-scores are 0..100 ints; dimensions that don't apply to an artifact are
    left ``None`` and omitted from the response.
    """

    overall: int
    coverage: int | None = None
    grounding: int | None = None
    structure: int | None = None
    balance: int | None = None
    diversity: int | None = None
    redundancy: int | None = None
    sourceChunks: int = 0
    documents: int = 0
    notes: list[str] = []


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
    sourceType: str = "text"  # text | ocr | table | image | diagram
    imageUrl: str = ""


class AskRequest(BaseModel):
    question: str
    course: str | None = None
    document: str | None = None
    route: str | None = None  # force a study mode; None = let the router decide
    search_query: str | None = None
    sessionId: str | None = None  # persist this turn into a chat session
    rag_mode: str = "fallback"  # "strict" = only ingested docs; "fallback" = AI fills gaps
    socratic: bool = False  # guide user step-by-step instead of direct answer


# ---------------------------------------------------------------------------
# Chat history (cross-session persistence)
# ---------------------------------------------------------------------------

class ChatMessageOut(BaseModel):
    id: str
    role: Literal["user", "assistant"]
    content: str
    sources: list = []
    createdAt: str = ""


class ChatSessionMeta(BaseModel):
    id: str
    title: str
    course: str = ""
    messageCount: int = 0
    updatedAt: str = ""


class ChatSessionOut(ChatSessionMeta):
    messages: list[ChatMessageOut] = []


class ChatSessionCreate(BaseModel):
    course: str | None = None
    title: str | None = None


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
    systemPrompt: str | None = None


class CourseCreate(BaseModel):
    name: str
    systemPrompt: str | None = None


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


class DocumentUploadOut(DocumentOut):
    jobId: str


class DocumentPatch(BaseModel):
    course: str | None = None


# ---------------------------------------------------------------------------
# Background jobs
# ---------------------------------------------------------------------------

class JobOut(BaseModel):
    id: str
    kind: str
    status: str  # queued | running | done | failed
    label: str = ""
    result: dict | None = None
    error: str | None = None
    createdAt: str = ""
    updatedAt: str = ""


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


class TraceSourceStat(BaseModel):
    source: str
    weakCount: int = 0
    downCount: int = 0
    total: int = 0
    avgSimilarity: float = 0.0


class TraceAnalyticsOut(BaseModel):
    totalFlags: int = 0
    sources: list[TraceSourceStat] = []


class TraceFeedbackRequest(BaseModel):
    chunkId: str = ""
    source: str
    query: str = ""
    similarity: float = 0.0


# ---------------------------------------------------------------------------
# Settings / Models
# ---------------------------------------------------------------------------

class SettingsOut(BaseModel):
    fastModel: str
    reasoningModel: str
    embeddingModel: str
    visionModel: str
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
    ragMode: str = "fallback"  # "strict" | "fallback"
    usePromptEnhancer: bool = True


class SettingsPatch(BaseModel):
    fastModel: str | None = None
    reasoningModel: str | None = None
    embeddingModel: str | None = None
    visionModel: str | None = None
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
    ragMode: str | None = None
    usePromptEnhancer: bool | None = None


class ModelsList(BaseModel):
    fastModels: list[str]
    reasoningModels: list[str]
    embeddingModels: list[str]
    visionModels: list[str]


# ---------------------------------------------------------------------------
# Generative study features
# ---------------------------------------------------------------------------

class GenerateFlashcardsRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None
    count: int = 8
    rag_mode: str = "fallback"  # "strict" | "fallback"


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
    quality: QualityScore | None = None


class GenerateQuizRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None
    difficulty: Literal["Easy", "Medium", "Hard"] = "Medium"
    rag_mode: str = "fallback"


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
    quality: QualityScore | None = None
    session_answers: dict | None = None
    session_current_question: int | None = None
    session_started_at: str | None = None


class GenerateDiagramRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None
    type: str | None = None  # flowchart | decision_tree | concept_map
    rag_mode: str = "fallback"


class DiagramOut(BaseModel):
    id: str
    title: str
    course: str
    kind: str
    mermaid: str
    grounded: bool = True
    quality: QualityScore | None = None


class GenerateMindmapRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None
    rag_mode: str = "fallback"


class MindmapOut(BaseModel):
    id: str
    title: str
    course: str
    text: str
    grounded: bool = True
    quality: QualityScore | None = None


class GenerateRevisionRequest(BaseModel):
    topic: str | None = None
    course: str | None = None
    document: str | None = None
    format: Literal["notes", "concepts", "formulas", "summary"] = "notes"
    rag_mode: str = "fallback"


class RevisionOut(BaseModel):
    title: str
    markdown: str
    grounded: bool = True
    quality: QualityScore | None = None


class SaveRevisionRequest(BaseModel):
    title: str
    topic: str
    course: str | None = None
    format: Literal["notes", "concepts", "formulas", "summary"] = "notes"
    content: str
    quality: QualityScore | None = None


class SavedRevisionOut(BaseModel):
    id: str
    title: str
    topic: str
    course: str
    format: str
    content: str
    quality: QualityScore | None = None
    timestamp: float


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
    quality: QualityScore | None = None


class SaveDeckRequest(BaseModel):
    name: str
    course: str | None = None
    color: str | None = None
    cards: list[FlashcardOut] = []
    quality: QualityScore | None = None


class CardReview(BaseModel):
    ease: Literal["new", "learning", "mastered"]
    due: str | None = None


class SaveQuizRequest(BaseModel):
    title: str
    course: str | None = None
    difficulty: str = "Medium"
    questions: list[QuizQuestionOut] = []
    quality: QualityScore | None = None


class QuizSessionPatch(BaseModel):
    session_answers: dict
    session_current_question: int


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
    is_draft: bool = False


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
    is_draft: bool | None = None


class NotebookAssistRequest(BaseModel):
    action: Literal["explain", "summarize", "improve"] = "explain"
    text: str
    course: str | None = None


class NotebookAssistResponse(BaseModel):
    text: str


class NotebookDeduplicateRequest(BaseModel):
    notebook_id: int
    text: str


class NotebookDeduplicateResponse(BaseModel):
    redundant: bool
    similarity: float
    existing_block_index: int | None
    flagged_content: str | None


class NotebookAppendRequest(BaseModel):
    markdown_content: str
    artifact_type: str
    source_id: str
    force: bool = False


class NotebookAppendResponse(BaseModel):
    appended: bool
    redundant: bool
    similarity: float
    existing_block_index: int | None
    block_index: int | None


# ---------------------------------------------------------------------------
# Whiteboards (Excalidraw)
# ---------------------------------------------------------------------------

class WhiteboardMeta(BaseModel):
    id: str
    title: str
    course: str
    source: str = "manual"  # manual | ai | imported | selection
    status: str = "saved"   # draft | saved | archived
    thumbnail: str | None = None
    revisions: int = 0
    updated: str
    createdAt: str


class WhiteboardOut(BaseModel):
    id: str
    title: str
    course: str
    scene: dict = {}
    thumbnail: str | None = None
    source: str = "manual"
    status: str = "saved"
    quality: QualityScore | None = None
    updated: str
    createdAt: str


class WhiteboardCreate(BaseModel):
    title: str
    course: str | None = None
    scene: dict = {}
    thumbnail: str | None = None
    source: str = "manual"


class WhiteboardPatch(BaseModel):
    title: str | None = None
    course: str | None = None
    scene: dict | None = None
    thumbnail: str | None = None
    status: str | None = None


class WhiteboardRevisionOut(BaseModel):
    id: str
    whiteboardId: str
    revisionNumber: int
    changeSummary: str = ""
    scene: dict = {}
    createdAt: str


class WhiteboardRevisionCreate(BaseModel):
    scene: dict = {}
    change_summary: str = ""


class WhiteboardGenerateRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None
    type: str | None = None  # flowchart | decision_tree | concept_map
    rag_mode: str = "fallback"


class WhiteboardGenerateResponse(BaseModel):
    title: str
    mermaid: str
    grounded: bool = True


class WhiteboardAssistRequest(BaseModel):
    action: Literal["explain", "expand"] = "explain"
    text: str  # serialized canvas labels (explain) or a single node label (expand)
    course: str | None = None
    document: str | None = None


class WhiteboardAssistResponse(BaseModel):
    text: str = ""       # for "explain"
    mermaid: str = ""    # for "expand" (a sub-graph to merge)


# ---------------------------------------------------------------------------
# Reading
# ---------------------------------------------------------------------------

class ReadingParagraph(BaseModel):
    text: str
    page: int | None = None

class ReadingSectionOut(BaseModel):
    id: str
    number: str
    title: str
    paragraphs: list[ReadingParagraph]


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


class HighlightRect(BaseModel):
    x: float
    y: float
    width: float
    height: float


class HighlightCreate(BaseModel):
    text: str
    page_number: int = 1
    rects: list[HighlightRect] = []


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
    # When set, bias the generated exam toward the PYQ topic/difficulty mix of
    # this course (and record per-topic accuracy on submit).
    pyqCourse: str | None = None
    # Server-enforced time limit in minutes; 0 = untimed.
    durationMinutes: int = 0


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
    durationMinutes: int = 0
    remainingSeconds: int | None = None  # null = untimed


class ExamStatusOut(BaseModel):
    sessionId: str
    submitted: bool = False
    expired: bool = False
    durationMinutes: int = 0
    remainingSeconds: int | None = None  # null = untimed


class ExamSubmitRequest(BaseModel):
    answers: dict[str, str] = {}
    timeSpent: int | None = None


class ExamResultOut(BaseModel):
    score: int
    correct: float  # fractional with partial credit (e.g. 2.5 out of 5)
    total: int
    topicPerformance: list[dict] = []
    difficultyAnalysis: list[dict] = []
    review: list[dict] = []  # each item includes score: int (0-100) for partial credit
    recommendedRevisions: list[str] = []
    elapsedSeconds: int | None = None
    timedOut: bool = False


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


class ConceptMergeRequest(BaseModel):
    keepId: int
    dropId: int


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


# ---------------------------------------------------------------------------
# Concept Dependency Engine
# ---------------------------------------------------------------------------

class DepBuildRequest(BaseModel):
    course: str | None = None
    max_documents: int = 8


class DepBuildResponse(BaseModel):
    concepts: int
    edges: int


class DepLinkOut(BaseModel):
    id: str
    name: str
    difficulty: str
    masteryStatus: str


class DepConceptInspectorOut(BaseModel):
    id: str
    name: str
    definition: str
    difficulty: str
    importance: float
    estStudyTimeMin: int
    depth: int
    pyqFrequency: int
    masteryStatus: str
    masteryScore: float
    prerequisites: list[DepLinkOut] = []
    dependents: list[DepLinkOut] = []


class ReadinessMissing(BaseModel):
    id: str
    name: str
    masteryStatus: str
    reason: str


class ReadinessOut(BaseModel):
    concept: str | None = None
    ready: bool
    missing: list[ReadinessMissing] = []


# ---------------------------------------------------------------------------
# Differences
# ---------------------------------------------------------------------------

class GenerateDifferenceRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None


class DifferenceOut(BaseModel):
    title: str
    content: str
    grounded: bool = True
    quality: QualityScore | None = None


class SaveDifferenceRequest(BaseModel):
    title: str
    content: str
    course: str | None = None
    quality: QualityScore | None = None


class DifferenceTableItem(BaseModel):
    id: int
    title: str
    course: str
    content: str
    createdAt: str
    quality: QualityScore | None = None


# ---------------------------------------------------------------------------
# Teach Me — learning overview + saved packages
# ---------------------------------------------------------------------------

class TeachRequest(BaseModel):
    topic: str
    depth: Literal["quick", "standard", "deep"] = "standard"
    course: str | None = None
    document: str | None = None


class OverviewOut(BaseModel):
    title: str
    markdown: str
    grounded: bool = True
    sources: list[SourceOut] = []


class PackageIn(BaseModel):
    title: str
    course: str | None = None
    depth: str = "standard"
    overview: dict = {}
    artifacts: dict = {}
    sources: list = []


class PackageMeta(BaseModel):
    id: str
    title: str
    course: str
    depth: str
    artifactCount: int
    createdAt: str


class PackageOut(BaseModel):
    id: str
    title: str
    course: str
    depth: str
    overview: dict = {}
    artifacts: dict = {}
    sources: list = []
    createdAt: str
    updatedAt: str


class TeachDraftOut(BaseModel):
    session_id: str
    title: str
    draft_markdown: str
    grounded: bool = True
    sources: list[SourceOut] = []


class TeachResumeRequest(BaseModel):
    approved_notes_markdown: str
    artifacts_to_generate: list[str] = []


class TeachArtifactsOut(BaseModel):
    notes: dict | None = None
    flashcards: dict | None = None
    quiz: dict | None = None
    mindmap: dict | None = None
    diagram: dict | None = None
    difference: dict | None = None


# ---------------------------------------------------------------------------
# Learning Path — dependency-ordered roadmap
# ---------------------------------------------------------------------------

class GenerateLearningPathRequest(BaseModel):
    topic: str
    course: str | None = None
    document: str | None = None
    rag_mode: str = "fallback"


class LearningPathConcept(BaseModel):
    title: str
    summary: str = ""
    difficulty: str = "Medium"  # Easy|Medium|Hard
    estimatedMinutes: int = 0
    prerequisites: list[str] = []
    unlocks: list[str] = []
    status: str = "not_started"  # not_started|in_progress|completed|needs_revision|weak_area


class LearningPathStage(BaseModel):
    title: str
    summary: str = ""
    concepts: list[LearningPathConcept] = []


class LearningPathOverview(BaseModel):
    difficulty: str = "Intermediate"  # Beginner|Intermediate|Advanced
    conceptCount: int = 0
    estimatedHours: float = 0.0
    studySessions: int = 0
    recommendedPace: str = "1 session/day"


class NextRecommendation(BaseModel):
    conceptTitle: str
    reason: str
    estimatedMinutes: int = 0


class LearningProgress(BaseModel):
    conceptsDone: int = 0
    conceptsTotal: int = 0
    studyHoursDone: float = 0.0
    studyHoursTotal: float = 0.0
    percent: int = 0


class LearningAnalytics(BaseModel):
    strongestStage: str | None = None
    weakestStage: str | None = None
    mostRevisedTopic: str | None = None
    highestMistakeTopic: str | None = None
    conceptsSkipped: int = 0
    avgCompletionMinutes: int = 0


class LearningPathOut(BaseModel):
    id: str
    title: str
    course: str
    document: str = ""
    overview: LearningPathOverview
    stages: list[LearningPathStage] = []
    sources: list[SourceOut] = []
    grounded: bool = True
    archived: bool = False
    nextRecommendation: NextRecommendation | None = None
    progress: LearningProgress
    analytics: LearningAnalytics
    createdAt: str


class LearningPathMeta(BaseModel):
    id: str
    title: str
    course: str
    conceptCount: int
    archived: bool = False
    createdAt: str


class UpdateConceptStatusRequest(BaseModel):
    status: str  # not_started|in_progress|completed|needs_revision|weak_area


# ---------------------------------------------------------------------------
# PYQ analysis
# ---------------------------------------------------------------------------

class PyqPaperOut(BaseModel):
    id: int
    course: str
    title: str
    year: int | None = None
    questionCount: int
    createdAt: str


class PyqUploadResponse(BaseModel):
    paper: PyqPaperOut
    extracted: int


class PyqQuestionOut(BaseModel):
    id: int
    text: str
    topic: str
    subtopics: list[str] = []
    difficulty: str
    type: str
    marks: int | None = None
    year: int | None = None


class PyqQuestionPatch(BaseModel):
    text: str | None = None
    topic: str | None = None
    subtopics: list[str] | None = None
    difficulty: Literal["Easy", "Medium", "Hard"] | None = None
    type: str | None = None  # maps to PYQQuestion.qtype
    marks: int | None = None
    year: int | None = None


class PyqAnalysisOut(BaseModel):
    course: str
    papers: int
    totalQuestions: int
    yearsLabel: str = ""
    summary: dict = {}
    topicFrequency: list[dict] = []
    patterns: list[dict] = []
    difficulty: list[dict] = []
    marksDistribution: list[dict] = []
    yearTrends: list[dict] = []
    revisionRisk: list[dict] = []
    readiness: dict = {}


class PyqDifferenceSuggestion(BaseModel):
    a: str
    b: str
    topic: str
    count: int
    example: str


# ---------------------------------------------------------------------------
# Cross-Artifact Consistency Engine
# ---------------------------------------------------------------------------

class ConsistencyRequest(BaseModel):
    """Analyze in-memory Teach Me Package artifacts against their source."""

    sourceText: str
    artifacts: dict[str, dict] = {}  # {notes:{markdown}, flashcards:{cards}, quiz:{questions}, ...}


class ConsistencyLibraryRequest(BaseModel):
    """Analyze saved artifacts for a course (optionally a single document)."""

    course: str
    document: str | None = None  # document TITLE, optional


class ArtifactCoverage(BaseModel):
    artifact: str
    coverage: float
    covered: list[str] = []
    weak: list[str] = []
    missing: list[str] = []


class ConsistencySuggestion(BaseModel):
    artifactType: str  # notes | mindmap | diagram | difference
    label: str
    issue: str
    concepts: list[str] = []


class ConsistencyReport(BaseModel):
    canonicalConcepts: list[str] = []
    overallCoverage: float = 0.0
    artifacts: list[ArtifactCoverage] = []
    underrepresented: list[str] = []
    overrepresented: list[str] = []
    recommendations: list[str] = []
    suggestions: list[ConsistencySuggestion] = []


class ConsistencyApplyRequest(BaseModel):
    course: str
    artifactType: str  # notes | mindmap | diagram | difference
    concepts: list[str] = []


class ConsistencyApplyResponse(BaseModel):
    applied: bool
    artifactType: str
    preview: str = ""
    message: str = ""


# ---------------------------------------------------------------------------
# Pagination
# ---------------------------------------------------------------------------

class PaginatedResponse(BaseModel):
    items: list
    total: int


# ---------------------------------------------------------------------------
# Artifact Recommendation
# ---------------------------------------------------------------------------

class ArtifactRecommendRequest(BaseModel):
    topic: str
    courseId: int | None = None


class ArtifactRecommendation(BaseModel):
    artifact: str  # notes | flashcards | quiz | mindmap | diagram | difference
    stars: int     # 1-5
    reason: str


class ArtifactRecommendResponse(BaseModel):
    recommendations: list[ArtifactRecommendation]


# ---------------------------------------------------------------------------
# Course Workspace
# ---------------------------------------------------------------------------

class CourseStats(BaseModel):
    documents: int = 0
    flashcards: int = 0
    quizzes: int = 0
    notebooks: int = 0
    diagrams: int = 0
    mindmaps: int = 0
    whiteboards: int = 0
    difference_tables: int = 0
    revisions: int = 0
    concepts: int = 0
    total_artifacts: int = 0
    last_updated: str | None = None


class ArtifactItem(BaseModel):
    id: str
    title: str
    type: str  # deck | quiz | notebook | diagram | mindmap | whiteboard | difference_table | revision
    created_at: str
    source_doc_title: str | None = None
