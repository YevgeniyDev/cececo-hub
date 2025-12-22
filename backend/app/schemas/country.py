from pydantic import BaseModel, Field

from app.schemas.country_policy import CountryPolicyOut
from app.schemas.country_framework import CountryFrameworkOut
from app.schemas.country_indicator import CountryIndicatorOut


class CountryOut(BaseModel):
    id: int
    name: str
    iso2: str
    region: str | None = None

    class Config:
        from_attributes = True


class CountryDetailOut(CountryOut):
    briefing: str | None = None
    potential_notes: str | None = None
    action_plan_notes: str | None = None

    indicators: list[CountryIndicatorOut] = Field(default_factory=list)
    policies: list[CountryPolicyOut] = Field(default_factory=list)
    frameworks: list[CountryFrameworkOut] = Field(default_factory=list)


class CountryIndicatorBreakdown(BaseModel):
    key: str
    value: float | None = None  # normalized 0..1 (may be missing)
    weight: float


class CountryRankOut(BaseModel):
    country_id: int
    name: str
    iso2: str
    region: str | None = None
    score: int  # 0..100
    breakdown: list[CountryIndicatorBreakdown] = Field(default_factory=list)

    class Config:
        from_attributes = True
