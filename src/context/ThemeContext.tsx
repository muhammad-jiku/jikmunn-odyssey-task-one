"use client";

import
    {
        createContext,
        useCallback,
        useContext,
        useEffect,
        useMemo,
        useState,
        type ReactNode,
    } from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "jikmunn-odyssey:theme";

interface ThemeContextValue {
  theme: ThemePreference;
  resolved: ResolvedTheme;
  setTheme: (next: ThemePreference) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  return "system";
}

function applyTheme(resolved: ResolvedTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");

  // Initialize from localStorage on mount.
  useEffect(() => {
    const stored = readStoredTheme();
    const next = stored === "system" ? getSystemTheme() : stored;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(stored);
    setResolved(next);
    applyTheme(next);
  }, []);

  // Track system changes when preference is "system".
  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const next: ResolvedTheme = mql.matches ? "dark" : "light";
      setResolved(next);
      applyTheme(next);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
    const resolvedNext = next === "system" ? getSystemTheme() : next;
    setResolved(resolvedNext);
    applyTheme(resolvedNext);
  }, []);

  const toggle = useCallback(() => {
    // Toggle moves between light and dark; if currently "system", flip
    // away from the resolved value.
    setTheme(resolved === "dark" ? "light" : "dark");
  }, [resolved, setTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolved, setTheme, toggle }),
    [theme, resolved, setTheme, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

/** Synchronous script that applies the persisted theme before first paint
 *  to avoid a flash of incorrect theme. Inject via next/script in <head>.
 */
export const themeBootstrapScript = `
(function(){try{
var k='${STORAGE_KEY}';
var s=localStorage.getItem(k);
var d= s==='dark' || ((!s||s==='system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
var t= d ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme',t);
document.documentElement.style.colorScheme=t;
}catch(e){}})();
`.trim();
