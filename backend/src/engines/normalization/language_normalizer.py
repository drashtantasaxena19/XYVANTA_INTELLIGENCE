from deep_translator import GoogleTranslator
from langdetect import detect


LANGUAGE_MAP = {
    "en": "English",
    "hi": "Hindi",
    "ja": "Japanese",
    "nl": "Dutch",
    "fr": "French",
    "de": "German",
    "es": "Spanish",
    "ar": "Arabic",
    "pt": "Portuguese",
    "it": "Italian",
    "zh-cn": "Chinese",
    "ko": "Korean",
}


def safe_translate_to_english(text: str, detected_language: str) -> str:
    if not text:
        return ""

    if detected_language == "en":
        return text

    try:
        translated = GoogleTranslator(
            source="auto",
            target="en",
        ).translate(text)

        if translated:
            return translated.strip()

    except Exception as error:
        print(f"⚠️ Translation failed: {error}")

    return text


def normalize_multilingual_text(text: str) -> dict:
    cleaned = text.replace("\x00", " ").strip()

    detected_language = "unknown"

    try:
        detected_language = detect(cleaned)
    except Exception:
        pass

    english_text = safe_translate_to_english(
        cleaned,
        detected_language,
    )

    return {
        "original_text": cleaned,
        "english_text": english_text,
        "detected_language": detected_language,
        "language_name": LANGUAGE_MAP.get(
            detected_language,
            detected_language,
        ),
    }