import uuid
from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.infrastructure.database.base import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    system_role: Mapped[str] = mapped_column(String(50), default="user")  # admin, user, travel_agent
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    profile: Mapped["Profile"] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    memberships: Mapped[list["JourneyMember"]] = relationship(back_populates="user")
    contributions: Mapped[list["Contribution"]] = relationship(back_populates="user")
    expenses: Mapped[list["Expense"]] = relationship(back_populates="payer")
    splits: Mapped[list["ExpenseSplit"]] = relationship(back_populates="user")
    tasks: Mapped[list["Task"]] = relationship(back_populates="assignee")
    documents: Mapped[list["Document"]] = relationship(back_populates="user")
    approvals: Mapped[list["Approval"]] = relationship(back_populates="approver")
    memories: Mapped[list["AIMemory"]] = relationship(back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    organisation_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("organisations.id", ondelete="SET NULL"), nullable=True)
    department_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    passport_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    passport_expiry: Mapped[datetime | None] = mapped_column(DateTime(timezone=False), nullable=True)
    country_code: Mapped[str] = mapped_column(String(3), nullable=False)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="profile")
    organisation: Mapped["Organisation"] = relationship(back_populates="profiles")
    department: Mapped["Department"] = relationship(back_populates="profiles")
