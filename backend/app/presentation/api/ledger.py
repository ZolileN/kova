import uuid
import os
from decimal import Decimal
from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.infrastructure.database.session import get_db
from app.infrastructure.database.models.user import User
from app.infrastructure.database.models.journey import JourneyMember
from app.infrastructure.database.models.ledger import JourneyLedger, Expense, ExpenseSplit, Receipt
from app.presentation.api.auth import get_current_user

router = APIRouter(tags=["Ledger & Expenses"])

class SplitShare(BaseModel):
    user_id: uuid.UUID
    share_amount: float

class ExpenseCreateSchema(BaseModel):
    amount: float
    currency: str
    description: str
    category: str = "other"
    expense_date: date = date.today()
    splits: List[SplitShare]

class LedgerResponseSchema(BaseModel):
    journey_id: uuid.UUID
    treasurer_id: uuid.UUID
    total_budget: float
    total_spent: float
    currency: str

@router.post("/journeys/{journey_id}/expenses", status_code=status.HTTP_201_CREATED)
async def create_expense(journey_id: uuid.UUID, data: ExpenseCreateSchema, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Verify journey membership
    mem_result = await db.execute(select(JourneyMember).where(JourneyMember.journey_id == journey_id, JourneyMember.user_id == current_user.id))
    if not mem_result.scalars().first():
        raise HTTPException(status_code=403, detail="Not authorized to edit this journey ledger")
        
    expense_id = uuid.uuid4()
    
    # Create Expense
    expense = Expense(
        id=expense_id,
        journey_id=journey_id,
        payer_id=current_user.id,
        amount=Decimal(str(data.amount)),
        currency=data.currency,
        exchange_rate=Decimal("1.000000"),
        category=data.category,
        description=data.description,
        expense_date=data.expense_date
    )
    db.add(expense)
    
    # Create Splits
    for split in data.splits:
        es = ExpenseSplit(
            id=uuid.uuid4(),
            expense_id=expense_id,
            user_id=split.user_id,
            share_amount=Decimal(str(split.share_amount)),
            settled=False
        )
        db.add(es)
        
    # Update JourneyLedger total spent
    ledger_result = await db.execute(select(JourneyLedger).where(JourneyLedger.journey_id == journey_id))
    ledger = ledger_result.scalars().first()
    if ledger:
        ledger.total_spent += Decimal(str(data.amount))
        
    await db.commit()
    return {"status": "success", "expense_id": expense_id}

@router.get("/journeys/{journey_id}/ledger", response_model=LedgerResponseSchema)
async def get_ledger(journey_id: uuid.UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Verify membership
    mem_result = await db.execute(select(JourneyMember).where(JourneyMember.journey_id == journey_id, JourneyMember.user_id == current_user.id))
    if not mem_result.scalars().first():
        raise HTTPException(status_code=403, detail="Not authorized to view this ledger")
        
    ledger_result = await db.execute(select(JourneyLedger).where(JourneyLedger.journey_id == journey_id))
    ledger = ledger_result.scalars().first()
    if not ledger:
        raise HTTPException(status_code=404, detail="Ledger not found")
        
    return {
        "journey_id": ledger.journey_id,
        "treasurer_id": ledger.treasurer_id,
        "total_budget": float(ledger.total_budget),
        "total_spent": float(ledger.total_spent),
        "currency": ledger.currency
    }

@router.post("/receipts/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_receipt(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    receipt_id = uuid.uuid4()
    
    # In a production app, save file to AWS S3 bucket.
    # Here, we save to local uploads directory or mock the S3 file path.
    upload_dir = "/home/zolile/Documents/kova-os/public/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, f"{receipt_id}_{file.filename}")
    
    with open(file_path, "wb") as f:
        f.write(await file.read())
        
    # Create pending receipt record
    receipt = Receipt(
        id=receipt_id,
        uploader_id=current_user.id,
        file_url=f"/public/uploads/{receipt_id}_{file.filename}",
        ocr_status="pending"
    )
    db.add(receipt)
    await db.commit()
    
    # Trigger asynchronous OCR scan via Celery background worker
    from app.infrastructure.celery.worker import process_receipt_task
    process_receipt_task.delay(str(receipt_id))
    
    return {
        "receipt_id": receipt_id,
        "status": "pending",
        "message": "Receipt processing queued."
    }
