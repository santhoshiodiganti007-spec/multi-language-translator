from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseTranslationProvider(ABC):
    """Abstract base class for all translation engine providers."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Provider name identifier."""
        pass

    @abstractmethod
    def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        """
        Translates text from source_lang to target_lang.
        If source_lang is 'auto', it auto-detects.
        """
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """Returns True if the provider is configured and available."""
        pass
