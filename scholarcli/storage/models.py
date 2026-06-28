"""SQLAlchemy ORM models.

YAGNI for MVP: only Course + Document. Chunk text + metadata lives in
LanceDB — the vector store is the source of truth for chunks. Chat
history is kept in-memory until persistence is justified.
"""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session
import re

def get_course(session: Session, name: str | None) -> "Course" | None:
    if not name:
        return None

    def is_similar(n1: str, n2: str) -> bool:
        n1, n2 = n1.lower().strip(), n2.lower().strip()
        if n1 == n2: return True
        a1 = "".join(w[0] for w in re.split(r'\W+', n1) if w)
        a2 = "".join(w[0] for w in re.split(r'\W+', n2) if w)
        if (len(a1) > 1 and a1 == n2.replace(" ", "")) or (len(a2) > 1 and a2 == n1.replace(" ", "")):
            return True
        return False

    exact = session.query(Course).filter(func.lower(Course.name) == name.lower().strip()).first()
    if exact:
        return exact

    for existing in session.query(Course).all():
        if is_similar(name, existing.name):
            return existing
    
    return None

class Base(DeclarativeBase):
    pass


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(256), unique=True, nullable=False)

    documents: Mapped[list["Document"]] = relationship(
        back_populates="course", cascade="all, delete-orphan"
    )


class Document(Base):
    __tablename__ = "documents"
    __table_args__ = (
        UniqueConstraint("path", "course_id", name="uq_document_path_course"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    path: Mapped[str] = mapped_column(Text, nullable=False)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    file_type: Mapped[str] = mapped_column(String(16), nullable=False)  # pdf, md, txt
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    # Display metadata surfaced by the HTTP API / frontend.
    size_kb: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    pages: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[str] = mapped_column(
        String(16), nullable=False, default="indexed"
    )  # indexed, processing, failed
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    tags: Mapped[list | None] = mapped_column(JSON, nullable=True)
    topics: Mapped[list | None] = mapped_column(JSON, nullable=True)
    indexed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    course_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("courses.id"), nullable=True, index=True
    )
    course: Mapped["Course"] = relationship(back_populates="documents")
    code_examples: Mapped[list["CodeExample"]] = relationship(
        back_populates="document", cascade="all, delete-orphan"
    )


# ---------------------------------------------------------------------------
# Persistence for generated study artifacts (decks, quizzes, notebooks, KG).
# Nested structures (quiz questions, notebook blocks) are stored as JSON to
# avoid premature normalization.
# ---------------------------------------------------------------------------

class Deck(Base):
    __tablename__ = "decks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    color: Mapped[str] = mapped_column(String(16), nullable=False, default="#4f4d7a")
    # Dependency-engine link for exact mastery rollup (null = unlinked).
    concept_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("dep_concepts.id"), nullable=True, index=True
    )
    quality_score: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    cards: Mapped[list["Card"]] = relationship(
        back_populates="deck", cascade="all, delete-orphan"
    )


class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    deck_id: Mapped[int] = mapped_column(Integer, ForeignKey("decks.id"), nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(16), nullable=False, default="basic")
    front: Mapped[str] = mapped_column(Text, nullable=False)
    back: Mapped[str] = mapped_column(Text, nullable=False)
    due: Mapped[str] = mapped_column(String(32), nullable=False, default="Today")
    ease: Mapped[str] = mapped_column(String(16), nullable=False, default="new")

    deck: Mapped["Deck"] = relationship(back_populates="cards")


class SavedQuiz(Base):
    __tablename__ = "quizzes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    difficulty: Mapped[str] = mapped_column(String(16), nullable=False, default="Medium")
    questions: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    quality_score: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    session_answers: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    session_current_question: Mapped[int | None] = mapped_column(Integer, nullable=True)
    session_started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )


class Notebook(Base):
    __tablename__ = "notebooks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    subtitle: Mapped[str] = mapped_column(Text, nullable=False, default="")
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    color: Mapped[str] = mapped_column(String(16), nullable=False, default="#4f4d7a")
    blocks: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    tags: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    is_draft: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Diagram(Base):
    __tablename__ = "diagrams"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    kind: Mapped[str] = mapped_column(String(64), nullable=False, default="Flowchart")
    mermaid: Mapped[str] = mapped_column(Text, nullable=False)
    quality_score: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class Mindmap(Base):
    __tablename__ = "mindmaps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    text: Mapped[str] = mapped_column(Text, nullable=False)
    quality_score: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class Whiteboard(Base):
    """An interactive Excalidraw canvas — a first-class visual artifact.

    The full Excalidraw scene ({elements, appState, files}) is stored as JSON;
    a rendered SVG/PNG ``thumbnail`` is cached for cards and search results.
    Each save can snapshot a ``WhiteboardRevision`` for version history.
    """

    __tablename__ = "whiteboards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    scene: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    thumbnail: Mapped[str | None] = mapped_column(Text, nullable=True)
    source: Mapped[str] = mapped_column(
        String(16), nullable=False, default="manual"
    )  # manual|ai|imported|selection
    status: Mapped[str] = mapped_column(
        String(16), nullable=False, default="saved"
    )  # draft|saved|archived
    # Dependency-engine / knowledge-graph link (null = unlinked).
    concept_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("dep_concepts.id"), nullable=True, index=True
    )
    quality_score: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    revisions: Mapped[list["WhiteboardRevision"]] = relationship(
        back_populates="whiteboard", cascade="all, delete-orphan"
    )


class WhiteboardRevision(Base):
    """A point-in-time snapshot of a whiteboard's scene for version history."""

    __tablename__ = "whiteboard_revisions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    whiteboard_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("whiteboards.id"), nullable=False, index=True
    )
    revision_number: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    scene: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    change_summary: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    whiteboard: Mapped["Whiteboard"] = relationship(back_populates="revisions")


class DifferenceTable(Base):
    __tablename__ = "difference_tables"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    content: Mapped[str] = mapped_column(Text, nullable=False)
    quality_score: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class SavedRevision(Base):
    __tablename__ = "revisions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    topic: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    format: Mapped[str] = mapped_column(String(64), nullable=False, default="notes")
    content: Mapped[str] = mapped_column(Text, nullable=False)
    # Dependency-engine link for exact mastery rollup (null = unlinked).
    concept_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("dep_concepts.id"), nullable=True, index=True
    )
    quality_score: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class Prompt(Base):
    """A user-customizable system prompt for a generation category.

    Built-in prompts (``built_in=True``) are seeded from the RAG defaults and
    cannot be edited or deleted; users clone or author their own variants.
    Exactly one prompt per category is ``active`` and drives generation.
    """

    __tablename__ = "prompts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    # Maps to a RAG route: quick_qa|flashcards|quiz|mermaid|mindmap|study_notes
    category: Mapped[str] = mapped_column(String(32), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    style: Mapped[str] = mapped_column(String(32), nullable=False, default="")
    body: Mapped[str] = mapped_column(Text, nullable=False)
    built_in: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Concept(Base):
    __tablename__ = "concepts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(256), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    definition: Mapped[str] = mapped_column(Text, nullable=False, default="")
    summary: Mapped[str] = mapped_column(Text, nullable=False, default="")
    cluster: Mapped[str] = mapped_column(String(16), nullable=False, default="rag")
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    ref_count: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    source_count: Mapped[int] = mapped_column(Integer, nullable=False, default=1)


class ConceptEdge(Base):
    __tablename__ = "concept_edges"
    __table_args__ = (UniqueConstraint("source_id", "target_id"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source_id: Mapped[int] = mapped_column(Integer, ForeignKey("concepts.id"), nullable=False, index=True)
    target_id: Mapped[int] = mapped_column(Integer, ForeignKey("concepts.id"), nullable=False, index=True)
    relation: Mapped[str] = mapped_column(String(64), nullable=False, default="related")


# ---------------------------------------------------------------------------
# Concept Dependency Engine — a directed *prerequisite* graph, kept separate
# from the knowledge graph (Concept/ConceptEdge) above. Concepts are upserted
# by (name, course) so their ids stay stable: performance rows (TopicStat,
# Deck, ...) carry a nullable concept_id FK pointing here for exact mastery.
# ---------------------------------------------------------------------------

class DepConcept(Base):
    __tablename__ = "dep_concepts"
    __table_args__ = (
        UniqueConstraint("name", "course", name="uq_dep_concept_name_course"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    definition: Mapped[str] = mapped_column(Text, nullable=False, default="")
    difficulty: Mapped[str] = mapped_column(String(16), nullable=False, default="Medium")  # Easy|Medium|Hard
    importance: Mapped[float] = mapped_column(Float, nullable=False, default=0.5)  # 0-1
    est_study_time_min: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    depth: Mapped[int] = mapped_column(Integer, nullable=False, default=0)  # topological learning depth


class DependencyEdge(Base):
    """A directed prerequisite link: prereq_id must be learned before concept_id."""

    __tablename__ = "dependency_edges"
    __table_args__ = (UniqueConstraint("prereq_id", "concept_id"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    prereq_id: Mapped[int] = mapped_column(Integer, ForeignKey("dep_concepts.id"), nullable=False, index=True)
    concept_id: Mapped[int] = mapped_column(Integer, ForeignKey("dep_concepts.id"), nullable=False, index=True)
    reason: Mapped[str] = mapped_column(Text, nullable=False, default="")
    confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.5)


class ReadingState(Base):
    __tablename__ = "reading_state"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    document_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("documents.id"), unique=True, nullable=False, index=True
    )
    highlights: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    bookmarks: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    progress: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)


class QuestionPaper(Base):
    """An uploaded previous-year question paper (PYQ)."""

    __tablename__ = "question_papers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    source_document: Mapped[str] = mapped_column(String(512), nullable=False, default="")
    question_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    questions: Mapped[list["PYQQuestion"]] = relationship(
        back_populates="paper", cascade="all, delete-orphan"
    )


class PYQQuestion(Base):
    """A single question extracted from a question paper."""

    __tablename__ = "pyq_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    paper_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("question_papers.id"), nullable=False, index=True
    )
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    topic: Mapped[str] = mapped_column(String(256), nullable=False, default="General")
    subtopics: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    difficulty: Mapped[str] = mapped_column(String(16), nullable=False, default="Medium")  # Easy|Medium|Hard
    # definition|explanation|comparison|advantages|architecture|case_study|numerical|problem_solving|short_answer|long_answer|other
    qtype: Mapped[str] = mapped_column(String(32), nullable=False, default="other")
    marks: Mapped[int | None] = mapped_column(Integer, nullable=True)

    paper: Mapped["QuestionPaper"] = relationship(back_populates="questions")


class TopicStat(Base):
    """Accumulated per-topic answer accuracy for a course (the feedback loop)."""

    __tablename__ = "topic_stats"
    __table_args__ = (
        UniqueConstraint("course", "topic", name="uq_topic_stat_course_topic"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    topic: Mapped[str] = mapped_column(String(256), nullable=False)
    # Dependency-engine link for exact mastery rollup (null = unlinked).
    concept_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("dep_concepts.id"), nullable=True, index=True
    )
    correct: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    total: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_attempt: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )


class LearningPackage(Base):
    """A saved ``/teach`` workspace — a topic's whole mini-course bundled into
    one row. Overview, per-artifact payloads and sources are stored as JSON so
    the entire workspace can be restored without re-generating anything.
    """

    __tablename__ = "learning_packages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)  # the topic
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    depth: Mapped[str] = mapped_column(String(16), nullable=False, default="standard")  # quick|standard|deep
    # Dependency-engine link for exact mastery rollup (null = unlinked).
    concept_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("dep_concepts.id"), nullable=True, index=True
    )
    overview: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)  # {markdown, grounded}
    artifacts: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)  # {notes, flashcards, quiz, mindmap, diagram, difference}
    sources: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class LearningPath(Base):
    """A saved Learning Path roadmap — a dependency-ordered set of stages and
    concepts inferred from the student's material, stored as one JSON snapshot.
    Per-concept ``status`` lives inside the ``stages`` JSON.
    """

    __tablename__ = "learning_paths"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)  # the topic
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    document: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    overview: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    stages: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    sources: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    grounded: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    archived: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class ExamSession(Base):
    """Durable exam session — persists generate → submit across process restarts."""

    __tablename__ = "exam_sessions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    topic: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str | None] = mapped_column(String(128), nullable=True)
    questions: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    submitted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    # Server-side time enforcement. duration_minutes==0 means untimed.
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )


class Activity(Base):
    """Event log powering the dashboard (study stats, sessions, activity feed)."""

    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    kind: Mapped[str] = mapped_column(String(32), nullable=False, index=True)  # ask|flashcard|quiz|document|diagram|exam|note
    text: Mapped[str] = mapped_column(Text, nullable=False, default="")
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="", index=True)
    minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    cards: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


# ---------------------------------------------------------------------------
# Chat history (cross-session Q&A persistence).
# ---------------------------------------------------------------------------

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False, default="New chat")
    course: Mapped[str | None] = mapped_column(String(256), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    messages: Mapped[list["ChatMessage"]] = relationship(
        back_populates="session", cascade="all, delete-orphan"
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("chat_sessions.id"), nullable=False, index=True
    )
    role: Mapped[str] = mapped_column(String(16), nullable=False)  # user|assistant
    content: Mapped[str] = mapped_column(Text, nullable=False, default="")
    sources: Mapped[list | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    session: Mapped["ChatSession"] = relationship(back_populates="messages")


# ---------------------------------------------------------------------------
# Durable background jobs (e.g. document ingestion) — survive a reload so the
# UI can poll progress instead of holding it only in request-scoped state.
# ---------------------------------------------------------------------------

class BackgroundJob(Base):
    __tablename__ = "background_jobs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    kind: Mapped[str] = mapped_column(String(32), nullable=False)  # ingest|...
    status: Mapped[str] = mapped_column(
        String(16), nullable=False, default="queued"
    )  # queued|running|done|failed
    label: Mapped[str] = mapped_column(String(512), nullable=False, default="")
    payload: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    result: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )





# ---------------------------------------------------------------------------
# Retrieval-trace analytics — which chunks consistently show up in weak (low
# confidence / ungrounded) generations, plus manual thumbs-down feedback.
# ---------------------------------------------------------------------------

class ChunkFeedback(Base):
    __tablename__ = "chunk_feedback"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    query: Mapped[str] = mapped_column(Text, nullable=False, default="")
    chunk_id: Mapped[str] = mapped_column(String(128), nullable=False, default="")
    source: Mapped[str] = mapped_column(String(512), nullable=False, default="")
    similarity: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    verdict: Mapped[str] = mapped_column(String(16), nullable=False, default="weak")  # weak|down
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class CodeExample(Base):
    """Automatically extracted programming example."""

    __tablename__ = "code_examples"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    document_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False
    )
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    title: Mapped[str] = mapped_column(String(256), nullable=False, default="Untitled Example")
    language: Mapped[str] = mapped_column(String(64), nullable=False, default="Unknown")
    topic: Mapped[str] = mapped_column(String(256), nullable=False, default="General")
    difficulty: Mapped[str] = mapped_column(String(32), nullable=False, default="Intermediate")
    example_type: Mapped[str] = mapped_column(String(64), nullable=False, default="code")
    page_number: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    
    code: Mapped[str] = mapped_column(Text, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False, default="")
    purpose: Mapped[str] = mapped_column(Text, nullable=False, default="")
    inputs: Mapped[str] = mapped_column(Text, nullable=False, default="")
    outputs: Mapped[str] = mapped_column(Text, nullable=False, default="")
    time_complexity: Mapped[str] = mapped_column(String(128), nullable=False, default="")
    space_complexity: Mapped[str] = mapped_column(String(128), nullable=False, default="")
    common_mistakes: Mapped[str] = mapped_column(Text, nullable=False, default="")
    important_notes: Mapped[str] = mapped_column(Text, nullable=False, default="")
    
    related_concepts: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    used_in_quiz: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    used_in_pyq: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    
    document: Mapped["Document"] = relationship(back_populates="code_examples")


class PageOcrCache(Base):
    """Per-page OCR cache keyed on sha256 of the rendered PNG bytes."""

    __tablename__ = "page_ocr_cache"

    image_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    ocr_text: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
