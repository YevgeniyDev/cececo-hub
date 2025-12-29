from pydantic import BaseModel


class CountryInstitutionOut(BaseModel):
    id: int
    country_id: int
    name: str
    institution_type: str
    description: str | None = None
    website: str | None = None
    contact_email: str | None = None

    class Config:
        from_attributes = True

