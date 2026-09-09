import React, { useState } from 'react';
import { X, Search, Globe, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

const CATEGORIES = ['All', 'Indian', 'European', 'Asian', 'Middle Eastern', 'African', 'Global'];

export default function SupportedLanguagesModal({ 
  isOpen, 
  onClose, 
  onSelectLanguage 
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = SUPPORTED_LANGUAGES.filter((lang) => {
    const matchesCategory = selectedCategory === 'All' || lang.category === selectedCategory;
    const matchesQuery = 
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[85vh] rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Supported Languages</h2>
              <p className="text-xs text-slate-400">
                100+ World & Regional Languages ready for instant AI translation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/40 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by language name, native script, or code (e.g. Telugu, తెలుగు, te)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Languages Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map((lang) => (
              <div
                key={lang.code}
                onClick={() => {
                  if (onSelectLanguage) {
                    onSelectLanguage(lang.code);
                    onClose();
                  }
                }}
                className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all duration-150 flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-sm text-slate-200 group-hover:text-indigo-200 transition">
                    {lang.name}
                  </div>
                  <div className="text-xs text-slate-400 font-normal mt-0.5">
                    {lang.nativeName}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono group-hover:bg-indigo-600/30 group-hover:text-indigo-300">
                    {lang.code}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No languages match your search.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filtered.length} of {SUPPORTED_LANGUAGES.length} languages</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
