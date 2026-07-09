import React, { useState } from "react";
import { T } from "./theme.js";
import { seedHistory } from "./data/seedHistory.js";
import { useVoice } from "./hooks/useVoice.js";
import Header from "./components/Header.jsx";
import PoseCoach from "./components/PoseCoach.jsx";
import Tracker from "./components/Tracker.jsx";
import Nutrition from "./components/Nutrition.jsx";
import Progress from "./components/Progress.jsx";

const TABS = [
  ["coach", "Pose Coach"],
  ["track", "Tracker"],
  ["fuel", "Nutrition"],
  ["progress", "Progress"],
];

export default function App() {
  const [tab, setTab] = useState("coach");
  const { enabled, setEnabled, speak } = useVoice();
  const [log, setLog] = useState([]);
  const [meals, setMeals] = useState([]);
  const [history, setHistory] = useState(seedHistory);

  const addSet = (s) => {
    setLog((l) => [...l, s]);
    setHistory((h) => {
      const next = [...h];
      const kcal = Math.round(s.reps * 0.9);
      if (next[next.length - 1].date === "Today") {
        const last = { ...next[next.length - 1] };
        last.volume += s.weight * s.reps;
        last.reps += s.reps;
        last.kcal += kcal;
        next[next.length - 1] = last;
      } else {
        next.push({ date: "Today", volume: s.weight * s.reps, reps: s.reps, kcal });
      }
      return next;
    });
  };

  const onLogReps = (exName, reps, mode) =>
    addSet({
      ex: `${exName} (${mode === "vision" ? "AI vision" : "tempo"})`,
      weight: 0,
      reps,
      t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

  const toggleVoice = () => {
    setEnabled(!enabled);
    if (!enabled && window.speechSynthesis) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance("Voice coaching on."));
    }
  };

  return (
    <div className="min-h-screen" style={{ background: T.ink, color: T.text }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Header voiceOn={enabled} onToggleVoice={toggleVoice} />

        <nav className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {TABS.map(([k, lbl]) => (
            <button key={k} onClick={() => setTab(k)}
              className="rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap"
              style={{
                background: tab === k ? T.text : "transparent",
                color: tab === k ? T.ink : T.dim,
                border: `1px solid ${tab === k ? T.text : T.line}`,
              }}>{lbl}</button>
          ))}
        </nav>

        {tab === "coach" && <PoseCoach speak={speak} onLogReps={onLogReps} />}
        {tab === "track" && <Tracker log={log} addSet={addSet} speak={speak} />}
        {tab === "fuel" && (
          <Nutrition
            meals={meals}
            addMeal={(f) => setMeals((m) => [...m, f])}
            removeMeal={(i) => setMeals((m) => m.filter((_, j) => j !== i))}
          />
        )}
        {tab === "progress" && <Progress history={history} />}

        <footer className="mt-8 mono text-xs text-center" style={{ color: T.dim }}>
          Data lives in this session only · AI Vision uses TensorFlow.js MoveNet · Not medical advice
        </footer>
      </div>
    </div>
  );
}
