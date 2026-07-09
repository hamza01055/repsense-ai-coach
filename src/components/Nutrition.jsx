import React, { useState } from "react";
import { T } from "../theme.js";
import { FOODS } from "../data/foods.js";

export default function Nutrition({ meals, addMeal, removeMeal }) {
  const [weightKg, setWeightKg] = useState(75);
  const [goal, setGoal] = useState("build");

  const targets = {
    cut:      { kcal: Math.round(weightKg * 26), p: Math.round(weightKg * 2.2), c: Math.round(weightKg * 2.2), f: Math.round(weightKg * 0.8) },
    build:    { kcal: Math.round(weightKg * 35), p: Math.round(weightKg * 2.0), c: Math.round(weightKg * 4.5), f: Math.round(weightKg * 1.0) },
    maintain: { kcal: Math.round(weightKg * 31), p: Math.round(weightKg * 1.8), c: Math.round(weightKg * 3.5), f: Math.round(weightKg * 0.9) },
  }[goal];

  const tot = meals.reduce(
    (a, m) => ({ p: a.p + m.p, c: a.c + m.c, f: a.f + m.f, kcal: a.kcal + m.kcal }),
    { p: 0, c: 0, f: 0, kcal: 0 }
  );

  const Ring = ({ label, val, max, color }) => {
    const pct = Math.min(100, (val / max) * 100);
    return (
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r="33" fill="none" stroke={T.line} strokeWidth="8" />
            <circle cx="40" cy="40" r="33" fill="none" stroke={color} strokeWidth="8"
              strokeDasharray={`${pct * 2.073} 999`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center mono text-xs font-bold" style={{ color: T.text }}>
            {Math.round(pct)}%
          </div>
        </div>
        <div className="mono text-xs mt-1" style={{ color: T.dim }}>{label}</div>
        <div className="text-xs font-semibold" style={{ color }}>{val} / {max}g</div>
      </div>
    );
  };

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-2xl p-4" style={{ background: T.panel, border: `1px solid ${T.line}` }}>
          <div className="mono text-xs tracking-widest mb-3" style={{ color: T.dim }}>YOUR PLAN</div>
          <div className="mono text-xs tracking-widest mb-1" style={{ color: T.dim }}>BODYWEIGHT — {weightKg} KG</div>
          <input type="range" min="45" max="140" value={weightKg}
            onChange={(e) => setWeightKg(+e.target.value)} className="w-full mb-3" />
          <div className="grid grid-cols-3 gap-2">
            {[["cut", "Cut"], ["maintain", "Maintain"], ["build", "Build"]].map(([k, lbl]) => (
              <button key={k} onClick={() => setGoal(k)}
                className="rounded-lg py-2 text-xs font-semibold"
                style={{
                  background: goal === k ? T.amber : T.panel2,
                  color: goal === k ? T.ink : T.text,
                  border: `1px solid ${goal === k ? T.amber : T.line}`,
                }}>{lbl}</button>
            ))}
          </div>
          <div className="mt-4 rounded-xl p-3 text-center" style={{ background: T.panel2 }}>
            <span className="display font-black text-3xl" style={{ color: tot.kcal > targets.kcal ? T.coral : T.text }}>
              {tot.kcal}
            </span>
            <span className="text-sm" style={{ color: T.dim }}> / {targets.kcal} kcal</span>
          </div>
          <div className="flex justify-around mt-4">
            <Ring label="PROTEIN" val={tot.p} max={targets.p} color={T.teal} />
            <Ring label="CARBS" val={tot.c} max={targets.c} color={T.amber} />
            <Ring label="FAT" val={tot.f} max={targets.f} color={T.coral} />
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <div className="rounded-2xl p-4" style={{ background: T.panel, border: `1px solid ${T.line}` }}>
          <div className="mono text-xs tracking-widest mb-2" style={{ color: T.dim }}>QUICK ADD</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {FOODS.map((f, i) => (
              <button key={i} onClick={() => addMeal(f)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-left"
                style={{ background: T.panel2, border: `1px solid ${T.line}` }}>
                <span className="text-xs font-medium" style={{ color: T.text }}>{f.name}</span>
                <span className="mono text-xs" style={{ color: T.amber }}>{f.kcal}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-4" style={{ background: T.panel, border: `1px solid ${T.line}` }}>
          <div className="mono text-xs tracking-widest mb-2" style={{ color: T.dim }}>TODAY'S LOG</div>
          {meals.length === 0 ? (
            <p className="text-sm py-6 text-center" style={{ color: T.dim }}>
              Nothing logged yet. Tap a food above to add it.
            </p>
          ) : meals.map((m, i) => (
            <div key={i} className="flex items-center justify-between py-2"
              style={{ borderBottom: i < meals.length - 1 ? `1px solid ${T.line}` : "none" }}>
              <span className="text-sm" style={{ color: T.text }}>{m.name}</span>
              <div className="flex items-center gap-3">
                <span className="mono text-xs" style={{ color: T.dim }}>P{m.p} C{m.c} F{m.f}</span>
                <span className="mono text-xs font-bold" style={{ color: T.amber }}>{m.kcal}</span>
                <button onClick={() => removeMeal(i)} className="text-xs" style={{ color: T.coral }} aria-label={`Remove ${m.name}`}>✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
