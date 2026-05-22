from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, EmailStr
from datetime import datetime
from models import TicketStatus, TicketType


class WhitelistCheckItem(BaseModel):
    is_whitelisted: bool = Field(default=False)
    whitelist_value: str | None = Field(default=None)


class TicketBase(BaseModel):
    fullname: str = Field(max_length=50)
    sender_email: EmailStr = Field(max_length=50)
    email: EmailStr | None = Field(default=None, max_length=50)
    content: str = Field(min_length=1)
    url: str | None = Field(default=None)
    phone_number: str | None = Field(default=None)
    type: TicketType


class TicketCreate(TicketBase):
    pass


class TicketPublicResponse(TicketBase):
    model_config = ConfigDict(from_attributes=True)

    uuid: str
    risk_score: int | None = Field(default=None)
    whitelist_check: WhitelistCheckItem | None = Field(default=None)
    admin_note: str | None = Field(default=None)
    status: TicketStatus
    created_at: datetime


class TicketResponse(TicketBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: str
    file_path: str | None = Field(default=None)
    ai_suggestion: str | None = Field(default=None)
    whitelist_check: WhitelistCheckItem | None = Field(default=None)
    risk_score: int | None = Field(default=None)
    status: TicketStatus
    admin_note: str | None = Field(default=None)
    created_at: datetime
    ml_score: int | None = Field(default=None)


class TicketUpdate(BaseModel):
    status: TicketStatus | None = None
    admin_note: str | None = None
