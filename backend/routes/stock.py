from fastapi import APIRouter, Request, Body, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from models.stock import Stock, UpdateStockPrice
from pymongo.errors import DuplicateKeyError
from util.current_user import current_user
from models.user import User

router = APIRouter(prefix="/stocks", tags=["Stock"])

# GET request Method
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


@router.delete("/{ticker}", response_description="Delete stock")
async def delete_stock(ticker: str, user: User = Depends(current_user)):
    existing_stock = await Stock.find_one(Stock.ticker == ticker)
    if existing_stock is None:
        raise HTTPException(status_code=404, detail=f"Stock with ticker {ticker} does not exist")
    await existing_stock.delete()
    return {"message": "Stock deleted successfully"}