from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse, ToolCallResult
from app.agent.engine import chat

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    result = await chat(message=req.message, session_id=req.session_id)
    return ChatResponse(
        reply=result["reply"],
        session_id=result["session_id"],
        tool_calls=[
            ToolCallResult(tool=tc["tool"], result=tc["result"])
            for tc in result["tool_calls"]
        ],
        sources=result["sources"],
    )
