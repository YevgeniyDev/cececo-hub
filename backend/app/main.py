from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router
from app.db.base import Base
from app.db.session import engine
from app.core.seed import seed_initial_data
from app.models.country_policy import CountryPolicy  # noqa: F401
from app.models.country_framework import CountryFramework  # noqa: F401
from app.models.country_indicator import CountryIndicator  # noqa: F401
from app.models.news_item import NewsItem  # noqa: F401
from app.models.resource import Resource  # noqa: F401

app = FastAPI(title="CECECO Hub MVP")

# CORS for Next.js dev + (optional) Swagger try-it-out from same origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://cececo-hub-1.onrender.com",
    ],
    allow_credentials=False,
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
