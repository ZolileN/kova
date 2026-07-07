from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.presentation.api.auth import router as auth_router
from app.presentation.api.journey import router as journey_router
from app.presentation.api.ledger import router as ledger_router
from app.presentation.api.payments import router as payments_router
from app.presentation.api.concierge import router as concierge_router

app = FastAPI(
    title="Kova OS API",
    description="The AI Journey Operating System Core API",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(journey_router, prefix="/api/v1")
app.include_router(ledger_router, prefix="/api/v1")
app.include_router(payments_router, prefix="/api/v1")
app.include_router(concierge_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "kova-backend"}

@app.get("/")
def read_root():
    return {"message": "Welcome to Kova: The AI Journey Operating System API"}
