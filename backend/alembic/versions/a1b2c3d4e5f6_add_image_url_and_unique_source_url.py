"""add image_url and unique source_url

Revision ID: a1b2c3d4e5f6
Revises: de79d4953c4e
Create Date: 2025-12-26 12:00:00.000000

"""

from alembic import op
import sqlalchemy as sa

revision = "a1b2c3d4e5f6"
down_revision = "de79d4953c4e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add image_url column
    op.add_column(
        "news_items",
        sa.Column("image_url", sa.String(length=600), nullable=True),
    )
    
    # Change default status to 'pending' for new items
    op.alter_column(
        "news_items",
        "status",
        server_default="pending",
        existing_type=sa.String(length=20),
        existing_nullable=False,
    )
    
    # Add unique constraint on source_url
    # First, ensure no duplicate non-null source_urls exist
    op.execute("""
        DELETE FROM news_items n1
        USING news_items n2
        WHERE n1.id > n2.id
        AND n1.source_url IS NOT NULL
        AND n2.source_url IS NOT NULL
        AND n1.source_url = n2.source_url
    """)
    
    # Create unique constraint (PostgreSQL allows NULLs in unique constraints)
    op.create_unique_constraint(
        "uq_news_items_source_url",
        "news_items",
        ["source_url"],
    )


def downgrade() -> None:
    # Remove unique constraint
    op.drop_constraint("uq_news_items_source_url", "news_items", type_="unique")
    
    # Revert status default
    op.alter_column(
        "news_items",
        "status",
        server_default="approved",
        existing_type=sa.String(length=20),
        existing_nullable=False,
    )
    
    # Remove image_url column
    op.drop_column("news_items", "image_url")

