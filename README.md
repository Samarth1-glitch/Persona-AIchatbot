# Scaler Persona Chatbot

A persona-based AI chatbot that lets you have real conversations with three Scaler/InterviewBit personalities — **Anshuman Singh**, **Abhimanyu Saxena**, and **Kshitij Mishra**.

Built for the Prompt Engineering assignment at Scaler Academy.

---

## Live Demo

🚀 **[View Live App](https://persona-a-ichatbot-qho3.vercel.app/)**

## Screenshots

### Anshuman Singh
<img width="1245" height="1005" alt="Screenshot 2026-04-29 183920" src="https://github.com/user-attachments/assets/2f9c28ad-8c01-4173-b030-2e34911c4285" />

---

### Abhimanyu Saxena
<img width="1232" height="1017" alt="Screenshot 2026-04-29 184006" src="https://github.com/user-attachments/assets/67baa96a-fdcc-4cc8-8588-28e8d9be2f3f" />

---

### Kshitij Mishra
<img width="1250" height="1013" alt="Screenshot 2026-04-29 184038" src="https://github.com/user-attachments/assets/46e9f39c-ed1e-46ae-af98-2b6c93fe959d" />

---

## Features

- **3 distinct personas** — each with deeply researched system prompts
- **Suggestion chips** — 4 quick-start questions per persona to get the conversation going
- **Typing indicator** — animated dots while the API responds
- **Persona switching** — tabs reset conversation when you switch personas
- **Error handling** — user-friendly messages for API errors, rate limits, and misconfigurations
- **Responsive design** — works on mobile and desktop
- **Dark theme** — easy on the eyes for long sessions

---

## Tech Stack

- **Frontend:** React
- **API:** Groq (`llama-3.3-70b-versatile`)
- **Styling:** Pure CSS with custom design tokens
- **Fonts:** Outfit (UI) + Fraunces (display)
- **Deployment:** Vercel

---

## Local Setup

### Prerequisites
- Node.js and npm

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/scaler-persona-chatbot.git
cd scaler-persona-chatbot

# 2. Install dependencies
npm install

# 3. Set up your environment variables
cp .env.example .env
# Open .env and add your API key (at least one is required):
# REACT_APP_GROQ_API_KEY=gsk_... (Recommended, get at console.groq.com)
# REACT_APP_GEMINI_API_KEY=AIza... (Fallback, get at aistudio.google.com)

# 4. Start the development server
npm start
```

The app will open at `http://localhost:3000`.

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

---

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add your environment variable in the Vercel dashboard:
# Settings → Environment Variables → REACT_APP_API_KEY
```

Or connect your GitHub repo to Vercel and it will deploy automatically on every push.
Set the environment variable in **Project Settings → Environment Variables**:
- Key: `REACT_APP_GROQ_API_KEY` (or `REACT_APP_GEMINI_API_KEY`)
- Value: your API key

---

## Project Structure

```
scaler-chatbot/
├── public/
│   └── index.html          # HTML shell
├── src/
│   ├── App.js              # Main React component & UI logic
│   ├── App.css             # All styles (design tokens, layout, components)
│   ├── personas.js         # All 3 persona configs + system prompts
│   ├── api.js              # Unified AI API call (Groq/Gemini) with error handling
│   └── index.js            # React entry point
├── .env.example            # Template for environment variables
├── .gitignore              # Excludes .env, node_modules, build/
├── prompts.md              # All 3 system prompts with inline annotations
├── reflection.md           # 300–500 word project reflection
└── README.md               # This file
```

---

## The Three Personas

### Anshuman Singh — Co-founder
Ex-Facebook, IIT Hyderabad. Direct, technical, first-principles. He reframes your question before answering and doesn't sugarcoat. Talks about engineering fundamentals, the ISA model, and why blind LeetCode grinding fails.

### Abhimanyu Saxena — Co-founder
Ex-Fab, IIT Hyderabad. Warm, mission-driven, a natural storyteller. He thinks in asymmetric outcomes and long time horizons. Talks about Scaler's origin story, hiring philosophy, and the "stable job" illusion.

### Kshitij Mishra — Head of Instructors
IIT Hyderabad. Precise, pedagogical, loves analogies. He never skips the "why," always builds intuition before formalism, and ends every explanation with a practice exercise.

---

## Documentation

- **[prompts.md](./prompts.md)** — All 3 system prompts with detailed inline annotations explaining every design decision
- **[reflection.md](./reflection.md)** — 400-word reflection on what worked, the GIGO principle, and what I'd improve

---

## Security

- API key is stored in `.env` (not committed to git)
- `.env.example` contains a placeholder — never the real key
- The app calls the Gemini API directly from the browser using the `?key=` query param
- **For production:** route API calls through a backend/serverless function to fully hide the key from the browser network tab

---
