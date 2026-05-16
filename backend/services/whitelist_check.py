import re

from models import Ticket, TicketType

URL_WHITELIST = ["cimbniaga.com", "cimbniaga.co.id"]
PHONE_WHITELIST = "08041090909"
EMAIL_WHITELIST = "info@cnaf.co.id"


def build_whitelist_check(ticket: Ticket):
    # Email
    if ticket.type.value == TicketType.email.value:
        is_whitelisted = ticket.email in EMAIL_WHITELIST
        return {
            "is_whitelisted": is_whitelisted,
            "whitelist_value": ticket.email if is_whitelisted else None,
        }

    # SMS
    if (
        ticket.type.value == TicketType.sms.value
        or ticket.type.value == TicketType.whatsapp.value
    ):
        is_whitelisted = ticket.phone_number in PHONE_WHITELIST
        return {
            "is_whitelisted": is_whitelisted,
            "whitelist_value": ticket.phone_number if is_whitelisted else None,
        }

    # URL
    if ticket.type.value == TicketType.url.value:
        is_whitelisted = ticket.url in URL_WHITELIST
        return {
            "is_whitelisted": is_whitelisted,
            "whitelist_value": ticket.url if is_whitelisted else None,
        }

    return {"is_whitelisted": False, "whitelist_value": None}
