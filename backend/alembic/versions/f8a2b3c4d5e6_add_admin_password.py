"""add hashed_password to users + seed admin

Revision ID: f8a2b3c4d5e6
Revises: e7a1b2c3d4f5
Create Date: 2026-06-04 14:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from passlib.context import CryptContext

revision: str = "f8a2b3c4d5e6"
down_revision: Union[str, Sequence[str], None] = "e7a1b2c3d4f5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


def upgrade() -> None:
    op.add_column("users", sa.Column("hashed_password", sa.String(128), nullable=True))

    # Seed admin user: admin@cimb.com / admin123
    op.execute(
        f"INSERT INTO users (username, email, hashed_password) "
        f"VALUES ('admin', 'admin@cimb.com', '{pwd.hash('admin123')}') "
        f"ON CONFLICT DO NOTHING"
    )

    op.alter_column("users", "hashed_password", nullable=False)


def downgrade() -> None:
    op.drop_column("users", "hashed_password")
