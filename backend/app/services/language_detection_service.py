import logging
from typing import Tuple
from langdetect import detect, DetectorFactory
from deep_translator import single_detection
from app.utils.helpers import detect_script_heuristic, get_language_name

# Ensure consistent langdetect results
DetectorFactory.seed = 0

logger = logging.getLogger(__name__)

class LanguageDetectionService:
    """
    Advanced Language Detection Service.
    Combines Unicode script analysis, langdetect statistical model,
    and Google single detection fallback.
    """

    @staticmethod
    def detect_language(text: str) -> Tuple[str, str]:
        """
        Detects language of input text.
        Returns: (language_code, language_name)
        """
        if not text or not text.strip():
            return "en", "English"

        clean_text = text.strip()

        # Step 1: Check instant Unicode script heuristic
        heuristic_code = detect_script_heuristic(clean_text)
        if heuristic_code:
            return heuristic_code, get_language_name(heuristic_code)

        # Step 2: Use langdetect library
        try:
            detected_code = detect(clean_text)
            if detected_code:
                # Handle special mapping if needed (zh-cn -> zh)
                if detected_code.startswith("zh"):
                    detected_code = "zh"
                return detected_code, get_language_name(detected_code)
        except Exception as e:
            logger.warning(f"langdetect failed: {str(e)}, falling back to provider detection")

        # Step 3: Use deep_translator single_detection
        try:
            detected_code = single_detection(clean_text, api_key=None)
            if detected_code:
                return detected_code, get_language_name(detected_code)
        except Exception as e:
            logger.error(f"single_detection failed: {str(e)}")

        # Default fallback
        return "en", "English"

language_detection_service = LanguageDetectionService()
