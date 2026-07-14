# Alam AI — Interview Platform Frontend

React (Vite) + Tailwind CSS frontend for the Alam AI interview platform.

## Stack
- React 19 + Vite
- Tailwind CSS v4
- React Router DOM
- Axios (with JWT interceptor)
- react-speech-recognition (voice input)
- Browser SpeechSynthesis API (AI voice, no paid TTS)

## Getting started

```bash
npm install
npm run dev
```

The app expects the FastAPI backend at `http://127.0.0.1:8000` (see `src/services/api.js`).

## Folder structure

```
src/
  assets/avatars/     Alam & Zainab portraits
  components/         Shared UI (Button, Card-style utilities, ChatBubble, MicButton, ScoreRing...)
  context/            AuthContext (JWT session state)
  hooks/               useSpeechSynthesis
  pages/               Login, Register, Dashboard, UploadCV, InterviewerSelect, Interview, Result
  routes/              ProtectedRoute
  services/            api.js, authService.js, interviewService.js
  utils/               storage.js, history.js, interviewers.js
```

## Notes
- Speech recognition requires a Chromium-based browser (Web Speech API support).
- Microphone/voice output require HTTPS or localhost.
