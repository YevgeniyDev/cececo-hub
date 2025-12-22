from sqlalchemy import ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class CountryIndicator(Base):
    __tablename__ = "country_indicators"
    __table_args__ = (UniqueConstraint("country_id", "key", name="uq_country_indicator_key"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    country_id: Mapped[int] = mapped_column(ForeignKey("countries.id", ondelete="CASCADE"), nullable=False)

    key: Mapped[str] = mapped_column(String(80), nullable=False)
    value: Mapped[float] = mapped_column(nullable=False)  # 0..1 normalized

    method: Mapped[str | None] = mapped_column(String(120), nullable=True)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)

    country = relationship("Country", back_populates="indicators")
