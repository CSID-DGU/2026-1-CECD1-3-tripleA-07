from enum import Enum

class EventType(str, Enum):
    NEW = "NEW"
    DISCOUNT = "DISCOUNT"