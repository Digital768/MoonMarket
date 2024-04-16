from fastapi import APIRouter, Request, Body, HTTPException, status, Response
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from Stock.models import Stock, UpdateStockPrice, Purchase
from Stock.schemas import list_serial
import requests
from pymongo.errors import DuplicateKeyError

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
    try:
        new_stock = await request.app.mongodb_db["stock_collection"].insert_one(stock)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="A stock with this name or ticker already exists.")
    
    created_stock = await request.app.mongodb_db["stock_collection"].find_one({"_id":new_stock.inserted_id})
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_stock)

        
# @Stocks_router.put("/{id}", response_description = "Update stock")
# async def update_stock(id:str, request: Request , stock:UpdateStock= Body(...)):
#     stock = {k: v for k, v in stock.dict().items() if v is not None}
    
#     # Retrieve the existing stock document
#     existing_stock = await request.app.mongodb_db["stock_collection"].find_one({"_id":id})
#     if existing_stock is None:
#         raise HTTPException(status_code=404, detail = f"Stock with id {id} does not found")
    
#     # If 'last_price' or 'quantity' is being updated, update 'value' as well
#     if 'last_price' in stock or 'quantity' in stock:
#         last_price = stock['last_price'] if 'last_price' in stock else existing_stock['last_price']
#         quantity = stock['quantity'] if 'quantity' in stock else existing_stock['quantity']
#         stock['value'] = last_price * quantity
    
#     if(len(stock)>=1):
#         update_result = await request.app.mongodb_db["stock_collection"].update_one({"_id": id,}, {"$set": stock})
        
#         if update_result.modified_count == 1:
#             if(updated_stock := await request.app.mongodb_db["stock_collection"].find_one({"_id":id})) is not None:
#                 return updated_stock
            
#     return existing_stock

@Stocks_router.put("/update_price/{id}", response_description = "Update stock")
async def update_stock(id:str, request: Request , stock:UpdateStockPrice= Body(...)):
    stock = {k: v for k, v in stock.dict().items() if v is not None}
    
    # Retrieve the existing stock document
    existing_stock = await request.app.mongodb_db["stock_collection"].find_one({"_id":id})
    if existing_stock is None:
        raise HTTPException(status_code=404, detail = f"Stock with id {id} does not found")
    
    # If 'last_price' is being updated, update 'value' as well
    if 'last_price' in stock:
        last_price = stock['last_price']
        quantity = sum(purchase['quantity'] for purchase in existing_stock['purchases'])
        stock['value'] = last_price * quantity
    
    if(len(stock)>=1):
        update_result = await request.app.mongodb_db["stock_collection"].update_one({"_id": id,}, {"$set": stock})
        
        if update_result.modified_count == 1:
            if(updated_stock := await request.app.mongodb_db["stock_collection"].find_one({"_id":id})) is not None:
                return updated_stock
            
    return existing_stock

@Stocks_router.put("/add_shares/{id}", response_description = "add shares")
async def add_stock_shares(id:str, request: Request, purchase: Purchase = Body(...)):
    # Retrieve the existing stock document
    existing_stock = await request.app.mongodb_db["stock_collection"].find_one({"_id":id})
    if existing_stock is None:
        raise HTTPException(status_code=404, detail = f"Stock with id {id} does not found")
    existing_stock['purchases'].append(purchase.dict())  # Append the purchase
    try:
        quantity = sum(purchase['quantity'] for purchase in existing_stock['purchases'])
        existing_stock['value'] = existing_stock['last_price'] * quantity 
        await request.app.mongodb_db["stock_collection"].update_one({"_id": id,}, {"$set": existing_stock})  # Update the stock document
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while updating the stock.") from e
    return {"message": "Stock updated successfully", "stock": existing_stock}
        
@Stocks_router.delete("/{id}", response_description = "Delete stock")
async def delete_stock(id:str, request: Request ):  
    delete_result = await request.app.mongodb_db["stock_collection"].delete_one({"_id":id})
    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    
    raise HTTPException(status_code=404, detail = f"Stock with id {id} does not exist")
