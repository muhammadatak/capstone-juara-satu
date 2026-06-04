"""reset_tickets_table

Revision ID: 4c14bdf6970e
Revises: f8a2b3c4d5e6
Create Date: 2026-06-04 15:59:07.623029

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "4c14bdf6970e"
down_revision: Union[str, Sequence[str], None] = "f8a2b3c4d5e6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("TRUNCATE TABLE tickets RESTART IDENTITY CASCADE")
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
