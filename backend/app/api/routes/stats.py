# ==========================================
# BESTIARY & STATS ROUTES
# ==========================================

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.security import verify_token
from app.db.supabase import supabase

router = APIRouter()

class BestiaryUpdate(BaseModel):
    monster_id: str
    kills: int = 0
    encounters: int = 0
    wins: int = 0

class StatsUpdate(BaseModel):
    kills: int
    time: int
    is_win: bool
    gold: int
    level: int
    character: str

@router.get("/data")
async def get_stats(user = Depends(verify_token)):
    """Fetch global user stats."""
    try:
        # Using .execute() and index access to avoid .maybe_single() bugs
        res = supabase.table("user_stats").select("*").eq("user_id", user.id).execute()
        
        if res.data and len(res.data) > 0:
            return res.data[0]
        
        # Return default structure if empty
        return {
            "total_runs": 0,
            "total_wins": 0,
            "total_gold_earned": 0,
            "total_time_seconds": 0,
            "highest_level_reached": 0,
            "most_played_character": None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/update")
async def update_user_stats(req: StatsUpdate, user = Depends(verify_token)):
    """Update global stats using the SQL RPC."""
    try:
        supabase.rpc("update_global_stats", {
            "p_user_id": user.id,
            "p_kills": req.kills,
            "p_time": req.time,
            "p_is_win": req.is_win,
            "p_gold": req.gold,
            "p_level": req.level,
            "p_character": req.character
        }).execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stats update failed: {str(e)}")

@router.get("/bestiary")
async def get_bestiary(user = Depends(verify_token)):
    """Fetch all bestiary entries for the user."""
    try:
        res = supabase.table("user_bestiary").select("*").eq("user_id", user.id).execute()
        return res.data if res.data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/bestiary/update")
async def update_bestiary_entry(req: BestiaryUpdate, user = Depends(verify_token)):
    """Update kills/encounters/wins using the SQL RPC."""
    try:
        supabase.rpc("update_bestiary", {
            "p_user_id": user.id,
            "p_monster_id": req.monster_id,
            "p_kills": req.kills,
            "p_encounters": req.encounters,
            "p_wins": req.wins
        }).execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bestiary update failed: {str(e)}")