from pydantic import BaseModel


class CountryTargetOut(BaseModel):
    id: int
    country_id: int
    year: int | None = None
    target_type: str
    title: str
    value: str | None = None
    unit: str | None = None
    notes: str | None = None
    source_url: str | None = None

    class Config:
        from_attributes = True

