# ==========================================
# ECONOMY & METAPROGRESSION ROUTES
# ==========================================

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.security import verify_token
from app.db.supabase import supabase
from app.db.utils import execute_with_retry

router = APIRouter()

class PurchaseRequest(BaseModel):
    upgrade_id: str
    cost: int

class UnlockRequest(BaseModel):
    character_id: str
    cost: int

@router.get("/data")
async def get_shop_data(user = Depends(verify_token)):
    try:
        query = supabase.table("profiles").select("*").eq("id", user.id)
        profile_res = execute_with_retry(query)
        
        # RESTORED: Raw Payload Logs
        print(f"\n[RAW PROFILES PAYLOAD]: {profile_res.data}\n")

        gold_balance = 0
        if profile_res.data and len(profile_res.data) > 0:
            gold_balance = profile_res.data[0].get("gold_balance") 
            if gold_balance is None:
                gold_balance = profile_res.data[0].get("evr_balance", 0)

        upgrades_query = supabase.table("user_upgrades").select("*").eq("user_id", user.id)
        upgrades_res = execute_with_retry(upgrades_query)
        
        # RESTORED: Raw Payload Logs
        print(f"\n[RAW UPGRADES PAYLOAD]: {upgrades_res.data}\n")
        
        upgrades = upgrades_res.data if upgrades_res.data else []
        
        return {"status": "success", "gold_balance": gold_balance, "upgrades": upgrades}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/purchase")
async def purchase_shop_upgrade(req: PurchaseRequest, user = Depends(verify_token)):
    try:
        res = supabase.rpc("purchase_upgrade", {
            "p_user_id": user.id,
            "p_upgrade_id": req.upgrade_id,
            "p_cost": req.cost
        }).execute()

        if not res.data:
            raise HTTPException(status_code=400, detail="Insufficient gold balance.")
        return {"status": "success", "message": f"Upgrade {req.upgrade_id} purchased."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/roster")
async def get_player_roster(user = Depends(verify_token)):
    try:
        profile_res = execute_with_retry(supabase.table("profiles").select("*").eq("id", user.id))
        gold = 0
        if profile_res.data and len(profile_res.data) > 0:
            gold = profile_res.data[0].get("gold_balance", 0)
        
        roster_res = execute_with_retry(supabase.table("user_characters").select("*").eq("user_id", user.id))
        
        print(f"\n[RAW ROSTER PAYLOAD]: {roster_res.data}\n")

        unlocked = [row["character_id"] for row in roster_res.data] if roster_res.data else []
        
        if "witch" not in unlocked: unlocked.append("witch")
        if "viking" not in unlocked: unlocked.append("viking")

        return {"status": "success", "gold_balance": gold, "unlocked": unlocked}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/unlock")
async def unlock_character(req: UnlockRequest, user = Depends(verify_token)):
    try:
        profile_res = supabase.table("profiles").select("gold_balance").eq("id", user.id).execute()
        current_gold = profile_res.data[0].get("gold_balance", 0) if profile_res.data else 0
        
        if current_gold < req.cost:
            raise HTTPException(status_code=400, detail="Insufficient gold.")

        supabase.table("profiles").update({"gold_balance": current_gold - req.cost}).eq("id", user.id).execute()
        supabase.table("user_characters").insert({"user_id": user.id, "character_id": req.character_id}).execute()

        return {"status": "success", "message": f"{req.character_id} unlocked!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))