import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


BASE_DIR = Path(__file__).resolve().parents[2]


def load_local_env(env_path: Path | None = None) -> None:
    env_file_path = env_path or BASE_DIR / ".env"
    if not env_file_path.exists():
        return

    with open(env_file_path, "r", encoding="utf-8") as env_file:
        for raw_line in env_file:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip())


load_local_env()

DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "atm_db")

# Fallback to SQLite if no password provided (for easier local development)
if not DB_PASSWORD:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./atm_db.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
    print("Database: Using SQLite (Fallback)")
else:
    SQLALCHEMY_DATABASE_URL = (
        f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    print(f"Database: Using PostgreSQL (User: {DB_USER})")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
