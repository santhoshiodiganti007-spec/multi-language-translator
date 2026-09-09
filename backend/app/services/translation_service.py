import logging
from typing import Dict, List, Tuple, Optional
from app.config import settings
from app.services.providers.base import BaseTranslationProvider
from app.services.providers.google_provider import GoogleProvider
from app.services.providers.mymemory_provider import MyMemoryProvider
from app.services.providers.huggingface_provider import HuggingFaceProvider
from app.services.language_detection_service import language_detection_service
from app.utils.helpers import SUPPORTED_LANGUAGES, get_language_name

logger = logging.getLogger(__name__)

class TranslationService:
    """
    Main Translation Service layer orchestrating providers, language detection,
    and automatic failover handling.
    """

    def __init__(self):
        # Register providers singleton instances
        self.providers: Dict[str, BaseTranslationProvider] = {
            "google": GoogleProvider(),
            "mymemory": MyMemoryProvider(),
            "huggingface": HuggingFaceProvider()
        }
        self.default_provider_name = settings.TRANSLATION_PROVIDER

    def get_provider(self, provider_name: Optional[str] = None) -> BaseTranslationProvider:
        name = (provider_name or self.default_provider_name).lower()
        if name in self.providers:
            return self.providers[name]
        logger.warning(f"Requested provider '{name}' not found, defaulting to 'google'")
        return self.providers["google"]

    def detect_language(self, text: str) -> Tuple[str, str]:
        """
        Detects the language of given text.
        Returns (language_code, language_name).
        """
        return language_detection_service.detect_language(text)

    def get_supported_languages(self) -> List[Dict[str, str]]:
        """
        Returns list of all supported languages.
        """
        return SUPPORTED_LANGUAGES

    def translate_text(
        self,
        text: str,
        source_language: str,
        target_language: str,
        preferred_provider: Optional[str] = None
    ) -> Dict[str, str]:
        """
        Translates text with auto-detection and resilient fallback.
        """
        if not text or not text.strip():
            raise ValueError("Translation text cannot be empty.")

        source_clean = source_language.lower().strip()
        target_clean = target_language.lower().strip()

        # Handle Auto Detection
        detected_code = source_clean
        if source_clean in ["auto", "", None]:
            detected_code, _ = self.detect_language(text)

        detected_lang_name = get_language_name(detected_code)

        # If source equals target, return directly without hitting API
        if detected_code == target_clean:
            return {
                "original_text": text,
                "detected_language": detected_lang_name,
                "translated_text": text,
                "source_language": detected_code,
                "target_language": target_clean,
                "provider_used": "direct"
            }

        # Select primary provider
        primary_provider = self.get_provider(preferred_provider)
        provider_used = primary_provider.name
        translated_text = ""

        try:
            logger.info(f"Translating via {provider_used}: '{source_clean}' -> '{target_clean}'")
            translated_text = primary_provider.translate(
                text=text,
                source_lang=detected_code,
                target_lang=target_clean
            )
        except Exception as primary_error:
            logger.warning(f"Primary provider '{provider_used}' failed: {str(primary_error)}. Attempting fallback...")
            
            # If Hugging Face failed, fallback to Google
            if provider_used != "google":
                try:
                    fallback_provider = self.providers["google"]
                    translated_text = fallback_provider.translate(
                        text=text,
                        source_lang=detected_code,
                        target_lang=target_clean
                    )
                    provider_used = "google (fallback)"
                except Exception as fb_err:
                    logger.error(f"Fallback translation also failed: {str(fb_err)}")
                    raise RuntimeError(f"Translation failed: {str(primary_error)} (Fallback error: {str(fb_err)})")
            else:
                # If Google failed, try MyMemory
                try:
                    fallback_provider = self.providers["mymemory"]
                    translated_text = fallback_provider.translate(
                        text=text,
                        source_lang=detected_code,
                        target_lang=target_clean
                    )
                    provider_used = "mymemory (fallback)"
                except Exception as fb_err:
                    raise RuntimeError(f"Translation failed: {str(primary_error)}")

        return {
            "original_text": text,
            "detected_language": detected_lang_name,
            "translated_text": translated_text,
            "source_language": detected_code,
            "target_language": target_clean,
            "provider_used": provider_used
        }

translation_service = TranslationService()
