import asyncio
from typing import Dict
from pydantic import BaseModel
import uuid
from datetime import datetime, timezone
from models.message import IncomingMessage
from services.context_store import get_context, save_context, find_customer_by_phone, find_customer_by_email
from services.llm_engine import generate_response
from services.kpi_tracker import parse_kpi_from_response, update_session_kpis

# Global SSE Queue
sse_queue = asyncio.Queue()

class OrchestratorResult(BaseModel):
    reply: str
    kpi: str
    customer_id: str
    customer_name: str
    channel: str

async def process_event(event: IncomingMessage) -> OrchestratorResult:
    context = None
    if event.channel == "whatsapp":
        context = await find_customer_by_phone(event.identifier)
    elif event.channel == "email":
        context = await find_customer_by_email(event.identifier)
    else:
        context = await get_context(event.identifier)

    if not context:
        cust_id = f"cust_{uuid.uuid4().hex[:8]}"
        context = {
            "customer_id": cust_id,
            "name": event.name or "New Customer",
            "email": event.identifier if event.channel == "email" else f"{cust_id}@example.com",
            "phone": event.identifier if event.channel == "whatsapp" else "+00000000000",
            "unified_history": [],
            "active_channels": [event.channel],
            "last_channel": event.channel,
            "last_seen": event.timestamp,
            "session_kpis": {
                "resolved": 0,
                "escalated": 0,
                "dropped": 0,
                "converted": 0
            }
        }

    if event.channel not in context.get("active_channels", []):
        context.setdefault("active_channels", []).append(event.channel)

    user_msg_id = f"msg_{uuid.uuid4().hex[:8]}"
    user_msg = {
        "id": user_msg_id,
        "channel": event.channel,
        "role": "user",
        "content": event.message,
        "timestamp": event.timestamp,
        "kpi": None
    }
    context.setdefault("unified_history", []).append(user_msg)

    # Note channel switch implicitly handled above and by history
    raw_response = generate_response(context, event.message, event.channel)
    reply_text, kpi = parse_kpi_from_response(raw_response)

    assistant_msg_id = f"msg_{uuid.uuid4().hex[:8]}"
    assistant_timestamp = datetime.now(timezone.utc).isoformat() + "Z"
    assistant_msg = {
        "id": assistant_msg_id,
        "channel": event.channel,
        "role": "assistant",
        "content": reply_text,
        "timestamp": assistant_timestamp,
        "kpi": kpi
    }
    context["unified_history"].append(assistant_msg)
    
    context = update_session_kpis(context, kpi)
    context["last_channel"] = event.channel
    context["last_seen"] = assistant_timestamp

    await save_context(context["customer_id"], context)

    # Publish SSE event
    await sse_queue.put({
        "type": "interaction",
        "customer_id": context["customer_id"],
        "customer_name": context["name"],
        "channel": event.channel,
        "kpi": kpi,
        "message_preview": reply_text[:80],
        "timestamp": assistant_timestamp
    })

    return OrchestratorResult(
        reply=reply_text,
        kpi=kpi,
        customer_id=context["customer_id"],
        customer_name=context["name"],
        channel=event.channel
    )
