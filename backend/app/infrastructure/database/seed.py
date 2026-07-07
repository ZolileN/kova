import asyncio
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.database.session import AsyncSessionLocal
from app.infrastructure.database.models.journey import JourneyType

JOURNEY_TYPES = [
    {"code": "holiday", "name": "Holiday", "description": "Leisure trip for rest and recreation"},
    {"code": "business_trip", "name": "Business Trip", "description": "Professional and corporate travel"},
    {"code": "conference", "name": "Conference", "description": "Attending symposiums, congresses, or events"},
    {"code": "wedding", "name": "Wedding", "description": "Destination weddings or matrimonial gatherings"},
    {"code": "retreat", "name": "Retreat", "description": "Wellness, spiritual, or corporate retreats"},
    {"code": "sports_tour", "name": "Sports Tour", "description": "Trips related to sporting events or competitions"},
    {"code": "family_vacation", "name": "Family Vacation", "description": "Recreation trip for immediate and extended family"},
    {"code": "school_tour", "name": "School Tour", "description": "Educational excursions for students"},
    {"code": "group_getaway", "name": "Group Getaway", "description": "Social travel with groups of friends"},
    {"code": "medical_travel", "name": "Medical Travel", "description": "Travel for healthcare or surgery purposes"},
    {"code": "relocation", "name": "Relocation", "description": "Moving to a new city or country permanently"},
    {"code": "pilgrimage", "name": "Pilgrimage", "description": "Religious journeys to sacred locations"},
    {"code": "custom_journey", "name": "Custom Journey", "description": "Bespoke configurations for unique itineraries"},
]

async def seed_data() -> None:
    print("Seeding database static parameters...")
    async with AsyncSessionLocal() as session:
        # Check if already seeded
        from sqlalchemy import select
        result = await session.execute(select(JourneyType))
        existing_codes = {jt.code for jt in result.scalars().all()}
        
        seeded_count = 0
        for jt_data in JOURNEY_TYPES:
            if jt_data["code"] not in existing_codes:
                jt = JourneyType(
                    id=uuid.uuid4(),
                    code=jt_data["code"],
                    name=jt_data["name"],
                    description=jt_data["description"]
                )
                session.add(jt)
                seeded_count += 1
        
        if seeded_count > 0:
            await session.commit()
            print(f"Successfully seeded {seeded_count} journey types.")
        else:
            print("Database already contains journey types. Skipping seed.")

if __name__ == "__main__":
    asyncio.run(seed_data())
