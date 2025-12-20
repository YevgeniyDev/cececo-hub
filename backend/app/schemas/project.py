from __future__ import annotations

from datetime import datetime
from typing import Optional, Literal

from pydantic import BaseModel, AnyUrl, Field, ConfigDict
from app.schemas.country import CountryOut

ProjectKind = Literal["project", "startup"]


class ProjectCreate(BaseModel):
    kind: ProjectKind
    country_id: int

    title: str = Field(min_length=3, max_length=200)
    summary: str = Field(min_length=10)

    sector: Optional[str] = Field(default=None, max_length=60)
    stage: Optional[str] = Field(default=None, max_length=40)
    website: Optional[AnyUrl] = None


class ProjectOut(BaseModel):
    id: int
    kind: ProjectKind
    country_id: int
    country: CountryOut

    title: str
    summary: str
    sector: Optional[str] = None
    stage: Optional[str] = None
    website: Optional[str] = None

    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
