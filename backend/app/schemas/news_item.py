from datetime import datetime
from pydantic import BaseModel


class NewsItemOut(BaseModel):
    id: int
    country_id: int | None = None
    country_name: str | None = None
    country_iso2: str | None = None
    status: str

    impact_type: str
    impact_score: int

    title: str
    summary: str

    tags: str | None = None
    source_name: str | None = None
    source_url: str | None = None
    image_url: str | None = None

    published_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class NewsItemCreate(BaseModel):
    country_id: int | None = None
    status: str | None = None
    impact_type: str
    title: str
    summary: str
    tags: str | None = None
    source_name: str | None = None
    source_url: str | None = None
    published_at: datetime

