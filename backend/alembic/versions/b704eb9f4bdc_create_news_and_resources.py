"""create news and resources

Revision ID: b704eb9f4bdc
Revises: 3503d0c8ac9e
Create Date: 2025-12-22 04:05:00.165866

"""

from alembic import op
import sqlalchemy as sa

revision = "b704eb9f4bdc"
down_revision = "3503d0c8ac9e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "news_items",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("country_id", sa.Integer(), sa.ForeignKey("countries.id", ondelete="SET NULL"), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="approved"),
        sa.Column("impact_type", sa.String(length=30), nullable=False),
        sa.Column("impact_score", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("title", sa.String(length=220), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("tags", sa.String(length=400), nullable=True),
        sa.Column("source_name", sa.String(length=120), nullable=True),
        sa.Column("source_url", sa.String(length=600), nullable=True),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_news_items_country_id", "news_items", ["country_id"])
    op.create_index("ix_news_items_status", "news_items", ["status"])
    op.create_index("ix_news_items_published_at", "news_items", ["published_at"])

    op.create_table(
        "resources",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("country_id", sa.Integer(), sa.ForeignKey("countries.id", ondelete="SET NULL"), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="pending"),
        sa.Column("resource_type", sa.String(length=30), nullable=False),
        sa.Column("title", sa.String(length=220), nullable=False),
        sa.Column("abstract", sa.Text(), nullable=False),
        sa.Column("url", sa.String(length=700), nullable=False),
        sa.Column("tags", sa.String(length=400), nullable=True),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("submitted_by_name", sa.String(length=120), nullable=True),
        sa.Column("submitted_by_email", sa.String(length=180), nullable=True),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_resources_country_id", "resources", ["country_id"])
    op.create_index("ix_resources_status", "resources", ["status"])


def downgrade() -> None:
    op.drop_index("ix_resources_status", table_name="resources")
    op.drop_index("ix_resources_country_id", table_name="resources")
    op.drop_table("resources")

    op.drop_index("ix_news_items_published_at", table_name="news_items")
    op.drop_index("ix_news_items_status", table_name="news_items")
    op.drop_index("ix_news_items_country_id", table_name="news_items")
    op.drop_table("news_items")
