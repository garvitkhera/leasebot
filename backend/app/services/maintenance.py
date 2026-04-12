import uuid
from datetime import datetime

_tickets: list[dict] = []


def submit_maintenance(
    unit: str,
    issue: str,
    priority: str = "normal",
) -> dict:
    """Submit a maintenance request."""
    ticket = {
        "ticket_id": str(uuid.uuid4())[:8],
        "unit": unit,
        "issue": issue,
        "priority": priority,
        "status": "open",
        "created_at": datetime.now().isoformat(),
    }
    _tickets.append(ticket)
    return ticket


def get_tickets() -> list[dict]:
    return _tickets
