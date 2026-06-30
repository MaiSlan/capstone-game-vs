import time
from fastapi import HTTPException
from app.db.supabase import supabase

def execute_with_retry(query_builder, retries=3, delay=0.5):
    """Executes a query and retries if the result is empty (cold-boot protection)."""
    for i in range(retries):
        res = query_builder.execute()
        # If we get data, return it immediately
        if res.data:
            return res
        # If we get [] on the first try, wait and retry
        print(f"[DEBUG] Empty result received, retrying {i+1}/{retries}...")
        time.sleep(delay)
    return res # Return the final result even if it's empty