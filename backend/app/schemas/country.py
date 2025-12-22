from pydantic import BaseModel

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

    indicators: list[CountryIndicatorOut] = []
    policies: list[CountryPolicyOut] = []
    frameworks: list[CountryFrameworkOut] = []
