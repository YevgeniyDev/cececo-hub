from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Resource(Base):
    __tablename__ = "resources"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    country_id: Mapped[int | None] = mapped_column(
        ForeignKey("countries.id", ondelete="SET NULL"), nullable=True
    )

    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")

    resource_type: Mapped[str] = mapped_column(String(30), nullable=False)
    title: Mapped[str] = mapped_column(String(220), nullable=False)
    abstract: Mapped[str] = mapped_column(Text, nullable=False)

    url: Mapped[str] = mapped_column(String(700), nullable=False)
    tags: Mapped[str | None] = mapped_column(String(400), nullable=True)

    published_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    submitted_by_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    submitted_by_email: Mapped[str | None] = mapped_column(String(180), nullable=True)

    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    country = relationship("Country", lazy="selectin")
