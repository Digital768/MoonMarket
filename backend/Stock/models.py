from typing import Optional, List
from pydantic import BaseModel, Field
import uuid

class Purchase(BaseModel):
    price: float
    quantity: float

    class Config:
        json_schema_extra = {
            "example": {
                "price": 100.0,
                "quantity": 10
            }
        }

class Stock(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias='_id')  # Convert UUID to string
    name:str = Field(...)
    ticker:str = Field(...)
    purchases: List[Purchase]  # List of purchases
    last_price:float
    value:float
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "60000000-0000-0000",
                "name": "Apple",    
                "ticker": "AAPL",
                "purchases": [{"price": 100.0, "quantity": 10}],  # List of purchases
                "last_price": 100.0,
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
