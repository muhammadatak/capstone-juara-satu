from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

import models


async def generate_ticket_code(db: AsyncSession):
    today = datetime.now().strftime("%Y%m%d")

    result = await db.execute(
        select(models.Ticket)
        .where(models.Ticket.uuid.like(f"TCK-{today}-%"))
        .order_by(models.Ticket.id.desc())
        .limit(1)
    )

    last_ticket = result.scalar_one_or_none()

    if not last_ticket:
        number = 1
    else:
        number = int(last_ticket.uuid.split("-")[-1]) + 1

    return f"TCK-{today}-{number:04d}"
