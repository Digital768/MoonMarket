from pydantic_settings import BaseSettings

class CommonSettings(BaseSettings):
    APP_NAME: str = "MOON MARKET"
    DEBUG_MODE: bool = False

class ServerSettings(BaseSettings):
    HOST: str = "localhost"
    PORT: int = 8000
    
class DatabaseSettings(BaseSettings):
    DB_URL: str = "mongodb+srv://benarojas11:K3oYp7Q5l90htcqh@cluster0.rekurqc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    DB_NAME: str = "stock_db"
    
class Settings(CommonSettings, ServerSettings, DatabaseSettings):
    pass

# Instantiate Settings
settings = Settings()