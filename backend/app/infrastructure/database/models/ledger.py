import uuid
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.infrastructure.database.base import Base

class JourneyLedger(Base):
    __tablename__ = "journey_ledgers"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    journey_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("journeys.id", ondelete="CASCADE"), unique=True, nullable=False)
    treasurer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    total_budget: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"))
    total_spent: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"))
    currency: Mapped[str] = mapped_column(String(3), default="USD")

    # Relationships
    journey: Mapped["Journey"] = relationship(back_populates="ledger")

class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    journey_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("journeys.id", ondelete="CASCADE"), nullable=False)
    payer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    exchange_rate: Mapped[Decimal] = mapped_column(Numeric(10, 6), default=Decimal("1.000000"))
    category: Mapped[str] = mapped_column(String(100), default="other")  # accommodation, transport, food, visa, other
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    expense_date: Mapped[date] = mapped_column(Date, default=date.today)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    journey: Mapped["Journey"] = relationship(back_populates="expenses")
    payer: Mapped["User"] = relationship(back_populates="expenses")
    splits: Mapped[list["ExpenseSplit"]] = relationship(back_populates="expense", cascade="all, delete-orphan")
    receipts: Mapped[list["Receipt"]] = relationship(back_populates="expense", cascade="all, delete-orphan")

class ExpenseSplit(Base):
    __tablename__ = "expense_splits"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    expense_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("expenses.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    share_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    settled: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    expense: Mapped["Expense"] = relationship(back_populates="splits")
    user: Mapped["User"] = relationship(back_populates="splits")

class Contribution(Base):
    __tablename__ = "contributions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    journey_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("journeys.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    payment_provider: Mapped[str] = mapped_column(String(50))  # stripe, yoco, ozow, manual
    provider_transaction_id: Mapped[str | None] = mapped_column(String(255), unique=True, index=True, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="pending")  # pending, completed, failed
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    settled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    journey: Mapped["Journey"] = relationship(back_populates="contributions")
    user: Mapped["User"] = relationship(back_populates="contributions")

class Receipt(Base):
    __tablename__ = "receipts"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    expense_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("expenses.id", ondelete="SET NULL"), nullable=True)
    uploader_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    file_url: Mapped[str] = mapped_column(String(500), nullable=False)
    ocr_status: Mapped[str] = mapped_column(String(50), default="pending")  # pending, processed, failed
    extracted_merchant: Mapped[str | None] = mapped_column(String(255), nullable=True)
    extracted_amount: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    extracted_tax: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    extracted_currency: Mapped[str | None] = mapped_column(String(3), nullable=True)
    extracted_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    ocr_payload: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    # Relationships
    expense: Mapped["Expense"] = relationship(back_populates="receipts")
