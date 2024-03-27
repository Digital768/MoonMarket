from fastapi import FastAPI, Request
from backend.Stock.route import router
from fastapi.middleware.cors import CORSMiddleware
from backend.Stock.database import client  # Import the MongoDB client
from motor.motor_asyncio import AsyncIOMotorClient
from database import settings

origins = [
    "http://localhost:3000"
]

app = FastAPI()
app.include_router(router)
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