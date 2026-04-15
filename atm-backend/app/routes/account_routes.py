from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Transaction, User
from app.schemas import (
    AccountStatementResponse,
    BalanceResponse,
    MessageResponse,
    TransactionRequest,
)


router = APIRouter(prefix="/account", tags=["Account"])


def create_transaction(
    db: Session,
    user: User,
    transaction_type: str,
    amount: Decimal,
) -> None:
    transaction = Transaction(
        user_id=user.id,
        transaction_type=transaction_type,
        amount=amount,
        balance_after=user.balance,
    )
    db.add(transaction)


@router.get("/balance", response_model=BalanceResponse)
def check_balance(current_user: User = Depends(get_current_user)):
    return BalanceResponse(
        account_number=current_user.account_number,
        name=current_user.name,
        balance=current_user.balance,
    )


@router.post("/deposit", response_model=MessageResponse)
def deposit(
    payload: TransactionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.balance += payload.amount
    create_transaction(db, current_user, "deposit", payload.amount)
    db.commit()
    db.refresh(current_user)
    return MessageResponse(
        message="Amount deposited successfully",
        balance=current_user.balance,
    )


@router.post("/withdraw", response_model=MessageResponse)
def withdraw(
    payload: TransactionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.amount > current_user.balance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance",
        )

    current_user.balance -= payload.amount
    create_transaction(db, current_user, "withdraw", payload.amount)
    db.commit()
    db.refresh(current_user)
    return MessageResponse(
        message="Withdrawal successful",
        balance=current_user.balance,
    )


@router.get("/transactions", response_model=AccountStatementResponse)
def list_transactions(current_user: User = Depends(get_current_user)):
    return AccountStatementResponse(
        account_number=current_user.account_number,
        transactions=current_user.transactions,
    )
