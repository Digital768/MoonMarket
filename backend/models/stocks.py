from pydantic import BaseModel

class Stock(BaseModel):
    name:str
    bought_price:float
    last_price:float
    quantity:float
    value:float