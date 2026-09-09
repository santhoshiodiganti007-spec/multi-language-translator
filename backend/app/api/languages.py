from typing import List
from fastapi import APIRouter
from app.models.translation import LanguageItem
from app.services.translation_service import translation_service

router = APIRouter(prefix="/languages", tags=["Languages"])

@router.get("", response_model=List[LanguageItem])
def get_languages():
    """
    Get all supported languages for source and target translation.
    """
    return translation_service.get_supported_languages()
