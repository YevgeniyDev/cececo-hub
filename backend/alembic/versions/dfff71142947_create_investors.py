"""create investors

Revision ID: dfff71142947
Revises: 406546b01842
Create Date: 2025-12-20 09:56:52.241178

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "dfff71142947"
down_revision = "406546b01842"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "investors",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("investor_type", sa.String(length=30), nullable=False),
        sa.Column("focus_sectors", sa.Text(), nullable=True),
        sa.Column("stages", sa.Text(), nullable=True),
        sa.Column("ticket_min", sa.Integer(), nullable=True),
        sa.Column("ticket_max", sa.Integer(), nullable=True),
        sa.Column("website", sa.String(length=300), nullable=True),
        sa.Column("contact_email", sa.String(length=200), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(op.f("ix_investors_id"), "investors", ["id"], unique=False)
    op.create_index(op.f("ix_investors_name"), "investors", ["name"], unique=False)
    op.create_index(op.f("ix_investors_investor_type"), "investors", ["investor_type"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_investors_investor_type"), table_name="investors")
    op.drop_index(op.f("ix_investors_name"), table_name="investors")
    op.drop_index(op.f("ix_investors_id"), table_name="investors")
    op.drop_table("investors")
