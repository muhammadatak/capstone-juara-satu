from schemas import TicketResponse, TicketUpdate, TicketCreate, TicketPublicResponse


from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from services.ticket_service import generate_ticket_code
from services.ml_service import predict_text
from services.llm_helper import make_llm_explanation
from services.risk_score import calculate_risk_score
from services.whitelist_check import build_whitelist_check
from services.url_crawler import crawler

from services.email_utils import send_ticket_uuid

import models
from database import get_db

router = APIRouter()


# USER GET TICKET
@router.get("/{ticket_uuid}", response_model=TicketPublicResponse)
async def get_ticket_user(
    ticket_uuid: str, db: Annotated[AsyncSession, Depends(get_db)]
):
    result = await db.execute(
        select(models.Ticket).where(models.Ticket.uuid == ticket_uuid)
    )
    ticket = result.scalars().first()

    if ticket:
        return ticket
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found"
    )


# USER POST TICKET
@router.post(
    "",
    response_model=TicketPublicResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_submission(
    ticket_data: TicketCreate,
    background_task: BackgroundTasks,
    db: Annotated[AsyncSession, Depends(get_db)],
):

    uuid = await generate_ticket_code(db)
    use_ml = ticket_data.type != models.TicketType.url
    ml_score = predict_text(ticket_data.content) if use_ml else None
    new_ticket = models.Ticket(
        fullname=ticket_data.fullname,
        sender_email=ticket_data.sender_email,
        email=ticket_data.email,
        content=ticket_data.content,
        url=ticket_data.url,
        phone_number=ticket_data.phone_number,
        type=ticket_data.type,
        ml_score=ml_score,
        uuid=uuid,
    )
    whitelist_check = build_whitelist_check(new_ticket)
    risk_score = calculate_risk_score(ml_score, whitelist_check, use_ml=use_ml)
    summary = {
        "type": ticket_data.type.value,
        "ml_score": ml_score,
        "risk_score": risk_score,
        "whitelist_check": whitelist_check,
    }

    new_ticket.risk_score = risk_score
    new_ticket.ai_suggestion = make_llm_explanation(summary)
    new_ticket.whitelist_check = whitelist_check

    if ticket_data.type == models.TicketType.url:
        if not ticket_data.url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="URL is required for url ticket type",
            )
        # crawl_result = await crawler.crawl(ticket_data.url)
        # new_ticket.final_url = crawl_result["final_url"]
        # new_ticket.screenshot_uuid = crawl_result["screenshot_uuid"]

    db.add(new_ticket)
    await db.commit()
    await db.refresh(new_ticket)

    background_task.add_task(
        send_ticket_uuid,
        to_email=ticket_data.sender_email,
        fullname=ticket_data.fullname,
        ticket_uuid=uuid,
    )

    return new_ticket
