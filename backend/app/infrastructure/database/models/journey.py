import uuid
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, ForeignKey, DateTime, Date, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.infrastructure.database.base import Base

class JourneyType(Base):
    __tablename__ = "journey_types"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Relationships
    journeys: Mapped[list["Journey"]] = relationship(back_populates="journey_type")

class Journey(Base):
    __tablename__ = "journeys"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    journey_type_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("journey_types.id"), nullable=False)
    organisation_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("organisations.id", ondelete="SET NULL"), nullable=True)
    cost_centre_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("cost_centres.id", ondelete="SET NULL"), nullable=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="planning")  # planning, active, completed, cancelled
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    journey_type: Mapped["JourneyType"] = relationship(back_populates="journeys")
    organisation: Mapped["Organisation"] = relationship(back_populates="journeys")
    cost_centre: Mapped["CostCentre"] = relationship(back_populates="journeys")
    members: Mapped[list["JourneyMember"]] = relationship(back_populates="journey", cascade="all, delete-orphan")
    timeline_events: Mapped[list["TimelineEvent"]] = relationship(back_populates="journey", cascade="all, delete-orphan")
    ledger: Mapped["JourneyLedger"] = relationship(back_populates="journey", uselist=False, cascade="all, delete-orphan")
    expenses: Mapped[list["Expense"]] = relationship(back_populates="journey", cascade="all, delete-orphan")
    contributions: Mapped[list["Contribution"]] = relationship(back_populates="journey", cascade="all, delete-orphan")
    tasks: Mapped[list["Task"]] = relationship(back_populates="journey", cascade="all, delete-orphan")
    documents: Mapped[list["Document"]] = relationship(back_populates="journey", cascade="all, delete-orphan")
    votes: Mapped[list["Vote"]] = relationship(back_populates="journey", cascade="all, delete-orphan")
    approvals: Mapped[list["Approval"]] = relationship(back_populates="journey", cascade="all, delete-orphan")

class JourneyMember(Base):
    __tablename__ = "journey_members"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    journey_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("journeys.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="member")  # member, treasurer, coordinator, viewer
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    journey: Mapped["Journey"] = relationship(back_populates="members")
    user: Mapped["User"] = relationship(back_populates="memberships")

class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    journey_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("journeys.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)  # flight, hotel, activity, custom

    # Relationships
    journey: Mapped["Journey"] = relationship(back_populates="timeline_events")
    flight: Mapped["Flight"] = relationship(back_populates="timeline_event", uselist=False, cascade="all, delete-orphan")
    hotel: Mapped["Hotel"] = relationship(back_populates="timeline_event", uselist=False, cascade="all, delete-orphan")
    activity: Mapped["Activity"] = relationship(back_populates="timeline_event", uselist=False, cascade="all, delete-orphan")

class Flight(Base):
    __tablename__ = "flights"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    timeline_event_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("timeline_events.id", ondelete="CASCADE"), unique=True, nullable=False)
    carrier: Mapped[str] = mapped_column(String(100), nullable=False)
    flight_number: Mapped[str] = mapped_column(String(20), nullable=False)
    departure_airport: Mapped[str] = mapped_column(String(10), nullable=False)  # IATA
    arrival_airport: Mapped[str] = mapped_column(String(10), nullable=False)
    booking_reference: Mapped[str] = mapped_column(String(100), nullable=False)
    seat_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    cabin_class: Mapped[str] = mapped_column(String(50), default="economy")  # economy, business, first
    cost: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)

    # Relationships
    timeline_event: Mapped["TimelineEvent"] = relationship(back_populates="flight")

class Hotel(Base):
    __tablename__ = "hotels"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    timeline_event_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("timeline_events.id", ondelete="CASCADE"), unique=True, nullable=False)
    hotel_name: Mapped[str] = mapped_column(String(255), nullable=False)
    address: Mapped[str] = mapped_column(String(500), nullable=False)
    check_in: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    check_out: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    booking_reference: Mapped[str] = mapped_column(String(100), nullable=False)
    room_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    cost: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)

    # Relationships
    timeline_event: Mapped["TimelineEvent"] = relationship(back_populates="hotel")

class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    timeline_event_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("timeline_events.id", ondelete="CASCADE"), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str] = mapped_column(String(500), nullable=False)
    cost: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)

    # Relationships
    timeline_event: Mapped["TimelineEvent"] = relationship(back_populates="activity")
