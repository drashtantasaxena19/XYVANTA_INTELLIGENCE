from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Xyvanta Intelligence"
    APP_ENV: str = "development"
    API_PREFIX: str = "/api"

    MONGO_URI: str
    MONGO_DB_NAME: str

    FIREBASE_SERVICE_ACCOUNT_PATH: str = (
        "firebase-service-account.json"
    )

    FRONTEND_URL: str = "http://localhost:5173"

    # =========================================================
    # AI CONFIGURATION
    # =========================================================

    # Primary provider preference
    AI_PROVIDER: str = "gemini"

    # Full fallback chain
    AI_PROVIDER_CHAIN: str = (
        "gemini,groq,openrouter,openai"
    )

    # Gemini
    GEMINI_API_KEY: str | None = None

    # Groq
    GROQ_API_KEY: str | None = None

    # OpenRouter
    OPENROUTER_API_KEY: str | None = None

    # OpenAI
    OPENAI_API_KEY: str | None = None

    # =========================================================
    # FILE / PARSING LIMITS
    # =========================================================

    MAX_TEXT_PARSE_LENGTH: int = 12000

    # =========================================================
    # CORS
    # =========================================================

        # =========================================
    # GEOCODING
    # =========================================

    NOMINATIM_BASE_URL: str = (
        "https://nominatim.openstreetmap.org/search"
    )

    NOMINATIM_USER_AGENT: str = (
        "Xyvanta-Intelligence/1.0"
    )

    GEOCODING_CACHE_ENABLED: bool = True
    
    
    ALLOWED_ORIGINS: str = (
        "http://localhost:5173,"
        "http://127.0.0.1:5173"
    )

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()