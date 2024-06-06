"""User router."""

from fastapi import APIRouter, Depends, HTTPException, Response, Security
from fastapi_jwt import JwtAuthorizationCredentials

from models.user import User, UserOut, UserUpdate, PasswordChangeRequest, Deposit
from jwt import access_security
from util.current_user import current_user
from models.transaction import Transaction
from util.password import hash_password, verify_password
from bson import DBRef


router = APIRouter(prefix="/user", tags=["User"])


@router.get("", response_model=UserOut, operation_id="retrieve_user")
async def get_user(user: User = Depends(current_user)):  # type: ignore[no-untyped-def]
    """Return the current user."""
    return user

@router.get("/name", operation_id="retrieve_user_name")
async def get_user_name(user: User = Depends(current_user)): 
    """Return the current user first name."""
    return user.username

@router.get("/user_transactions", operation_id="retrieve_user_transactions")
async def get_user_transactions(user: User = Depends(current_user)):
    # Retrieve transactions for the specified user ID
    # transactions = await Transaction.get_Transactions_by_user(current_user.id)
    transactions = await Transaction.find(Transaction.user_id.id == user.id).to_list()
    # Return the list of transactions
    return transactions

@router.get("/user_transactions/{type}",response_model=UserOut, operation_id="retrieve_user_transactions_by_type")
async def get_user_transactions_by_type(type: str, user: User = Depends(current_user)):
    # Retrieve transactions for the specified user ID
    # transactions = await Transaction.get_Transactions_by_type_and_user(type, current_user.id)
    transactions = await Transaction.find(Transaction.user_id.id == user.id, Transaction.type == type).to_list()
    # Return the list of transactions
    return transactions

@router.post("/add_deposit")
async def add_deposit(deposit:Deposit, user:User = Depends(current_user)):
    """Add deposit to user account."""
    user.deposits.append(deposit)
    user.current_balance+=deposit.amount
    await user.save()
    return user


@router.patch("/update", response_model=UserOut, operation_id="update_user_details")
async def update_user(update: UserUpdate, user: User = Depends(current_user)):  # type: ignore[no-untyped-def]
    """Update allowed user fields."""
    fields = update.model_dump(exclude_unset=True)
     # Check and hash the password if it's being updated
    if "password" in fields:
        fields["password"] = hash_password(fields["password"])
    if new_email := fields.pop("email", None):
        if new_email != user.email:
            if await User.by_email(new_email) is not None:
                raise HTTPException(400, "Email already exists")
            user.update_email(new_email)
    user = user.model_copy(update=fields)
    await user.save()
    return user

@router.patch("/change_password",response_model=UserOut, operation_id="change_password")
async def update_password(request: PasswordChangeRequest, user:User = Depends(current_user)):
    """change user password."""
    if not verify_password(request.password, user.password):
        raise HTTPException(400, "Passwords do not match")
    # Hash the new password
    hashed_new_password = hash_password(request.new_password)
    # Update the user's password
    user.password = hashed_new_password
    await user.save()
    return user
        

#todo fix this function
@router.delete("/delete", operation_id="delete_user_account")
async def delete_user(
    auth: JwtAuthorizationCredentials = Security(access_security)
) -> Response:
    """Delete current user."""
    # Find the user
    user = await User.find_one(User.email == auth.subject["username"])
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Find and delete transactions associated with the user
    await Transaction.find({"user_id": user.id}).delete()

    # Delete the user
    await user.delete()
    return Response(status_code=204)