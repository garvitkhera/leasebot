from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict


# --- Chat ---
class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None  # auto-generated if not provided


class ToolCallResult(BaseModel):
    tool: str
    result: dict


class ChatResponse(BaseModel):
    reply: str
    session_id: str
    tool_calls: List[ToolCallResult] = []
    sources: List[str] = []  # doc chunks used for RAG


# --- Documents ---
class DocumentOut(BaseModel):
    id: str
    filename: str
    uploaded_at: str
    chunk_count: int


# --- Conversations (admin) ---
class MessageOut(BaseModel):
    role: str  # "user" | "assistant"
    content: str
    timestamp: str
    tool_calls: list[ToolCallResult] = []


class ConversationOut(BaseModel):
    session_id: str
    started_at: str
    message_count: int
    last_message: str


class ConversationDetail(BaseModel):
    session_id: str
    messages: List[MessageOut]


# --- Analytics ---
class AnalyticsOut(BaseModel):
    total_conversations: int
    total_messages: int
    avg_messages_per_conversation: float
    top_intents: Dict[str, int]  # intent -> count
    tool_usage: Dict[str, int]  # tool_name -> call count
    daily_volume: List[dict]  # [{date, count}, ...]


# --- Services ---
class UnitInfo(BaseModel):
    unit_id: str
    bedrooms: int
    bathrooms: float
    rent: float
    sqft: int
    available_date: str
    floor: int
    amenities: List[str]


class ViewingRequest(BaseModel):
    unit_id: str
    name: str
    email: str
    preferred_date: str
    preferred_time: str


class MaintenanceRequest(BaseModel):
    unit: str
    issue: str
    priority: str = "normal"  # low, normal, high, emergency


class LeadInfo(BaseModel):
    name: str
    email: str
    phone: str = ""
    bedrooms_wanted: int | None = None
    budget_max: float | None = None
    move_in_date: str | None = None
    notes: str = ""
