from abc import ABC, abstractmethod
from typing import Optional, List
from uuid import UUID
from app.domain.journey.entities import JourneyEntity, TimelineEventEntity, JourneyMemberEntity

class JourneyRepositoryInterface(ABC):
    @abstractmethod
    async def get_by_id(self, journey_id: UUID) -> Optional[JourneyEntity]:
        """Retrieve a journey by its UUID with all associations."""
        pass

    @abstractmethod
    async def list_by_user(self, user_id: UUID) -> List[JourneyEntity]:
        """List all journeys a user belongs to."""
        pass

    @abstractmethod
    async def create(self, journey: JourneyEntity) -> JourneyEntity:
        """Store a new journey in the database."""
        pass

    @abstractmethod
    async def add_member(self, member: JourneyMemberEntity) -> JourneyMemberEntity:
        """Add a member to a journey."""
        pass

    @abstractmethod
    async def add_timeline_event(self, event: TimelineEventEntity) -> TimelineEventEntity:
        """Add a timeline event to a journey."""
        pass
