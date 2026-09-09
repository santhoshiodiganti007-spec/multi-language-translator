from fastapi import APIRouter
from app.api.languages import router as languages_router
from app.api.translation import router as translation_router
from app.api.history import router as history_router

api_router = APIRouter(prefix="/api")
api_router.include_router(languages_router)
api_router.include_router(translation_router)
api_router.include_router(history_router)

__all__ = ["api_router"]
