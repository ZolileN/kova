from datetime import datetime, date
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel

class ExpenseSplitEntity(BaseModel):
    id: UUID
    expense_id: UUID
    user_id: UUID
    share_amount: float
    settled: bool

    class Config:
        from_attributes = True

class ReceiptEntity(BaseModel):
    id: UUID
    expense_id: Optional[UUID] = None
    uploader_id: UUID
    file_url: str
    ocr_status: str  # pending, processed, failed
    extracted_merchant: Optional[str] = None
    extracted_amount: Optional[float] = None
    extracted_tax: Optional[float] = None
    extracted_currency: Optional[str] = None
    extracted_date: Optional[date] = None
    ocr_payload: Optional[dict] = None

    class Config:
        from_attributes = True

class ExpenseEntity(BaseModel):
    id: UUID
    journey_id: UUID
    payer_id: UUID
    amount: float
    currency: str
    exchange_rate: float
    category: str
    description: str
    expense_date: date
    created_at: datetime
    splits: List[ExpenseSplitEntity] = []
    receipts: List[ReceiptEntity] = []

    class Config:
        from_attributes = True

class JourneyLedgerEntity(BaseModel):
    id: UUID
    journey_id: UUID
    treasurer_id: UUID
    total_budget: float
    total_spent: float
    currency: str

    class Config:
        from_attributes = True

class ContributionEntity(BaseModel):
    id: UUID
    journey_id: UUID
    user_id: UUID
    amount: float
    currency: str
    payment_provider: str  # stripe, yoco, ozow, manual
    provider_transaction_id: Optional[str] = None
    status: str  # pending, completed, failed
    created_at: datetime
    settled_at: Optional[datetime] = None

    class Config:
        from_attributes = True
