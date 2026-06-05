"use client";

import { useEffect } from "react";

/** Opens the browser print dialog when `?autoprint=1` is present. */
export function WorksheetAutoPrint({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => {
      window.print();
    }, 300);
    return () => window.clearTimeout(timer);
  }, [enabled]);

  return null;
}
