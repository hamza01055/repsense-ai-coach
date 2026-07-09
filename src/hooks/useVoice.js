import { useState, useCallback } from "react";

export function useVoice() {
  const [enabled, setEnabled] = useState(true);

  const speak = useCallback((text, rate = 1.02) => {
    if (!enabled || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  }, [enabled]);

  return { enabled, setEnabled, speak };
}
