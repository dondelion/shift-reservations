"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "indigo" | "sky" | "rose" | "amber";
export type Mode = "light" | "dark";

interface ThemeCtx {
  theme: Theme;
  mode: Mode;
  setTheme: (t: Theme) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: "indigo",
  mode: "light",
  setTheme: () => {},
  toggleMode: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("indigo");
  const [mode, setModeState] = useState<Mode>("light");

  // Sync from localStorage once mounted (avoids SSR mismatch)
  useEffect(() => {
    const t = (localStorage.getItem("rs_theme") as Theme) || "indigo";
    const m = (localStorage.getItem("rs_mode") as Mode) || "light";
    setThemeState(t);
    setModeState(m);
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.setAttribute("data-mode", m);
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("rs_theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }

  function toggleMode() {
    const next: Mode = mode === "light" ? "dark" : "light";
    setModeState(next);
    localStorage.setItem("rs_mode", next);
    document.documentElement.setAttribute("data-mode", next);
  }

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
