from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class GraphState(BaseModel):
    messages: List[Dict[str, Any]] = Field(default_factory=list)
    journey_id: Optional[str] = None
    user_id: str
    active_agent: Optional[str] = None
    extracted_data: Dict[str, Any] = Field(default_factory=dict)
    validation_errors: List[str] = Field(default_factory=list)
    is_compliant: bool = True
    next_step: Optional[str] = None
