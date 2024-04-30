"""User models."""

from datetime import datetime
from typing import Annotated, Any, Optional
from beanie import Document, Indexed
from pydantic import BaseModel, EmailStr
from typing import List

class Purchase(BaseModel):
    ticker: str
    name:str
    price: float
    quantity: float
    purchased_date : datetime

    class Config:
        json_schema_extra = {
            "example": {
                "ticker": "AAPL",
                "name": "Apple",
                "price": 100.0,
                "quantity": 10, 
                "purchased_date":"2024-04-30T08:24:12"
            }
        }

class Sale(BaseModel):
    ticker: str
    name:str
    price: float
    quantity: float
    sale_date: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "ticker": "AAPL",
                "name": "Apple",
                "price": 100.0,
                "quantity": 10,
                "sale_date": "2024-04-30T08:24:12"
            }
        }

class Holding(BaseModel):
    ticker: str
    avg_bought_price: float
    quantity: int
    position_started: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "ticker": "AAPL",
                "avg_bought_price": 150,
                "quantity": 40,
                "position_started": "2024-04-30T08:24:12"
            }
        }
        

class UserAuth(BaseModel):
    """User login auth."""

    email: EmailStr
    password: str

class UserRegister(BaseModel):
    """User register."""

    email: EmailStr
    password: str
    deposit: float | None = 0
        
class UserUpdate(BaseModel):
    """Updatable user fields."""

    email: EmailStr | None = None

    # User information
    first_name: str | None = None
    last_name: str | None = None
    deposit: float | None = 0
    Purchases: List[Purchase] = []
    sales: List[Sale] = []
    holdings: List[Holding] = []


class UserOut(UserUpdate):
    """User fields returned to the client."""

    email: Annotated[str, Indexed(EmailStr, unique=True)]
    disabled: bool = False

class User(Document, UserOut):
    """User DB representation."""

    password: str
    # email_confirmed_at: datetime | None = None

    def __repr__(self) -> str:
        return f"<User {self.email}>"

    def __str__(self) -> str:
        return self.email

    def __hash__(self) -> int:
        return hash(self.email)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, User):
            return self.email == other.email
        return False

    @property
    def created(self) -> datetime | None:
        """Datetime user was created from ID."""
        return self.id.generation_time if self.id else None

    @property
    def jwt_subject(self) -> dict[str, Any]:
        """JWT subject fields."""
        return {"username": self.email}

    @classmethod
    async def by_email(cls, email: str) -> Optional["User"]:
        """Get a user by email."""
        return await cls.find_one(cls.email == email)

    def update_email(self, new_email: str) -> None:
        """Update email logging and replace."""
        # Add any pre-checks here
        self.email = new_email