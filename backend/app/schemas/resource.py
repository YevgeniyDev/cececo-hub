from datetime import datetime
from pydantic import BaseModel


class ResourceOut(BaseModel):
    id: int
    country_id: int | None = None
    status: str

    resource_type: str
    title: str
    abstract: str
    url: str
    tags: str | None = None

    published_at: datetime | None = None

    submitted_by_name: str | None = None
    submitted_by_email: str | None = None
    submitted_at: datetime

    class Config:
        from_attributes = True


class ResourceCreate(BaseModel):
    country_id: int | None = None
    resource_type: str
    title: str
    abstract: str
    url: str
    tags: str | None = None
    published_at: datetime | None = None
    submitted_by_name: str | None = None
    submitted_by_email: str | None = None
