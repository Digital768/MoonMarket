from fastapi import APIRouter
from models.stocks import Stock
from config.database import collection_name
from schema.schemas import list_serial
import requests

router = APIRouter()

API_KEY = "qR1MOdNrEiVye4840mWjYFKrdBIf6wDx"
BASE_URL = 'https://financialmodelingprep.com/api/v3'

@router.get("/api/quote/{symbol}")
def get_quote(symbol: str):
    try:
        endpoint = f'/quote/{symbol}?apikey={API_KEY}'
        url = BASE_URL + endpoint
        response = requests.get(url)
        return response.json()
    except Exception as e:
        return {"error": str(e)}
    


# #GET request Method
# @router.get("/stocks")
# async def get_stocks():
#     stocks= list_serial(collection_name.find())
#     return stocks

# #POST request Method
# @router.post("/")
# async def post_stock(stock:Stock):
#     collection_name.insert_one(dict(stock))

# #PUT request Method
# @router.put("/stocks/{id}")
# async def update_stock(id:str, stock:Stock):
#     collection_name.find_one_and_update({"_id":ObjectId(id)},{"$set":dict(stock)})
    
# #DELETE request Method
# @router.delete("/stocks/{id}")
# async def delete_stock(id:str):
#     collection_name.find_one_and_delete({"_id":ObjectId(id)})
    
