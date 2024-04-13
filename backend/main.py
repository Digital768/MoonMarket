from fastapi import FastAPI, Request
import uvicorn
from Stock.route import Stocks_router
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
from contextlib import asynccontextmanager

origins = [
    "http://localhost:3000"
]
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.mongodb_client = AsyncIOMotorClient(settings.DB_URL)
    app.mongodb_db = app.mongodb_client[settings.DB_NAME]
     # Get the collection
    collection = app.mongodb_db['stock_collection']  # replace with your actual collection name

    # Create unique indexes
    await collection.create_index('name', unique=True)
    await collection.create_index('ticker', unique=True)
    yield
    app.mongodb_client.close()
    
app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(Stocks_router, prefix="/stocks")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        reload=settings.DEBUG_MODE,
        port=settings.PORT,
    )
