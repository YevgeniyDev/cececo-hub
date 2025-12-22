"""create country_knowledge_hub

Revision ID: 3503d0c8ac9e
Revises: 288ece6b3baf
Create Date: 2025-12-21 07:17:47.718014

"""

from alembic import op
import sqlalchemy as sa

revision = "3503d0c8ac9e"
down_revision = "288ece6b3baf"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add narrative fields to countries
    op.add_column("countries", sa.Column("briefing", sa.Text(), nullable=True))
    op.add_column("countries", sa.Column("potential_notes", sa.Text(), nullable=True))
    op.add_column("countries", sa.Column("action_plan_notes", sa.Text(), nullable=True))

    # Policies
    op.create_table(
        "country_policies",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("country_id", sa.Integer(), sa.ForeignKey("countries.id", ondelete="CASCADE"), nullable=False),
        sa.Column("policy_type", sa.String(length=50), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("title", sa.String(length=180), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("why_it_matters", sa.Text(), nullable=True),
        sa.Column("source_url", sa.String(length=500), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_country_policies_country_id", "country_policies", ["country_id"])

    # Frameworks
    op.create_table(
        "country_frameworks",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("country_id", sa.Integer(), sa.ForeignKey("countries.id", ondelete="CASCADE"), nullable=False),
        sa.Column("framework_type", sa.String(length=60), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("name", sa.String(length=180), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("why_it_matters", sa.Text(), nullable=True),
        sa.Column("source_url", sa.String(length=500), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_country_frameworks_country_id", "country_frameworks", ["country_id"])

    # Indicators
    op.create_table(
        "country_indicators",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("country_id", sa.Integer(), sa.ForeignKey("countries.id", ondelete="CASCADE"), nullable=False),
        sa.Column("key", sa.String(length=80), nullable=False),
        sa.Column("value", sa.Float(), nullable=False),  # normalized 0..1
        sa.Column("method", sa.String(length=120), nullable=True),
        sa.Column("details", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("country_id", "key", name="uq_country_indicator_key"),
    )
    op.create_index("ix_country_indicators_country_id", "country_indicators", ["country_id"])


def downgrade() -> None:
    op.drop_index("ix_country_indicators_country_id", table_name="country_indicators")
    op.drop_table("country_indicators")

    op.drop_index("ix_country_frameworks_country_id", table_name="country_frameworks")
    op.drop_table("country_frameworks")

    op.drop_index("ix_country_policies_country_id", table_name="country_policies")
    op.drop_table("country_policies")

    op.drop_column("countries", "action_plan_notes")
    op.drop_column("countries", "potential_notes")
    op.drop_column("countries", "briefing")
