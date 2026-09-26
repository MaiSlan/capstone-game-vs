from supabase import create_client, Client
from app.core.config import settings

# Admin client: used for privileged table reads/writes with the service-role key.
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

# Dedicated auth client: kept separate from `supabase` above so that sign-in/sign-up
# calls (which internally track a "current session" on the client instance) never
# touch the admin client's state. Built once at import time instead of per-request:
# each request used to call create_client() from scratch, paying for a fresh
# object + a fresh HTTP connection pool (no keep-alive to Supabase) on every single
# login/register call. Reusing one instance lets httpx reuse its connection pool,
# which is a real, if modest, latency win. This is safe to share across concurrent
# requests because auth.py only ever reads the data returned directly in each call's
# response object (res.session, res.user) rather than reading back session state
# off this shared client afterwards. If a future route calls things like
# auth_client.auth.get_session()/get_user() relying on client-side session state,
# stop sharing this instance and go back to a per-request client for that route.
auth_client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)