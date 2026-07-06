"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  clearScrollReturn,
  loadScrollReturn,
  type ScrollReturnState,
} from "@/lib/scroll-return";

export function ReturnToReadingButton() {
  const pathname = usePathname();
  const [saved, setSaved] = useState<ScrollReturnState | null>(null);

  useEffect(() => {
    const state = loadScrollReturn();
    if (!state) {
      setSaved(null);
      return;
    }
    const current = `${pathname}${typeof window !== "undefined" ? window.location.hash : ""}`;
    const savedPath = `${state.path}${state.hash ? `#${state.hash}` : ""}`;
    setSaved(current !== savedPath ? state : null);
  }, [pathname]);

  const dismiss = useCallback(() => {
    clearScrollReturn();
    setSaved(null);
  }, []);

  if (!saved) return null;

  const href = `${saved.path}${saved.hash ? `#${saved.hash}` : ""}`;

  return (
    <div
      className="fixed right-4 top-4 z-50 flex max-w-xs items-start gap-2 border border-[var(--slj-border)] bg-[var(--slj-surface)] px-3 py-2 font-sans text-sm shadow-sm"
      role="status"
    >
      <Link
        href={href}
        className="flex-1 underline underline-offset-4 hover:text-[var(--slj-text)]"
      >
        Return to where you were reading
      </Link>
      <button
        type="button"
        onClick={dismiss}
        className="slj-faint shrink-0 px-1 hover:text-[var(--slj-text)]"
        aria-label="Dismiss return link"
      >
        ×
      </button>
    </div>
  );
}
