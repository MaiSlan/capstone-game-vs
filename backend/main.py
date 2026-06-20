import os
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="VS Cloud Engine Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 1. SECURITY / GATEKEEPER
# ==========================================
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("Warning: Supabase credentials not found in environment.")
    
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def verify_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized: Missing authentication token.")
    token = authorization.split(" ")[1]
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Unauthorized: Invalid token.")
        return user_response.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

# ==========================================
# 2. AUTHENTICATION ROUTES
# ==========================================
class AuthRequest(BaseModel):
    email: str
    password: str

@app.post("/api/v1/auth/register")
async def register_user(req: AuthRequest):
    try:
        res = supabase.auth.sign_up({"email": req.email, "password": req.password})
        return {"status": "success", "message": "Account created. Please verify your email."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/v1/auth/login")
async def login_user(req: AuthRequest):
    try:
        res = supabase.auth.sign_in_with_password({"email": req.email, "password": req.password})
        # Return the JWT token to the frontend
        return {
            "status": "success", 
            "token": res.session.access_token,
            "user_id": res.user.id
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials or email not verified.")

# Example of a protected game route
@app.post("/api/v1/game/validate_run")
async def validate_run(user = Depends(verify_token)):
    return {"status": "success", "message": f"Run validated for operator {user.id}"}


# ==========================================
# 3. ECONOMY & METAPROGRESSION ROUTES
# ==========================================
class EndRunRequest(BaseModel):
    character_used: str
    level_reached: int
    survival_time_seconds: int
    gold_earned: int

class PurchaseRequest(BaseModel):
    upgrade_id: str
    cost: int

@app.get("/api/v1/shop/data")
async def get_shop_data(user = Depends(verify_token)):
    """Fetches the player's current gold balance and their purchased upgrades."""
    try:
        # 1. Get Gold Balance
        profile_res = supabase.table("profiles").select("gold_balance").eq("id", user.id).single().execute()
        gold_balance = profile_res.data.get("gold_balance", 0)

        # 2. Get Upgrades
        upgrades_res = supabase.table("user_upgrades").select("upgrade_id, level").eq("user_id", user.id).execute()
        
        return {
            "status": "success",
            "gold_balance": gold_balance,
            "upgrades": upgrades_res.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/v1/shop/purchase")
async def purchase_shop_upgrade(req: PurchaseRequest, user = Depends(verify_token)):
    """Calls the secure Supabase RPC to deduct gold and apply the upgrade."""
    try:
        # We call the RPC function we created in SQL
        res = supabase.rpc("purchase_upgrade", {
            "p_user_id": user.id,
            "p_upgrade_id": req.upgrade_id,
            "p_cost": req.cost
        }).execute()

        # The RPC returns a boolean: True if successful, False if insufficient funds
        if not res.data:
            raise HTTPException(status_code=400, detail="Insufficient gold balance.")

        return {"status": "success", "message": f"Upgrade {req.upgrade_id} purchased successfully."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transaction failed: {str(e)}")

@app.post("/api/v1/game/end_run")
async def process_end_run(req: EndRunRequest, user = Depends(verify_token)):
    """Validates the run, saves to match history, and deposits earned gold."""
    try:
        # 1. Log the match history
        supabase.table("match_history").insert({
            "user_id": user.id,
            "character_used": req.character_used,
            "level_reached": req.level_reached,
            "survival_time_seconds": req.survival_time_seconds,
            "is_cleared": True # You can add server-side validation checks here later
        }).execute()

        # 2. Deposit the gold if they earned any
        if req.gold_earned > 0:
            # We fetch current gold and add to it (Alternatively, you can make a quick RPC for this too)
            profile = supabase.table("profiles").select("gold_balance").eq("id", user.id).single().execute()
            new_balance = profile.data.get("gold_balance", 0) + req.gold_earned
            
            supabase.table("profiles").update({"gold_balance": new_balance}).eq("id", user.id).execute()

        return {"status": "success", "message": "Run processed successfully", "gold_deposited": req.gold_earned}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process run data: {str(e)}")