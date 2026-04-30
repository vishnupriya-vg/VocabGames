import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(totalSeconds, { onExpire } = {}) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const onExpireRef = useRef(onExpire);

  // Keep ref current on every render so the callback always reads latest state
  useEffect(() => { onExpireRef.current = onExpire; });

  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft <= 0) {
      setIsRunning(false);
      onExpireRef.current?.();
      return;
    }
    const id = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [isRunning, secondsLeft]);

  const start = useCallback(() => setIsRunning(true), []);
  const stop  = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  }, [totalSeconds]);

  return { secondsLeft, isRunning, start, stop, reset };
}
