import React from 'react';
import { Languages, Sparkles, History, Globe2, Cpu, Github, Activity } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenLanguagesModal, 
  backendStatus,
  provider = 'Google Engine'
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('translator')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Languages className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                OmniLingua
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                AI Voice & Text
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Multilingual Universal Neural Translator</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('translator')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'translator'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>Translator</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'history'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </button>

          <button
            onClick={onOpenLanguagesModal}
            className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all flex items-center space-x-1.5"
          >
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Languages</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded-full">100+</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all hidden md:flex items-center space-x-1.5 ${
              activeTab === 'architecture'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Architecture</span>
          </button>
        </nav>

        {/* Status & Github */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
            <span className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-slate-400">{backendStatus === 'online' ? `API: ${provider}` : 'Connecting...'}</span>
          </div>

          <a
            href="https://github.com/santhoshiodiganti007-spec/multi-language-translator"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
            title="View Source on GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>

      </div>
    </header>
  );
}
