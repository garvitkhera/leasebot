import uuid
from datetime import datetime

# In-memory bookings store (in production → Supabase)
_bookings: list[dict] = []


def schedule_viewing(
    unit_id: str,
    name: str,
    email: str,
    preferred_date: str,
    preferred_time: str,
) -> dict:
    """Schedule a viewing for a prospect."""
    booking = {
        "booking_id": str(uuid.uuid4())[:8],
        "unit_id": unit_id,
        "name": name,
        "email": email,
        "date": preferred_date,
        "time": preferred_time,
        "status": "confirmed",
        "created_at": datetime.now().isoformat(),
    }
    _bookings.append(booking)
    return booking


def get_bookings() -> list[dict]:
    return _bookings
