import uuid
from datetime import datetime, date
from sqlalchemy import String, ForeignKey, DateTime, Date, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.infrastructure.database.base import Base

class Document(Base):
    __tablename__ = "documents"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    journey_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("journeys.id", ondelete="SET NULL"), nullable=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    document_type: Mapped[str] = mapped_column(String(50))  # visa, passport, insurance, other
    file_url: Mapped[str] = mapped_column(String(500), nullable=False)
    expiry_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    meta: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    # Relationships
    journey: Mapped["Journey"] = relationship(back_populates="documents")
    user: Mapped["User"] = relationship(back_populates="documents")

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    journey_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("journeys.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    assigned_to: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="todo")  # todo, in_progress, done
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    # Relationships
    journey: Mapped["Journey"] = relationship(back_populates="tasks")
    assignee: Mapped["User"] = relationship(back_populates="tasks")

class Vote(Base):
    __tablename__ = "votes"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    journey_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("journeys.id", ondelete="CASCADE"), nullable=False)
    question: Mapped[str] = mapped_column(String(255), nullable=False)
    options: Mapped[dict] = mapped_column(JSON, nullable=False)  # list of strings
    status: Mapped[str] = mapped_column(String(50), default="open")  # open, closed

    # Relationships
    journey: Mapped["Journey"] = relationship(back_populates="votes")
    user_votes: Mapped[list["UserVote"]] = relationship(back_populates="vote", cascade="all, delete-orphan")

class UserVote(Base):
    __tablename__ = "user_votes"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    vote_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("votes.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    selected_option: Mapped[str] = mapped_column(String(255), nullable=False)
    voted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    vote: Mapped["Vote"] = relationship(back_populates="user_votes")

class Approval(Base):
    __tablename__ = "approvals"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    journey_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("journeys.id", ondelete="CASCADE"), nullable=False)
    approver_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="pending")  # pending, approved, rejected
    comments: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    journey: Mapped["Journey"] = relationship(back_populates="approvals")
    approver: Mapped["User"] = relationship(back_populates="approvals")
