from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import DATABASE_URL
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://cececo_bd_user:XhcXQlmQDQ7emoWSxRWpF5rF5DhvA8Nj@dpg-d54iuebe5dus73bkbt6g-a/cececo_bd"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
