import { useState, useEffect, useCallback } from 'react';
import { getLanguageByCode } from '../utils/languages';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, []);

  const speak = useCallback((text, langCode = 'en') => {
    if (!('speechSynthesis' in window) || !text) return;

    window.speechSynthesis.cancel();

    const langInfo = getLanguageByCode(langCode);
    const targetLocale = (langInfo.locale || 'en-US').toLowerCase();
    const prefix = targetLocale.split('-')[0];

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find matching voice
    const matchingVoice = voices.find(v => 
      v.lang.toLowerCase() === targetLocale || 
      v.lang.toLowerCase().startsWith(prefix)
    );

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
    utterance.lang = langInfo.locale || 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voices]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported
  };
}
