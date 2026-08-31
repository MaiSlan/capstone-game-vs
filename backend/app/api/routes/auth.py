# ==========================================
#  AUTHENTICATION ROUTES
# ==========================================

from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel
from app.core.security import verify_token
from app.db.supabase import supabase
from supabase import create_client
from app.core.config import settings

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    username: str

class UpdateUsernameRequest(BaseModel):
    new_username: str

@router.post("/register")
async def register_user(req: RegisterRequest):
    try:
        # Spin up a temporary client so we don't mutate the global admin client
        auth_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        
        # Create the user in Supabase Auth
        res = auth_client.auth.sign_up({"email": req.email, "password": req.password})
        
        # If auth creation is successful, extract ID and create the profile
        if res.user:
            profile_data = {
                "id": res.user.id,
                "email": req.email,
                "display_name": req.username,
                "evr_balance": 0,
                "gold_balance": 0
            }
            # Use the global admin client to insert the profile
            supabase.table("profiles").insert(profile_data).execute()

        return {"status": "success", "message": "Account created. Please verify your email."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login_user(req: LoginRequest):
    try:
        # Spin up a temporary client so we don't mutate the global admin client
        auth_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        res = auth_client.auth.sign_in_with_password({"email": req.email, "password": req.password})
        return {
            "status": "success", 
            "token": res.session.access_token,
            "user_id": res.user.id
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials or email not verified.")
    
@router.put("/update_username")
async def update_username(req: UpdateUsernameRequest, user = Depends(verify_token)):
    try:
        # 1. Consult the archives to check the cooldown
        profile_res = supabase.table("profiles").select("last_name_change").eq("id", user.id).execute()
        
        if profile_res.data and len(profile_res.data) > 0:
            last_change_str = profile_res.data[0].get("last_name_change")
            
            if last_change_str:
                last_change = datetime.fromisoformat(last_change_str.replace("Z", "+00:00"))
                # Enforce the 30-day lock
                if datetime.now(timezone.utc) < last_change + timedelta(days=30):
                    raise Exception("Moniker is sealed. You must wait 30 days between changes.")

        # 2. Inscribe the new name and set the new cooldown timestamp
        current_time = datetime.now(timezone.utc).isoformat()
        
        response = supabase.table("profiles") \
            .update({
                "display_name": req.new_username,
                "last_name_change": current_time
            }) \
            .eq("id", user.id) \
            .execute()
            
        if not response.data:
            raise Exception("Profile not found in the archives.")
            
        return {"status": "success", "message": "True Name inscribed successfully."}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))