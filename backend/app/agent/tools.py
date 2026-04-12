import json
from app.services.availability import check_availability
from app.services.booking import schedule_viewing
from app.services.maintenance import submit_maintenance
from app.services.leads import collect_prospect_info

# ──────────────────────────────────────────────
#  Tool schemas (OpenAI function calling format)
# ──────────────────────────────────────────────

TOOL_DEFINITIONS = [
    {
        "type": "function",
        "function": {
            "name": "check_availability",
            "description": "Check available rental units. Use when a prospect asks about available apartments, pricing, or unit details.",
            "parameters": {
                "type": "object",
                "properties": {
                    "bedrooms": {
                        "type": "integer",
                        "description": "Number of bedrooms (0 for studio)",
                    },
                    "max_rent": {
                        "type": "number",
                        "description": "Maximum monthly rent budget",
                    },
                    "move_in_date": {
                        "type": "string",
                        "description": "Desired move-in date (YYYY-MM-DD)",
                    },
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "schedule_viewing",
            "description": "Schedule a property viewing/tour for a prospect. Use when someone wants to see a unit in person.",
            "parameters": {
                "type": "object",
                "properties": {
                    "unit_id": {"type": "string", "description": "Unit number to view"},
                    "name": {"type": "string", "description": "Prospect's full name"},
                    "email": {"type": "string", "description": "Prospect's email"},
                    "preferred_date": {"type": "string", "description": "Preferred date (YYYY-MM-DD)"},
                    "preferred_time": {"type": "string", "description": "Preferred time (e.g. '2:00 PM')"},
                },
                "required": ["unit_id", "name", "email", "preferred_date", "preferred_time"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "submit_maintenance",
            "description": "Submit a maintenance/repair request for a current tenant. Use when a tenant reports an issue.",
            "parameters": {
                "type": "object",
                "properties": {
                    "unit": {"type": "string", "description": "Tenant's unit number"},
                    "issue": {"type": "string", "description": "Description of the maintenance issue"},
                    "priority": {
                        "type": "string",
                        "enum": ["low", "normal", "high", "emergency"],
                        "description": "Issue priority level",
                    },
                },
                "required": ["unit", "issue"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "collect_prospect_info",
            "description": "Save a prospect's contact info and preferences for follow-up. Use when a prospect shares their details or wants to be contacted.",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "Prospect's name"},
                    "email": {"type": "string", "description": "Email address"},
                    "phone": {"type": "string", "description": "Phone number"},
                    "bedrooms_wanted": {"type": "integer", "description": "Desired number of bedrooms"},
                    "budget_max": {"type": "number", "description": "Maximum monthly budget"},
                    "move_in_date": {"type": "string", "description": "Target move-in date"},
                    "notes": {"type": "string", "description": "Any additional notes or preferences"},
                },
                "required": ["name", "email"],
            },
        },
    },
]


# ──────────────────────────────────────────────
#  Tool executor
# ──────────────────────────────────────────────

TOOL_FUNCTIONS = {
    "check_availability": check_availability,
    "schedule_viewing": schedule_viewing,
    "submit_maintenance": submit_maintenance,
    "collect_prospect_info": collect_prospect_info,
}


def execute_tool(name: str, arguments: str | dict) -> dict:
    """Execute a tool call and return the result."""
    if isinstance(arguments, str):
        arguments = json.loads(arguments)

    func = TOOL_FUNCTIONS.get(name)
    if not func:
        return {"error": f"Unknown tool: {name}"}

    try:
        result = func(**arguments)
        return {"success": True, "data": result}
    except Exception as e:
        return {"error": str(e)}
