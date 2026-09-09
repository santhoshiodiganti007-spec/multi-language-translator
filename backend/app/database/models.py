import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database.database import Base

class TranslationHistory(Base):
    __tablename__ = "translation_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    original_text = Column(Text, nullable=False)
    translated_text = Column(Text, nullable=False)
    source_language = Column(String(50), nullable=False)
    target_language = Column(String(50), nullable=False)
    detected_language = Column(String(100), nullable=True)
    provider_used = Column(String(50), default="google")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    def __repr__(self):
        return f"<TranslationHistory(id={self.id}, {self.source_language}->{self.target_language})>"
