from fastapi import APIRouter
from app.models.database import get_conversations, get_conversation_messages

router = APIRouter(prefix="/api/conversations", tags=["conversations"])


@router.get("/")
async def list_conversations(limit: int = 50, offset: int = 0):
    try:
        return get_conversations(limit, offset)
    except Exception:
        return []


@router.get("/{session_id}")
async def get_conversation(session_id: str):
    try:
        messages = get_conversation_messages(session_id)
        return {"session_id": session_id, "messages": messages}
    except Exception:
        return {"session_id": session_id, "messages": []}
