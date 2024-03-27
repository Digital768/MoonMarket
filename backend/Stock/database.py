from pymongo import MongoClient
from pydantic import BaseSettings


client = MongoClient("mongodb+srv://benarojas11:K3oYp7Q5l90htcqh@cluster0.rekurqc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

db = client.stock_db

collection_name = db["stock_collection"]

class DatabaseSettings(BaseSettings):
    DB_URL:str
    DB_NAME:str
    
class Settings(DatabaseSettings):
    pass

settings = Settings()