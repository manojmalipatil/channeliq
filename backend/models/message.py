from pydantic import BaseModel
from typing import Optional

class WhatsAppWebhook(BaseModel):
    from_: str = BaseModel.model_fields.get("from_", None) # We'll use alias in the router, but let's just use from_number or from_ alias
    # Wait, 'from' is a reserved keyword in python. So we'll use Field(alias="from") in the router.
    message: str
    timestamp: str

class EmailWebhook(BaseModel):
    from_: str # alias="from"
    subject: str
    body: str
    timestamp: str

class WebChatWebhook(BaseModel):
    session_id: str
    customer_id: str
    message: str
    timestamp: str

class PushWebhook(BaseModel):
    device_token: str
    customer_id: str
    action: str
    timestamp: str

class IncomingMessage(BaseModel):
    channel: str
    message: str
    timestamp: str
    identifier: str # phone, email, customer_id depending on channel
    name: Optional[str] = None # We might not have this for new customers
