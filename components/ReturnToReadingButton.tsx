"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  clearScrollReturn,
  loadScrollReturn,
  markPendingScrollRestore,
  type ScrollReturnState,
} from "@/lib/scroll-return";

export function ReturnToReadingButton() {
  const pathname = usePathname();
  const [saved, setSaved] = useState<ScrollReturnState | null>(null);

  useEffect(() => {
    const state = loadScrollReturn();
    if (!state || state.source !== "footnote") {
      setSaved(null);
      return;
    }
    const current = `${pathname ?? ""}${typeof window !== "undefined" ? window.location.hash : ""}`;
    const savedPath = `${state.path}${state.hash ? `#${state.hash}` : ""}`;
    const onReferences = (pathname ?? "").startsWith("/course/29-references");
    setSaved(current !== savedPath && onReferences ? state : null);
  }, [pathname]);

  const dismiss = useCallback(() => {
    clearScrollReturn();
    setSaved(null);
  }, []);

  if (!saved) return null;

  const href = `${saved.path}${saved.hash ? `#${saved.hash}` : ""}`;

  return (
    <div
      className="fixed right-4 top-4 z-50 flex max-w-sm items-center gap-3 border border-[var(--slj-border)] bg-[var(--slj-surface)] px-4 py-3 font-sans text-sm shadow-md"
      role="status"
    >
      <Link
        href={href}
        onClick={markPendingScrollRestore}
        className="flex-1 leading-snug underline underline-offset-4 hover:text-[var(--slj-text)]"
      >
        Return to where you were reading
      </Link>
      <button
        type="button"
        onClick={dismiss}
        className="flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--slj-border)] text-lg leading-none text-[var(--slj-text-muted)] hover:bg-[var(--slj-hover)] hover:text-[var(--slj-text)]"
        aria-label="Dismiss return link"
      >
        ×
      </button>
    </div>
  );
}
