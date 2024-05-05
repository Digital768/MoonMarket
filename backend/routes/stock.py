from fastapi import APIRouter, Request, Body, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from models.stock import Stock, UpdateStockPrice
from pymongo.errors import DuplicateKeyError
from util.current_user import current_user
from models.user import User
from decouple import config
import requests

router = APIRouter(prefix="/stocks", tags=["Stock"])
BASE_URL = 'https://financialmodelingprep.com/api/v3'

# request from FMP API
@router.get("/quote/{symbol}", response_description="stock details from api")
def get_quote(symbol: str):
    try:
        # Try first API key for quote request
        api_key = config("FMP_FIRST_API_KEY")
        endpoint = f'/quote/{symbol}?apikey={api_key}'
        url = BASE_URL + endpoint
        response = requests.get(url)
        data1 = response.json()[0]

        # Try first API key for company info request
        companyInfoUrl = f'https://financialmodelingprep.com/api/v3/profile/{symbol}?apikey={api_key}'
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
            api_key = config("FMP_SECOND_API_KEY")
            endpoint = f'/quote/{symbol}?apikey={api_key}'
            url = BASE_URL + endpoint
            response = requests.get(url)
            data1 = response.json()[0]

            # Try second API key for company info request
            companyInfoUrl = f'https://financialmodelingprep.com/api/v3/profile/{symbol}?apikey={api_key}'
            companyInfoRes = requests.get(companyInfoUrl)
            data2 = companyInfoRes.json()[0]

            # Combine the two JSON objects
            combined_data = {**data1, **data2}
            print("Using second API key.")
            return combined_data

        except Exception as e:
            return {"error": str(e)}
        
# Requests from Stock collection
@router.get("/", response_description="list of all stocks in portfolio")
async def list_stocks( user: User = Depends(current_user)):
    stocks = await Stock.find_all().to_list()
    return stocks


@router.get("/{ticker}")
async def get_stock(ticker: str,  user: User = Depends(current_user)):
    symbol = ticker.upper()
    if stock := await Stock.find_one(Stock.ticker == symbol):
        return stock
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Stock with ticker {ticker} does not exist")

@router.post("/add_stock")
async def add_stock(stock_data: Stock):
    # Check if the stock already exists in the database
    stock = await Stock.find_one(Stock.ticker == stock_data.ticker)

    # If the stock doesn't exist, create a new one
    if not stock:
        stock = stock_data
        await stock.save()

    return {"message": "Stock added successfully"}


@router.delete("/delete/{ticker}", response_description="Delete stock")
async def delete_stock(ticker: str, user: User = Depends(current_user)):
    existing_stock = await Stock.find_one(Stock.ticker == ticker)
    if existing_stock is None:
        raise HTTPException(status_code=404, detail=f"Stock with ticker {ticker} does not exist")
    await existing_stock.delete()
    return {"message": "Stock deleted successfully"}