from fastapi import FastAPI

app = FastAPI(title="VS Cloud Game Engine API")

@app.get("/")
def read_root():
    return {"status": "Engine Backend Online", "version": "0.1.0"}