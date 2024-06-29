from beanie import Document
from datetime import datetime
from pydantic import BaseModel

class PortfolioSnapshot(Document):
    timestamp: datetime
    value: float

    class Config:
       json_schema_extra = {
            "example": {
                "timestamp": "2024-04-30T08:24:12",
                "value": 10020
            }
        }