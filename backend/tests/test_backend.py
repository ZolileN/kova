import pytest
import uuid
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.main import app
from app.infrastructure.database.base import Base
from app.infrastructure.database.session import get_db

# Setup Test Database (in-memory SQLite)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
engine = create_async_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)

@pytest.fixture(autouse=True, scope="module")
def prepare_database():
    async def create_tables():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            
        # Seed default journey type for testing
        async with TestingSessionLocal() as session:
            from app.infrastructure.database.models.journey import JourneyType
            j_type = JourneyType(
                id=uuid.uuid4(),
                code="holiday",
                name="Holiday",
                description="Leisure travel"
            )
            session.add(j_type)
            await session.commit()
            
    async def drop_tables():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            
    asyncio.run(create_tables())
    yield
    asyncio.run(drop_tables())

async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "kova-backend"}

def test_register_user():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test_traveller@example.com",
            "password": "SecurePassword123",
            "first_name": "Test",
            "last_name": "User",
            "country_code": "ZAF"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test_traveller@example.com"
    assert data["first_name"] == "Test"

def test_login_jwt():
    response = client.post(
        "/api/v1/auth/token",
        data={
            "username": "test_traveller@example.com",
            "password": "SecurePassword123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_end_to_end_journey_ledger_flow():
    # 1. Login to get authentication headers
    login_response = client.post(
        "/api/v1/auth/token",
        data={
            "username": "test_traveller@example.com",
            "password": "SecurePassword123"
        }
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create a Journey
    journey_response = client.post(
        "/api/v1/journeys",
        headers=headers,
        json={
            "title": "Summer Trip in Florence",
            "journey_type_code": "holiday",
            "start_date": "2026-08-01",
            "end_date": "2026-08-10"
        }
    )
    assert journey_response.status_code == 201
    journey_data = journey_response.json()
    journey_id = journey_data["id"]

    # 3. Verify Ledger was automatically initialized with 0 spent
    ledger_response = client.get(
        f"/api/v1/journeys/{journey_id}/ledger",
        headers=headers
    )
    assert ledger_response.status_code == 200
    ledger_data = ledger_response.json()
    assert ledger_data["total_budget"] == 0.00
    assert ledger_data["total_spent"] == 0.00

    # 4. Log an Expense
    # Retrieve user ID (we extract from registration or token payloads)
    profile_response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "friend@example.com",
            "password": "SecurePassword123",
            "first_name": "Friend",
            "last_name": "Two",
            "country_code": "ZAF"
        }
    )
    friend_id = profile_response.json()["id"]
    
    expense_response = client.post(
        f"/api/v1/journeys/{journey_id}/expenses",
        headers=headers,
        json={
            "amount": 150.00,
            "currency": "USD",
            "description": "Group Tour Tickets",
            "category": "activity",
            "splits": [
                {"user_id": friend_id, "share_amount": 150.00}
            ]
        }
    )
    assert expense_response.status_code == 201

    # 5. Verify the Ledger updated its spent totals
    ledger_response_after = client.get(
        f"/api/v1/journeys/{journey_id}/ledger",
        headers=headers
    )
    assert ledger_response_after.json()["total_spent"] == 150.00

    # 6. Ask AI Concierge a travel question
    concierge_response = client.post(
        f"/api/v1/journeys/{journey_id}/concierge",
        headers=headers,
        json={"message": "Suggest packing items for Italy in August"}
    )
    assert concierge_response.status_code == 200
    assert "reply" in concierge_response.json()
