import logging
from typing import Dict, Any
from app.config import settings

logger = logging.getLogger(__name__)

class ModelService:
    """
    Manages AI Model lifecycle, metadata, and status caching.
    Ensures model weights or API connections are not re-initialized per request.
    """

    def __init__(self):
        self.model_name = settings.HUGGINGFACE_MODEL
        self._is_loaded = False

    def get_model_info(self) -> Dict[str, Any]:
        has_key = bool(settings.HUGGINGFACE_API_KEY)
        return {
            "model_name": self.model_name,
            "provider": settings.TRANSLATION_PROVIDER,
            "ai_mode_available": has_key,
            "description": "NLLB-200 (No Language Left Behind) Multilingual AI Translation Model"
        }

model_service = ModelService()
