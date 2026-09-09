import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Sparkles, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../utils/languages';

const POPULAR_LANGUAGES = ['en', 'te', 'hi', 'ta', 'es', 'fr', 'ar', 'de', 'zh', 'ja'];

export default function LanguageDropdown({
  value,
  onChange,
  includeAuto = false,
  detectedLanguage = null,
  disabled = false,
  label = 'Language'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 50);
    }
  }, [isOpen]);

  const currentLang = value === 'auto'
    ? { code: 'auto', name: 'Auto Detect', nativeName: detectedLanguage ? `Detected: ${detectedLanguage}` : 'Automatic' }
    : getLanguageByCode(value);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang => {
    const q = searchQuery.toLowerCase();
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q) ||
      (lang.category && lang.category.toLowerCase().includes(q))
    );
  });

  const handleSelect = (code) => {
    onChange(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative inline-block text-left w-full sm:w-auto" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all w-full sm:w-56 ${
          isOpen
            ? 'bg-indigo-600/20 text-white border border-indigo-500/50 shadow-lg shadow-indigo-500/10'
            : 'bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800/80 border border-slate-700/60'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center space-x-2 truncate">
          {value === 'auto' ? (
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
          )}
          <span className="truncate">{currentLang.name}</span>
          {value === 'auto' && detectedLanguage && (
            <span className="text-[11px] text-indigo-300 font-normal truncate">
              ({detectedLanguage})
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-80 max-w-[90vw] rounded-2xl glass-dropdown p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 right-0 sm:left-0">
          {/* Search Input */}
          <div className="relative mb-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search language or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Quick Popular Chips */}
          <div className="mb-2 px-1">
            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-1.5">Quick Select</p>
            <div className="flex flex-wrap gap-1">
              {includeAuto && (
                <button
                  type="button"
                  onClick={() => handleSelect('auto')}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                    value === 'auto'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Auto
                </button>
              )}
              {POPULAR_LANGUAGES.map((code) => {
                const lang = getLanguageByCode(code);
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleSelect(code)}
                    className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                      value === code
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {lang.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Languages List */}
          <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1">
            {includeAuto && (
              <button
                type="button"
                onClick={() => handleSelect('auto')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                  value === 'auto'
                    ? 'bg-indigo-600/30 text-indigo-200 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Auto Detect Language</span>
                </div>
                {value === 'auto' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>
            )}

            {filteredLanguages.map((lang) => {
              const isSelected = value === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-indigo-600/30 text-indigo-200 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div>
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-slate-500 ml-1.5 text-[11px]">({lang.nativeName})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">{lang.code}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                </button>
              );
            })}

            {filteredLanguages.length === 0 && (
              <div className="text-center py-4 text-xs text-slate-500">
                No languages found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
