import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://cececo:cececo@localhost:5432/cececo"
)
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
