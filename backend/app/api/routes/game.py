from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.security import verify_token
from app.db.supabase import supabase

router = APIRouter()

# Define the structure for incoming Bestiary data
class BestiaryEntry(BaseModel):
    monster_id: str
    kills: int = 0
    encounters: int = 0
    wins: int = 0

# Expanded payload to catch all missing data
class EndRunRequest(BaseModel):
    character_used: str
    level_reached: int
    survival_time_seconds: int
    gold_earned: int
    enemies_defeated: int           # <-- Now properly requested
    is_cleared: bool = False        # <-- Used to calculate Win Rate
    bestiary_data: List[BestiaryEntry] = [] # <-- Array of monsters faced

@router.post("/end_run")
async def process_end_run(req: EndRunRequest, user = Depends(verify_token)):
    """Validates the run, saves to match history, updates stats/bestiary, and deposits gold."""
    try:
        # 1. Log the match history (Now includes enemies_defeated and is_cleared)
        supabase.table("match_history").insert({
            "user_id": user.id,
            "character_used": req.character_used,
            "level_reached": req.level_reached,
            "survival_time_seconds": req.survival_time_seconds,
            "enemies_defeated": req.enemies_defeated, 
            "is_cleared": req.is_cleared 
        }).execute()

        # 2. Deposit the gold if they earned any
        if req.gold_earned > 0:
            profile_res = supabase.table("profiles").select("gold_balance").eq("id", user.id).execute()
            current_balance = 0
            if profile_res.data and len(profile_res.data) > 0:
                current_balance = profile_res.data[0].get("gold_balance", 0)
            
            new_balance = current_balance + req.gold_earned
            supabase.table("profiles").update({"gold_balance": new_balance}).eq("id", user.id).execute()

        # 3. Update Global User Stats via RPC
        supabase.rpc("update_global_stats", {
            "p_user_id": user.id,
            "p_kills": req.enemies_defeated,
            "p_time": req.survival_time_seconds,
            "p_is_win": req.is_cleared,
            "p_gold": req.gold_earned,
            "p_level": req.level_reached,
            "p_character": req.character_used
        }).execute()

        # 4. Update Bestiary via RPC
        for entry in req.bestiary_data:
            supabase.rpc("update_bestiary", {
                "p_user_id": user.id,
                "p_monster_id": entry.monster_id,
                "p_kills": entry.kills,
                "p_encounters": entry.encounters,
                "p_wins": entry.wins
            }).execute()

        return {"status": "success", "message": "Run processed completely and inscribed into the archives.", "gold_deposited": req.gold_earned}
    
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to process run data: {str(e)}")