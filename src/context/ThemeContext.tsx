/**
 * ThemeContext.tsx — Global state for the app's colour theme.
 *
 * The assignment leaves dark mode behaviour intentionally open-ended.
 * Our approach:
 *   - Default to the user's OS preference via `prefers-color-scheme`.
 *   - Expose a toggle so the Navbar button can switch themes.
 *   - Apply the active theme by setting a `data-theme` attribute on
 *     <html>. CSS variables in index.css respond to this attribute.
 *
 * Usage:
 *   Wrap <App> with <ThemeProvider> in main.tsx.
 *   Consume with the `useTheme` hook (or directly via useContext).
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialise from OS preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useState<Theme>(prefersDark ? 'dark' : 'light');

  // Sync <html data-theme="..."> whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Convenience hook — throws if used outside <ThemeProvider> */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
