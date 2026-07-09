"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  clearSearchReturn,
  loadSearchReturn,
  type SearchReturnState,
} from "@/lib/search-return";

export function BackToSearchButton() {
  const pathname = usePathname();
  const [saved, setSaved] = useState<SearchReturnState | null>(null);

  useEffect(() => {
    const state = loadSearchReturn();
    const onCourse = (pathname ?? "").startsWith("/course/");
    setSaved(onCourse && state ? state : null);
  }, [pathname]);

  const dismiss = useCallback(() => {
    clearSearchReturn();
    setSaved(null);
  }, []);

  if (!saved) return null;

  return (
    <div
      className="fixed right-4 top-[4.75rem] z-50 flex max-w-sm items-center gap-3 border border-[var(--slj-border)] bg-[var(--slj-surface)] px-4 py-3 font-sans text-sm shadow-md"
      role="status"
    >
      <Link
        href={saved.href}
        className="flex-1 leading-snug underline underline-offset-4 hover:text-[var(--slj-text)]"
      >
        Back to search results
      </Link>
      <button
        type="button"
        onClick={dismiss}
        className="flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--slj-border)] text-lg leading-none text-[var(--slj-text-muted)] hover:bg-[var(--slj-hover)] hover:text-[var(--slj-text)]"
        aria-label="Dismiss search return link"
      >
        ×
      </button>
    </div>
  );
}
