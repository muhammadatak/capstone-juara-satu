from schemas import TicketResponse, TicketUpdate, TicketCreate, TicketPublicResponse


from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from services.email_utils import send_ticket_done

import models
from database import get_db

router = APIRouter()


# ADMIN GET LIST TICKET
@router.get("/ticket", response_model=list[TicketResponse])
async def get_all_ticket(db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(models.Ticket))
    ticket = result.scalars().all()

    return ticket


# ADMIN GET TICKET
@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket(ticket_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(
        select(models.Ticket).where(models.Ticket.id == ticket_id)
    )
    ticket = result.scalars().first()

    if ticket:
        return ticket
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found"
    )


# ADMIN UPDATE TICKET
@router.patch("/{ticket_id}", response_model=TicketResponse)
async def update_ticket(
    ticket_id: int,
    background_task: BackgroundTasks,
    ticket_data: TicketUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await db.execute(
        select(models.Ticket).where(models.Ticket.id == ticket_id)
    )
    ticket = result.scalars().first()

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    update_data = ticket_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ticket, field, value)

    await db.commit()
    await db.refresh(ticket)

    background_task.add_task(
        send_ticket_done,
        to_email=ticket.sender_email,
        fullname=ticket.fullname,
        ticket_uuid=ticket.uuid,
    )

    return ticket
