"""create investor_countries

Revision ID: 288ece6b3baf
Revises: dfff71142947
Create Date: 2025-12-20 11:07:57.692973

"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "288ece6b3baf"
down_revision = "dfff71142947"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "investor_countries",
        sa.Column("investor_id", sa.Integer(), nullable=False),
        sa.Column("country_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["investor_id"], ["investors.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["country_id"], ["countries.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("investor_id", "country_id"),
    )
    op.create_index(
        "ix_investor_countries_investor_id",
        "investor_countries",
        ["investor_id"],
    )
    op.create_index(
        "ix_investor_countries_country_id",
        "investor_countries",
        ["country_id"],
    )


def downgrade() -> None:
    op.drop_index("ix_investor_countries_country_id", table_name="investor_countries")
    op.drop_index("ix_investor_countries_investor_id", table_name="investor_countries")
    op.drop_table("investor_countries")
