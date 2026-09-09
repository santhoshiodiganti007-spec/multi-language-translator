# 🌐 OmniLingua — AI-Powered Multilingual Universal Translator with Voice & Text Translation

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-grade, full-stack web application for universal text and voice translation supporting **100+ world and regional languages** (including Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, Marathi, Gujarati, Spanish, French, German, Japanese, Arabic, and more).

Built with a resilient **multi-engine provider architecture** (Google Deep Engine, Hugging Face NLLB AI Model, and MyMemory fallback), native **Web Speech API** for real-time Speech-to-Text (STT) and Text-to-Speech (TTS), **SQLAlchemy ORM** with SQLite/PostgreSQL persistence, and a modern glassmorphic UI.

---

## 🌟 Key Features

1. **🌍 Universal Language Support (100+ Languages)**
   - Major world languages and full coverage of regional Indian languages: English, Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, Punjabi, Marathi, Gujarati, Urdu, Spanish, French, German, Japanese, Chinese, Arabic, and 80+ more.
   - Categorized language directory (Indian, European, Asian, Middle Eastern, African, Global).

2. **🧠 Smart Language Auto-Detection**
   - Heuristic Unicode script-range analysis combined with neural language detection.
   - Detects source language in milliseconds and seamlessly updates the interface.

3. **🎙️ Real-Time Voice Translation (Speech-to-Text)**
   - Direct voice dictation using the browser-native `webkitSpeechRecognition` API.
   - Pulsing visual audio waveforms and live transcript streaming.

4. **🔊 Natural Audio Playback (Text-to-Speech)**
   - Instant pronunciation and speech playback for both original and translated text in the native accent.

5. **🔄 Instant Language & Text Swapping**
   - One-click language swap with animated 360-degree rotation and bidirectional text swapping.

6. **📋 One-Click Copy & Quick Actions**
   - Copy translated results with smooth toast animations.
   - Keyboard shortcut support: Press <kbd>Ctrl + Enter</kbd> or <kbd>Cmd + Enter</kbd> to translate instantly.

7. **💾 Persistent Translation History (PostgreSQL & SQLite)**
   - Automatic record saving with timestamps and language pairs.
   - Searchable history log, individual record deletion, and bulk clear.
   - "Use in Translator" button to reload any past translation with a single click.

8. **🛡️ Resilient Multi-Provider Backend**
   - Primary: High-speed Google Deep Engine with mobile web fallback resilience.
   - AI Secondary: Hugging Face NLLB-200 distilled AI model integration.
   - Fallback: MyMemory Translation API.
   - Graceful fallback ensure 99.9% translation uptime.

---

## 🏗️ Architecture & Data Flow

```
[ User Input: Voice / Text ]
             │
    ┌────────┴────────┐
    ▼                 ▼
[ Web Speech STT ]  [ Direct Text Input ]
    │                 │
    └────────┬────────┘
             ▼
[ React 18 + Vite Frontend (Glassmorphic UI) ]
             │  (Axios HTTP / JSON)
             ▼
[ FastAPI Backend (Python 3.11) ]
     ├─► Language Detection Service (Unicode Heuristic + langdetect)
     ├─► Translation Service Orchestrator
     │      ├─ Google Engine (Primary)
     │      ├─ Hugging Face NLLB-200 (AI Neural Model)
     │      └─ MyMemory API (Secondary Fallback)
     └─► SQLAlchemy ORM ──► [ SQLite (Local) / PostgreSQL (Cloud) ]
             │
             ▼
[ Response: Translated Text + Detected Lang ]
             │
    ┌────────┴────────┐
    ▼                 ▼
[ Live UI Update ]  [ Web Speech TTS Audio Playback ]
```

---

## 📁 Project Structure

```
multi-language-translator/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── translation.py      # /api/translate, /api/detect-language
│   │   │   ├── languages.py        # /api/languages
│   │   │   └── history.py          # /api/history (CRUD)
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   ├── database.py         # SQLAlchemy engine & session maker
│   │   │   └── models.py           # TranslationHistory ORM model
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── translation.py      # Pydantic schemas & validations
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── translation_service.py # Provider orchestrator
│   │   │   ├── language_detection_service.py # Detection logic
│   │   │   └── providers/
│   │   │       ├── base.py         # BaseTranslationProvider ABC
│   │   │       ├── google_provider.py # Google engine + web fallback
│   │   │       ├── huggingface_provider.py # NLLB AI model
│   │   │       └── mymemory_provider.py # MyMemory REST fallback
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   └── helpers.py          # Language registry & script ranges
│   │   ├── config.py               # Pydantic Settings
│   │   └── main.py                 # FastAPI app entry point & CORS
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_translation.py     # Pytest automated test suite
│   ├── Dockerfile                  # Container deployment
│   ├── Procfile                    # Railway/Render web process
│   ├── render.yaml                 # Render blueprint
│   ├── requirements.txt            # Python dependencies
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Top navigation & system status
│   │   │   ├── LanguageDropdown.jsx# Searchable dropdown with quick chips
│   │   │   ├── TranslationCard.jsx # Core translation card with STT/TTS
│   │   │   ├── HistoryPanel.jsx    # Translation history with search & CRUD
│   │   │   ├── SupportedLanguagesModal.jsx # 100+ languages grid
│   │   │   ├── ArchitectureSection.jsx # Architecture breakdown
│   │   │   └── Footer.jsx          # Footer & attribution
│   │   ├── hooks/
│   │   │   ├── useSpeechRecognition.js # Web Speech API STT hook
│   │   │   └── useSpeechSynthesis.js   # Web Speech API TTS hook
│   │   ├── services/
│   │   │   └── api.js              # Axios API client
│   │   ├── utils/
│   │   │   └── languages.js        # Supported languages catalog
│   │   ├── App.jsx                 # Main application
│   │   ├── index.css               # Tailwind & glassmorphic styles
│   │   └── main.jsx                # React DOM entry
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── vercel.json                 # Vercel SPA routing
│   └── .env.example
├── .gitignore
├── .env.example
└── README.md
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- **Python 3.11+** installed
- **Node.js 18+** and **npm** installed
- **Git**

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (cmd):
.\venv\Scripts\activate.bat
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from example (SQLite is enabled by default)
cp .env.example .env

# Run automated tests
pytest tests/test_translation.py -v

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```

The backend server will run at `http://localhost:8000`.  
Interactive Swagger API documentation is available at `http://localhost:8000/docs`.

---

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start Vite development server
npm run dev
```

Open your browser at `http://localhost:5173` to experience the translator.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `8000` | Server listening port |
| `ENVIRONMENT` | `development` | Runtime environment (`development` or `production`) |
| `CORS_ORIGINS` | `http://localhost:5173,...` | Allowed CORS origins (comma-separated or `*`) |
| `DATABASE_URL` | `sqlite:///./translator.db` | SQLite or PostgreSQL connection string |
| `TRANSLATION_PROVIDER` | `google` | Active provider (`google`, `huggingface`, `mymemory`) |
| `HUGGINGFACE_API_KEY`| `""` | Optional Hugging Face API token for NLLB AI model |
| `HUGGINGFACE_MODEL` | `facebook/nllb-200-distilled-600M` | Model identifier on Hugging Face |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:8000` | URL of the backend FastAPI service |

---

## 📡 API Reference

### Health Check
- **`GET /api/health`**
  - Returns backend operational status, active provider, and database type.

### Supported Languages
- **`GET /api/languages`**
  - Returns array of supported languages with language codes, native names, and regional categories.

### Language Detection
- **`POST /api/detect-language`**
  - Request body: `{"text": "నమస్కారం"}`
  - Returns: `{"language_code": "te", "language_name": "Telugu", "confidence": 1.0}`

### Translation
- **`POST /api/translate`**
  - Request body:
    ```json
    {
      "text": "Hello, how are you?",
      "source_language": "en",
      "target_language": "te",
      "save_history": true
    }
    ```
  - Returns:
    ```json
    {
      "original_text": "Hello, how are you?",
      "translated_text": "హలో, మీరు ఎలా ఉన్నారు?",
      "source_language": "en",
      "target_language": "te",
      "detected_language": "English",
      "provider_used": "google"
    }
    ```

### History Management
- **`GET /api/history?limit=20`**: Fetch recent translations.
- **`DELETE /api/history/{id}`**: Delete a single translation record.
- **`DELETE /api/history`**: Clear all translation history.

---

## 🚢 Deployment Guide

### Deploy Frontend to Vercel

1. Push your code to GitHub (see instructions below).
2. Go to [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import your `multi-language-translator` repository.
4. Set the **Root Directory** to `frontend`.
5. Set Environment Variable:
   - `VITE_API_URL`: URL of your deployed backend (e.g. `https://your-api.onrender.com`).
6. Click **Deploy**.

---

### Deploy Backend to Render or Railway

#### Render
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Select your GitHub repository.
4. Settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   - `CORS_ORIGINS`: `*` (or your Vercel frontend URL)
   - `DATABASE_URL`: `sqlite:///./translator.db` (or a Neon/Supabase PostgreSQL connection string)
   - `TRANSLATION_PROVIDER`: `google`
6. Click **Create Web Service**.

#### Railway
1. Go to [Railway](https://railway.app).
2. New Project -> **Deploy from GitHub repo**.
3. Select the repository and specify `backend` as the root.
4. Railway will automatically detect the `Procfile` or `Dockerfile` and deploy the service.

---

## 🧪 Testing

Run backend automated tests with pytest:
```bash
cd backend
pytest tests/test_translation.py -v
```

All 10 comprehensive tests verify:
- Health endpoint
- Language catalog
- Unicode script heuristic detection
- Language detection API endpoint
- Empty text validation (422 response)
- Same source-target language shortcut
- Live translation endpoint
- Unsupported language validation
- Complete history CRUD operations

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
