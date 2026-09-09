import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Powered Multilingual Universal Translator"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    
    # Database configuration - defaults to SQLite, seamlessly switches to Postgres if provided
    DATABASE_URL: str = "sqlite:///./translator.db"
    
    # Translation Provider: 'google', 'huggingface', 'mymemory'
    TRANSLATION_PROVIDER: str = "google"
    
    # Hugging Face optional settings
    HUGGINGFACE_API_KEY: str = ""
    HUGGINGFACE_MODEL: str = "facebook/nllb-200-distilled-600M"
    
    # CORS Origins
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
