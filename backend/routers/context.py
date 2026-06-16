from fastapi import APIRouter, HTTPException
from services.context_store import get_context

router = APIRouter(tags=["context"])

@router.get("/context/{customer_id}")
async def get_customer_context(customer_id: str):
    context = await get_context(customer_id)
    if not context:
        raise HTTPException(status_code=404, detail="Customer not found")
    return context
