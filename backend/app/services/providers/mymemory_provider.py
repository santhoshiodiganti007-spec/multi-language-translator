import logging
import requests
from app.services.providers.base import BaseTranslationProvider

logger = logging.getLogger(__name__)

class MyMemoryProvider(BaseTranslationProvider):
    """
    MyMemory Translation provider using official free REST API.
    Reliable fallback supporting pairs like en|te, en|hi, etc.
    """

    @property
    def name(self) -> str:
        return "mymemory"

    def is_available(self) -> bool:
        return True

    def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        if not text or not text.strip():
            return ""

        src = "en" if source_lang in ["auto", "", None] else source_lang.lower().strip()
        tgt = target_lang.lower().strip()

        try:
            url = "https://api.mymemory.translated.net/get"
            params = {
                "q": text,
                "langpair": f"{src}|{tgt}"
            }
            resp = requests.get(url, params=params, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                if "responseData" in data and "translatedText" in data["responseData"]:
                    result = data["responseData"]["translatedText"]
                    if result and not result.startswith("MYMEMORY WARNING"):
                        return result
            raise RuntimeError(f"MyMemory returned invalid response or error: {resp.text}")
        except Exception as e:
            logger.error(f"MyMemory translation error ({src}->{tgt}): {str(e)}")
            raise RuntimeError(f"MyMemory error: {str(e)}")
