from __future__ import annotations

from sqlalchemy import String, Text, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    kind: Mapped[str] = mapped_column(String(20), nullable=False, index=True)

    country_id: Mapped[int] = mapped_column(ForeignKey("countries.id"), nullable=False, index=True)
    country = relationship("Country", lazy="joined")

    title: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    summary: Mapped[str] = mapped_column(Text, nullable=False)

    sector: Mapped[str | None] = mapped_column(String(60), nullable=True, index=True)
    stage: Mapped[str | None] = mapped_column(String(40), nullable=True, index=True)
    website: Mapped[str | None] = mapped_column(String(300), nullable=True)

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
