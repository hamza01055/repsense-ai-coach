import React from "react";
import { T } from "../theme.js";

// Animated SVG form-guide avatar. `phase`: 0 = top of rep, 1 = bottom.
export default function Skeleton({ phase, exercise }) {
  const p = phase;
  let joints;
  if (exercise === "pushup" || exercise === "row" || exercise === "ohp") {
    const drop = p * 26;
    joints = {
      head: [150, 60 + drop], sh: [150, 78 + drop], hip: [150, 130 + drop * 0.9],
      knee: [150, 172 + drop * 0.5], foot: [150, 210],
      elbow: [184, 78 + drop + 18 * p], hand: [180, 118 + drop * 0.2],
    };
  } else {
    const sink = p * 46;
    joints = {
      head: [150, 42 + sink], sh: [150, 66 + sink], hip: [150 - p * 14, 118 + sink],
      knee: [162, 160 + sink * 0.35], foot: [158, 208],
      elbow: [176 - p * 30, 82 + sink], hand: [194 - p * 55, 92 + sink - p * 4],
    };
  }
  const L = ([a, b], [c, d], color = T.teal, w = 5) => (
    <line x1={a} y1={b} x2={c} y2={d} stroke={color} strokeWidth={w} strokeLinecap="round" />
  );
  const good = p > 0.85 || p < 0.15;
  return (
    <svg viewBox="0 0 300 230" className="w-full h-full" role="img" aria-label="Form guide avatar">
      <line x1="40" y1="212" x2="260" y2="212" stroke={T.line} strokeWidth="2" strokeDasharray="4 6" />
      {L(joints.sh, joints.hip)}{L(joints.hip, joints.knee)}{L(joints.knee, joints.foot)}
      {L(joints.sh, joints.elbow, T.amber)}{L(joints.elbow, joints.hand, T.amber)}
      <circle cx={joints.head[0]} cy={joints.head[1]} r="11" fill="none" stroke={T.teal} strokeWidth="5" />
      {[joints.sh, joints.hip, joints.knee, joints.elbow].map((j, i) => (
        <circle key={i} cx={j[0]} cy={j[1]} r="4.5" fill={good ? T.green : T.text} />
      ))}
      <text x="262" y="30" textAnchor="end" fill={good ? T.green : T.dim} fontSize="11" fontFamily="monospace">
        {good ? "DEPTH ✓" : "TRACKING"}
      </text>
    </svg>
  );
}

// Live keypoint overlay drawn over the camera feed in AI Vision mode.
export function KeypointOverlay({ keypoints, width, height }) {
  if (!keypoints) return null;
  const EDGES = [
    ["left_shoulder","right_shoulder"],["left_shoulder","left_elbow"],["left_elbow","left_wrist"],
    ["right_shoulder","right_elbow"],["right_elbow","right_wrist"],["left_shoulder","left_hip"],
    ["right_shoulder","right_hip"],["left_hip","right_hip"],["left_hip","left_knee"],
    ["left_knee","left_ankle"],["right_hip","right_knee"],["right_knee","right_ankle"],
  ];
  const get = (n) => keypoints.find((k) => k.name === n && k.score > 0.3);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ transform: "scaleX(-1)" }}>
      {EDGES.map(([a, b], i) => {
        const ka = get(a), kb = get(b);
        return ka && kb ? (
          <line key={i} x1={ka.x} y1={ka.y} x2={kb.x} y2={kb.y}
            stroke={T.teal} strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        ) : null;
      })}
      {keypoints.filter((k) => k.score > 0.3).map((k, i) => (
        <circle key={i} cx={k.x} cy={k.y} r="5" fill={T.amber} />
      ))}
    </svg>
  );
}
