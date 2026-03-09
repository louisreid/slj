"use client";

import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[var(--slj-border)] bg-[var(--slj-surface)] p-1 text-xs">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`px-3 py-1 rounded-full transition-colors ${
          theme === "light"
            ? "bg-[var(--slj-button-bg)] text-[var(--slj-button-fg)]"
            : "slj-muted hover:text-[var(--slj-text)]"
        }`}
        aria-pressed={theme === "light"}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`px-3 py-1 rounded-full transition-colors ${
          theme === "dark"
            ? "bg-[var(--slj-button-bg)] text-[var(--slj-button-fg)]"
            : "slj-muted hover:text-[var(--slj-text)]"
        }`}
        aria-pressed={theme === "dark"}
      >
        Dark
      </button>
    </div>
  );
}

