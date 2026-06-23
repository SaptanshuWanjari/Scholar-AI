"""SQLAlchemy ORM models.

YAGNI for MVP: only Course + Document. Chunk text + metadata lives in
LanceDB — the vector store is the source of truth for chunks. Chat
history is kept in-memory in the TUI until persistence is justified.
"""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
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
