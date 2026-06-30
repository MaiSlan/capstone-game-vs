import uvicorn
import os
from dotenv import load_dotenv

# 1. Force load the .env file BEFORE anything else starts
load_dotenv(dotenv_path=".env", override=True)

if __name__ == "__main__":
    print("[DEBUG] Environment loaded. Launching Uvicorn...")
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)