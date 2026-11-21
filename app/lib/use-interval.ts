import React from "react";

export function useInterval(
  callback: () => void,
  { delay, immediate = false }: { delay: number; immediate?: boolean }
) {
  const intervalRef = React.useRef(null);
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === "number") {
      intervalRef.current = window.setInterval(tick, delay);
      if (immediate) tick();
      return () => window.clearInterval(intervalRef.current);
    }
  }, [delay, immediate]);

  return intervalRef;
}
