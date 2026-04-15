from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import create_access_token, hash_pin, verify_pin
from app.database import get_db
from app.models import User
from app.schemas import LoginRequest, MessageResponse, TokenResponse, UserCreate


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing_user = (
        db.query(User).filter(User.account_number == payload.account_number).first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account number already exists",
        )

    user = User(
        name=payload.name,
        account_number=payload.account_number,
        hashed_pin=hash_pin(payload.pin),
        balance=payload.opening_balance,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return MessageResponse(message="Account created successfully", balance=user.balance)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.account_number == payload.account_number).first()
    if not user or not verify_pin(payload.pin, user.hashed_pin):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid account number or PIN",
        )

    access_token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=access_token)

