from abc import ABC, abstractmethod
from typing import Optional, List
from uuid import UUID
from app.domain.collaboration.entities import DocumentEntity, TaskEntity, VoteEntity, UserVoteEntity, ApprovalEntity

class CollaborationRepositoryInterface(ABC):
    @abstractmethod
    async def add_document(self, doc: DocumentEntity) -> DocumentEntity:
        """Store a new visa, passport, or insurance document."""
        pass

    @abstractmethod
    async def get_document_by_id(self, doc_id: UUID) -> Optional[DocumentEntity]:
        """Fetch document by id."""
        pass

    @abstractmethod
    async def create_task(self, task: TaskEntity) -> TaskEntity:
        """Add a preparation task to a journey."""
        pass

    @abstractmethod
    async def update_task_status(self, task_id: UUID, status: str) -> Optional[TaskEntity]:
        """Update a task's status (todo, in_progress, done)."""
        pass

    @abstractmethod
    async def create_vote(self, vote: VoteEntity) -> VoteEntity:
        """Add a poll/vote proposal to a journey."""
        pass

    @abstractmethod
    async def cast_user_vote(self, user_vote: UserVoteEntity) -> UserVoteEntity:
        """Log a user's selection in a poll."""
        pass

    @abstractmethod
    async def create_approval_request(self, approval: ApprovalEntity) -> ApprovalEntity:
        """Log a new corporate trip approval request."""
        pass

    @abstractmethod
    async def review_approval_request(self, approval_id: UUID, status: str, comments: str) -> Optional[ApprovalEntity]:
        """Record manager or finance review on travel request."""
        pass
