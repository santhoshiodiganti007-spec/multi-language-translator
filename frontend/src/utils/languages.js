export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', locale: 'en-US', category: 'Global' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', locale: 'te-IN', category: 'Indian' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', locale: 'hi-IN', category: 'Indian' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', locale: 'ta-IN', category: 'Indian' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', locale: 'kn-IN', category: 'Indian' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', locale: 'ml-IN', category: 'Indian' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', locale: 'bn-IN', category: 'Indian' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', locale: 'pa-IN', category: 'Indian' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', locale: 'mr-IN', category: 'Indian' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', locale: 'gu-IN', category: 'Indian' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', locale: 'ur-PK', category: 'Indian' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', locale: 'es-ES', category: 'European' },
  { code: 'fr', name: 'French', nativeName: 'Français', locale: 'fr-FR', category: 'European' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', locale: 'de-DE', category: 'European' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', locale: 'it-IT', category: 'European' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', locale: 'pt-PT', category: 'European' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', locale: 'ru-RU', category: 'European' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', locale: 'nl-NL', category: 'European' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', locale: 'tr-TR', category: 'Middle Eastern' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', locale: 'ar-SA', category: 'Middle Eastern' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', locale: 'zh-CN', category: 'Asian' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', locale: 'ja-JP', category: 'Asian' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', locale: 'ko-KR', category: 'Asian' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', locale: 'id-ID', category: 'Asian' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', locale: 'vi-VN', category: 'Asian' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', locale: 'th-TH', category: 'Asian' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', locale: 'pl-PL', category: 'European' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', locale: 'uk-UA', category: 'European' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', locale: 'el-GR', category: 'European' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', locale: 'sv-SE', category: 'European' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', locale: 'cs-CZ', category: 'European' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', locale: 'ro-RO', category: 'European' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', locale: 'hu-HU', category: 'European' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', locale: 'da-DK', category: 'European' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', locale: 'fi-FI', category: 'European' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', locale: 'nb-NO', category: 'European' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', locale: 'he-IL', category: 'Middle Eastern' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', locale: 'fa-IR', category: 'Middle Eastern' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', locale: 'ne-NP', category: 'Indian' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', locale: 'si-LK', category: 'Asian' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', locale: 'ms-MY', category: 'Asian' },
  { code: 'fil', name: 'Filipino', nativeName: 'Tagalog', locale: 'fil-PH', category: 'Asian' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', locale: 'sw-KE', category: 'African' }
];

export const LANGUAGE_BY_CODE = SUPPORTED_LANGUAGES.reduce((acc, lang) => {
  acc[lang.code] = lang;
  return acc;
}, {});

export function getLanguageByCode(code) {
  if (!code) return { code: 'en', name: 'English', nativeName: 'English', locale: 'en-US' };
  return LANGUAGE_BY_CODE[code.toLowerCase()] || {
    code: code,
    name: code.toUpperCase(),
    nativeName: code.toUpperCase(),
    locale: `${code}-US`
  };
}

export const POPULAR_SOURCE_LANGS = ['auto', 'en', 'te', 'hi', 'ta', 'es', 'fr', 'ar', 'zh', 'ja'];
export const POPULAR_TARGET_LANGS = ['te', 'hi', 'en', 'ta', 'es', 'fr', 'de', 'ar', 'zh', 'ja'];
