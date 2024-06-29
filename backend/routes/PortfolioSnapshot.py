
from fastapi import APIRouter, Body, Depends
from models.PortfolioSnapshot import PortfolioSnapshot
from util.current_user import current_user
from models.user import User

from datetime import datetime



router = APIRouter(prefix="/PortfolioSnapshot", tags=["Stock"])

@router.post("/snapshot")
async def create_snapshot(value: float = Body(...), user: User = Depends(current_user)):
    snapshot = PortfolioSnapshot(timestamp=datetime.utcnow(), value=value, user_id=str(user.id))
    await snapshot.insert()
    return {"message": "Snapshot created successfully"}

@router.get("/snapshots")
async def get_snapshots(timeframe: str = "intraday"):
    print(timeframe)
    if timeframe == "intraday":
        # Return all snapshots for the current day
        today = datetime.utcnow().date()
        snapshots = await PortfolioSnapshot.find(
            PortfolioSnapshot.timestamp >= today
        ).to_list()
    elif timeframe == "daily":
        # Return the latest snapshot for each day
        pipeline = [
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}},
                "latest_snapshot": {"$last": "$$ROOT"}
            }},
            {"$replaceRoot": {"newRoot": "$latest_snapshot"}},
            {"$sort": {"timestamp": 1}}
        ]
        snapshots = await PortfolioSnapshot.aggregate(pipeline).to_list()
    else:
        return {"error": "Invalid timeframe"}
    
    return [{"timestamp": s.timestamp, "value": s.value} for s in snapshots]