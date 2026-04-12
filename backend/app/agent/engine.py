import json
import litellm
from app.config import get_settings
from app.agent.prompts import SYSTEM_PROMPT, RAG_PROMPT_TEMPLATE
from app.agent.tools import TOOL_DEFINITIONS, execute_tool
from app.agent.memory import (
    get_or_create_session,
    add_message,
    get_history,
    format_history_for_prompt,
)
from app.rag.query import query_documents, build_context
from app.models.database import save_message
from typing import Optional


async def chat(message: str, session_id: Optional[str] = None) -> dict:
    """Main chat function. Handles RAG retrieval, tool calls, and response generation.

    Returns: {reply, session_id, tool_calls, sources}
    """
    settings = get_settings()
    session_id = get_or_create_session(session_id)

    # 1. Retrieve relevant docs via RAG
    chunks = query_documents(message, top_k=5)
    context = build_context(chunks)
    sources = list({c["source"] for c in chunks}) if chunks else []

    # 2. Build conversation history
    chat_history = format_history_for_prompt(session_id)

    # 3. Build messages for LLM
    user_prompt = RAG_PROMPT_TEMPLATE.format(
        context=context,
        chat_history=chat_history,
        question=message,
    )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *get_history(session_id),
        {"role": "user", "content": user_prompt},
    ]

    # 4. Call LLM with tools
    response = litellm.completion(
        model=settings.llm_model,
        messages=messages,
        tools=TOOL_DEFINITIONS,
        tool_choice="auto",
        api_key=settings.llm_api_key,
    )

    response_message = response.choices[0].message
    tool_results = []

    # 5. Handle tool calls (loop for multi-tool)
    if response_message.tool_calls:
        # Add assistant's tool call message to history
        messages.append(response_message.model_dump())

        for tool_call in response_message.tool_calls:
            fn_name = tool_call.function.name
            fn_args = tool_call.function.arguments

            result = execute_tool(fn_name, fn_args)
            tool_results.append({"tool": fn_name, "result": result})

            # Add tool result to messages
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result),
            })

        # 6. Get final response after tool execution
        final_response = litellm.completion(
            model=settings.llm_model,
            messages=messages,
            api_key=settings.llm_api_key,
        )
        reply = final_response.choices[0].message.content
    else:
        reply = response_message.content

    # 7. Save to memory
    add_message(session_id, "user", message)
    add_message(session_id, "assistant", reply)

    # 8. Persist to Supabase (non-blocking, best-effort)
    try:
        save_message(session_id, "user", message)
        save_message(session_id, "assistant", reply, tool_calls=tool_results)
    except Exception:
        pass  # don't break chat if DB is down

    return {
        "reply": reply,
        "session_id": session_id,
        "tool_calls": tool_results,
        "sources": sources,
    }
