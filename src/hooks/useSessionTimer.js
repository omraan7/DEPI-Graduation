import { useState, useRef, useEffect } from "react";

export function useSessionTimer(active) {
  const [elapsed, setElapsed] = useState(0);
  const iRef = useRef(null);
  const oRef = useRef(null);

  useEffect(() => {
    if (active) {
      oRef.current = Date.now() - elapsed * 1000;
      iRef.current = setInterval(
        () => setElapsed(Math.floor((Date.now() - oRef.current) / 1000)),
        1000
      );
    } else {
      clearInterval(iRef.current);
    }
    return () => clearInterval(iRef.current);
  }, [active]);

  const reset = () => setElapsed(0);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  return { display: `${mm}:${ss}`, reset };
}
