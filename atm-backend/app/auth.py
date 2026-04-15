import base64
import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User


SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

PBKDF2_ITERATIONS = 100_000
HASH_NAME = "sha256"


def hash_pin(pin: str) -> str:
    salt = secrets.token_bytes(16)
    derived_key = hashlib.pbkdf2_hmac(
        HASH_NAME,
        pin.encode("utf-8"),
        salt,
        PBKDF2_ITERATIONS,
    )
    salt_b64 = base64.b64encode(salt).decode("utf-8")
    hash_b64 = base64.b64encode(derived_key).decode("utf-8")
    return f"pbkdf2_{HASH_NAME}${PBKDF2_ITERATIONS}${salt_b64}${hash_b64}"


def verify_pin(plain_pin: str, hashed_pin: str) -> bool:
    try:
        algorithm, iterations, salt_b64, hash_b64 = hashed_pin.split("$", 3)
        if algorithm != f"pbkdf2_{HASH_NAME}":
            return False

        salt = base64.b64decode(salt_b64.encode("utf-8"))
        expected_hash = base64.b64decode(hash_b64.encode("utf-8"))
        actual_hash = hashlib.pbkdf2_hmac(
            HASH_NAME,
            plain_pin.encode("utf-8"),
            salt,
            int(iterations),
        )
        return hmac.compare_digest(actual_hash, expected_hash)
    except (ValueError, TypeError):
        return False


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError as exc:
        raise credentials_exception from exc

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user
