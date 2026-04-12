import uuid
from datetime import datetime

_leads: list[dict] = []


def collect_prospect_info(
    name: str,
    email: str,
    phone: str = "",
    bedrooms_wanted: int | None = None,
    budget_max: float | None = None,
    move_in_date: str | None = None,
    notes: str = "",
) -> dict:
    """Capture prospect lead info."""
    lead = {
        "lead_id": str(uuid.uuid4())[:8],
        "name": name,
        "email": email,
        "phone": phone,
        "bedrooms_wanted": bedrooms_wanted,
        "budget_max": budget_max,
        "move_in_date": move_in_date,
        "notes": notes,
        "created_at": datetime.now().isoformat(),
    }
    _leads.append(lead)
    return lead


def get_leads() -> list[dict]:
    return _leads
