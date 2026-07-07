from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr

class ProfileEntity(BaseModel):
    id: UUID
    user_id: UUID
    organisation_id: Optional[UUID] = None
    department_id: Optional[UUID] = None
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    passport_number: Optional[str] = None
    passport_expiry: Optional[datetime] = None
    country_code: str

    class Config:
        from_attributes = True

class UserEntity(BaseModel):
    id: UUID
    email: EmailStr
    system_role: str
    created_at: datetime
    updated_at: datetime
    profile: Optional[ProfileEntity] = None

    class Config:
        from_attributes = True
