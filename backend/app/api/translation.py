import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import TranslationHistory
from app.models.translation import (
    TranslationRequest,
    TranslationResponse,
    DetectLanguageRequest,
    DetectLanguageResponse
)
from app.services.translation_service import translation_service
from app.utils.helpers import LANGUAGE_MAP

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Translation"])

@router.post("/detect-language", response_model=DetectLanguageResponse)
def detect_language(payload: DetectLanguageRequest):
    """
    Detect the language of the provided text.
    """
    if not payload.text or not payload.text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Text for language detection cannot be empty."
        )

    code, name = translation_service.detect_language(payload.text)
    return DetectLanguageResponse(
        language_code=code,
        language_name=name,
        confidence=1.0
    )

@router.post("/translate", response_model=TranslationResponse)
def translate_text(payload: TranslationRequest, db: Session = Depends(get_db)):
    """
    Translate text between source and target languages.
    Supports auto language detection and optional database history logging.
    """
    clean_text = payload.text.strip()
    if not clean_text:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Text to translate cannot be empty."
        )

    target_lang = payload.target_language.lower().strip()
    if target_lang not in LANGUAGE_MAP:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Target language '{target_lang}' is not supported."
        )

    source_lang = payload.source_language.lower().strip()
    if source_lang != "auto" and source_lang not in LANGUAGE_MAP:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Source language '{source_lang}' is not supported."
        )

    try:
        result = translation_service.translate_text(
            text=clean_text,
            source_language=source_lang,
            target_language=target_lang
        )

        # Save to database history if enabled
        if payload.save_history:
            try:
                history_record = TranslationHistory(
                    original_text=result["original_text"],
                    translated_text=result["translated_text"],
                    source_language=result["source_language"],
                    target_language=result["target_language"],
                    detected_language=result["detected_language"],
                    provider_used=result.get("provider_used", "google")
                )
                db.add(history_record)
                db.commit()
            except Exception as db_err:
                logger.warning(f"Could not persist translation history: {str(db_err)}")
                db.rollback()

        return TranslationResponse(**result)

    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(ve))
    except Exception as e:
        logger.error(f"Translation processing error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation service error: {str(e)}"
        )
