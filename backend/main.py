import asyncio
import json
from datetime import datetime, timezone
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from routers import channels, context, dashboard, kpi, simulator
from services.orchestrator import sse_manager
from services.context_store import save_context, get_context

app = FastAPI(title="ChannelIQ Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(channels.router)
app.include_router(context.router)
app.include_router(dashboard.router)
app.include_router(simulator.router)

async def seed_data():
    # Seed Priya Mehta
    if not await get_context("cust_001"):
        await save_context("cust_001", {
            "customer_id": "cust_001",
            "name": "Priya Mehta",
            "email": "priya@example.com",
            "phone": "+91-9876543210",
            "active_channels": ["whatsapp", "email"],
            "last_channel": "email",
            "last_seen": datetime.now(timezone.utc).isoformat() + "Z",
            "session_kpis": {
                "resolved": 1,
                "escalated": 0,
                "dropped": 0,
                "converted": 0
            },
            "unified_history": [
                {
                    "id": "msg_001",
                    "channel": "whatsapp",
                    "role": "user",
                    "content": "My order hasn't arrived",
                    "timestamp": "2024-01-15T10:00:00Z",
                    "kpi": None
                },
                {
                    "id": "msg_002",
                    "channel": "whatsapp",
                    "role": "assistant",
                    "content": "I can help track that. Your order #4521 is out for delivery.",
                    "timestamp": "2024-01-15T10:00:05Z",
                    "kpi": "resolved"
                },
                {
                    "id": "msg_003",
                    "channel": "email",
                    "role": "user",
                    "content": "Following up on my order #4521 from WhatsApp. The delivery guy didn't call.",
                    "timestamp": "2024-01-15T12:00:00Z",
                    "kpi": None
                },
                {
                    "id": "msg_004",
                    "channel": "email",
                    "role": "assistant",
                    "content": "I apologize for the inconvenience. I will ask the delivery partner to call you immediately.",
                    "timestamp": "2024-01-15T12:05:00Z",
                    "kpi": "resolved"
                }
            ]
        })

    # Seed Arjun Sharma
    if not await get_context("cust_002"):
        await save_context("cust_002", {
            "customer_id": "cust_002",
            "name": "Arjun Sharma",
            "email": "arjun@example.com",
            "phone": "+91-9845012345",
            "active_channels": ["webchat"],
            "last_channel": "webchat",
            "last_seen": datetime.now(timezone.utc).isoformat() + "Z",
            "session_kpis": {
                "resolved": 0,
                "escalated": 1,
                "dropped": 0,
                "converted": 0
            },
            "unified_history": [
                {
                    "id": "msg_005",
                    "channel": "webchat",
                    "role": "user",
                    "content": "I want to return this product, it's defective",
                    "timestamp": "2024-01-16T09:00:00Z",
                    "kpi": None
                },
                {
                    "id": "msg_006",
                    "channel": "webchat",
                    "role": "assistant",
                    "content": "I'm sorry to hear that. A return specialist will contact you shortly.",
                    "timestamp": "2024-01-16T09:02:00Z",
                    "kpi": "escalated"
                }
            ]
        })

@app.on_event("startup")
async def startup_event():
    await seed_data()

@app.get("/health")
async def health():
    try:
        from services.context_store import redis_client
        await redis_client.ping()
        return {"status": "ok", "redis": "connected"}
    except Exception as e:
        return {"status": "error", "redis": str(e)}

@app.get("/events")
async def sse_events(request: Request):
    async def event_generator():
        q = asyncio.Queue()
        sse_manager.clients.add(q)
        try:
            while True:
                if await request.is_disconnected():
                    break
                event_data = await q.get()
                yield {
                    "data": json.dumps(event_data)
                }
        except asyncio.CancelledError:
            pass
        finally:
            sse_manager.clients.remove(q)
    return EventSourceResponse(event_generator())
