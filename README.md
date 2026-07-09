# RepForge — AI Fitness Coach

A React app with real-time pose estimation, workout tracking, nutrition planning, voice coaching, and progress analysis.

## Features

| Feature | How it works |
|---|---|
| **Pose estimation** | TensorFlow.js MoveNet detects 17 body keypoints from your webcam and counts squat / push-up reps from joint angles. Falls back to a tempo-guided avatar if the camera or model is unavailable. |
| **Workout tracking** | Log sets (exercise, weight, reps) with rest timers and running session volume. |
| **Nutrition planning** | Calorie & macro targets from bodyweight + goal (cut / maintain / build), with a quick-add food log and macro rings. |
| **Voice coaching** | Browser speech synthesis announces reps, form cues, rest countdowns, and set summaries. |
| **Progress analysis** | Volume, reps, and calorie charts (Recharts) that update live as you train. |

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173 and allow camera access for AI Vision mode.

> First AI-Vision start downloads the MoveNet model (~7 MB); it's cached afterward.

## Project structure

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

## Notes

- Data lives in memory for the session (no backend). Add persistence via localStorage or an API as a next step.
- Rep detection thresholds live in `src/hooks/usePoseEngine.js` (`ANGLE_DOWN`, `ANGLE_UP`) — tune per camera angle.
- Not medical advice.
