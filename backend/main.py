from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router

app = FastAPI(title="VS Cloud Engine Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://capstone-game-vs.vercel.app", 
        "https://capstone-game-7asw2nbg5-maislans-projects.vercel.app", # Your specific preview branch
        "http://localhost:5173", 
        "http://127.0.0.1:5173", # Add 127.0.0.1 explicitly
        "http://localhost:5000", 
        "https://capstone-game-vs.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "Tartarus Engine is Online"}