import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://cececo_bd_user:XhcXQlmQDQ7emoWSxRWpF5rF5DhvA8Nj@dpg-d54iuebe5dus73bkbt6g-a/cececo_bd"
)
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")
