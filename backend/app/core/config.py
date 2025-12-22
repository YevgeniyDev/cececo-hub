import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://cececo_bd_user:XhcXQlmQDQ7emoWSxRWpF5rF5DhvA8Nj@dpg-d54iuebe5dus73bkbt6g-a/cececo_bd",
    "postgresql+psycopg://cececo:cececo@localhost:5432/cececo"
)
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")
