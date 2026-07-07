import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Numeric, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.infrastructure.database.base import Base

class Organisation(Base):
    __tablename__ = "organisations"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    profiles: Mapped[list["Profile"]] = relationship(back_populates="organisation")
    departments: Mapped[list["Department"]] = relationship(back_populates="organisation", cascade="all, delete-orphan")
    journeys: Mapped[list["Journey"]] = relationship(back_populates="organisation")
    travel_policy: Mapped["TravelPolicy"] = relationship(back_populates="organisation", uselist=False, cascade="all, delete-orphan")

class Department(Base):
    __tablename__ = "departments"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    organisation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organisations.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    manager_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    organisation: Mapped["Organisation"] = relationship(back_populates="departments")
    profiles: Mapped[list["Profile"]] = relationship(back_populates="department")
    cost_centres: Mapped[list["CostCentre"]] = relationship(back_populates="department", cascade="all, delete-orphan")

class CostCentre(Base):
    __tablename__ = "cost_centres"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    department_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("departments.id", ondelete="CASCADE"), nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    allocated_budget: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"))
    spent_budget: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"))

    # Relationships
    department: Mapped["Department"] = relationship(back_populates="cost_centres")
    journeys: Mapped[list["Journey"]] = relationship(back_populates="cost_centre")

class TravelPolicy(Base):
    __tablename__ = "travel_policies"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    organisation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organisations.id", ondelete="CASCADE"), unique=True, nullable=False)
    max_flight_class: Mapped[str] = mapped_column(String(50), default="economy")  # economy, business, first
    max_hotel_star_rating: Mapped[int] = mapped_column(default=3)
    max_daily_budget: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("150.00"))
    require_approval: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    organisation: Mapped["Organisation"] = relationship(back_populates="travel_policy")
