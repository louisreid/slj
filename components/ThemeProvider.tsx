"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";
export type ReaderFont = "source-serif" | "literata" | "cormorant";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  readerFont: ReaderFont;
  setReaderFont: (font: ReaderFont) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = "slj-theme";
const READER_FONT_STORAGE_KEY = "slj-reader-font";

function isReaderFont(value: string | null): value is ReaderFont {
  return value === "source-serif" || value === "literata" || value === "cormorant";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [readerFont, setReaderFontState] = useState<ReaderFont>("source-serif");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
      document.documentElement.dataset.theme = stored;
    } else {
      setThemeState("light");
      document.documentElement.dataset.theme = "light";
    }

    const storedReaderFont = window.localStorage.getItem(READER_FONT_STORAGE_KEY);
    const selectedReaderFont = isReaderFont(storedReaderFont)
      ? storedReaderFont
      : "source-serif";
    setReaderFontState(selectedReaderFont);
    document.documentElement.dataset.readerFont = selectedReaderFont;
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    }
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = next;
    }
  }, []);

  const setReaderFont = useCallback((next: ReaderFont) => {
    setReaderFontState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(READER_FONT_STORAGE_KEY, next);
    }
    if (typeof document !== "undefined") {
      document.documentElement.dataset.readerFont = next;
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, readerFont, setReaderFont }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

