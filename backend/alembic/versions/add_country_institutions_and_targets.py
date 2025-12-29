"""add country institutions and targets

Revision ID: add_institutions_targets
Revises: a1b2c3d4e5f6
Create Date: 2025-01-20 10:00:00.000000

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "add_institutions_targets"
down_revision = "a1b2c3d4e5f6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create country_institution table
    op.create_table(
        "country_institution",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("country_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("institution_type", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("website", sa.String(), nullable=True),
        sa.Column("contact_email", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["country_id"], ["countries.id"], ondelete="CASCADE"),
    )
    op.create_index(op.f("ix_country_institution_id"), "country_institution", ["id"], unique=False)
    op.create_index(op.f("ix_country_institution_country_id"), "country_institution", ["country_id"], unique=False)

    # Create country_target table
    op.create_table(
        "country_target",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("country_id", sa.Integer(), nullable=False),
        sa.Column("year", sa.Integer(), nullable=True),
        sa.Column("target_type", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("value", sa.String(), nullable=True),
        sa.Column("unit", sa.String(), nullable=True),
        sa.Column("notes", sa.String(), nullable=True),
        sa.Column("source_url", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["country_id"], ["countries.id"], ondelete="CASCADE"),
    )
    op.create_index(op.f("ix_country_target_id"), "country_target", ["id"], unique=False)
    op.create_index(op.f("ix_country_target_country_id"), "country_target", ["country_id"], unique=False)
    op.create_index(op.f("ix_country_target_year"), "country_target", ["year"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_country_target_year"), table_name="country_target")
    op.drop_index(op.f("ix_country_target_country_id"), table_name="country_target")
    op.drop_index(op.f("ix_country_target_id"), table_name="country_target")
    op.drop_table("country_target")
    
    op.drop_index(op.f("ix_country_institution_country_id"), table_name="country_institution")
    op.drop_index(op.f("ix_country_institution_id"), table_name="country_institution")
    op.drop_table("country_institution")

