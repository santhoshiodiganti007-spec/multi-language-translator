import html
import logging
import re
import urllib.parse
import requests
from typing import Optional
from deep_translator import GoogleTranslator
from app.services.providers.base import BaseTranslationProvider

logger = logging.getLogger(__name__)

class GoogleProvider(BaseTranslationProvider):
    """
    Resilient Google Translation provider.
    Tries deep-translator GoogleTranslator first; if blocked or rate-limited,
    falls back to Google mobile web endpoint, ensuring reliable translations.
    """

    @property
    def name(self) -> str:
        return "google"

    def is_available(self) -> bool:
        return True

    def _translate_via_web(self, text: str, source_lang: str, target_lang: str) -> str:
        """Fallback to Google mobile web interface with custom headers."""
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-US,en;q=0.9",
        }
        params = {
            "sl": source_lang,
            "tl": target_lang,
            "q": text
        }
        url = "https://translate.google.com/m?" + urllib.parse.urlencode(params)
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code == 200:
            match = re.search(r'<div class="result-container">(.*?)</div>', resp.text, re.DOTALL)
            if match:
                translated = html.unescape(match.group(1).strip())
                if translated:
                    return translated
        raise RuntimeError(f"Google web translate returned status {resp.status_code}")

    def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        if not text or not text.strip():
            return ""

        src = "auto" if source_lang in ["auto", "", None] else source_lang.lower().strip()
        tgt = target_lang.lower().strip()

        # Strategy 1: deep-translator GoogleTranslator
        try:
            translator = GoogleTranslator(source=src, target=tgt)
            result = translator.translate(text)
            if result and not result.startswith("Error 500") and not result.startswith("Error 429"):
                return result
        except Exception as e:
            logger.warning(f"deep-translator GoogleTranslator failed ({src}->{tgt}): {str(e)}")

        # Strategy 2: Google web mobile endpoint
        try:
            return self._translate_via_web(text, src, tgt)
        except Exception as e2:
            logger.warning(f"Google web translation failed ({src}->{tgt}): {str(e2)}")

        raise RuntimeError(f"Google Translation failed for {src}->{tgt}")
