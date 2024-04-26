from fastapi import APIRouter, Request, Body, HTTPException, status, Response
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from Stock.models import Stock, UpdateStockPrice, Purchase, Sale
from Stock.schemas import list_serial
import requests
from pymongo.errors import DuplicateKeyError
import json

Stocks_router = APIRouter()

API_KEY = "qR1MOdNrEiVye4840mWjYFKrdBIf6wDx"
SECOND_API_KEY ="FSCUqF7FY7DBmuG9cL06Z6w9K52DtfYn"
BASE_URL = 'https://financialmodelingprep.com/api/v3'
# TODO need to get Company information and create a new json made of both responses that i get and return that json object

@Stocks_router.get("/api/quote/{symbol}")
def get_quote(symbol: str):
    try:
        # Try first API key for quote request
        endpoint = f'/quote/{symbol}?apikey={API_KEY}'
        url = BASE_URL + endpoint
        response = requests.get(url)
        data1 = response.json()[0]

        # Try first API key for company info request
        companyInfoUrl = f'https://financialmodelingprep.com/api/v3/profile/{symbol}?apikey={API_KEY}'
        companyInfoRes = requests.get(companyInfoUrl)
        data2 = companyInfoRes.json()[0]

        # Combine the two JSON objects
        combined_data = {**data1, **data2}
        print("Using first API key.")
        return combined_data

    except Exception as e:
        # If the first API key fails, try the second API key
        try:
            print("First API key failed, trying second API key.")
            # Try second API key for quote request
            endpoint = f'/quote/{symbol}?apikey={SECOND_API_KEY}'
            url = BASE_URL + endpoint
            response = requests.get(url)
            data1 = response.json()[0]

            # Try second API key for company info request
            companyInfoUrl = f'https://financialmodelingprep.com/api/v3/profile/{symbol}?apikey={SECOND_API_KEY}'
            companyInfoRes = requests.get(companyInfoUrl)
            data2 = companyInfoRes.json()[0]

            # Combine the two JSON objects
            combined_data = {**data1, **data2}
            print("Using second API key.")
            return combined_data

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

@Stocks_router.get("/{ticker}")
async def get_stock(ticker:str, request: Request ):
    symbol = ticker.upper()
    if(stock := await request.app.mongodb_db["stock_collection"].find_one({"ticker":symbol})) is not None:
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

@Stocks_router.put("/sell_shares/{id}", response_description = "sell shares")
async def sell_stock_shares(id:str, request: Request, sale: Sale = Body(...)):
    # Retrieve the existing stock document
    existing_stock = await request.app.mongodb_db["stock_collection"].find_one({"_id":id})
    if existing_stock is None:
        raise HTTPException(status_code=404, detail = f"Stock with id {id} does not found")
    # need to add validations
    # TODO: make sure that quantity of shares sold isnt greater than quantity of overall shares
    purchased_shares_quantity = sum(purchase['quantity'] for purchase in existing_stock['purchases'])
    if sale.quantity > purchased_shares_quantity:
        raise HTTPException(status_code=404, detail = "Can't sell more shares then what you own")
    # TODO: make sure that the price of a share is smaller than the last_price
    # if sale.price > existing_stock['last_price']:
    #     raise HTTPException(status_code=404, detail = "Can't buy for a higher price then auction price")
    existing_stock['sales'].append(sale.dict())  # Append the sale
    try:
        quantity = sum(purchase['quantity'] for purchase in existing_stock['purchases']) - sum(sale['quantity'] for sale in existing_stock['sales'])
        if (quantity == 0):
            # meaning no more shares left, need to delete the existing stock from the database
            await delete_stock(id,request)
        else:
            existing_stock['value'] = existing_stock['last_price'] * quantity 
            await request.app.mongodb_db["stock_collection"].update_one({"_id": id,}, {"$set": existing_stock})  # Update the stock document
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
    return {"message": "Stock updated successfully", "stock": existing_stock}
    
        
@Stocks_router.delete("/{id}", response_description = "Delete stock")
async def delete_stock(id:str, request: Request ):  
    delete_result = await request.app.mongodb_db["stock_collection"].delete_one({"_id":id})
    if delete_result.deleted_count == 1:
        return {"message": "Stock deleted successfully"}
    raise HTTPException(status_code=404, detail = f"Stock with id {id} does not exist")
