"""add auto_classification

Revision ID: e7a1b2c3d4f5
Revises: abc912617f9a
Create Date: 2026-06-04 12:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e7a1b2c3d4f5"
down_revision: Union[str, Sequence[str], None] = "abc912617f9a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "tickets", sa.Column("auto_classification", sa.String(length=20), nullable=True)
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("tickets", "auto_classification")
