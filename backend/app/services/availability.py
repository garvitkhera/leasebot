from datetime import date

# Mock unit inventory
UNITS = [
    {"unit_id": "101", "bedrooms": 1, "bathrooms": 1.0, "rent": 1450, "sqft": 650, "available_date": "2025-05-01", "floor": 1, "amenities": ["dishwasher", "in-unit laundry", "balcony"]},
    {"unit_id": "205", "bedrooms": 2, "bathrooms": 1.0, "rent": 2100, "sqft": 900, "available_date": "2025-04-15", "floor": 2, "amenities": ["dishwasher", "in-unit laundry", "walk-in closet"]},
    {"unit_id": "302", "bedrooms": 2, "bathrooms": 2.0, "rent": 2450, "sqft": 1050, "available_date": "2025-05-01", "floor": 3, "amenities": ["dishwasher", "in-unit laundry", "balcony", "city view"]},
    {"unit_id": "410", "bedrooms": 3, "bathrooms": 2.0, "rent": 3200, "sqft": 1350, "available_date": "2025-06-01", "floor": 4, "amenities": ["dishwasher", "in-unit laundry", "balcony", "city view", "walk-in closet"]},
    {"unit_id": "108", "bedrooms": 0, "bathrooms": 1.0, "rent": 1100, "sqft": 450, "available_date": "2025-04-01", "floor": 1, "amenities": ["dishwasher"]},
]


def check_availability(
    bedrooms: int | None = None,
    max_rent: float | None = None,
    move_in_date: str | None = None,
) -> list[dict]:
    """Search available units with optional filters."""
    results = UNITS.copy()

    if bedrooms is not None:
        results = [u for u in results if u["bedrooms"] == bedrooms]

    if max_rent is not None:
        results = [u for u in results if u["rent"] <= max_rent]

    if move_in_date:
        target = date.fromisoformat(move_in_date)
        results = [u for u in results if date.fromisoformat(u["available_date"]) <= target]

    return results
