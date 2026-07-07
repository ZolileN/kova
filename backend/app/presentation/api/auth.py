import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.infrastructure.database.session import get_db
from app.infrastructure.database.models.user import User, Profile
from app.presentation.auth_utils import get_password_hash, verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

class RegisterSchema(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    country_code: str = "USA"

class UserResponseSchema(BaseModel):
    id: uuid.UUID
    email: str
    first_name: str
    last_name: str
    system_role: str

class TokenSchema(BaseModel):
    access_token: str
    token_type: str

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
        
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=UserResponseSchema, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterSchema, db: AsyncSession = Depends(get_db)):
    # Check if exists
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_pwd = get_password_hash(data.password)
    user_id = uuid.uuid4()
    
    # Create user
    user = User(
        id=user_id,
        email=data.email,
        hashed_password=hashed_pwd,
        system_role="user"
    )
    db.add(user)
    
    # Create profile
    profile = Profile(
        id=uuid.uuid4(),
        user_id=user_id,
        first_name=data.first_name,
        last_name=data.last_name,
        country_code=data.country_code
    )
    db.add(profile)
    await db.commit()
    
    return {
        "id": user.id,
        "email": user.email,
        "first_name": profile.first_name,
        "last_name": profile.last_name,
        "system_role": user.system_role
    }

@router.post("/token", response_model=TokenSchema)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
