from pydantic import BaseModel, Field
import uuid

class Stock(BaseModel):
    id:str = Field(default_factory=uuid.uuid4, alias='_id')
    name:str = Field(...)
    bought_price:float
    last_price:float
    quantity:float
    value:float
    
    class Config:
        schema_extra = {
            "example": {
                "id": "60000000-0000-0000",
                "name": "Apple",
                "bought_price": 100.0,
                "last_price": 100.0,
                "quantity": 10,
                "value": 100.0
            }
        }
    
class UpdateStock(BaseModel):
    last_price:float
    
    class Config:
        schema_extra = {
            "example": {
                "last_price": 100.0
            }
        }
    