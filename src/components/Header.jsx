import React from "react";
import { T } from "../theme.js";

export default function Header({ voiceOn, onToggleVoice }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <div className="mono text-xs tracking-widest" style={{ color: T.amber }}>REPFORGE</div>
        <h1 className="display font-black text-3xl leading-tight" style={{ color: T.text }}>AI Fitness Coach</h1>
      </div>
      <button
        onClick={onToggleVoice}
        className="rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2"
        style={{
          background: voiceOn ? T.amber : T.panel2,
          color: voiceOn ? T.ink : T.dim,
          border: `1px solid ${voiceOn ? T.amber : T.line}`,
        }}>
        {voiceOn ? "🔊 Voice on" : "🔇 Voice off"}
      </button>
    </header>
  );
}
