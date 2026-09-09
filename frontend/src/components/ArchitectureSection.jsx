import React from 'react';
import { 
  Layers, 
  Cpu, 
  Database, 
  Globe2, 
  Mic, 
  Volume2, 
  Server, 
  Zap, 
  ShieldCheck, 
  Code2 
} from 'lucide-react';

export default function ArchitectureSection() {
  const steps = [
    {
      icon: Mic,
      title: "1. Speech & Text Input",
      desc: "Web Speech API processes voice input locally via webkitSpeechRecognition, with real-time transcript streaming."
    },
    {
      icon: Server,
      title: "2. FastAPI Backend",
      desc: "High-performance Python backend with Pydantic validation, CORS middleware, and automatic language detection."
    },
    {
      icon: Cpu,
      title: "3. Provider Abstraction",
      desc: "Multi-engine translation orchestrator: Google Engine, Hugging Face NLLB-200 AI model, and MyMemory fallback."
    },
    {
      icon: Database,
      title: "4. Database Persistence",
      desc: "SQLAlchemy ORM seamlessly connecting SQLite for zero-config local dev and PostgreSQL for cloud deployment."
    },
    {
      icon: Volume2,
      title: "5. Speech Synthesis & UI",
      desc: "Reactive React interface renders translated output and plays native audio speech synthesis with zero lag."
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
          <Layers className="w-3.5 h-3.5" />
          <span>System Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Engineered for Accuracy, Speed & Resilience
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          A decoupled full-stack architecture combining browser-native speech APIs with a robust Python translation microservice.
        </p>
      </div>

      {/* Pipeline Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl glass-panel relative flex flex-col justify-between hover:border-indigo-500/30 transition-all group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="font-bold text-sm text-slate-100 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tech Stack Matrix */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-indigo-400" />
          <span>Full-Stack Technology Stack</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Frontend</h4>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• React 18 + Vite</li>
              <li>• Tailwind CSS (Glassmorphism)</li>
              <li>• Web Speech API (STT & TTS)</li>
              <li>• Lucide React Icons</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">Backend</h4>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• Python 3.11 + FastAPI</li>
              <li>• Pydantic v2 validation</li>
              <li>• Uvicorn ASGI server</li>
              <li>• Pytest automated test suite</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Translation Engines</h4>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• Google Deep Engine (100+ langs)</li>
              <li>• Hugging Face NLLB AI Model</li>
              <li>• MyMemory Fallback Provider</li>
              <li>• Script Heuristic Detection</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">Data & Deployment</h4>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• SQLAlchemy ORM</li>
              <li>• SQLite (Local) / PostgreSQL</li>
              <li>• Vercel (Frontend SPA)</li>
              <li>• Render / Railway (Backend)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
