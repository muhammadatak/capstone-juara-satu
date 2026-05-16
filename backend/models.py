from __future__ import annotations

from datetime import UTC, datetime
import uuid

from sqlalchemy import (
    Integer,
    String,
    Text,
    JSON,
    DateTime,
    ForeignKey,
    Enum as SAEnum,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base
import enum


class TicketType(str, enum.Enum):
    url = "url"
    sms = "sms"
    email = "email"
    whatsapp = "whatsapp"


class TicketStatus(str, enum.Enum):
    on_review = "on_review"
    reviewed = "reviewed"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)


class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    uuid: Mapped[str] = mapped_column(
        String(36), unique=True, index=True, default=lambda: str(uuid.uuid4())
    )
    # creds
    fullname: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    sender_email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    # message
    content: Mapped[str] = mapped_column(Text, nullable=False)
    url: Mapped[str] = mapped_column(Text, nullable=True)
    phone_number: Mapped[str] = mapped_column(String, nullable=True)
    email: Mapped[str] = mapped_column(String(120), unique=False, nullable=True)
    type: Mapped[TicketType] = mapped_column(SAEnum(TicketType), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=True)

    # detail
    ai_suggestion: Mapped[str] = mapped_column(Text, nullable=True)
    whitelist_check: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    risk_score: Mapped[int] = mapped_column(Integer, nullable=True)
    status: Mapped[TicketStatus] = mapped_column(
        SAEnum(TicketStatus), default=TicketStatus.on_review.value, nullable=False
    )
    admin_note: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
    )
