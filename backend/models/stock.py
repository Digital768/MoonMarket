from typing import List, Annotated
from beanie import Document, Indexed
from pydantic import BaseModel, Field


class Stock(Document):
    name: Annotated[str, Indexed(unique=True)]
    ticker: Annotated[str, Indexed(unique=True)]
    description: str
    price: float
    
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Apple",
                "ticker": "AAPL",
                "description": "Apple is a technology company",
                "price": 100.0,
            }
        }

# class UpdateStockPrice(BaseModel):
#     last_price: float | None = None

#     class Config:
#         json_schema_extra = {
#             "example": {
#                 "price": 100.0
#             }
#         }
