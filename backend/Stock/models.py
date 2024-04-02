from typing import Optional
from pydantic import BaseModel, Field
import uuid

class Stock(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias='_id')  # Convert UUID to string
    name:str = Field(...)
    ticker:str = Field(...)
    bought_price:float
    last_price:float
    quantity:float
    value:float
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "60000000-0000-0000",
                "name": "Apple",
                "ticker": "AAPL",
                "bought_price": 100.0,
                "last_price": 100.0,
                "quantity": 10,
                "value": 100.0
            }
        }
    
class UpdateStock(BaseModel):
    quantity:Optional[float]
    last_price:Optional[float]
    
    class Config:
        json_schema_extra = {
            "example": {
                "last_price": 100.0,
                "quantity": 20
            }
        }
    