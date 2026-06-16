import os
import random
import asyncio
from datetime import datetime, timezone
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="ChannelIQ Simulator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

CUSTOMERS = [
    {"name": "Priya Mehta",   "phone": "+91-9876543210", "email": "priya@example.com",  "customer_id": "cust_001"},
    {"name": "Arjun Sharma",  "phone": "+91-9845012345", "email": "arjun@example.com",  "customer_id": "cust_002"},
    {"name": "Divya Nair",    "phone": "+91-9123456789", "email": "divya@example.com",  "customer_id": "cust_003"},
    {"name": "Rohit Kumar",   "phone": "+91-9988776655", "email": "rohit@example.com",  "customer_id": "cust_004"},
    {"name": "Sneha Iyer",    "phone": "+91-9765432100", "email": "sneha@example.com",  "customer_id": "cust_005"},
]

MESSAGES = [
    "My order hasn't arrived yet, it's been 5 days",
    "I want to return this product, it's defective",
    "Can I upgrade to the premium plan?",
    "The mobile app keeps crashing on login",
    "I was charged twice for the same order",
    "I'd like to buy the annual subscription",
    "Where is my refund? It's been 10 days",
    "How do I reset my account password?",
    "Can I change my delivery address?",
    "I want to cancel my subscription",
]

class SimulateRequest(BaseModel):
    customer_index: Optional[int] = None
    message: Optional[str] = None

def get_sim_data(req: SimulateRequest):
    cust = CUSTOMERS[req.customer_index] if req.customer_index is not None else random.choice(CUSTOMERS)
    msg = req.message if req.message else random.choice(MESSAGES)
    ts = datetime.now(timezone.utc).isoformat() + "Z"
    return cust, msg, ts

@app.post("/simulate/whatsapp")
async def simulate_whatsapp(req: SimulateRequest = SimulateRequest()):
    cust, msg, ts = get_sim_data(req)
    payload = {
        "from": cust["phone"],
        "message": msg,
        "timestamp": ts
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post(f"{BACKEND_URL}/webhook/whatsapp", json=payload)
    return res.json()

@app.post("/simulate/email")
async def simulate_email(req: SimulateRequest = SimulateRequest()):
    cust, msg, ts = get_sim_data(req)
    payload = {
        "from": cust["email"],
        "subject": "Customer Support Request",
        "body": msg,
        "timestamp": ts
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post(f"{BACKEND_URL}/webhook/email", json=payload)
    return res.json()

@app.post("/simulate/webchat")
async def simulate_webchat(req: SimulateRequest = SimulateRequest()):
    cust, msg, ts = get_sim_data(req)
    payload = {
        "session_id": f"sess_{random.randint(1000, 9999)}",
        "customer_id": cust["customer_id"],
        "message": msg,
        "timestamp": ts
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post(f"{BACKEND_URL}/webhook/webchat", json=payload)
    return res.json()

@app.post("/simulate/push")
async def simulate_push(req: SimulateRequest = SimulateRequest()):
    cust, msg, ts = get_sim_data(req)
    payload = {
        "device_token": f"dev_{random.randint(1000, 9999)}",
        "customer_id": cust["customer_id"],
        "action": msg,
        "timestamp": ts
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post(f"{BACKEND_URL}/webhook/push", json=payload)
    return res.json()

@app.post("/simulate/journey")
async def simulate_journey():
    cust = CUSTOMERS[0] # Priya Mehta
    responses = []
    
    # Step 1: WhatsApp
    ts = datetime.now(timezone.utc).isoformat() + "Z"
    payload_wa = {"from": cust["phone"], "message": "My order hasn't arrived", "timestamp": ts}
    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post(f"{BACKEND_URL}/webhook/whatsapp", json=payload_wa)
        responses.append({"channel": "whatsapp", "response": res.json()})
    
    await asyncio.sleep(3)
    
    # Step 2: Email
    ts = datetime.now(timezone.utc).isoformat() + "Z"
    payload_em = {"from": cust["email"], "subject": "Order Issue", "body": "Following up on my order issue from WhatsApp", "timestamp": ts}
    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post(f"{BACKEND_URL}/webhook/email", json=payload_em)
        responses.append({"channel": "email", "response": res.json()})
        
    await asyncio.sleep(3)
    
    # Step 3: Webchat
    ts = datetime.now(timezone.utc).isoformat() + "Z"
    payload_wc = {"session_id": "sess_123", "customer_id": cust["customer_id"], "message": "I'm still waiting for a resolution", "timestamp": ts}
    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post(f"{BACKEND_URL}/webhook/webchat", json=payload_wc)
        responses.append({"channel": "webchat", "response": res.json()})
        
    return {"journey": responses}

async def fire_random_event(delay: int):
    await asyncio.sleep(delay)
    channels = ["whatsapp", "email", "webchat", "push"]
    channel = random.choice(channels)
    req = SimulateRequest()
    if channel == "whatsapp":
        await simulate_whatsapp(req)
    elif channel == "email":
        await simulate_email(req)
    elif channel == "webchat":
        await simulate_webchat(req)
    else:
        await simulate_push(req)

@app.post("/simulate/bulk")
async def simulate_bulk():
    tasks = []
    for i in range(10):
        tasks.append(fire_random_event(i * 2))
    asyncio.create_task(asyncio.gather(*tasks))
    return {"status": "bulk simulation started", "count": 10}

@app.get("/health")
async def health():
    return {"status": "ok"}
