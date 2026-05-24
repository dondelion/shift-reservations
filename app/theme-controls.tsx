"use client";

import { useTheme, type Theme } from "./theme-provider";

const THEMES: { id: Theme; color: string; label: string }[] = [
  { id: "indigo", color: "#6366f1", label: "Indigo" },
  { id: "sky",    color: "#0ea5e9", label: "Sky" },
  { id: "rose",   color: "#f43f5e", label: "Rose" },
  { id: "amber",  color: "#f59e0b", label: "Amber" },
];

export function ThemeControls() {
  const { theme, mode, setTheme, toggleMode } = useTheme();

  return (
    <div className="theme-controls" aria-label="Appearance settings">
      {THEMES.map((t) => (
        <button
          key={t.id}
          className={`theme-dot${theme === t.id ? " active" : ""}`}
          style={{ background: t.color }}
          onClick={() => setTheme(t.id)}
          title={`${t.label} theme`}
          aria-label={`${t.label} theme${theme === t.id ? " (active)" : ""}`}
        />
      ))}
      <button
        className="mode-toggle"
        onClick={toggleMode}
        title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
        aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {mode === "light" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}
