from typing import List, Annotated
from beanie import Document, Indexed
from pydantic import BaseModel, Field

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

class Sale(BaseModel):
    price: float
    quantity: float

    class Config:
        json_schema_extra = {
            "example": {
                "price": 100.0,
                "quantity": 10
            }
        }

class Stock(Document):
    name: Annotated[str, Indexed(unique=True)]
    ticker: Annotated[str, Indexed(unique=True)]
    purchases: List[Purchase]
    sales: List[Sale]
    last_price: float
    value: float


    class Config:
        json_schema_extra = {
            "example": {
                "name": "Apple",
                "ticker": "AAPL",
                "purchases": [{"price": 100.0, "quantity": 10}],
                "sales": [{"price": 100.0, "quantity": 5}],
                "last_price": 100.0,
                "value": 100.0
            }
        }

class UpdateStockPrice(BaseModel):
    last_price: float | None = None

    class Config:
        json_schema_extra = {
            "example": {
                "last_price": 100.0
            }
        }
