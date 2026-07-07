from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel

class CostCentreEntity(BaseModel):
    id: UUID
    department_id: UUID
    code: str
    name: str
    allocated_budget: float
    spent_budget: float

    class Config:
        from_attributes = True

class DepartmentEntity(BaseModel):
    id: UUID
    organisation_id: UUID
    name: str
    manager_id: Optional[UUID] = None
    cost_centres: List[CostCentreEntity] = []

    class Config:
        from_attributes = True

class TravelPolicyEntity(BaseModel):
    id: UUID
    organisation_id: UUID
    max_flight_class: str
    max_hotel_star_rating: int
    max_daily_budget: float
    require_approval: bool

    class Config:
        from_attributes = True

class OrganisationEntity(BaseModel):
    id: UUID
    name: str
    domain: str
    created_at: datetime
    departments: List[DepartmentEntity] = []
    travel_policy: Optional[TravelPolicyEntity] = None

    class Config:
        from_attributes = True
