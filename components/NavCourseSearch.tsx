"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function NavCourseSearch({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();

  const handleFocus = useCallback(() => {
    onNavigate?.();
    router.push("/search");
  }, [onNavigate, router]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.length > 0) {
        onNavigate?.();
        router.push(`/search?q=${encodeURIComponent(value)}`);
      }
    },
    [onNavigate, router]
  );

  return (
    <div className="mt-4 shrink-0 border-t border-[var(--slj-border)] pt-3">
      <label className="slj-faint mb-2 block font-sans text-[11px] uppercase tracking-[0.16em]">
        Search course
      </label>
      <input
        type="search"
        onFocus={handleFocus}
        onChange={handleChange}
        placeholder="Search all chapters…"
        className="slj-input w-full px-3 py-2 font-sans text-sm"
        aria-label="Search course"
      />
      <Link
        href="/search"
        onClick={onNavigate}
        className="slj-muted mt-2 block font-sans text-xs underline underline-offset-4 hover:text-[var(--slj-text)]"
      >
        Open full search
      </Link>
    </div>
  );
}
