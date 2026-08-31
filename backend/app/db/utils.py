import time
from fastapi import HTTPException
from app.db.supabase import supabase

def execute_with_retry(query_builder, retries=3, delay=0.5):
    """Executes a query and retries if the result is empty (cold-boot protection)."""
    for i in range(retries):
        res = query_builder.execute()
        if res.data:
            return res
        print(f"[DEBUG] Empty result received, retrying {i+1}/{retries}...")
        time.sleep(delay)
    return res