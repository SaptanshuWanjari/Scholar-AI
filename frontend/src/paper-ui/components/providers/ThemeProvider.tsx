import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Props for the ThemeProvider component.
 *
 * @description Configures theme behavior and localStorage persistence.
 */
export interface ThemeProviderProps {
  defaultTheme?: Theme;
  storageKey?: string;
  children: React.ReactNode;
}

/**
 * Provides light/dark theme context to descendant components.
 *
 * @description Wraps the app, manages theme state, synchronizes with
 * localStorage, and applies the active theme to `document.documentElement`
 * via a `data-theme` attribute and the `dark` CSS class.
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme="light" storageKey="paper-theme">
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * @param defaultTheme - Initial theme when no stored preference exists (default: `"light"`).
 * @param storageKey - localStorage key for persisting the user's choice (default: `"paper-theme"`).
 * @param children - React subtree that receives theme context.
 *
 * @see {@link useTheme} for consuming the theme context.
 */
export function ThemeProvider({
  defaultTheme = "light",
  storageKey = "paper-theme",
  children,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === "light" || stored === "dark") return stored;
    } catch { /* noop */ }
    return defaultTheme;
  });

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", t);
    if (t === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch { /* noop */ }
  }, [theme, storageKey, applyTheme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return React.createElement(
    ThemeContext.Provider,
    { value: { theme, setTheme, toggleTheme } },
    children,
  );
}
ThemeProvider.displayName = "ThemeProvider";

/**
 * Hook to access the current theme and theme controls.
 *
 * @description Returns `{ theme, setTheme, toggleTheme }`. Must be used
 * within a `<ThemeProvider>` ancestor.
 *
 * @example
 * ```tsx
 * const { theme, toggleTheme } = useTheme();
 * return <button onClick={toggleTheme}>{theme}</button>;
 * ```
 *
 * @returns The ThemeContextValue containing theme state and setters.
 * @throws If called outside a ThemeProvider boundary.
 *
 * @see {@link ThemeProvider}
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
