from datetime import datetime, date
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel

class DocumentEntity(BaseModel):
    id: UUID
    journey_id: Optional[UUID] = None
    user_id: UUID
    document_type: str  # visa, passport, insurance, other
    file_url: str
    expiry_date: Optional[date] = None
    meta: Optional[dict] = None

    class Config:
        from_attributes = True

class TaskEntity(BaseModel):
    id: UUID
    journey_id: UUID
    title: str
    assigned_to: Optional[UUID] = None
    status: str  # todo, in_progress, done
    due_date: Optional[date] = None

    class Config:
        from_attributes = True

class UserVoteEntity(BaseModel):
    id: UUID
    vote_id: UUID
    user_id: UUID
    selected_option: str
    voted_at: datetime

    class Config:
        from_attributes = True

class VoteEntity(BaseModel):
    id: UUID
    journey_id: UUID
    question: str
    options: List[str]
    status: str  # open, closed
    user_votes: List[UserVoteEntity] = []

    class Config:
        from_attributes = True

class ApprovalEntity(BaseModel):
    id: UUID
    journey_id: UUID
    approver_id: UUID
    status: str  # pending, approved, rejected
    comments: Optional[str] = None
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
