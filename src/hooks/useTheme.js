import { useState, useEffect } from 'react';

/**
 * Hook to manage dark theme state
 * Aegis is designed primarily as a high-contrast dark developer profiler.
 */
export function useTheme() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
  }, []);

  return {
    theme,
    isDark: true,
    setTheme,
  };
}

export default useTheme;

