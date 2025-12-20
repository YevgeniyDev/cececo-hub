from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, AnyUrl, EmailStr

class CountryMini(BaseModel):
    id: int
    name: str
    iso2: str

    model_config = {"from_attributes": True}

class InvestorBase(BaseModel):
    name: str
    investor_type: str  # fund | angel | corporate | public | ngo

    focus_sectors: Optional[str] = None
    stages: Optional[str] = None

    ticket_min: Optional[int] = None
    ticket_max: Optional[int] = None

    website: Optional[AnyUrl] = None
    contact_email: Optional[EmailStr] = None

class InvestorCreate(InvestorBase):
    country_ids: List[int] = []

class InvestorOut(InvestorBase):
    id: int
    created_at: datetime
    countries: List[CountryMini] = []

    model_config = {"from_attributes": True}
