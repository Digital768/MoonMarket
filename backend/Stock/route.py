from fastapi import APIRouter, Request, Body, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from Stock.models import Stock, UpdateStock
from Stock.schemas import list_serial
import requests

Stocks_router = APIRouter()

API_KEY = "qR1MOdNrEiVye4840mWjYFKrdBIf6wDx"
BASE_URL = 'https://financialmodelingprep.com/api/v3'

@Stocks_router.get("/api/quote/{symbol}")
def get_quote(symbol: str):
    try:
        endpoint = f'/quote/{symbol}?apikey={API_KEY}'
        url = BASE_URL + endpoint
        response = requests.get(url)
        return response.json()
    except Exception as e:
        return {"error": str(e)}
    
#GET request Method
@Stocks_router.get("/", response_description = "list of all stocks in portfolio")
async def list_stocks(request: Request ):
    stocks =[]
    for doc in await request.app.mongodb_db["stock_collection"].find().to_list(length=100):
         # Convert ObjectId to string before appending to the list
        doc["_id"] = str(doc["_id"])
        stocks.append(doc)
    # stocks= list_serial(collection_name.find())
    return stocks

@Stocks_router.get("/{id}")
async def get_stock(id:str, request: Request ):
    if(stock := await request.app.mongodb_db["stock_collection"].find_one({"_id":id})) is not None:
        stock["_id"] = str(stock["_id"])
        return stock
    
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail = f"Stock with id {id} does not exist")

#POST request Method
@Stocks_router.post("/", response_description = "Add new stock to portfolio")
async def add_stock(request: Request , stock:Stock= Body(...)): 
    stock = jsonable_encoder(stock)
    new_stock = await request.app.mongodb_db["stock_collection"].insert_one(stock)
    created_stock = await request.app.mongodb_db["stock_collection"].find_one({"_id":new_stock.inserted_id})
    # collection_name.insert_one(dict(stock))
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_stock)

@Stocks_router.delete("/", response_description = "Delete stock")
async def delete_stock(id:str, request: Request ):  
    delete_result = await request.app.mongodb_db["stock_collection"].delete_one({"_id":id})
    if delete_result.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=404, detail = f"Stock with id {id} does not exist")