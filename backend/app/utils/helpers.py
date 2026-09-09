import re
from typing import Dict, List, Optional

# Supported Languages with ISO codes, English names, Native script names, and Region
SUPPORTED_LANGUAGES: List[Dict[str, str]] = [
    {"code": "en", "name": "English", "native_name": "English", "category": "Global"},
    {"code": "te", "name": "Telugu", "native_name": "తెలుగు", "category": "Indian"},
    {"code": "hi", "name": "Hindi", "native_name": "हिन्दी", "category": "Indian"},
    {"code": "ta", "name": "Tamil", "native_name": "தமிழ்", "category": "Indian"},
    {"code": "kn", "name": "Kannada", "native_name": "ಕನ್ನಡ", "category": "Indian"},
    {"code": "ml", "name": "Malayalam", "native_name": "മലയാളം", "category": "Indian"},
    {"code": "bn", "name": "Bengali", "native_name": "বাংলা", "category": "Indian"},
    {"code": "pa", "name": "Punjabi", "native_name": "ਪੰਜਾਬੀ", "category": "Indian"},
    {"code": "mr", "name": "Marathi", "native_name": "मराठी", "category": "Indian"},
    {"code": "gu", "name": "Gujarati", "native_name": "ગુજરાતી", "category": "Indian"},
    {"code": "ur", "name": "Urdu", "native_name": "اردو", "category": "Indian"},
    {"code": "es", "name": "Spanish", "native_name": "Español", "category": "European"},
    {"code": "fr", "name": "French", "native_name": "Français", "category": "European"},
    {"code": "de", "name": "German", "native_name": "Deutsch", "category": "European"},
    {"code": "it", "name": "Italian", "native_name": "Italiano", "category": "European"},
    {"code": "pt", "name": "Portuguese", "native_name": "Português", "category": "European"},
    {"code": "ru", "name": "Russian", "native_name": "Русский", "category": "European"},
    {"code": "nl", "name": "Dutch", "native_name": "Nederlands", "category": "European"},
    {"code": "tr", "name": "Turkish", "native_name": "Türkçe", "category": "Middle Eastern"},
    {"code": "ar", "name": "Arabic", "native_name": "العربية", "category": "Middle Eastern"},
    {"code": "zh", "name": "Chinese (Simplified)", "native_name": "简体中文", "category": "Asian"},
    {"code": "ja", "name": "Japanese", "native_name": "日本語", "category": "Asian"},
    {"code": "ko", "name": "Korean", "native_name": "한국어", "category": "Asian"},
    {"code": "id", "name": "Indonesian", "native_name": "Bahasa Indonesia", "category": "Asian"},
    {"code": "vi", "name": "Vietnamese", "native_name": "Tiếng Việt", "category": "Asian"},
    {"code": "th", "name": "Thai", "native_name": "ไทย", "category": "Asian"},
    {"code": "pl", "name": "Polish", "native_name": "Polski", "category": "European"},
    {"code": "uk", "name": "Ukrainian", "native_name": "Українська", "category": "European"},
    {"code": "el", "name": "Greek", "native_name": "Ελληνικά", "category": "European"},
    {"code": "sv", "name": "Swedish", "native_name": "Svenska", "category": "European"},
    {"code": "cs", "name": "Czech", "native_name": "Čeština", "category": "European"},
    {"code": "ro", "name": "Romanian", "native_name": "Română", "category": "European"},
    {"code": "hu", "name": "Hungarian", "native_name": "Magyar", "category": "European"},
    {"code": "da", "name": "Danish", "native_name": "Dansk", "category": "European"},
    {"code": "fi", "name": "Finnish", "native_name": "Suomi", "category": "European"},
    {"code": "no", "name": "Norwegian", "native_name": "Norsk", "category": "European"},
    {"code": "he", "name": "Hebrew", "native_name": "עברית", "category": "Middle Eastern"},
    {"code": "fa", "name": "Persian", "native_name": "فارسی", "category": "Middle Eastern"},
    {"code": "ne", "name": "Nepali", "native_name": "नेपाली", "category": "Indian"},
    {"code": "si", "name": "Sinhala", "native_name": "සිංහල", "category": "Asian"},
    {"code": "ms", "name": "Malay", "native_name": "Bahasa Melayu", "category": "Asian"},
    {"code": "fil", "name": "Filipino", "native_name": "Tagalog", "category": "Asian"},
    {"code": "sw", "name": "Swahili", "native_name": "Kiswahili", "category": "African"}
]

LANGUAGE_MAP: Dict[str, Dict[str, str]] = {
    item["code"]: item for item in SUPPORTED_LANGUAGES
}

# NLLB language code mapping (e.g. te -> tel_Telu, en -> eng_Latn)
NLLB_CODE_MAP = {
    "en": "eng_Latn",
    "te": "tel_Telu",
    "hi": "hin_Deva",
    "ta": "tam_Taml",
    "kn": "kan_Knda",
    "ml": "mal_Mlym",
    "bn": "ben_Beng",
    "pa": "pan_Guru",
    "mr": "mar_Deva",
    "gu": "guj_Gujr",
    "ur": "urd_Arab",
    "ar": "arb_Arab",
    "fr": "fra_Latn",
    "es": "spa_Latn",
    "de": "deu_Latn",
    "it": "ita_Latn",
    "pt": "por_Latn",
    "ru": "rus_Cyrl",
    "zh": "zho_Hans",
    "ja": "jpn_Jpan",
    "ko": "kor_Hang",
    "tr": "tur_Latn",
    "nl": "nld_Latn",
    "id": "ind_Latn",
    "vi": "vie_Latn",
    "th": "tha_Thai",
    "fa": "pes_Arab",
    "ne": "npi_Deva",
    "sw": "swh_Latn",
}

def get_language_name(code: str) -> str:
    """Returns the English name for a given ISO language code."""
    cleaned = code.lower().strip()
    if cleaned in LANGUAGE_MAP:
        return LANGUAGE_MAP[cleaned]["name"]
    return code.upper()

def detect_script_heuristic(text: str) -> Optional[str]:
    """
    Rapid Unicode script heuristic detection for non-Latin writing systems.
    Particularly effective for Indian languages, East Asian languages, and Arabic.
    """
    if not text:
        return None

    # Sample non-whitespace characters
    chars = [c for c in text if not c.isspace() and not c.isdigit() and c not in '.,!?;:"\'()[]{}<>/-_+=@#$%^&*~`']
    if not chars:
        return None

    counts = {
        "te": 0,  # Telugu: 0x0C00 - 0x0C7F
        "ta": 0,  # Tamil: 0x0B80 - 0x0BFF
        "kn": 0,  # Kannada: 0x0C80 - 0x0CFF
        "ml": 0,  # Malayalam: 0x0D00 - 0x0D7F
        "bn": 0,  # Bengali: 0x0980 - 0x09FF
        "gu": 0,  # Gujarati: 0x0A80 - 0x0AFF
        "pa": 0,  # Punjabi/Gurmukhi: 0x0A00 - 0x0A7F
        "hi": 0,  # Devanagari (Hindi, Marathi, Nepali): 0x0900 - 0x097F
        "ar": 0,  # Arabic/Urdu: 0x0600 - 0x06FF
        "th": 0,  # Thai: 0x0E00 - 0x0E7F
        "ko": 0,  # Hangul: 0xAC00 - 0xD7AF, 0x1100 - 0x11FF
        "ja": 0,  # Hiragana/Katakana: 0x3040 - 0x30FF
        "zh": 0,  # Han / CJK: 0x4E00 - 0x9FFF
        "ru": 0,  # Cyrillic: 0x0400 - 0x04FF
        "el": 0,  # Greek: 0x0370 - 0x03FF
        "he": 0,  # Hebrew: 0x0590 - 0x05FF
    }

    for char in chars:
        code = ord(char)
        if 0x0C00 <= code <= 0x0C7F:
            counts["te"] += 1
        elif 0x0B80 <= code <= 0x0BFF:
            counts["ta"] += 1
        elif 0x0C80 <= code <= 0x0CFF:
            counts["kn"] += 1
        elif 0x0D00 <= code <= 0x0D7F:
            counts["ml"] += 1
        elif 0x0980 <= code <= 0x09FF:
            counts["bn"] += 1
        elif 0x0A80 <= code <= 0x0AFF:
            counts["gu"] += 1
        elif 0x0A00 <= code <= 0x0A7F:
            counts["pa"] += 1
        elif 0x0900 <= code <= 0x097F:
            counts["hi"] += 1
        elif 0x0600 <= code <= 0x06FF:
            counts["ar"] += 1
        elif 0x0E00 <= code <= 0x0E7F:
            counts["th"] += 1
        elif (0xAC00 <= code <= 0xD7AF) or (0x1100 <= code <= 0x11FF):
            counts["ko"] += 1
        elif 0x3040 <= code <= 0x30FF:
            counts["ja"] += 1
        elif 0x4E00 <= code <= 0x9FFF:
            counts["zh"] += 1
        elif 0x0400 <= code <= 0x04FF:
            counts["ru"] += 1
        elif 0x0370 <= code <= 0x03FF:
            counts["el"] += 1
        elif 0x0590 <= code <= 0x05FF:
            counts["he"] += 1

    # Find dominant script
    max_lang, max_count = max(counts.items(), key=lambda x: x[1])
    if max_count > len(chars) * 0.3:
        return max_lang

    return None
