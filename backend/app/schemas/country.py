from pydantic import BaseModel

class CountryOut(BaseModel):
    id: int
    name: str
    iso2: str
    region: str | None = None

    class Config:
        from_attributes = True
