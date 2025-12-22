from pydantic import BaseModel


class CountryFrameworkOut(BaseModel):
    id: int
    country_id: int
    framework_type: str
    status: str
    name: str
    description: str
    why_it_matters: str | None = None
    source_url: str | None = None

    class Config:
        from_attributes = True
