import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.infrastructure.database.models.user import User
from app.infrastructure.ai.orchestrator import AIOrchestrator
from app.presentation.api.auth import get_current_user

router = APIRouter(tags=["AI Concierge Assistant"])
orchestrator = AIOrchestrator()

class ChatRequestSchema(BaseModel):
    message: str

class ChatResponseSchema(BaseModel):
    reply: str

@router.post("/journeys/{journey_id}/concierge", response_model=ChatResponseSchema)
async def concierge_chat(
    journey_id: uuid.UUID,
    data: ChatRequestSchema,
    current_user: User = Depends(get_current_user)
):
    try:
        reply = await orchestrator.process_query(
            user_id=str(current_user.id),
            message=data.message,
            journey_id=str(journey_id)
        )
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Concierge Error: {str(e)}")
