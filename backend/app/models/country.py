from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Country(Base):
    __tablename__ = "countries"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    iso2: Mapped[str] = mapped_column(String(2), nullable=False, unique=True)
    region: Mapped[str | None] = mapped_column(String(120), nullable=True)

    investors = relationship(
        "Investor",
        secondary="investor_countries",
        back_populates="countries",
        lazy="selectin",
    )

