from enum import Enum

class KPILabel(str, Enum):
    RESOLVED = "resolved"
    ESCALATED = "escalated"
    DROPPED = "dropped"
    CONVERTED = "converted"
