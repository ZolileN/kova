import uuid
from datetime import date, datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.infrastructure.database.session import get_db
from app.infrastructure.database.models.user import User
from app.infrastructure.database.models.journey import Journey, JourneyType, JourneyMember, TimelineEvent, Flight, Hotel, Activity
from app.infrastructure.database.models.ledger import JourneyLedger
from app.presentation.api.auth import get_current_user

router = APIRouter(prefix="/journeys", tags=["Journeys"])

class JourneyCreateSchema(BaseModel):
    title: str
    journey_type_code: str
    start_date: date
    end_date: date
    organisation_id: Optional[uuid.UUID] = None
    cost_centre_id: Optional[uuid.UUID] = None

class JourneyResponseSchema(BaseModel):
    id: uuid.UUID
    title: str
    journey_type_code: str
    start_date: date
    end_date: date
    status: str

class TimelineEventCreateSchema(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    event_type: str  # flight, hotel, activity, custom
    
    # Detail fields (Optional based on event_type)
    carrier: Optional[str] = None
    flight_number: Optional[str] = None
    departure_airport: Optional[str] = None
    arrival_airport: Optional[str] = None
    booking_reference: Optional[str] = None
    seat_number: Optional[str] = None
    cabin_class: Optional[str] = "economy"
    hotel_name: Optional[str] = None
    hotel_address: Optional[str] = None
    room_number: Optional[str] = None
    cost: Optional[float] = 0.00
    currency: Optional[str] = "USD"
    location: Optional[str] = None

@router.post("", response_model=JourneyResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_journey(data: JourneyCreateSchema, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Lookup journey type
    result = await db.execute(select(JourneyType).where(JourneyType.code == data.journey_type_code))
    j_type = result.scalars().first()
    if not j_type:
        raise HTTPException(status_code=400, detail="Invalid journey type code")

    journey_id = uuid.uuid4()
    
    # Create journey
    journey = Journey(
        id=journey_id,
        title=data.title,
        journey_type_id=j_type.id,
        organisation_id=data.organisation_id,
        cost_centre_id=data.cost_centre_id,
        start_date=data.start_date,
        end_date=data.end_date,
        status="planning"
    )
    db.add(journey)
    
    # Add creator as Journey Member and designated TREASURER
    member = JourneyMember(
        id=uuid.uuid4(),
        journey_id=journey_id,
        user_id=current_user.id,
        role="treasurer"  # Designated treasurer by default
    )
    db.add(member)
    
    # Initialize Journey Ledger linked to the treasurer
    ledger = JourneyLedger(
        id=uuid.uuid4(),
        journey_id=journey_id,
        treasurer_id=current_user.id,
        total_budget=0.00,
        total_spent=0.00,
        currency="USD"
    )
    db.add(ledger)
    
    await db.commit()
    
    return {
        "id": journey.id,
        "title": journey.title,
        "journey_type_code": j_type.code,
        "start_date": journey.start_date,
        "end_date": journey.end_date,
        "status": journey.status
    }

@router.get("", response_model=List[JourneyResponseSchema])
async def list_journeys(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # List all journeys user is a member of
    result = await db.execute(
        select(Journey)
        .join(JourneyMember)
        .where(JourneyMember.user_id == current_user.id)
        .options(selectinload(Journey.journey_type))
    )
    journeys = result.scalars().all()
    return [
        {
            "id": j.id,
            "title": j.title,
            "journey_type_code": j.journey_type.code,
            "start_date": j.start_date,
            "end_date": j.end_date,
            "status": j.status
        } for j in journeys
    ]

@router.post("/{journey_id}/timeline/events", status_code=status.HTTP_201_CREATED)
async def add_timeline_event(journey_id: uuid.UUID, data: TimelineEventCreateSchema, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Check if user is member of journey
    mem_result = await db.execute(select(JourneyMember).where(JourneyMember.journey_id == journey_id, JourneyMember.user_id == current_user.id))
    if not mem_result.scalars().first():
        raise HTTPException(status_code=403, detail="Not authorized to edit this journey")
        
    event_id = uuid.uuid4()
    
    # Create base event
    event = TimelineEvent(
        id=event_id,
        journey_id=journey_id,
        title=data.title,
        description=data.description,
        start_time=data.start_time,
        end_time=data.end_time,
        event_type=data.event_type
    )
    db.add(event)
    
    # Create details based on type
    if data.event_type == "flight":
        flight = Flight(
            id=uuid.uuid4(),
            timeline_event_id=event_id,
            carrier=data.carrier or "Mock Airways",
            flight_number=data.flight_number or "MK001",
            departure_airport=data.departure_airport or "LHR",
            arrival_airport=data.arrival_airport or "FCO",
            booking_reference=data.booking_reference or "REF000",
            seat_number=data.seat_number,
            cabin_class=data.cabin_class or "economy",
            cost=data.cost or 0.00,
            currency=data.currency or "USD"
        )
        db.add(flight)
    elif data.event_type == "hotel":
        hotel = Hotel(
            id=uuid.uuid4(),
            timeline_event_id=event_id,
            hotel_name=data.hotel_name or "Mock Hotel",
            address=data.hotel_address or "Mock Address",
            check_in=data.start_time,
            check_out=data.end_time,
            booking_reference=data.booking_reference or "REF000",
            room_number=data.room_number,
            cost=data.cost or 0.00,
            currency=data.currency or "USD"
        )
        db.add(hotel)
    elif data.event_type == "activity":
        activity = Activity(
            id=uuid.uuid4(),
            timeline_event_id=event_id,
            name=data.title,
            location=data.location or "Mock Location",
            cost=data.cost or 0.00,
            currency=data.currency or "USD"
        )
        db.add(activity)
        
    await db.commit()
    return {"status": "success", "event_id": event_id}
