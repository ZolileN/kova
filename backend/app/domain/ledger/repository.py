from abc import ABC, abstractmethod
from typing import Optional, List
from uuid import UUID
from app.domain.ledger.entities import JourneyLedgerEntity, ExpenseEntity, ContributionEntity, ReceiptEntity

class LedgerRepositoryInterface(ABC):
    @abstractmethod
    async def get_ledger_by_journey(self, journey_id: UUID) -> Optional[JourneyLedgerEntity]:
        """Retrieve the ledger details of a journey."""
        pass

    @abstractmethod
    async def create_ledger(self, ledger: JourneyLedgerEntity) -> JourneyLedgerEntity:
        """Initialize a ledger for a journey."""
        pass

    @abstractmethod
    async def log_expense(self, expense: ExpenseEntity) -> ExpenseEntity:
        """Log a new expense and splits into the database."""
        pass

    @abstractmethod
    async def log_contribution(self, contribution: ContributionEntity) -> ContributionEntity:
        """Create a pending or completed contribution."""
        pass

    @abstractmethod
    async def update_contribution_status(self, transaction_id: str, status: str) -> Optional[ContributionEntity]:
        """Update contribution transaction state."""
        pass

    @abstractmethod
    async def store_receipt(self, receipt: ReceiptEntity) -> ReceiptEntity:
        """Store receipt metadata and links."""
        pass
