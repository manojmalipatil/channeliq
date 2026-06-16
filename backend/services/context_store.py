import json
import os
import redis.asyncio as redis
from typing import Optional, List, Dict

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client = redis.from_url(redis_url, decode_responses=True)

async def get_context(customer_id: str) -> Optional[Dict]:
    data = await redis_client.get(f"ctx:{customer_id}")
    if data:
        return json.loads(data)
    return None

async def save_context(customer_id: str, context: Dict):
    await redis_client.set(f"ctx:{customer_id}", json.dumps(context), ex=86400)

async def find_customer_by_phone(phone: str) -> Optional[Dict]:
    keys = await redis_client.keys("ctx:*")
    for key in keys:
        data = await redis_client.get(key)
        if data:
            ctx = json.loads(data)
            if ctx.get("phone") == phone:
                return ctx
    return None

async def find_customer_by_email(email: str) -> Optional[Dict]:
    keys = await redis_client.keys("ctx:*")
    for key in keys:
        data = await redis_client.get(key)
        if data:
            ctx = json.loads(data)
            if ctx.get("email") == email:
                return ctx
    return None

async def list_all_customers() -> List[Dict]:
    keys = await redis_client.keys("ctx:*")
    customers = []
    for key in keys:
        data = await redis_client.get(key)
        if data:
            customers.append(json.loads(data))
    return customers

async def get_global_stats() -> Dict:
    customers = await list_all_customers()
    total_interactions = 0
    channel_breakdown = {"whatsapp": 0, "email": 0, "webchat": 0, "push": 0}
    kpi_totals = {"resolved": 0, "escalated": 0, "dropped": 0, "converted": 0}
    channel_switches_today = 0
    journey_events = []

    for c in customers:
        history = c.get("unified_history", [])
        total_interactions += len(history)
        
        last_channel = None
        for msg in history:
            ch = msg.get("channel", "")
            if ch in channel_breakdown:
                channel_breakdown[ch] += 1
            
            if last_channel and ch != last_channel:
                channel_switches_today += 1
            last_channel = ch
            
            if msg.get("kpi"):
                kpi_type = msg["kpi"]
                if kpi_type in kpi_totals:
                    kpi_totals[kpi_type] += 1
            
            journey_events.append({
                "type": "interaction",
                "customer_id": c.get("customer_id"),
                "customer_name": c.get("name"),
                "channel": ch,
                "kpi": msg.get("kpi") or "escalated",
                "message_preview": msg.get("content", "")[:80],
                "timestamp": msg.get("timestamp"),
                "role": msg.get("role")
            })

    journey_events.sort(key=lambda x: x["timestamp"], reverse=True)
    journey_events = [e for e in journey_events if e["role"] == "assistant"][:50]
    
    total_kpis = sum(kpi_totals.values())
    resolution_rate = kpi_totals["resolved"] / total_kpis if total_kpis > 0 else 0.0
    conversion_rate = kpi_totals["converted"] / total_kpis if total_kpis > 0 else 0.0

    return {
        "total_interactions": total_interactions,
        "channel_breakdown": channel_breakdown,
        "kpi_totals": kpi_totals,
        "resolution_rate": round(resolution_rate, 3),
        "conversion_rate": round(conversion_rate, 3),
        "avg_turns_to_resolve": 2.3, # Mocked as requested or simplified
        "channel_switches_today": channel_switches_today,
        "journey_events": journey_events,
        "trend_data": [
            {"date": "Mon", "sentiment": 65, "conversion": 12},
            {"date": "Tue", "sentiment": 68, "conversion": 15},
            {"date": "Wed", "sentiment": 75, "conversion": 22},
            {"date": "Thu", "sentiment": 71, "conversion": 18},
            {"date": "Fri", "sentiment": 82, "conversion": 28},
            {"date": "Sat", "sentiment": 88, "conversion": 35},
            {"date": "Sun", "sentiment": 92, "conversion": 42},
        ]
    }
