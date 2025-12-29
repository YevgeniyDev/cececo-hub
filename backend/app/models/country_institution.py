from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class CountryInstitution(Base):
    __tablename__ = "country_institution"

    id = Column(Integer, primary_key=True, index=True)
    country_id = Column(Integer, ForeignKey("countries.id"), nullable=False, index=True)

    name = Column(String, nullable=False)
    institution_type = Column(String, nullable=False)  # ministry/regulator/tso/utility/agency/etc
    description = Column(String, nullable=True)
    website = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)

    country = relationship("Country", back_populates="institutions")
