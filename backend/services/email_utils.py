from email.message import EmailMessage
from config import settings
import aiosmtplib
import models
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="templates")


async def send_email(
    to_email: str,
    subject: str,
    plain_text: str,
    html_content: str | None = None,
) -> None:
    message = EmailMessage()
    message["From"] = settings.mail_from
    message["To"] = to_email
    message["Subject"] = subject

    message.set_content(plain_text)

    if html_content:
        message.add_alternative(html_content, subtype="html")

    await aiosmtplib.send(
        message,
        hostname=settings.mail_server,
        port=settings.mail_port,
        username=settings.mail_username if settings.mail_username else None,
        password=settings.mail_password.get_secret_value() or None,
        start_tls=settings.mail_use_tls,
    )


async def send_ticket_uuid(to_email: str, fullname: str, ticket_uuid: str) -> None:
    template = templates.env.get_template("ticket_id.html")
    html_content = template.render(ticket_uuid=ticket_uuid, fullname=fullname)

    plain_text = f"""Hi {fullname},

Kamu telah mengirim ticket ini id ticket anda:

{ticket_uuid}


Best regards,
Cumb Niaga Team
"""

    await send_email(
        to_email=to_email,
        subject="Ticket ID Anda - Cumb Niaga Blog",
        plain_text=plain_text,
        html_content=html_content,
    )


async def send_ticket_done(to_email: str, fullname: str, ticket_uuid: str) -> None:
    template = templates.env.get_template("ticket_selesai.html")
    html_content = template.render(ticket_uuid=ticket_uuid, fullname=fullname)

    plain_text = f"""Hi {fullname},

Tiket anda telah selsai silahkan cek di website kami

{ticket_uuid}


Best regards,
Cumb Niaga Team
"""

    await send_email(
        to_email=to_email,
        subject="Ticket Anda Selesai - Cumb Niaga Blog",
        plain_text=plain_text,
        html_content=html_content,
    )
