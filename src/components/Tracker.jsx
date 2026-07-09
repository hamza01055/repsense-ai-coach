import React, { useState, useRef, useEffect } from "react";
import { T } from "../theme.js";
import { EXERCISES } from "../data/exercises.js";

export default function Tracker({ log, addSet, speak }) {
  const [exId, setExId] = useState("squat");
  const [weight, setWeight] = useState(40);
  const [reps, setReps] = useState(8);
  const [rest, setRest] = useState(0);
  const restRef = useRef(null);

  const startRest = (sec) => {
    clearInterval(restRef.current);
    setRest(sec);
    speak(`Rest ${sec} seconds.`);
    restRef.current = setInterval(() => {
      setRest((r) => {
        if (r <= 1) { clearInterval(restRef.current); speak("Rest over. Next set."); return 0; }
        if (r === 11) speak("10 seconds.");
        return r - 1;
      });
    }, 1000);
  };
  useEffect(() => () => clearInterval(restRef.current), []);

  const ex = EXERCISES.find((e) => e.id === exId);
  const todayVol = log.reduce((s, l) => s + l.weight * l.reps, 0);

  const Stepper = ({ label, val, set, step, min, max }) => (
    <div>
      <div className="mono text-xs tracking-widest mb-1" style={{ color: T.dim }}>{label}</div>
      <div className="flex items-center gap-2">
        <button onClick={() => set((v) => Math.max(min, +(v - step).toFixed(1)))}
          className="w-10 h-10 rounded-lg text-lg font-bold"
          style={{ background: T.panel2, color: T.text, border: `1px solid ${T.line}` }}>−</button>
        <div className="flex-1 text-center display font-black text-3xl" style={{ color: T.text }}>{val}</div>
        <button onClick={() => set((v) => Math.min(max, +(v + step).toFixed(1)))}
          className="w-10 h-10 rounded-lg text-lg font-bold"
          style={{ background: T.panel2, color: T.text, border: `1px solid ${T.line}` }}>+</button>
      </div>
    </div>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-2 rounded-2xl p-4 space-y-4" style={{ background: T.panel, border: `1px solid ${T.line}` }}>
        <div>
          <div className="mono text-xs tracking-widest mb-2" style={{ color: T.dim }}>LOG A SET</div>
          <select value={exId} onChange={(e) => setExId(e.target.value)}
            className="w-full rounded-lg px-3 py-2.5 text-sm"
            style={{ background: T.panel2, color: T.text, border: `1px solid ${T.line}` }}>
            {EXERCISES.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.muscle}</option>)}
          </select>
        </div>
        <Stepper label="WEIGHT (KG)" val={weight} set={setWeight} step={2.5} min={0} max={300} />
        <Stepper label="REPS" val={reps} set={setReps} step={1} min={1} max={50} />
        <button
          onClick={() => {
            addSet({ ex: ex.name, weight, reps, t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
            speak(`Logged. ${reps} reps at ${weight} kilos.`);
          }}
          className="w-full rounded-xl py-3 font-bold" style={{ background: T.amber, color: T.ink }}>
          Log set
        </button>
        <div className="flex gap-2">
          {[60, 90, 120].map((s) => (
            <button key={s} onClick={() => startRest(s)}
              className="flex-1 rounded-lg py-2 text-sm font-semibold"
              style={{ background: T.panel2, color: T.teal, border: `1px solid ${T.line}` }}>
              Rest {s}s
            </button>
          ))}
        </div>
        {rest > 0 && (
          <div className="rounded-xl p-3 text-center" style={{ background: T.panel2, border: `1px solid ${T.teal}` }}>
            <div className="display font-black text-4xl" style={{ color: T.teal, animation: "breathe 2s infinite" }}>{rest}s</div>
            <div className="mono text-xs tracking-widest" style={{ color: T.dim }}>RESTING</div>
          </div>
        )}
      </div>

      <div className="lg:col-span-3 rounded-2xl p-4" style={{ background: T.panel, border: `1px solid ${T.line}` }}>
        <div className="flex items-baseline justify-between mb-3">
          <div className="mono text-xs tracking-widest" style={{ color: T.dim }}>TODAY'S SESSION</div>
          <div className="text-sm" style={{ color: T.text }}>
            Volume <span className="display font-black" style={{ color: T.amber }}>{todayVol.toLocaleString()}</span> kg
          </div>
        </div>
        {log.length === 0 ? (
          <p className="text-sm py-10 text-center" style={{ color: T.dim }}>
            No sets yet. Log your first set to start the session.
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {[...log].reverse().map((l, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2.5"
                style={{ background: T.panel2, border: `1px solid ${T.line}` }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: T.text }}>{l.ex}</div>
                  <div className="mono text-xs" style={{ color: T.dim }}>{l.t}</div>
                </div>
                <div className="mono text-sm" style={{ color: T.teal }}>{l.weight}kg × {l.reps}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
