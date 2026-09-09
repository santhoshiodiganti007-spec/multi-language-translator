from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class TranslationRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000, description="Text to translate")
    source_language: str = Field(..., description="Source language code (e.g. 'auto', 'en', 'te', 'hi')")
    target_language: str = Field(..., description="Target language code (e.g. 'te', 'en', 'es')")
    save_history: bool = Field(default=True, description="Whether to persist to database history")

class TranslationResponse(BaseModel):
    original_text: str
    detected_language: str
    translated_text: str
    source_language: str
    target_language: str
    provider_used: Optional[str] = "google"

class DetectLanguageRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Text to detect language for")

class DetectLanguageResponse(BaseModel):
    language_code: str
    language_name: str
    confidence: Optional[float] = 1.0

class HistoryCreate(BaseModel):
    original_text: str
    translated_text: str
    source_language: str
    target_language: str
    detected_language: Optional[str] = None
    provider_used: Optional[str] = "google"

class HistoryResponse(BaseModel):
    id: int
    original_text: str
    translated_text: str
    source_language: str
    target_language: str
    detected_language: Optional[str] = None
    provider_used: Optional[str] = "google"
    created_at: datetime

    class Config:
        from_attributes = True

class LanguageItem(BaseModel):
    code: str
    name: str
    native_name: str
    category: Optional[str] = "Global"

class HealthResponse(BaseModel):
    status: str
    version: str
    provider: str
    database: str
