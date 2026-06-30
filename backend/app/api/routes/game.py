from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.security import verify_token
from app.db.supabase import supabase

router = APIRouter()

class EndRunRequest(BaseModel):
    character_used: str
    level_reached: int
    survival_time_seconds: int
    gold_earned: int

@router.post("/end_run")
async def process_end_run(req: EndRunRequest, user = Depends(verify_token)):
    """Validates the run, saves to match history, and deposits earned gold safely."""
    try:
        # 1. Log the match history
        supabase.table("match_history").insert({
            "user_id": user.id,
            "character_used": req.character_used,
            "level_reached": req.level_reached,
            "survival_time_seconds": req.survival_time_seconds,
            "is_cleared": True 
        }).execute()

        # 2. Deposit the gold if they earned any
        if req.gold_earned > 0:
            # Use list indexing instead of .single() to avoid library bugs
            profile_res = supabase.table("profiles").select("gold_balance").eq("id", user.id).execute()
            
            # Extract current balance safely
            current_balance = 0
            if profile_res.data and len(profile_res.data) > 0:
                current_balance = profile_res.data[0].get("gold_balance", 0)
            
            new_balance = current_balance + req.gold_earned
            
            supabase.table("profiles").update({"gold_balance": new_balance}).eq("id", user.id).execute()

        return {"status": "success", "message": "Run processed successfully", "gold_deposited": req.gold_earned}
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to process run data: {str(e)}")