# ==========================================
#  AUTHENTICATION ROUTES
# ==========================================

from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel
from app.core.security import verify_token
from app.db.supabase import supabase, auth_client

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
        # Create the user in Supabase Auth. The profile row (and starter characters)
        # are created by the on_auth_user_created DB trigger, which reads the
        # username from this metadata (supabase/migrations/0007). Don't insert the
        # profile here too: it would collide with the trigger's row.
        auth_client.auth.sign_up({
            "email": req.email,
            "password": req.password,
            "options": {"data": {"username": req.username}}
        })

        return {"status": "success", "message": "Account created. Please verify your email."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login_user(req: LoginRequest):
    try:
        res = auth_client.auth.sign_in_with_password({"email": req.email, "password": req.password})
        return {
            "status": "success", 
            "token": res.session.access_token,
            "user_id": res.user.id
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials or email not verified.")
    
@router.get("/me")
async def get_current_user(user = Depends(verify_token)):
    """Who the token belongs to, including the is_admin flag that gates Dev Mode."""
    try:
        res = supabase.table("profiles").select("display_name, is_admin").eq("id", user.id).execute()
        profile = res.data[0] if res.data else {}
        return {
            "user_id": user.id,
            "display_name": profile.get("display_name"),
            "is_admin": profile.get("is_admin") is True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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