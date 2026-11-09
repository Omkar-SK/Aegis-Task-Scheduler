import { useEffect, useRef } from 'react';

/**
 * Custom React hook for declarative, safe setInterval
 * @param {Function} callback 
 * @param {number|null} delay - Milliseconds or null to pause
 */
export function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null || delay === undefined) {
      return;
    }

    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;

