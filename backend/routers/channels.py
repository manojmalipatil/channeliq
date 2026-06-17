from fastapi import APIRouter
from pydantic import BaseModel, Field

from models.message import IncomingMessage
from services.orchestrator import process_event

router = APIRouter(prefix="/webhook", tags=["webhooks"])

class WhatsappPayload(BaseModel):
    from_: str = Field(alias="from")
    message: str
    timestamp: str

class EmailPayload(BaseModel):
    from_: str = Field(alias="from")
    subject: str
    body: str
    timestamp: str

class WebchatPayload(BaseModel):
    session_id: str
    customer_id: str
    message: str
    timestamp: str
    image_data: str | None = None

class PushPayload(BaseModel):
    device_token: str
    customer_id: str
    action: str
    timestamp: str

@router.post("/whatsapp")
async def handle_whatsapp(payload: WhatsappPayload):
    event = IncomingMessage(
        channel="whatsapp",
        message=payload.message,
        timestamp=payload.timestamp,
        identifier=payload.from_
    )
    res = await process_event(event)
    return res

@router.post("/email")
async def handle_email(payload: EmailPayload):
    event = IncomingMessage(
        channel="email",
        message=f"{payload.subject}\n\n{payload.body}",
        timestamp=payload.timestamp,
        identifier=payload.from_
    )
    res = await process_event(event)
    return res

@router.post("/webchat")
async def handle_webchat(payload: WebchatPayload):
    event = IncomingMessage(
        channel="webchat",
        message=payload.message,
        timestamp=payload.timestamp,
        identifier=payload.customer_id,
        image_data=payload.image_data
    )
    res = await process_event(event)
    return res

@router.post("/push")
async def handle_push(payload: PushPayload):
    event = IncomingMessage(
        channel="push",
        message=payload.action,
        timestamp=payload.timestamp,
        identifier=payload.customer_id
    )
    res = await process_event(event)
    return res
