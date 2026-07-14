<div align="center">

# RepSense — AI Fitness Coach

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-MoveNet-FF6F00?style=flat-square&logo=tensorflow)](https://www.tensorflow.org/js)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-22B5BF?style=flat-square)](https://recharts.org/)

*A React app with real-time pose estimation, workout tracking, nutrition planning, voice coaching, and live progress analysis — all in the browser, no backend required.*

[Features](#features) · [Getting Started](#getting-started) · [Project Structure](#project-structure) · [Configuration Notes](#configuration-notes) · [Roadmap](#roadmap)

</div>

---

## Overview

RepSense turns your webcam into a personal trainer. TensorFlow.js MoveNet tracks 17 body keypoints in real time, counts your squat and push-up reps from joint angles, and a voice coach calls out reps, form cues, and rest countdowns — while your training volume, reps, and nutrition update on live charts.

Everything runs client-side in the browser: no account, no server, no data leaving your machine.

---

## Features

| Feature | How it works |
|---------|--------------|
| **Pose estimation** | TensorFlow.js MoveNet detects 17 body keypoints from your webcam and counts squat / push-up reps from joint angles. Falls back to a tempo-guided avatar if the camera or model is unavailable. |
| **Workout tracking** | Log sets (exercise, weight, reps) with rest timers and running session volume. |
| **Nutrition planning** | Calorie and macro targets computed from bodyweight and goal (cut / maintain / build), with a quick-add food log and macro rings. |
| **Voice coaching** | Browser speech synthesis announces reps, form cues, rest countdowns, and set summaries. |
| **Progress analysis** | Volume, rep, and calorie charts (Recharts) that update live as you train. |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A webcam (optional — the app falls back to tempo-guided mode without one)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/repsense.git
cd repsense

# Install dependencies and start the dev server
npm install
npm run dev
```

Open http://localhost:5173 and allow camera access to enable AI Vision mode.

> **Note:** the first AI Vision start downloads the MoveNet model (~7 MB). It is cached for subsequent sessions.

---

## Project Structure

```
src/
  main.jsx              entry point
  App.jsx               tabs, shared state, layout
  theme.js              design tokens
  index.css             global styles & animations
  data/
    exercises.js        exercise library + form cues
    foods.js            quick-add food database
    seedHistory.js      sample training history
  hooks/
    useVoice.js         speech-synthesis coaching
    usePoseEngine.js    MoveNet keypoints + rep counting (with tempo fallback)
  components/
    Header.jsx          branding + voice toggle
    PoseCoach.jsx       camera stage, HUD, controls
    Skeleton.jsx        SVG form-guide avatar / keypoint overlay
    Tracker.jsx         set logger + rest timer
    Nutrition.jsx       macro planner + food log
    Progress.jsx        charts + coach's analysis
```

---

## Configuration Notes

- **Data persistence:** all data lives in memory for the session (no backend). Adding persistence via localStorage or an API is the natural next step.
- **Rep detection tuning:** thresholds live in `src/hooks/usePoseEngine.js` (`ANGLE_DOWN`, `ANGLE_UP`) — tune them to match your camera angle and setup.
- **Privacy:** all pose estimation runs locally in the browser; no video or keypoint data is uploaded anywhere.

---

## Roadmap

- [ ] Persist workouts and nutrition logs (localStorage or backend API)
- [ ] Additional tracked exercises (lunges, overhead press, planks)
- [ ] Exportable training history (CSV / JSON)
- [ ] PWA support for offline and mobile use

---

## Disclaimer

RepSense is a fitness tool, not a medical device. It does not provide medical advice — consult a qualified professional before starting a new exercise or nutrition program.
