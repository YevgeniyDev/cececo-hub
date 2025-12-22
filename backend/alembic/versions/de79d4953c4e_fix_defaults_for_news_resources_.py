"""fix defaults for news/resources timestamps

Revision ID: de79d4953c4e
Revises: b704eb9f4bdc
Create Date: 2025-12-22 04:32:28.349534

"""

from alembic import op
import sqlalchemy as sa

revision = "de79d4953c4e"
down_revision = "b704eb9f4bdc"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # news_items.created_at: ensure DB default exists
    op.alter_column(
        "news_items",
        "created_at",
        server_default=sa.text("now()"),
        existing_type=sa.DateTime(timezone=True),
        existing_nullable=False,
    )

    # resources.submitted_at: ensure DB default exists
    op.alter_column(
        "resources",
        "submitted_at",
        server_default=sa.text("now()"),
        existing_type=sa.DateTime(timezone=True),
        existing_nullable=False,
    )


def downgrade() -> None:
    op.alter_column(
        "news_items",
        "created_at",
        server_default=None,
        existing_type=sa.DateTime(timezone=True),
        existing_nullable=False,
    )

    op.alter_column(
        "resources",
        "submitted_at",
        server_default=None,
        existing_type=sa.DateTime(timezone=True),
        existing_nullable=False,
    )
