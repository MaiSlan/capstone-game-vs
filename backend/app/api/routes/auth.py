# ==========================================
#  AUTHENTICATION ROUTES
# ==========================================

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.security import verify_token
from app.db.supabase import supabase
from supabase import create_client
from app.core.config import settings

router = APIRouter()

class AuthRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register_user(req: AuthRequest):
    try:
        # Spin up a temporary client so we don't mutate the global admin client
        auth_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        auth_client.auth.sign_up({"email": req.email, "password": req.password})
        return {"status": "success", "message": "Account created. Please verify your email."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login_user(req: AuthRequest):
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

@router.post("/validate_run")
async def validate_run(user = Depends(verify_token)):
    return {"status": "success", "message": f"Run validated for operator {user.id}"}