FACE DETECTION SYSTEM

Real-time facial emotion recognition and biometric analysis system built with React, TypeScript, and the Gemini API. Combines live camera-based face tracking with a futuristic HUD-style interface for emotion telemetry, FACS (Facial Action Coding System) analysis, and biometric authentication simulation.

View your app in AI Studio: https://ai.studio/apps/83f8d587-0cb0-4e1c-b01f-d16810f1c91d

## Features

- Real-time face detection and tracking via webcam
- Live emotion recognition with circumplex (valence/arousal) plotting
- FACS matrix visualization for facial action units
- Biometric authentication gate simulation
- Animated telemetry and cyberpunk-style HUD overlays
- Robotic voice feedback system

## Prerequisites

- Node.js (v18 or higher recommended)
- A Gemini API key ([Get one here](https://aistudio.google.com/apikey))

## Run Locally

1. Install dependencies:
```bash
   npm install
```
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key:

3. 3. Run the app:
```bash
   npm run dev
```

## Build for Production

```bash
npm run build
```

## Tech Stack

- React + TypeScript
- Vite
- Gemini API

## License

MIT
