from fastapi import APIRouter
from app.models.database import get_analytics

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/")
async def analytics():
    try:
        return get_analytics()
    except Exception:
        return {
            "total_conversations": 0,
            "total_messages": 0,
            "avg_messages_per_conversation": 0,
        }
