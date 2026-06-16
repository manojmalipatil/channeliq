from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class UnifiedMessage(BaseModel):
    id: str
    channel: str
    role: str
    content: str
    timestamp: str
    kpi: Optional[str] = None

class SessionKPIs(BaseModel):
    resolved: int = 0
    escalated: int = 0
    dropped: int = 0
    converted: int = 0

class CustomerContext(BaseModel):
    customer_id: str
    name: str
    email: str
    phone: str
    unified_history: List[UnifiedMessage] = Field(default_factory=list)
    active_channels: List[str] = Field(default_factory=list)
    last_channel: str = ""
    last_seen: str = ""
    session_kpis: SessionKPIs = Field(default_factory=SessionKPIs)
