from urllib.parse import urlparse

from models import Ticket, TicketType

URL_WHITELIST = {"cimbniaga.com", "cimbniaga.co.id"}
PHONE_WHITELIST = {"08041090909"}
EMAIL_WHITELIST = {"info@cnaf.co.id"}


def _normalize_host(raw_url: str) -> str | None:
    if not raw_url:
        return None
    cleaned = raw_url.strip().lower()
    if not cleaned:
        return None
    if "://" not in cleaned:
        cleaned = f"http://{cleaned}"
    parsed = urlparse(cleaned)
    return parsed.hostname.lower() if parsed.hostname else None


def _is_url_whitelisted(raw_url: str | None) -> tuple[bool, str | None]:
    if not raw_url:
        return True, None
    host = _normalize_host(raw_url)
    if not host:
        return False, raw_url
    for allowed in URL_WHITELIST:
        if host == allowed or host.endswith(f".{allowed}"):
            return True, raw_url
    return False, raw_url


def _combine_whitelist_result(
    sender_ok: bool,
    sender_value: str | None,
    url_ok: bool,
    url_value: str | None,
) -> dict:
    if not sender_ok:
        return {"is_whitelisted": False, "whitelist_value": sender_value}
    if not url_ok:
        return {"is_whitelisted": False, "whitelist_value": url_value}
    return {"is_whitelisted": True, "whitelist_value": sender_value}


def build_whitelist_check(ticket: Ticket):
    # Email
    if ticket.type.value == TicketType.email.value:
        sender_ok = bool(ticket.email) and ticket.email in EMAIL_WHITELIST
        url_ok, url_value = _is_url_whitelisted(ticket.url)
        return _combine_whitelist_result(sender_ok, ticket.email, url_ok, url_value)

    # SMS
    if (
        ticket.type.value == TicketType.sms.value
        or ticket.type.value == TicketType.whatsapp.value
    ):
        sender_ok = bool(ticket.phone_number) and ticket.phone_number in PHONE_WHITELIST
        url_ok, url_value = _is_url_whitelisted(ticket.url)
        return _combine_whitelist_result(
            sender_ok, ticket.phone_number, url_ok, url_value
        )

    # URL
    if ticket.type.value == TicketType.url.value:
        is_whitelisted, url_value = _is_url_whitelisted(ticket.url)
        return {
            "is_whitelisted": is_whitelisted,
            "whitelist_value": url_value if is_whitelisted else ticket.url,
        }

    return {"is_whitelisted": False, "whitelist_value": None}
