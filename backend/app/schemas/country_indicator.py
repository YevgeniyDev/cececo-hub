from pydantic import BaseModel


class CountryIndicatorOut(BaseModel):
    id: int
    country_id: int
    key: str
    value: float
    method: str | None = None
    details: str | None = None

    class Config:
        from_attributes = True
