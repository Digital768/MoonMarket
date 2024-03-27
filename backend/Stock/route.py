from fastapi import APIRouter, Request, Body, HttpException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from backend.models.models import Stock, UpdateStock
from backend.Stock.database import collection_name
from backend.Stock.schemas import list_serial
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
    


#GET request Method
@router.get("/stocks", response_description = "list of all stocks in portfolio")
async def list_stocks(request: Request ):
    stocks =[]
    for doc in await request.app.mongodb[collection_name].find().to_list(length=100):
        stocks.append(doc)
    # stocks= list_serial(collection_name.find())
    return stocks

@router.get("/stocks/{id}")
async def get_stock(id:str, request: Request ):
    if(task := await request.app.mongodb[collection_name].find_one({"_id":id})) is not None:
        return task
    
    raise HttpException(status_code=status.HTTP_404_NOT_FOUND, detail = f"Stock with id {id} does not exist")

#POST request Method
@router.post("/", response_description = "Add new stock to portfolio")
async def add_stock(request: Request , stock:Stock= Body(...)): 
    stock = jsonable_encoder(stock)
    new_stock = await request.app.mongodb[collection_name].insert_one(stock)
    created_stock = await request.app.mongodb[collection_name].find_one({"_id":new_stock.inserted_id})
    # collection_name.insert_one(dict(stock))
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_stock)

@router.delete("/", response_description = "Delete stock")
async def delete_stock(id:str, request: Request ):  
    delete_result = await request.app.mongodb[collection_name].delete_one({"_id":id})
    if delete_result.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HttpException(status_code=404, detail = f"Stock with id {id} does not exist")