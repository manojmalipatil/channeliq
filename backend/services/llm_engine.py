import os
import google.generativeai as genai

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "dummy"))
model = genai.GenerativeModel("gemini-2.5-flash") # as requested in requirements 11

def format_history(history: list) -> str:
    formatted = []
    for msg in history:
        formatted.append(f"[{msg.get('channel', 'unknown')}] {msg.get('role', 'unknown')}: {msg.get('content', '')} ({msg.get('timestamp', '')})")
    return "\n".join(formatted)

def generate_response(context: dict, user_message: str, current_channel: str) -> str:
    customer_name = context.get("name", "Customer")
    previous_channels = ", ".join([ch for ch in context.get("active_channels", []) if ch != current_channel])
    history_text = format_history(context.get("unified_history", []))
    
    system_prompt = f"""
You are ChannelIQ, an intelligent customer support AI. You maintain full memory of this customer's journey across all channels.

Customer: {customer_name}
Current Channel: {current_channel}
Previous Channels: {previous_channels}

CROSS-CHANNEL CONVERSATION HISTORY:
{history_text}

INSTRUCTIONS:
- Acknowledge channel switches naturally (e.g., "Continuing from our WhatsApp chat...")
- Never ask for information already given in any channel
- Be channel-appropriate: WhatsApp = brief, Email = detailed, WebChat = balanced, Push = one-liner
- End EVERY response with exactly one KPI tag on its own line:
  [KPI:resolved] — issue fully addressed
  [KPI:escalated] — needs human agent
  [KPI:dropped] — customer disengaged
  [KPI:converted] — purchase or signup completed

Now respond to the customer's latest message:
User ({current_channel}): {user_message}
"""
    try:
        response = model.generate_content(system_prompt)
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "I'm having trouble right now. A human agent will assist you shortly.\n[KPI:escalated]"
