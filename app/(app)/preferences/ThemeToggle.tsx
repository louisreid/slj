"use client";

import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[#E5E7EB] bg-white p-1 text-xs">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`px-3 py-1 rounded-full transition-colors ${
          theme === "light"
            ? "bg-black text-white"
            : "text-black/65 hover:text-black"
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
            ? "bg-black text-white"
            : "text-black/65 hover:text-black"
        }`}
        aria-pressed={theme === "dark"}
      >
        Dark
      </button>
    </div>
  );
}

