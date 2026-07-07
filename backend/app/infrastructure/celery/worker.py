import os
import asyncio
import uuid
from decimal import Decimal
from datetime import datetime
from celery import Celery
from sqlalchemy import select

# Initialize Celery app
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
celery_app = Celery("kova_worker", broker=REDIS_URL, backend=REDIS_URL)

@celery_app.task(name="app.infrastructure.celery.worker.process_receipt_task")
def process_receipt_task(receipt_id: str):
    """Celery background task for scanning receipt file via OpenAI OCR."""
    print(f"Starting Celery receipt OCR task for receipt_id={receipt_id}")
    
    # Run the async logic in the Celery worker
    return asyncio.run(async_process_receipt(receipt_id))

async def async_process_receipt(receipt_id: str):
    from app.infrastructure.database.session import AsyncSessionLocal
    from app.infrastructure.database.models.ledger import Receipt, Expense, JourneyLedger, ExpenseSplit
    from app.infrastructure.database.models.journey import JourneyMember
    from app.infrastructure.adapters.openai_adapter import OpenAIAdapter
    
    async with AsyncSessionLocal() as session:
        # 1. Fetch Receipt record
        receipt_uuid = uuid.UUID(receipt_id)
        result = await session.execute(select(Receipt).where(Receipt.id == receipt_uuid))
        receipt = result.scalars().first()
        
        if not receipt:
            print(f"Receipt {receipt_id} not found in database.")
            return False
            
        # 2. Extract OCR data using OpenAI Adapter
        openai = OpenAIAdapter()
        ocr_data = await openai.extract_receipt_data(receipt.file_url)
        
        if "error" in ocr_data:
            receipt.ocr_status = "failed"
            await session.commit()
            print(f"OCR failed: {ocr_data['error']}")
            return False
            
        # 3. Update receipt record with OCR results
        receipt.extracted_merchant = ocr_data.get("merchant")
        receipt.extracted_amount = Decimal(str(ocr_data.get("amount", 0)))
        receipt.extracted_tax = Decimal(str(ocr_data.get("tax", 0)))
        receipt.extracted_currency = ocr_data.get("currency", "USD")
        
        # Parse date safely
        date_str = ocr_data.get("date")
        if date_str:
            try:
                receipt.extracted_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                pass
                
        receipt.ocr_status = "processed"
        receipt.ocr_payload = ocr_data
        
        # 4. Auto-create Expense if not already linked
        if not receipt.expense_id:
            # We need to find a Journey that the uploader belongs to.
            # For simplicity, we query the latest active journey of the uploader.
            member_result = await session.execute(
                select(JourneyMember)
                .where(JourneyMember.user_id == receipt.uploader_id)
                .order_key if hasattr(JourneyMember, "joined_at") else select(JourneyMember)
            )
            member = member_result.scalars().first()
            
            if member:
                journey_id = member.journey_id
                expense_id = uuid.uuid4()
                
                # Create default Expense
                expense = Expense(
                    id=expense_id,
                    journey_id=journey_id,
                    payer_id=receipt.uploader_id,
                    amount=receipt.extracted_amount,
                    currency=receipt.extracted_currency or "USD",
                    category=ocr_data.get("category", "other"),
                    description=f"Auto-logged: {receipt.extracted_merchant or 'Receipt Upload'}",
                    expense_date=receipt.extracted_date or datetime.utcnow().date()
                )
                session.add(expense)
                
                # Auto-create Expense Split for the uploader (100% share by default)
                split = ExpenseSplit(
                    id=uuid.uuid4(),
                    expense_id=expense_id,
                    user_id=receipt.uploader_id,
                    share_amount=receipt.extracted_amount,
                    settled=False
                )
                session.add(split)
                
                # Link expense to receipt
                receipt.expense_id = expense_id
                
                # Update JourneyLedger spent total
                ledger_result = await session.execute(select(JourneyLedger).where(JourneyLedger.journey_id == journey_id))
                ledger = ledger_result.scalars().first()
                if ledger:
                    ledger.total_spent += receipt.extracted_amount
                    
        await session.commit()
        print(f"Successfully processed receipt {receipt_id} | Merchant: {receipt.extracted_merchant} | Amount: {receipt.extracted_amount}")
        return True
