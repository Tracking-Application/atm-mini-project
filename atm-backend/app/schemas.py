from datetime import datetime
from decimal import Decimal
from typing import List

from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    account_number: str = Field(..., min_length=6, max_length=30)
    pin: str = Field(..., min_length=4, max_length=6)
    opening_balance: Decimal = Field(Decimal("0.00"), ge=0)


class LoginRequest(BaseModel):
    account_number: str
    pin: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class BalanceResponse(BaseModel):
    account_number: str
    name: str
    balance: Decimal


class TransactionRequest(BaseModel):
    amount: Decimal = Field(..., gt=0)


class MessageResponse(BaseModel):
    message: str
    balance: Decimal


class TransactionResponse(BaseModel):
    transaction_type: str
    amount: Decimal
    balance_after: Decimal
    created_at: datetime

    class Config:
        from_attributes = True


class AccountStatementResponse(BaseModel):
    account_number: str
    transactions: List[TransactionResponse]
