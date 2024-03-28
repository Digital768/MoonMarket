from pymongo import MongoClient
from pydantic import BaseSettings


client = MongoClient("mongodb+srv://benarojas11:K3oYp7Q5l90htcqh@cluster0.rekurqc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

db = client.stock_db

collection_name = db["stock_collection"]

class CommonSettings(BaseSettings):
    APP_NAME: str = "MOON MARKET"
    DEBUG_MODE: bool = False

class ServerSettings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
class DatabaseSettings(BaseSettings):
    DB_URL:str
    DB_NAME:str
    
class Settings(CommonSettings,ServerSettings, DatabaseSettings):
    pass

settings = Settings()