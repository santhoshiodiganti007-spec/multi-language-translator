import React from 'react';
import { Heart, Github, Languages, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950/60 mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Languages className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <span className="font-semibold text-slate-300">OmniLingua Universal Translator</span>
          <span>•</span>
          <span>Open Source AI Platform</span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <span>Powered by FastAPI, React & Neural Models</span>
          </span>
          <a
            href="https://github.com/santhoshiodiganti007-spec/multi-language-translator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition flex items-center space-x-1"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>

      </div>
    </footer>
  );
}
