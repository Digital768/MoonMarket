from fastapi import APIRouter, Request, Body, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from models.stock import Stock, UpdateStockPrice, Purchase, Sale
from pymongo.errors import DuplicateKeyError

router = APIRouter(prefix="/stocks", tags=["Stock"])

# GET request Method
@router.get("/", response_description="list of all stocks in portfolio")
async def list_stocks(request: Request):
    stocks = await Stock.find_all().to_list()
    return stocks

@router.get("/{ticker}")
async def get_stock(ticker: str, request: Request):
    symbol = ticker.upper()
    if stock := await Stock.find_one(Stock.ticker == symbol):
        return stock
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Stock with ticker {ticker} does not exist")

# POST request Method
@router.post("/", response_description="Add new stock to portfolio")
async def add_stock(request: Request, stock: Stock = Body(...)):
    stock = jsonable_encoder(stock)
    try:
        new_stock = await Stock(**stock).create()
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="A stock with this name or ticker already exists.")
    return new_stock

@router.put("/update_price/{ticker}", response_description="Update stock")
async def update_stock(ticker: str, request: Request, stock: UpdateStockPrice = Body(...)):
    stock_data = stock.dict(exclude_unset=True)
    if not stock_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    existing_stock = await Stock.find_one(Stock.ticker == ticker)
    if existing_stock is None:
        raise HTTPException(status_code=404, detail=f"Stock with ticker {ticker} does not exist")

    if 'last_price' in stock_data:
        last_price = stock_data['last_price']
        quantity = sum(purchase.quantity for purchase in existing_stock.purchases)
        existing_stock.value = last_price * quantity

    await existing_stock.update({"$set": stock_data})
    return existing_stock

@router.put("/add_shares/{ticker}", response_description="add shares")
async def add_stock_shares(ticker: str, request: Request, purchase: Purchase = Body(...)):
    existing_stock = await Stock.find_one(Stock.ticker == ticker)
    if existing_stock is None:
        raise HTTPException(status_code=404, detail=f"Stock with ticker {ticker} does not exist")
    existing_stock.purchases.append(purchase)
    quantity = sum(purchase.quantity for purchase in existing_stock.purchases)
    existing_stock.value = existing_stock.last_price * quantity
    await existing_stock.save()
    return {"message": "Stock updated successfully", "stock": existing_stock}

@router.put("/sell_shares/{ticker}", response_description="sell shares")
async def sell_stock_shares(ticker: str, request: Request, sale: Sale = Body(...)):
    existing_stock = await Stock.find_one(Stock.ticker == ticker)
    if existing_stock is None:
        raise HTTPException(status_code=404, detail=f"Stock with ticker {ticker} does not exist")

    purchased_shares_quantity = sum(purchase.quantity for purchase in existing_stock.purchases)
    if sale.quantity > purchased_shares_quantity:
        raise HTTPException(status_code=400, detail="Can't sell more shares than you own")

    existing_stock.sales.append(sale)
    quantity = sum(purchase.quantity for purchase in existing_stock.purchases) - sum(sale.quantity for sale in existing_stock.sales)
    if quantity == 0:
        await existing_stock.delete()
        return {"message": "Stock deleted successfully"}
    else:
        existing_stock.value = existing_stock.last_price * quantity
        await existing_stock.save()
    return {"message": "Stock updated successfully", "stock": existing_stock}

@router.delete("/{ticker}", response_description="Delete stock")
async def delete_stock(ticker: str, request: Request):
    existing_stock = await Stock.find_one(Stock.ticker == ticker)
    if existing_stock is None:
        raise HTTPException(status_code=404, detail=f"Stock with ticker {ticker} does not exist")
    await existing_stock.delete()
    return {"message": "Stock deleted successfully"}