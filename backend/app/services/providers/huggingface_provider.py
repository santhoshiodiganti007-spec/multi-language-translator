import logging
import requests
from typing import Optional
from app.config import settings
from app.services.providers.base import BaseTranslationProvider
from app.utils.helpers import NLLB_CODE_MAP

logger = logging.getLogger(__name__)

class HuggingFaceProvider(BaseTranslationProvider):
    """
    AI Multilingual Model Provider (NLLB / Hugging Face).
    Uses the Hugging Face Inference API with graceful fallback.
    """

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.HUGGINGFACE_API_KEY
        self.model = model or settings.HUGGINGFACE_MODEL or "facebook/nllb-200-distilled-600M"
        self.api_url = f"https://api-inference.huggingface.co/models/{self.model}"

    @property
    def name(self) -> str:
        return "huggingface"

    def is_available(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        if not self.is_available():
            raise RuntimeError("Hugging Face API key is not configured. Set HUGGINGFACE_API_KEY in .env.")

        # Map short codes to NLLB codes if applicable
        src_nllb = NLLB_CODE_MAP.get(source_lang, f"{source_lang}_Latn")
        tgt_nllb = NLLB_CODE_MAP.get(target_lang, f"{target_lang}_Latn")

        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload = {
            "inputs": text,
            "parameters": {
                "src_lang": src_nllb,
                "tgt_lang": tgt_nllb
            }
        }

        try:
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=20)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    return data[0].get("translation_text", "")
                elif isinstance(data, dict) and "translation_text" in data:
                    return data["translation_text"]
                return str(data)
            elif response.status_code == 503:
                raise RuntimeError("Hugging Face model is currently loading on server. Please try again in 15 seconds.")
            else:
                raise RuntimeError(f"Hugging Face API error ({response.status_code}): {response.text}")
        except Exception as e:
            logger.error(f"HuggingFace translation failure: {str(e)}")
            raise
