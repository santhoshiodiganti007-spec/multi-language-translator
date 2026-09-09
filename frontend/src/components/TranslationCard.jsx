import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeftRight, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Trash2, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  Share2
} from 'lucide-react';
import LanguageDropdown from './LanguageDropdown';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export default function TranslationCard({
  sourceLanguage,
  setSourceLanguage,
  targetLanguage,
  setTargetLanguage,
  sourceText,
  setSourceText,
  translatedText,
  detectedLanguage,
  isLoading,
  error,
  providerUsed,
  onTranslate,
  onSwapLanguages,
  onClear
}) {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const textareaRef = useRef(null);

  // Speech Recognition hook
  const {
    isListening,
    startListening,
    stopListening,
    isSupported: isSttSupported,
    error: sttError
  } = useSpeechRecognition();

  // Speech Synthesis hook
  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    isSupported: isTtsSupported
  } = useSpeechSynthesis();

  // Handle STT Toggle
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      const speechLang = sourceLanguage === 'auto' ? 'en' : sourceLanguage;
      startListening(speechLang, (transcript) => {
        setSourceText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      });
    }
  };

  // Handle Copy to Clipboard
  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      showToast('Copied translated text to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('Failed to copy text');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Keyboard shortcut Ctrl+Enter or Cmd+Enter to translate
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onTranslate();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-indigo-500/40 text-indigo-200 text-xs font-medium shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Translation Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 relative">
        
        {/* SOURCE INPUT CARD */}
        <div className="rounded-3xl glass-panel p-4 sm:p-6 flex flex-col justify-between shadow-2xl relative transition-all focus-within:border-indigo-500/40">
          <div>
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">From</span>
                <LanguageDropdown
                  value={sourceLanguage}
                  onChange={setSourceLanguage}
                  includeAuto={true}
                  detectedLanguage={detectedLanguage}
                  label="Source Language"
                />
              </div>

              {sourceText && (
                <button
                  type="button"
                  onClick={onClear}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Clear source text"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Textarea Input */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type or paste text to translate... (e.g. 'Hello, how are you?')"
                rows={6}
                maxLength={5000}
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 resize-none focus:outline-none text-base sm:text-lg leading-relaxed font-normal"
              />

              {/* Listening Visualizer Overlay */}
              {isListening && (
                <div className="flex items-center space-x-2 p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-300 animate-pulse my-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span>Listening to your voice... Speak now</span>
                  <div className="flex items-center space-x-0.5 ml-auto">
                    <span className="wave-bar" />
                    <span className="wave-bar" />
                    <span className="wave-bar" />
                    <span className="wave-bar" />
                    <span className="wave-bar" />
                  </div>
                </div>
              )}

              {sttError && (
                <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-[11px] text-rose-300 mt-1">
                  {sttError}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-4 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              {/* Mic STT Button */}
              {isSttSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl border transition flex items-center space-x-1.5 ${
                    isListening
                      ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/25'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                  title={isListening ? 'Stop listening' : 'Speak to input text'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-400" />}
                </button>
              )}

              {/* Listen Audio TTS Button for Source */}
              {sourceText && isTtsSupported && (
                <button
                  type="button"
                  onClick={() => speak(sourceText, sourceLanguage === 'auto' ? 'en' : sourceLanguage)}
                  className="p-2.5 rounded-xl bg-slate-900/80 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800 transition"
                  title="Listen to original text"
                >
                  <Volume2 className="w-4 h-4 text-slate-300" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-[11px] text-slate-500">
                {sourceText.length} / 5000
              </span>
            </div>
          </div>
        </div>

        {/* SWAP BUTTON (Floats between on desktop, centered on mobile) */}
        <div className="lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-10 flex justify-center -my-2 lg:my-0">
          <button
            type="button"
            onClick={onSwapLanguages}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 border border-indigo-400/30 group"
            title="Swap source and target languages"
          >
            <ArrowLeftRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
          </button>
        </div>

        {/* TARGET OUTPUT CARD */}
        <div className="rounded-3xl glass-panel-glow p-4 sm:p-6 flex flex-col justify-between shadow-2xl relative">
          <div>
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">To</span>
                <LanguageDropdown
                  value={targetLanguage}
                  onChange={setTargetLanguage}
                  includeAuto={false}
                  label="Target Language"
                />
              </div>

              {providerUsed && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                  {providerUsed}
                </span>
              )}
            </div>

            {/* Translated Output Area */}
            <div className="relative min-h-[140px] flex flex-col">
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                  <p className="text-xs text-indigo-300/80 animate-pulse">Translating with neural engine...</p>
                </div>
              ) : translatedText ? (
                <p className="text-slate-100 text-base sm:text-lg leading-relaxed select-text font-normal">
                  {translatedText}
                </p>
              ) : (
                <div className="flex-1 flex items-center justify-center py-10 text-slate-500 text-sm italic">
                  Translation will appear here...
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-4 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopy}
                disabled={!translatedText}
                className={`p-2.5 rounded-xl border transition flex items-center space-x-1.5 ${
                  copied
                    ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
                title="Copy translated text"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              {/* Speak Audio Button for Target */}
              {translatedText && isTtsSupported && (
                <button
                  type="button"
                  onClick={() => speak(translatedText, targetLanguage)}
                  className="p-2.5 rounded-xl bg-slate-900/80 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800 transition"
                  title="Listen to translation"
                >
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-500">
                {translatedText ? translatedText.length : 0} chars
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="mt-4 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Translate Footer */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Shortcut: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">Ctrl + Enter</kbd> to translate instantly</span>
        </div>

        <button
          type="button"
          disabled={isLoading || !sourceText.trim()}
          onClick={onTranslate}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Translating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Translate Now</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
