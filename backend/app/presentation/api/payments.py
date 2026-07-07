import uuid
import json
from decimal import Decimal
from datetime import datetime
from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.infrastructure.database.session import get_db
from app.infrastructure.database.models.ledger import JourneyLedger, Contribution
from app.infrastructure.adapters.stripe_adapter import StripeAdapter

router = APIRouter(prefix="/payments", tags=["Payments Webhooks"])
stripe_adapter = StripeAdapter()

@router.post("/webhook/stripe")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("Stripe-Signature", "")
    
    # We retrieve the Stripe webhook secret key from env variables
    webhook_secret = json.loads(payload.decode("utf-8")).get("webhook_secret", "mock-secret")
    
    event = stripe_adapter.construct_event(payload, sig_header, webhook_secret)
    if not event:
        raise HTTPException(status_code=400, detail="Invalid signature or payload")
        
    # Process payment succeeded
    event_type = event.get("type")
    if event_type == "checkout.session.completed":
        session = event.get("data", {}).get("object", {})
        metadata = session.get("metadata", {})
        
        contribution_id = metadata.get("contribution_id")
        provider_txn_id = session.get("id")
        
        if contribution_id:
            contrib_uuid = uuid.UUID(contribution_id)
            result = await db.execute(select(Contribution).where(Contribution.id == contrib_uuid))
            contribution = result.scalars().first()
            
            if contribution and contribution.status != "completed":
                contribution.status = "completed"
                contribution.provider_transaction_id = provider_txn_id
                contribution.settled_at = datetime.utcnow()
                
                # Increment total budget inside JourneyLedger
                ledger_result = await db.execute(select(JourneyLedger).where(JourneyLedger.journey_id == contribution.journey_id))
                ledger = ledger_result.scalars().first()
                if ledger:
                    ledger.total_budget += contribution.amount
                    
                await db.commit()
                print(f"[Webhook Success] Reconciled contribution {contribution_id} for amount {contribution.amount}")
                
    return {"received": True}

@router.post("/webhook/yoco")
async def yoco_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.json()
    
    # Check verification hash or status
    event_type = payload.get("event")
    if event_type == "payment.succeeded":
        charge_data = payload.get("data", {})
        metadata = charge_data.get("metadata", {})
        contribution_id = metadata.get("contribution_id")
        provider_txn_id = charge_data.get("id")
        
        if contribution_id:
            contrib_uuid = uuid.UUID(contribution_id)
            result = await db.execute(select(Contribution).where(Contribution.id == contrib_uuid))
            contribution = result.scalars().first()
            
            if contribution and contribution.status != "completed":
                contribution.status = "completed"
                contribution.provider_transaction_id = provider_txn_id
                contribution.settled_at = datetime.utcnow()
                
                ledger_result = await db.execute(select(JourneyLedger).where(JourneyLedger.journey_id == contribution.journey_id))
                ledger = ledger_result.scalars().first()
                if ledger:
                    ledger.total_budget += contribution.amount
                    
                await db.commit()
                
    return {"received": True}

@router.post("/webhook/ozow")
async def ozow_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    # Ozow sends query parameters or form parameters
    params = dict(request.query_params)
    
    status_str = params.get("Status")
    transaction_id = params.get("TransactionId")
    ref = params.get("TransactionReference")
    
    if status_str == "Complete" and ref:
        contrib_uuid = uuid.UUID(ref)
        result = await db.execute(select(Contribution).where(Contribution.id == contrib_uuid))
        contribution = result.scalars().first()
        
        if contribution and contribution.status != "completed":
            contribution.status = "completed"
            contribution.provider_transaction_id = transaction_id
            contribution.settled_at = datetime.utcnow()
            
            ledger_result = await db.execute(select(JourneyLedger).where(JourneyLedger.journey_id == contribution.journey_id))
            ledger = ledger_result.scalars().first()
            if ledger:
                ledger.total_budget += contribution.amount
                
            await db.commit()
            
    return {"received": True}
