# atm-mini-project

FastAPI ATM backend with PostgreSQL and JWT authentication.

## Project structure

- `atm-backend/main.py` - FastAPI entry point
- `atm-backend/app/database.py` - PostgreSQL connection and session
- `atm-backend/app/models.py` - SQLAlchemy models
- `atm-backend/app/schemas.py` - Request and response schemas
- `atm-backend/app/auth.py` - PIN hashing and JWT helpers
- `atm-backend/app/routes/auth_routes.py` - register and login routes
- `atm-backend/app/routes/account_routes.py` - balance, deposit, withdraw, transactions
- `atm-backend/requirements.txt` - Python dependencies

## Setup

```bash
cd atm-backend
pip install -r requirements.txt
```

Create a PostgreSQL database named `atm_db`, then create `atm-backend/.env` from `.env.example` and update the values with your real PostgreSQL username and password.

Example:

```env
DATABASE_URL=postgresql+psycopg2://postgres:your_actual_password@localhost:5432/atm_db
SECRET_KEY=replace-with-a-long-random-secret
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

## Run

```bash
uvicorn main:app --reload
```

## Main endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /account/balance`
- `POST /account/deposit`
- `POST /account/withdraw`
- `GET /account/transactions`
