from supabase import create_client, Client
from app.core.config import settings

# This will fail fast if keys are missing
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)