from beanie import Document

class Log(Document):
    title: str
    text: str 
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "example",
                "text": "example"
            }
        }