# AI Integration

This repository contains **three self-contained, TypeScript-first projects** that demonstrate practical AI integrations across frontend, backend, and full-stack setups.  

Each task is designed to be:
- 🚀 Minimal setup (just `npm install && npm run dev`)
- 🔒 Strong error handling
- 🧩 Scalable & maintainable (small modules, shared conventions)
- 🎯 Real-world relevant (autocomplete UI, API automation, full-stack integration)

---

## 📂 Repository Structure
```
decoded-digital-portfolio/
  ai-form-autocomplete/   # Task 1 — React frontend demo
  ai-workflow-api/        # Task 2 — Node.js + Express API
  ai-fullstack/           # Task 3 — Full-stack integration (frontend + backend)
```

---

## 🧩 Shared Conventions
- **Language:** TypeScript
- **Package Manager:** npm
- **Validation:** zod
- **Error Handling:** Centralized `AppError` + middleware
- **Env Config:** `.env` files with safe **mock fallback**
- **Linting/Formatting:** ESLint + Prettier (optional)

---

## 🚀 Tasks Overview

### 1. AI-Powered Form Autocomplete (React)
A React + Vite app that autocompletes text input using AI (OpenAI, HuggingFace, or a mock provider).

- 📍 Path: `ai-form-autocomplete/`
- Input box → AI suggestions → Click to autofill
- Safe fallbacks if API keys are missing

Run:
```bash
cd ai-form-autocomplete
npm install
npm run dev
```
Visit: [http://localhost:5173](http://localhost:5173)

---

### 2. AI Workflow Automation API (Node + Express)
A backend API that takes a task description and returns a **next actionable step** with rationale.

- 📍 Path: `ai-workflow-api/`
- Endpoints:
  - `GET /health` → health check
  - `POST /generate-step` → body `{ "task": "..." }`
- Mock provider works out-of-the-box (no API key needed)

Run:
```bash
cd ai-workflow-api
npm install
npm run dev
```
API on [http://localhost:3000](http://localhost:3000)

---

### 3. Full-Stack AI Integration (Frontend + Backend)
A complete demo with:
- Backend (`Express`) that wraps AI completion
- Frontend (`React + Vite`) that calls backend and displays results

- 📍 Path: `ai-fullstack/`
- Backend → `POST /ai/complete`
- Frontend → Simple textarea UI to send prompts

Run backend:
```bash
cd ai-fullstack/backend
npm install
npm run dev
```
Run frontend (new terminal):
```bash
cd ai-fullstack/frontend
npm install
npm run dev
```
Visit: [http://localhost:5173](http://localhost:5173)

---

## ⚙️ Environment Variables
Each task ships with `.env` and adjust as needed.

### Example (frontend)
```
VITE_AI_PROVIDER=mock   # mock | openai | hf
VITE_OPENAI_API_KEY=
VITE_HF_TOKEN=
```

### Example (backend)
```
PORT=3000
AI_PROVIDER=mock        # mock | openai | hf
OPENAI_API_KEY=
HF_TOKEN=
```

- If no keys are provided → **mock mode** keeps everything functional.

---

## ✅ Review Checklist
- Small, single-purpose modules (`ai.ts`, `errors.ts`, `validation.ts`)
- Centralized error handling with consistent JSON
- Deterministic mock provider (demo-friendly)
- Logs include latency + status codes
- Minimal, readable UI (no CSS frameworks required)

---

## 📦 Deployment (future)
- **Frontend:** Vercel
- **Backend APIs:** Render, Railway, or similar
- Ensure environment variables are configured on deployment provider
