"""SQLAlchemy ORM models.

YAGNI for MVP: only Course + Document. Chunk text + metadata lives in
LanceDB — the vector store is the source of truth for chunks. Chat
history is kept in-memory in the TUI until persistence is justified.
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
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


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
    indexed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    course_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("courses.id"), nullable=False
    )
    course: Mapped["Course"] = relationship(back_populates="documents")


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
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    cards: Mapped[list["Card"]] = relationship(
        back_populates="deck", cascade="all, delete-orphan"
    )


class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    deck_id: Mapped[int] = mapped_column(Integer, ForeignKey("decks.id"), nullable=False)
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
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
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
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class Mindmap(Base):
    __tablename__ = "mindmaps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    text: Mapped[str] = mapped_column(Text, nullable=False)
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

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source_id: Mapped[int] = mapped_column(Integer, ForeignKey("concepts.id"), nullable=False)
    target_id: Mapped[int] = mapped_column(Integer, ForeignKey("concepts.id"), nullable=False)
    relation: Mapped[str] = mapped_column(String(64), nullable=False, default="related")


class ReadingState(Base):
    __tablename__ = "reading_state"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    document_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("documents.id"), unique=True, nullable=False
    )
    highlights: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    bookmarks: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    progress: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)


class Activity(Base):
    """Event log powering the dashboard (study stats, sessions, activity feed)."""

    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    kind: Mapped[str] = mapped_column(String(32), nullable=False)  # ask|flashcard|quiz|document|diagram|exam|note
    text: Mapped[str] = mapped_column(Text, nullable=False, default="")
    course: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    cards: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
