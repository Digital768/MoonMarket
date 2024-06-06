"""User models."""

from datetime import datetime
from typing import Annotated, Any, Optional, List, Optional
from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId


class Deposit(BaseModel):
    amount: float
    date: datetime

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
    deposits: List[Deposit] = Field(..., min_items=1)  # At least one deposit required
    username: str 
        
class UserUpdate(BaseModel):
    """Updatable user fields."""

    email: EmailStr | None = None
    holdings: List[Holding] = []
    transactions: List[PydanticObjectId] = []  # Use PydanticObjectId for transactions
    deposits: List[Deposit] | None = []
    current_balance: float | None = 0
    last_refresh: datetime | None = None
    username: Optional[str] = None
    password: Optional[str] = None
    
class UserOut(UserUpdate):
    """User fields returned to the client."""

    email: Annotated[str, Indexed(EmailStr, unique=True)]
    disabled: bool = False
    username: str
    deposits: List[Deposit] 
    current_balance: float 
    holdings: List[Holding] = []
    last_refresh: datetime | None = None
    transactions: List[PydanticObjectId] = []  # Use PydanticObjectId for transactions  

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

class PasswordChangeRequest(BaseModel):
    password: str
    new_password: str