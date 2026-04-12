from supabase import create_client, Client
from app.config import get_settings
from datetime import datetime, timezone
import json
import uuid

_client = None


def get_supabase() -> Client:
    global _client
    if _client is None:
        s = get_settings()
        _client = create_client(s.supabase_url, s.supabase_service_key)
    return _client


# ──────────────────────────────────────────────
#  Conversations & Messages
# ──────────────────────────────────────────────

def save_message(session_id: str, role: str, content: str, tool_calls: list | None = None):
    db = get_supabase()
    # upsert conversation
    db.table("conversations").upsert({
        "session_id": session_id,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }, on_conflict="session_id").execute()

    # insert message
    db.table("messages").insert({
        "id": str(uuid.uuid4()),
        "session_id": session_id,
        "role": role,
        "content": content,
        "tool_calls": json.dumps(tool_calls or []),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }).execute()


def get_conversations(limit: int = 50, offset: int = 0):
    db = get_supabase()
    result = db.table("conversations") \
        .select("*") \
        .order("updated_at", desc=True) \
        .range(offset, offset + limit - 1) \
        .execute()
    return result.data


def get_conversation_messages(session_id: str):
    db = get_supabase()
    result = db.table("messages") \
        .select("*") \
        .eq("session_id", session_id) \
        .order("created_at") \
        .execute()
    return result.data


# ──────────────────────────────────────────────
#  Documents metadata
# ──────────────────────────────────────────────

def save_document_meta(doc_id: str, filename: str, chunk_count: int):
    db = get_supabase()
    db.table("documents").insert({
        "id": doc_id,
        "filename": filename,
        "chunk_count": chunk_count,
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
    }).execute()


def get_documents():
    db = get_supabase()
    result = db.table("documents").select("*").order("uploaded_at", desc=True).execute()
    return result.data


def delete_document_meta(doc_id: str):
    db = get_supabase()
    db.table("documents").delete().eq("id", doc_id).execute()


# ──────────────────────────────────────────────
#  Analytics helpers
# ──────────────────────────────────────────────

def get_analytics():
    db = get_supabase()

    convos = db.table("conversations").select("*", count="exact").execute()
    msgs = db.table("messages").select("*", count="exact").execute()

    total_convos = convos.count or 0
    total_msgs = msgs.count or 0

    return {
        "total_conversations": total_convos,
        "total_messages": total_msgs,
        "avg_messages_per_conversation": round(total_msgs / max(total_convos, 1), 1),
    }
