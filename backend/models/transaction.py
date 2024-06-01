from typing import List
from bson import ObjectId
from beanie import Document, Link
from datetime import datetime
from pydantic import BaseModel
from models.user import User

class Transaction(Document):
    user_id: Link[User]  # Reference to the user who performed the activity
    title: str            # Title of the Transaction entry
    text: str             # Additional details or description
    type: str             # Type of activity (e.g., "purchase" or "sale")
    ticker: str           # Ticker symbol of the stock involved in the activity
    name: str             # Name of the stock
    price: float          # Price per share at the time of the activity
    quantity: float       # Quantity of shares involved in the activity
    transaction_date: datetime  # Date of the transaction

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "60c72b2f8fd0b62247f3a9e2",  # Example ObjectId
                "title": "Initial purchase",
                "text": "Bought 10 shares of AAPL",
                "type": "purchase",
                "ticker": "AAPL",
                "name": "Apple",
                "price": 100.0,
                "quantity": 10,
                "transaction_date": "2024-04-30T08:24:12"
            }
        }

    @classmethod
    async def create_Transaction(cls, user_id: str, title: str, text: str, log_type: str, ticker: str, name: str, price: float, quantity: float, transaction_date: datetime) -> "Transaction":
        """Create a new Transaction entry."""
        log = cls(
            user_id=user_id,
            title=title,
            text=text,
            type=log_type,
            ticker=ticker,
            name=name,
            price=price,
            quantity=quantity,
            transaction_date=transaction_date
        )
        await log.insert()
        return log

    @classmethod
    async def get_Transactions_by_user(cls, user_id: str) -> List["Transaction"]:
        """Retrieve all logs for a specific user."""
        user_object_id = ObjectId(user_id)
        transactions = await cls.find(cls.user_id.id == user_object_id).to_list()
        print(f"Found transactions for user {user_id}: {transactions}")
        return transactions


    @classmethod
    async def get_Transactions_by_type_and_user(cls, log_type: str, user_id: str) -> List["Transaction"]:
        """Retrieve all transactions of a specific type for a given user."""
        user_dbref = {"$ref": "User", "$id": ObjectId(user_id)}
        transactions = await cls.find(
            {"$and": [
                {"type": log_type},
                {"user_id": user_dbref}
            ]}
        ).to_list()
        print(f"Found transactions for user {user_id} and type {log_type}: {transactions}")
        return transactions
