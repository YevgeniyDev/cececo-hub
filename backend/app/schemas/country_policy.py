from pydantic import BaseModel


class CountryPolicyOut(BaseModel):
    id: int
    country_id: int
    policy_type: str
    status: str
    title: str
    summary: str
    why_it_matters: str | None = None
    source_url: str | None = None

    class Config:
        from_attributes = True
