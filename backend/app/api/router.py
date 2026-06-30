from fastapi import APIRouter
from app.api.routes import auth, shop, game, stats

api_router = APIRouter()

# Include all your specialized route groups here
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(shop.router, prefix="/shop", tags=["shop"])
api_router.include_router(game.router, prefix="/game", tags=["game"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])