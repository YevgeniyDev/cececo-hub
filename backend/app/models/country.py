from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Country(Base):
    __tablename__ = "countries"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    iso2: Mapped[str] = mapped_column(String(2), nullable=False, unique=True)
    region: Mapped[str | None] = mapped_column(String(120), nullable=True)

    # Knowledge hub narrative (MVP-curated)
    briefing: Mapped[str | None] = mapped_column(Text, nullable=True)
    potential_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    action_plan_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    investors = relationship(
        "Investor",
        secondary="investor_countries",
        back_populates="countries",
        lazy="selectin",
    )

    policies = relationship("CountryPolicy", back_populates="country", lazy="selectin", cascade="all, delete-orphan")
    frameworks = relationship("CountryFramework", back_populates="country", lazy="selectin", cascade="all, delete-orphan")
    indicators = relationship("CountryIndicator", back_populates="country", lazy="selectin", cascade="all, delete-orphan")
    news_items = relationship("NewsItem", back_populates="country", lazy="selectin")
    institutions = relationship("CountryInstitution", back_populates="country", cascade="all, delete-orphan")
    targets = relationship("CountryTarget", back_populates="country", cascade="all, delete-orphan")
