from sqlalchemy import Column, DateTime, Integer, String, Text, func, Table, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base

investor_countries = Table(
    "investor_countries",
    Base.metadata,
    Column("investor_id", Integer, ForeignKey("investors.id", ondelete="CASCADE"), primary_key=True),
    Column("country_id", Integer, ForeignKey("countries.id", ondelete="CASCADE"), primary_key=True),
)

class Investor(Base):
    __tablename__ = "investors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    investor_type = Column(String(30), nullable=False, index=True)  # fund | angel | corporate | public | ngo

    focus_sectors = Column(Text, nullable=True)  # CSV: "Solar,Wind,Grid"
    stages = Column(Text, nullable=True)         # CSV: "seed,seriesA"

    ticket_min = Column(Integer, nullable=True)
    ticket_max = Column(Integer, nullable=True)

    website = Column(String(300), nullable=True)
    contact_email = Column(String(200), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # NEW: countries supported by this investor
    countries = relationship(
        "Country",
        secondary=investor_countries,
        back_populates="investors",
        lazy="selectin",
    )
