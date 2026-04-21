"use client";

import { useTheme, type ReaderFont } from "@/components/ThemeProvider";

const READER_FONT_OPTIONS: Array<{ value: ReaderFont; label: string; note: string }> = [
  {
    value: "source-serif",
    label: "Source Serif 4 (recommended)",
    note: "Stronger, more readable for long-form reading.",
  },
  {
    value: "literata",
    label: "Literata",
    note: "Warm digital book feel.",
  },
  {
    value: "cormorant",
    label: "Cormorant Garamond (original)",
    note: "Current classic style for comparison.",
  },
];

export function ReaderFontToggle() {
  const { readerFont, setReaderFont } = useTheme();

  return (
    <div className="space-y-2" role="radiogroup" aria-label="Reader font">
      {READER_FONT_OPTIONS.map((option) => {
        const isActive = readerFont === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setReaderFont(option.value)}
            className={`w-full border px-3 py-2.5 text-left transition-colors ${
              isActive
                ? "border-[var(--slj-text)] bg-[var(--slj-hover)]"
                : "border-[var(--slj-border)] bg-[var(--slj-surface)] hover:bg-[var(--slj-hover)]"
            }`}
            role="radio"
            aria-checked={isActive}
          >
            <p className="font-sans text-sm font-medium text-[var(--slj-text)]">{option.label}</p>
            <p className="slj-muted mt-1 font-sans text-xs">{option.note}</p>
          </button>
        );
      })}
    </div>
  );
}
