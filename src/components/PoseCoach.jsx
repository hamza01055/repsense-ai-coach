import React, { useState, useRef, useEffect } from "react";
import { T } from "../theme.js";
import { EXERCISES } from "../data/exercises.js";
import { usePoseEngine } from "../hooks/usePoseEngine.js";
import Skeleton, { KeypointOverlay } from "./Skeleton.jsx";

export default function PoseCoach({ speak, onLogReps }) {
  const videoRef = useRef(null);
  const [camOn, setCamOn] = useState(false);
  const [camErr, setCamErr] = useState("");
  const [exercise, setExercise] = useState("squat");
  const [tempo, setTempo] = useState(3);
  const [flash, setFlash] = useState(false);
  const [videoSize, setVideoSize] = useState({ w: 640, h: 480 });

  const ex = EXERCISES.find((e) => e.id === exercise);

  const { mode, modelState, reps, phase, running, keypoints, start, stop } = usePoseEngine({
    videoRef,
    joint: ex.joint,
    tempo,
    onRep: (r) => {
      setFlash(true); setTimeout(() => setFlash(false), 400);
      if (r % 5 === 0) speak(`${r} reps. ${ex.cues[Math.floor(r / 5) % ex.cues.length]}`);
      else speak(String(r), 1.15);
    },
  });

  const startCam = async () => {
    setCamErr("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      const v = videoRef.current;
      if (v) {
        v.srcObject = stream;
        await v.play();
        setVideoSize({ w: v.videoWidth || 640, h: v.videoHeight || 480 });
      }
      setCamOn(true);
    } catch {
      setCamErr("Camera unavailable — the form-guide avatar and tempo counting still work.");
      setCamOn(false);
    }
  };

  const stopCam = () => {
    const s = videoRef.current?.srcObject;
    s?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamOn(false);
  };

  useEffect(() => () => stopCam(), []);

  const startSet = async () => {
    speak(`Starting ${ex.name}. ${ex.cues[0]}`);
    const used = await start(camOn);
    if (camOn && used === "tempo") {
      setCamErr("AI Vision model couldn't load — counting by tempo instead.");
    }
  };

  const endSet = () => {
    const count = stop();
    if (count > 0) {
      speak(`Set complete. ${count} reps logged. Nice work.`);
      onLogReps(ex.name, count, mode);
    }
  };

  const statusLabel = !running
    ? "STANDBY"
    : mode === "vision"
      ? "AI VISION — MOVENET LIVE"
      : "TEMPO TRACKING";

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* stage */}
      <div className="lg:col-span-3 rounded-2xl overflow-hidden relative"
        style={{ background: T.panel, border: `1px solid ${T.line}`, minHeight: 340 }}>
        <video ref={videoRef} muted playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: "scaleX(-1)", opacity: camOn ? 0.9 : 0 }} />
        {camOn && mode === "vision" && running && (
          <KeypointOverlay keypoints={keypoints} width={videoSize.w} height={videoSize.h} />
        )}
        {!camOn && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="w-full max-w-sm"><Skeleton phase={phase} exercise={exercise} /></div>
          </div>
        )}
        {camOn && mode !== "vision" && (
          <div className="absolute inset-0 pointer-events-none flex items-end justify-end p-3">
            <div className="w-40 rounded-xl p-1" style={{ background: "rgba(16,20,24,.75)", border: `1px solid ${T.line}` }}>
              <Skeleton phase={phase} exercise={exercise} />
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full"
            style={{ background: running ? T.coral : T.dim, animation: running ? "pulseDot 1.2s infinite" : "none" }} />
          <span className="mono text-xs" style={{ color: T.dim }}>{statusLabel}</span>
        </div>
        <div className={`absolute top-3 right-3 text-right ${flash ? "rep-flash" : ""}`}>
          <div className="display font-black leading-none" style={{ fontSize: 56, color: T.amber }}>{reps}</div>
          <div className="mono text-xs tracking-widest" style={{ color: T.dim }}>REPS</div>
        </div>
        {modelState === "loading" && (
          <div className="absolute bottom-3 left-3 mono text-xs px-2 py-1 rounded"
            style={{ background: "rgba(16,20,24,.8)", color: T.teal }}>
            Loading MoveNet model…
          </div>
        )}
      </div>

      {/* controls */}
      <div className="lg:col-span-2 flex flex-col gap-3">
        <div className="rounded-2xl p-4" style={{ background: T.panel, border: `1px solid ${T.line}` }}>
          <div className="mono text-xs tracking-widest mb-2" style={{ color: T.dim }}>EXERCISE</div>
          <div className="grid grid-cols-3 gap-2">
            {EXERCISES.map((e) => (
              <button key={e.id} onClick={() => { setExercise(e.id); stop(); }}
                className="rounded-lg px-2 py-2 text-xs font-semibold"
                style={{
                  background: exercise === e.id ? T.amber : T.panel2,
                  color: exercise === e.id ? T.ink : T.text,
                  border: `1px solid ${exercise === e.id ? T.amber : T.line}`,
                }}>{e.name}</button>
            ))}
          </div>
          <div className="mt-4 mono text-xs tracking-widest mb-1" style={{ color: T.dim }}>
            TEMPO — {tempo}s / rep {camOn ? "(fallback mode)" : ""}
          </div>
          <input type="range" min="2" max="6" step="0.5" value={tempo}
            onChange={(e) => setTempo(+e.target.value)} className="w-full" />
        </div>

        <div className="rounded-2xl p-4 flex-1" style={{ background: T.panel, border: `1px solid ${T.line}` }}>
          <div className="mono text-xs tracking-widest mb-2" style={{ color: T.dim }}>FORM CUES</div>
          <ul className="space-y-2">
            {ex.cues.map((c, i) => (
              <li key={i} className="text-sm flex gap-2" style={{ color: T.text }}>
                <span style={{ color: T.teal }}>▸</span>{c}
              </li>
            ))}
          </ul>
          {camErr && <p className="text-xs mt-3" style={{ color: T.coral }}>{camErr}</p>}
          {camOn && (
            <p className="text-xs mt-3" style={{ color: T.dim }}>
              AI Vision counts reps from your {ex.joint} angle — stand side-on to the camera with your full body in frame.
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={camOn ? stopCam : startCam}
            className="flex-1 rounded-xl py-3 text-sm font-semibold"
            style={{ background: T.panel2, color: T.text, border: `1px solid ${T.line}` }}>
            {camOn ? "Stop camera" : "Enable camera"}
          </button>
          {!running ? (
            <button onClick={startSet} className="flex-1 rounded-xl py-3 text-sm font-bold"
              style={{ background: T.amber, color: T.ink }}>Start set</button>
          ) : (
            <button onClick={endSet} className="flex-1 rounded-xl py-3 text-sm font-bold"
              style={{ background: T.coral, color: T.ink }}>End set</button>
          )}
        </div>
      </div>
    </div>
  );
}
