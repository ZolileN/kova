from datetime import datetime, date
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel

class JourneyTypeEntity(BaseModel):
    id: UUID
    code: str
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class JourneyMemberEntity(BaseModel):
    id: UUID
    journey_id: UUID
    user_id: UUID
    role: str  # member, treasurer, coordinator, viewer
    joined_at: datetime

    class Config:
        from_attributes = True

class FlightEntity(BaseModel):
    id: UUID
    timeline_event_id: UUID
    carrier: str
    flight_number: str
    departure_airport: str
    arrival_airport: str
    booking_reference: str
    seat_number: Optional[str] = None
    cabin_class: str
    cost: float
    currency: str

    class Config:
        from_attributes = True

class HotelEntity(BaseModel):
    id: UUID
    timeline_event_id: UUID
    hotel_name: str
    address: str
    check_in: datetime
    check_out: datetime
    booking_reference: str
    room_number: Optional[str] = None
    cost: float
    currency: str

    class Config:
        from_attributes = True

class ActivityEntity(BaseModel):
    id: UUID
    timeline_event_id: UUID
    name: str
    location: str
    cost: float
    currency: str

    class Config:
        from_attributes = True

class TimelineEventEntity(BaseModel):
    id: UUID
    journey_id: UUID
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    event_type: str  # flight, hotel, activity, custom
    flight: Optional[FlightEntity] = None
    hotel: Optional[HotelEntity] = None
    activity: Optional[ActivityEntity] = None

    class Config:
        from_attributes = True

class JourneyEntity(BaseModel):
    id: UUID
    title: str
    journey_type_id: UUID
    organisation_id: Optional[UUID] = None
    cost_centre_id: Optional[UUID] = None
    start_date: date
    end_date: date
    status: str  # planning, active, completed, cancelled
    created_at: datetime
    journey_type: Optional[JourneyTypeEntity] = None
    members: List[JourneyMemberEntity] = []
    timeline_events: List[TimelineEventEntity] = []

    class Config:
        from_attributes = True
