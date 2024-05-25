"""User router."""

from fastapi import APIRouter, Depends, HTTPException, Response, Security
from fastapi_jwt import JwtAuthorizationCredentials

from models.user import User, UserOut, UserUpdate,Holding, Purchase, Sale
from models.stock import Stock
from jwt import access_security
from util.current_user import current_user
from datetime import datetime

router = APIRouter(prefix="/user", tags=["User"])


@router.get("", response_model=UserOut)
async def get_user(user: User = Depends(current_user)):  # type: ignore[no-untyped-def]
    """Return the current user."""
    return user

@router.get("/name")
async def get_user_name(user: User = Depends(current_user)): 
    """Return the current user first name."""
    return user.first_name


@router.patch("/update", response_model=UserOut)
async def update_user(update: UserUpdate, user: User = Depends(current_user)):  # type: ignore[no-untyped-def]
    """Update allowed user fields."""
    fields = update.model_dump(exclude_unset=True)
    if new_email := fields.pop("email", None):
        if new_email != user.email:
            if await User.by_email(new_email) is not None:
                raise HTTPException(400, "Email already exists")
            user.update_email(new_email)
    user = user.model_copy(update=fields)
    await user.save()
    return user

@router.post("/buy_stock")
async def buy_stock_shares(price:float, ticker: str, quantity: int, user: User = Depends(current_user)):
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

    # Create a new Purchase and add it to the user's purchases
    purchase = Purchase(ticker=ticker, name=stock.name, price=price, quantity=quantity, purchased_date = datetime.now() )
    if user.Purchases is None:
        user.Purchases = [purchase]
    else:
        user.Purchases.append(purchase)

    # Update the user's holdings
    for holding in user.holdings:
        if holding.ticker == ticker:
            # Update the average bought price and quantity of the holding
            holding.avg_bought_price = ((holding.avg_bought_price * holding.quantity) + (price * quantity)) / (holding.quantity + quantity)
            holding.quantity += quantity
            break
    else:
        # If the user does not have a holding of this stock, create a new one
        user.holdings.append(Holding(ticker=ticker, avg_bought_price=price, quantity=quantity, position_started = datetime.now()))

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

            # If number of shares sold is the number of shares owned, remove the holding
            if holding.quantity == 0:
                user.holdings.pop(index)
            break
    else:
        # If the user does not have a holding of this stock
        raise HTTPException(status_code=404, detail="You can't sell a stock you don't own")

    # Calculate the total cost of the purchase
    profit = price * quantity

    # add the profit to the user's deposit
    user.deposit += profit

    # Create a new Sale and add it to the user's sales
    sale = Sale(ticker=ticker, name=stock.name, price=price, quantity=quantity, sale_date = datetime.now())
    if user.sales is None:
        user.sales = [sale]
    else:
        user.sales.append(sale)

    # Save the updated user document back to the database
    await user.save()

    return {"message": "Stock sold successfully"}


@router.delete("/delete")
async def delete_user(
    auth: JwtAuthorizationCredentials = Security(access_security)
) -> Response:
    """Delete current user."""
    await User.find_one(User.email == auth.subject["username"]).delete()
    return Response(status_code=204)