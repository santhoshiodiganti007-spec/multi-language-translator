import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  Copy, 
  Check, 
  Volume2, 
  ArrowRight, 
  Search, 
  RotateCcw,
  Sparkles,
  Calendar
} from 'lucide-react';
import { getLanguageByCode } from '../utils/languages';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export default function HistoryPanel({
  historyItems = [],
  onDeleteHistoryItem,
  onClearHistory,
  onSelectHistoryItem,
  isLoading
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const { speak } = useSpeechSynthesis();

  const handleCopy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      // ignore
    }
  };

  const filteredHistory = historyItems.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.original_text.toLowerCase().includes(term) ||
      item.translated_text.toLowerCase().includes(term) ||
      item.source_language.toLowerCase().includes(term) ||
      item.target_language.toLowerCase().includes(term)
    );
  });

  const formatDate = (isoStr) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl glass-panel p-4 sm:p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <History className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Translation History</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                {historyItems.length} items
              </span>
            </h2>
            <p className="text-xs text-slate-400">Stored in your database (PostgreSQL / SQLite)</p>
          </div>
        </div>

        {/* Clear All Action */}
        {historyItems.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium transition flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      {historyItems.length > 0 && (
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search translation history by text or language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* History List */}
      <div className="mt-4 space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => {
            const srcLang = getLanguageByCode(item.source_language);
            const tgtLang = getLanguageByCode(item.target_language);

            return (
              <div
                key={item.id}
                className="group p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 transition-all duration-200"
              >
                {/* Header info */}
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-200">{srcLang.name}</span>
                    <ArrowRight className="w-3 h-3 text-indigo-400" />
                    <span className="font-semibold text-indigo-300">{tgtLang.name}</span>
                    {item.detected_language && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Detected: {item.detected_language}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>

                {/* Texts grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <p className="text-slate-300 leading-relaxed break-words">{item.original_text}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/10">
                    <p className="text-slate-100 font-medium leading-relaxed break-words">{item.translated_text}</p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-3 mt-2 text-xs">
                  <div className="flex items-center space-x-1">
                    {/* Copy Target */}
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.translated_text)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Copy translated text"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Listen Target */}
                    <button
                      type="button"
                      onClick={() => speak(item.translated_text, item.target_language)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Listen audio"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                    </button>

                    {/* Re-use in Translator */}
                    <button
                      type="button"
                      onClick={() => onSelectHistoryItem(item)}
                      className="px-2.5 py-1 rounded-lg text-[11px] text-slate-300 bg-slate-800 hover:bg-indigo-600 hover:text-white transition flex items-center space-x-1"
                      title="Load this into translator"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Use in Translator</span>
                    </button>
                  </div>

                  {/* Delete Item */}
                  <button
                    type="button"
                    onClick={() => onDeleteHistoryItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 text-slate-500">
            <History className="w-12 h-12 mx-auto mb-3 opacity-30 text-indigo-400" />
            <p className="text-sm font-medium text-slate-400">No translations in history yet</p>
            <p className="text-xs text-slate-600 mt-1">
              {searchTerm ? 'Try adjusting your search filter' : 'Translate any text to view records here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
