from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router
from app.db.base import Base
from app.db.session import engine
from app.core.seed import seed_initial_data

app = FastAPI(title="CECECO Hub MVP")

# CORS for Next.js dev + (optional) Swagger try-it-out from same origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup() -> None:
    """
    In docker-compose you typically run Alembic first.
    This is a safe fallback to ensure tables exist in dev,
    then seed initial data.
    """
    Base.metadata.create_all(bind=engine)
    seed_initial_data()

# Health/root endpoint (prevents annoying 404 on "/")
@app.get("/")
def root():
    return {"status": "ok", "service": "cececo-backend"}

# All API routes live here
app.include_router(api_router, prefix="/api")
