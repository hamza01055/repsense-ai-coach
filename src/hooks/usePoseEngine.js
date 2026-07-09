// Pose engine: real MoveNet keypoint detection with angle-based rep counting,
// plus a tempo-guided fallback when the camera/model is unavailable.
//
// AI Vision mode:
//   - Loads MoveNet SinglePose Lightning (~7 MB, cached by the browser).
//   - Computes the tracked joint angle each frame (knee for squats, elbow for pushes).
//   - A rep = angle passes below ANGLE_DOWN (bottom) then back above ANGLE_UP (lockout).
// Tempo mode:
//   - Animates a 0..1 phase at the chosen tempo; each full cycle = 1 rep.

import { useState, useRef, useCallback, useEffect } from "react";

const ANGLE_DOWN = 100; // degrees — counts as "bottom position"
const ANGLE_UP = 155;   // degrees — counts as "lockout / top"

function angleAt(a, b, c) {
  // Angle at joint b formed by points a-b-c, in degrees.
  const v1 = { x: a.x - b.x, y: a.y - b.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const m = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y);
  if (!m) return 180;
  return (Math.acos(Math.min(1, Math.max(-1, dot / m))) * 180) / Math.PI;
}

function pick(kps, name, minScore = 0.3) {
  const k = kps.find((p) => p.name === name);
  return k && k.score >= minScore ? k : null;
}

export function usePoseEngine({ videoRef, joint, tempo, onRep }) {
  const [mode, setMode] = useState("tempo");     // "tempo" | "vision"
  const [modelState, setModelState] = useState("idle"); // idle | loading | ready | error
  const [reps, setReps] = useState(0);
  const [phase, setPhase] = useState(0);         // 0 top .. 1 bottom (drives the avatar)
  const [running, setRunning] = useState(false);
  const [keypoints, setKeypoints] = useState(null);

  const detectorRef = useRef(null);
  const rafRef = useRef(null);
  const intervalRef = useRef(null);
  const stageRef = useRef("up"); // rep state machine
  const repsRef = useRef(0);
  const phaseRef = useRef(0);
  const dirRef = useRef(1);
  const onRepRef = useRef(onRep);
  onRepRef.current = onRep;

  const loadModel = useCallback(async () => {
    if (detectorRef.current) return detectorRef.current;
    setModelState("loading");
    try {
      const tf = await import("@tensorflow/tfjs-core");
      await import("@tensorflow/tfjs-backend-webgl");
      await tf.setBackend("webgl");
      await tf.ready();
      const posedetection = await import("@tensorflow-models/pose-detection");
      detectorRef.current = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        { modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
      );
      setModelState("ready");
      return detectorRef.current;
    } catch (e) {
      console.error("Pose model failed to load:", e);
      setModelState("error");
      return null;
    }
  }, []);

  const stopLoops = () => {
    cancelAnimationFrame(rafRef.current);
    clearInterval(intervalRef.current);
  };

  const countRep = useCallback(() => {
    repsRef.current += 1;
    setReps(repsRef.current);
    onRepRef.current?.(repsRef.current);
  }, []);

  // ── AI Vision loop ──────────────────────────────────────────────
  const visionLoop = useCallback(async () => {
    const detector = detectorRef.current;
    const video = videoRef.current;
    if (!detector || !video || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(visionLoop);
      return;
    }
    try {
      const poses = await detector.estimatePoses(video);
      const kps = poses[0]?.keypoints;
      if (kps) {
        setKeypoints(kps);
        const side = ["left", "right"]
          .map((s) =>
            joint === "knee"
              ? [pick(kps, `${s}_hip`), pick(kps, `${s}_knee`), pick(kps, `${s}_ankle`)]
              : [pick(kps, `${s}_shoulder`), pick(kps, `${s}_elbow`), pick(kps, `${s}_wrist`)]
          )
          .find((tri) => tri.every(Boolean));
        if (side) {
          const deg = angleAt(...side);
          // Map angle → phase for the avatar (155° = top/0, 100° = bottom/1)
          const ph = Math.min(1, Math.max(0, (ANGLE_UP - deg) / (ANGLE_UP - ANGLE_DOWN)));
          setPhase(ph);
          if (stageRef.current === "up" && deg < ANGLE_DOWN) stageRef.current = "down";
          if (stageRef.current === "down" && deg > ANGLE_UP) {
            stageRef.current = "up";
            countRep();
          }
        }
      }
    } catch (e) {
      // keep looping; transient estimation errors are normal
    }
    rafRef.current = requestAnimationFrame(visionLoop);
  }, [joint, videoRef, countRep]);

  // ── Tempo loop ──────────────────────────────────────────────────
  const tempoLoop = useCallback(() => {
    const dt = 50;
    const step = dt / 1000 / (tempo / 2);
    intervalRef.current = setInterval(() => {
      let ph = phaseRef.current + dirRef.current * step;
      if (ph >= 1) { ph = 1; dirRef.current = -1; }
      if (ph <= 0 && dirRef.current === -1) {
        ph = 0; dirRef.current = 1;
        countRep();
      }
      phaseRef.current = ph;
      setPhase(ph);
    }, dt);
  }, [tempo, countRep]);

  const start = useCallback(async (useVision) => {
    stopLoops();
    repsRef.current = 0; setReps(0);
    phaseRef.current = 0; dirRef.current = 1; stageRef.current = "up";
    setRunning(true);
    if (useVision) {
      const d = await loadModel();
      if (d) { setMode("vision"); rafRef.current = requestAnimationFrame(visionLoop); return "vision"; }
    }
    setMode("tempo");
    tempoLoop();
    return "tempo";
  }, [loadModel, visionLoop, tempoLoop]);

  const stop = useCallback(() => {
    stopLoops();
    setRunning(false);
    return repsRef.current;
  }, []);

  useEffect(() => () => stopLoops(), []);

  return { mode, modelState, reps, phase, running, keypoints, start, stop };
}
