import os
import base64
import google.generativeai as genai

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "dummy"))
model = genai.GenerativeModel("gemini-2.5-flash")

KNOWLEDGE_BASE = """
COMPANY POLICIES:
- Returns: Customers can return items within 30 days of purchase. They must provide a photo of defective items.
- Refunds: Processed within 5-7 business days to original payment method.
- Shipping: Standard shipping is 3-5 days. Expedited is 1-2 days.
- Broken/Damaged Items: If an image is provided showing a broken or defective item, apologize immediately and authorize a replacement.
"""

def format_history(history: list) -> str:
    formatted = []
    for msg in history:
        formatted.append(f"[{msg.get('channel', 'unknown')}] {msg.get('role', 'unknown')}: {msg.get('content', '')} ({msg.get('timestamp', '')})")
    return "\n".join(formatted)

def generate_response(context: dict, user_message: str, current_channel: str, image_data: str = None) -> str:
    customer_name = context.get("name", "Customer")
    previous_channels = ", ".join([ch for ch in context.get("active_channels", []) if ch != current_channel])
    history_text = format_history(context.get("unified_history", []))
    
    system_prompt = f"""
You are ChannelIQ, an intelligent customer support AI. You maintain full memory of this customer's journey across all channels.

Customer: {customer_name}
Current Channel: {current_channel}
Previous Channels: {previous_channels}

KNOWLEDGE BASE:
{KNOWLEDGE_BASE}

CROSS-CHANNEL CONVERSATION HISTORY:
{history_text}

INSTRUCTIONS:
- Acknowledge channel switches naturally (e.g., "Continuing from our WhatsApp chat...")
- Never ask for information already given in any channel
- Be channel-appropriate: WhatsApp = brief, Email = detailed, WebChat = balanced, Push = one-liner
- If an image is provided, analyze it. If it shows damage, follow the Knowledge Base policy.
- End EVERY response with exactly two tags on new lines at the very end:
  [KPI:resolved|escalated|dropped|converted]
  [SENTIMENT:positive|neutral|negative]

Now respond to the customer's latest message:
User ({current_channel}): {user_message}
"""
    
    contents = [system_prompt]
    
    if image_data:
        try:
            # Handle data URL format: data:image/jpeg;base64,...
            if "," in image_data:
                mime_type = image_data.split(";")[0].split(":")[1]
                base64_str = image_data.split(",")[1]
            else:
                mime_type = "image/jpeg"
                base64_str = image_data
                
            contents.append({
                "mime_type": mime_type,
                "data": base64_str
            })
        except Exception as e:
            print(f"Error parsing image: {e}")

    try:
        response = model.generate_content(contents)
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "I'm having trouble right now. A human agent will assist you shortly.\n[KPI:escalated]\n[SENTIMENT:negative]"

def generate_executive_report(stats: dict) -> str:
    prompt = f"""
You are an AI Executive Analyst for ChannelIQ.
Generate a professional, strategic 2-paragraph Markdown report based on these real-time analytics:
{stats}

Highlight ROI, channel deflection, and overall customer satisfaction. Use emojis sparingly. Do not include raw JSON.
"""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating report: {e}"
