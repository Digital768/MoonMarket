"""User router."""

from fastapi import APIRouter, Depends, HTTPException, Response, Security
from fastapi_jwt import JwtAuthorizationCredentials

from models.user import User, UserOut, UserUpdate
from jwt import access_security
from util.current_user import current_user
from models.transaction import Transaction


router = APIRouter(prefix="/user", tags=["User"])


@router.get("", response_model=UserOut, operation_id="retrieve_user")
async def get_user(user: User = Depends(current_user)):  # type: ignore[no-untyped-def]
    """Return the current user."""
    return user

@router.get("/name", operation_id="retrieve_user_name")
async def get_user_name(user: User = Depends(current_user)): 
    """Return the current user first name."""
    return user.first_name

@router.get("/user_transactions", operation_id="retrieve_user_transactions")
async def get_user_transactions(current_user: User = Depends(current_user)):
    # Retrieve transactions for the specified user ID
    transactions = await Transaction.get_Transactions_by_user(current_user.id)
    # Return the list of transactions
    return transactions

@router.get("/user_transactions/{type}", operation_id="retrieve_user_transactions_by_type")
async def get_user_transactions_by_type(type: str, current_user: User = Depends(current_user)):

    # Retrieve transactions for the specified user ID
    transactions = await Transaction.get_Transactions_by_type_and_user(type, current_user.id)
    # Return the list of transactions
    return transactions


@router.patch("/update", response_model=UserOut, operation_id="update_user_details")
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


@router.delete("/delete", operation_id="delete_user_account")
async def delete_user(
    auth: JwtAuthorizationCredentials = Security(access_security)
) -> Response:
    """Delete current user."""
    await User.find_one(User.email == auth.subject["username"]).delete()
    return Response(status_code=204)