from collections import defaultdict
import uuid
from typing import Optional

# In-memory conversation store (per session)
# Format: {session_id: [{"role": "user"|"assistant", "content": "..."}, ...]}
_sessions: dict[str, list[dict]] = defaultdict(list)


def get_or_create_session(session_id: Optional[str] = None) -> str:
    if session_id and session_id in _sessions:
        return session_id
    new_id = session_id or str(uuid.uuid4())[:12]
    _sessions[new_id] = []
    return new_id


def add_message(session_id: str, role: str, content: str):
    _sessions[session_id].append({"role": role, "content": content})


def get_history(session_id: str, max_turns: int = 20) -> list[dict]:
    """Return recent conversation history for the session."""
    history = _sessions.get(session_id, [])
    return history[-max_turns:]


def format_history_for_prompt(session_id: str, max_turns: int = 10) -> str:
    """Format history as a readable string for the LLM prompt."""
    history = get_history(session_id, max_turns)
    if not history:
        return "No previous conversation."
    
    lines = []
    for msg in history:
        role = "Prospect" if msg["role"] == "user" else "LeaseBot"
        lines.append(f"{role}: {msg['content']}")
    return "\n".join(lines)


def clear_session(session_id: str):
    _sessions.pop(session_id, None)
