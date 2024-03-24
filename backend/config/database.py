from pymongo import MongoClient


client = MongoClient("mongodb+srv://benarojas11:K3oYp7Q5l90htcqh@cluster0.rekurqc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

db = client.stock_db

collection_name = db["stock_collection"]