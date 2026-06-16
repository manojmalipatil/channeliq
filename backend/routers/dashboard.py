from fastapi import APIRouter
from services.context_store import get_global_stats, list_all_customers

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats")
async def get_stats():
    return await get_global_stats()

@router.get("/customers")
async def get_customers():
    customers = await list_all_customers()
    return [{
        "name": c.get("name"),
        "customer_id": c.get("customer_id"),
        "active_channels": c.get("active_channels"),
        "session_kpis": c.get("session_kpis"),
        "last_seen": c.get("last_seen"),
        "last_channel": c.get("last_channel")
    } for c in customers]
