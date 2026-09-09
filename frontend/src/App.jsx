import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import TranslationCard from './components/TranslationCard';
import HistoryPanel from './components/HistoryPanel';
import SupportedLanguagesModal from './components/SupportedLanguagesModal';
import ArchitectureSection from './components/ArchitectureSection';
import Footer from './components/Footer';
import { translationAPI } from './services/api';
import { Sparkles, Globe2, Mic, Volume2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('translator');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('te'); // Default to Telugu
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [providerUsed, setProviderUsed] = useState('Google Engine');
  const [historyItems, setHistoryItems] = useState([]);
  const [isLanguagesModalOpen, setIsLanguagesModalOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('connecting');

  // Fetch backend status and initial history
  useEffect(() => {
    async function init() {
      try {
        const health = await translationAPI.checkHealth();
        if (health.status === 'ok') {
          setBackendStatus('online');
          if (health.provider) {
            setProviderUsed(health.provider.toUpperCase());
          }
        }
      } catch (err) {
        console.warn('Backend server not reachable yet:', err);
        setBackendStatus('offline');
      }

      try {
        const hist = await translationAPI.getHistory(30);
        if (Array.isArray(hist)) {
          setHistoryItems(hist);
        }
      } catch (err) {
        console.warn('Failed to load history:', err);
      }
    }

    init();
  }, []);

  // Translation handler
  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await translationAPI.translate({
        text: sourceText,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        save_history: true
      });

      setTranslatedText(res.translated_text);
      if (res.detected_language) {
        setDetectedLanguage(res.detected_language);
      }
      if (res.provider_used) {
        setProviderUsed(res.provider_used.toUpperCase());
      }

      // Refresh history list
      try {
        const updatedHistory = await translationAPI.getHistory(30);
        if (Array.isArray(updatedHistory)) {
          setHistoryItems(updatedHistory);
        }
      } catch (e) {
        // history refresh fail shouldn't break user view
      }

    } catch (err) {
      console.error('Translation error:', err);
      const errMsg = err.response?.data?.detail || err.message || 'Failed to complete translation. Please try again.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [sourceText, sourceLanguage, targetLanguage]);

  // Language swap handler
  const handleSwapLanguages = () => {
    if (sourceLanguage === 'auto') {
      // If auto-detected and detectedLanguage is known, we can swap
      setSourceLanguage(targetLanguage);
      setTargetLanguage('en');
    } else {
      const prevSource = sourceLanguage;
      const prevTarget = targetLanguage;
      setSourceLanguage(prevTarget);
      setTargetLanguage(prevSource);
    }

    // Swap text if both exist
    if (translatedText && sourceText) {
      const prevText = sourceText;
      setSourceText(translatedText);
      setTranslatedText(prevText);
    }
  };

  // Clear text handler
  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
    setDetectedLanguage(null);
    setError(null);
  };

  // History CRUD handlers
  const handleDeleteHistoryItem = async (id) => {
    try {
      await translationAPI.deleteHistoryItem(id);
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all translation history?')) return;
    try {
      await translationAPI.clearHistory();
      setHistoryItems([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const handleSelectHistoryItem = (item) => {
    setSourceLanguage(item.source_language || 'auto');
    setTargetLanguage(item.target_language || 'en');
    setSourceText(item.original_text || '');
    setTranslatedText(item.translated_text || '');
    if (item.detected_language) {
      setDetectedLanguage(item.detected_language);
    }
    setActiveTab('translator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Dynamic ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLanguagesModal={() => setIsLanguagesModalOpen(true)}
        backendStatus={backendStatus}
        provider={providerUsed}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-indigo-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>AI Neural Translation with Speech-to-Text & Voice Synthesis</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Speak & Translate Across{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              100+ Languages
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Break language barriers instantly. Type or speak in English, Telugu, Hindi, Spanish, French, Japanese, and 100+ world languages with real-time neural accuracy.
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2 text-xs text-slate-400">
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>100+ World & Indian Languages</span>
            </span>
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <Mic className="w-3.5 h-3.5 text-rose-400" />
              <span>Speech-to-Text Voice Input</span>
            </span>
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Text-to-Speech Audio Playback</span>
            </span>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'translator' && (
          <TranslationCard
            sourceLanguage={sourceLanguage}
            setSourceLanguage={setSourceLanguage}
            targetLanguage={targetLanguage}
            setTargetLanguage={setTargetLanguage}
            sourceText={sourceText}
            setSourceText={setSourceText}
            translatedText={translatedText}
            detectedLanguage={detectedLanguage}
            isLoading={isLoading}
            error={error}
            providerUsed={providerUsed}
            onTranslate={handleTranslate}
            onSwapLanguages={handleSwapLanguages}
            onClear={handleClear}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPanel
            historyItems={historyItems}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onClearHistory={handleClearHistory}
            onSelectHistoryItem={handleSelectHistoryItem}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureSection />
        )}

      </main>

      {/* Supported Languages Modal */}
      <SupportedLanguagesModal
        isOpen={isLanguagesModalOpen}
        onClose={() => setIsLanguagesModalOpen(false)}
        onSelectLanguage={(code) => {
          setTargetLanguage(code);
        }}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
