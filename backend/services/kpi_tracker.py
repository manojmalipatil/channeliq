import re
from typing import Tuple, Dict

def parse_kpi_from_response(text: str) -> Tuple[str, str, str]:
    kpi_label = "escalated" # Default
    sentiment_label = "neutral" # Default
    
    match_kpi = re.search(r'\[KPI:(resolved|escalated|dropped|converted)\]', text)
    if match_kpi:
        kpi_label = match_kpi.group(1)
        text = re.sub(r'\[KPI:(resolved|escalated|dropped|converted)\].*(\n|$)', '', text, flags=re.MULTILINE)
        
    match_sent = re.search(r'\[SENTIMENT:(positive|neutral|negative)\]', text)
    if match_sent:
        sentiment_label = match_sent.group(1)
        text = re.sub(r'\[SENTIMENT:(positive|neutral|negative)\].*(\n|$)', '', text, flags=re.MULTILINE)
        
    return text.strip(), kpi_label, sentiment_label

def update_session_kpis(context: Dict, kpi: str) -> Dict:
    session_kpis = context.get("session_kpis", {
        "resolved": 0,
        "escalated": 0,
        "dropped": 0,
        "converted": 0
    })
    
    if kpi in session_kpis:
        session_kpis[kpi] += 1
        
    context["session_kpis"] = session_kpis
    return context

def compute_rates(session_kpis: Dict, total: int) -> Dict:
    if total == 0:
        return {"resolution_rate": 0.0, "conversion_rate": 0.0}
        
    resolved = session_kpis.get("resolved", 0)
    converted = session_kpis.get("converted", 0)
    
    return {
        "resolution_rate": resolved / total,
        "conversion_rate": converted / total
    }
