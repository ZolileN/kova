from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID
from app.domain.user.entities import UserEntity, ProfileEntity

class UserRepositoryInterface(ABC):
    @abstractmethod
    async def get_by_id(self, user_id: UUID) -> Optional[UserEntity]:
        """Retrieve a user by their UUID."""
        pass

    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[UserEntity]:
        """Retrieve a user by their email address."""
        pass

    @abstractmethod
    async def create(self, user: UserEntity, password_hash: str) -> UserEntity:
        """Store a new user in the database."""
        pass

    @abstractmethod
    async def update_profile(self, user_id: UUID, profile: ProfileEntity) -> ProfileEntity:
        """Update user profile details."""
        pass
