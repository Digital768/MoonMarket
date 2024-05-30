from fastapi import APIRouter, Depends, HTTPException, Response, Security
from datetime import datetime
from util.current_user import current_user
from models.user import User
from models.stock import Stock
from models.transaction import Transaction
from models.user import Holding

router = APIRouter(prefix="/transaction", tags=["Transaction"])

@router.post("/buy_stock")
async def buy_stock_shares(price: float, ticker: str, quantity: int, user: User = Depends(current_user)):
    # Fetch the stock from the database
    stock = await Stock.find_one(Stock.ticker == ticker)

    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    # Calculate the total cost of the purchase
    total_cost = price * quantity

    # Check if the user has enough deposit to buy the stock
    if user.deposit < total_cost:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    # Deduct the cost of the purchase from the user's deposit
    user.deposit -= total_cost


    # Update the user's holdings
    for holding in user.holdings:
        if holding.ticker == ticker:
            # Update the average bought price and quantity of the holding
            holding.avg_bought_price = ((holding.avg_bought_price * holding.quantity) + (price * quantity)) / (holding.quantity + quantity)
            holding.quantity += quantity
            text=f"Bought {quantity} shares of {ticker}"
            break
    else:
        # If the user does not have a holding of this stock, create a new one
        user.holdings.append(Holding(ticker=ticker, avg_bought_price=price, quantity=quantity, position_started=datetime.now()))
        text=f"Started a position: Bought {quantity} shares of {ticker}"

     # Create a new Transaction for the purchase
    transaction = await Transaction.create_Transaction(
        user_id=str(user.id),  # Assuming user_id is stored as a string
        title="Stock purchase",
        text=text,
        log_type="purchase",
        ticker=ticker,
        name=stock.name,
        price=price,
        quantity=quantity,
        transaction_date=datetime.now()
    )
    # Save the updated user document back to the database
    await user.save()

    return {"message": "Stock purchased successfully"}

@router.post("/sell_stock")
async def sell_stock_shares(ticker: str, quantity: int, price: float, user: User = Depends(current_user)):
    # Fetch the stock from the database
    stock = await Stock.find_one(Stock.ticker == ticker)

    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    # Update the user's holdings
    for index, holding in enumerate(user.holdings):
        if holding.ticker == ticker:
            # Check if the user owns enough shares to sell
            if holding.quantity < quantity:
                raise HTTPException(status_code=400, detail="You can't sell more shares than you own")

            # Update the quantity of the holding
            holding.quantity -= quantity
            text=f"Sold {quantity} shares of {ticker}"

            # If number of shares sold is the number of shares owned, remove the holding
            if holding.quantity == 0:
                user.holdings.pop(index)
                text=f"Closed position: fully sold all remaining ({quantity}) shares of {ticker}"
            break
    else:
        # If the user does not have a holding of this stock
        raise HTTPException(status_code=404, detail="You can't sell a stock you don't own")

    # Calculate the total cost of the purchase
    profit = price * quantity

    # add the profit to the user's deposit
    user.deposit += profit

    # Create a new Transaction for the sale
    sale_transaction = await Transaction.create_Transaction(
        user_id=str(user.id),  # Assuming user_id is stored as a string
        title="Stock sale",
        text=text,
        log_type="sale",
        ticker=ticker,
        name=stock.name,
        price=price,
        quantity=quantity,
        transaction_date=datetime.now()
    )

    # Save the updated user document back to the database
    await user.save()

    return {"message": "Stock sold successfully"}
