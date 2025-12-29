from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class CountryTarget(Base):
    __tablename__ = "country_target"

    id = Column(Integer, primary_key=True, index=True)
    country_id = Column(Integer, ForeignKey("countries.id"), nullable=False, index=True)

    year = Column(Integer, nullable=True)
    target_type = Column(String, nullable=False)     # e.g. renewables_share, capacity_gw, emissions, efficiency
    title = Column(String, nullable=False)           # human readable label
    value = Column(String, nullable=True)            # “30%”, “15 GW”, “-20%”
    unit = Column(String, nullable=True)             # “%”, “GW”, “tCO2”, etc.
    notes = Column(String, nullable=True)
    source_url = Column(String, nullable=True)

    country = relationship("Country", back_populates="targets")
