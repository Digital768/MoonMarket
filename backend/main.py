from fastapi import FastAPI, Request
import uvicorn
from Stock.route import Stocks_router
from fastapi.middleware.cors import CORSMiddleware
from config import client  # Import the MongoDB client
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

origins = [
    "http://localhost:3000"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"]
    )

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(settings.DB_URL)
    app.mongodb_db = app.mongodb_client[settings.DB_NAME]
    
@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()
    
app.include_router(Stocks_router, prefix="/stocks")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        reload=settings.DEBUG_MODE,
        port=settings.PORT,
    )