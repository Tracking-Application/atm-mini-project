from fastapi import FastAPI

import app.models
from app.database import Base, engine
from app.routes.account_routes import router as account_router
from app.routes.auth_routes import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ATM Machine API",
    description="FastAPI ATM backend with PostgreSQL and JWT authentication",
    version="1.0.0",
    docs_url="/api/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(account_router)

# Startup event → create tables
# @app.on_event("startup")
# async def on_startup():
#     await init_db()


@app.get("/")
def root():
    return {"message": "ATM API is running"}
