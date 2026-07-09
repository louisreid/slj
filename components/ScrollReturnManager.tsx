"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import {
  clearScrollReturn,
  consumePendingScrollRestore,
  getAppScrollParent,
  loadScrollReturn,
  restoreScrollPosition,
} from "@/lib/scroll-return";
import { clearSearchReturn } from "@/lib/search-return";

/** Restores scroll position when returning from footnotes; clears stale state on direct nav. */
export function ScrollReturnManager() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollParent = getAppScrollParent();
    const hash = window.location.hash.slice(1);
    const pending = consumePendingScrollRestore();
    const saved = loadScrollReturn();

    if (pending && saved && saved.path === pathname) {
      restoreScrollPosition(scrollParent, saved.scrollTop, saved.hash || hash || undefined);
      return;
    }

    if (hash) {
      restoreScrollPosition(scrollParent, 0, hash);
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor?.href) return;
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      if (url.pathname.startsWith("/course/") && url.pathname !== pathname) {
        const isChapterNav =
          anchor.closest("aside") != null ||
          anchor.getAttribute("href")?.match(/^\/course\/[^#]+$/);
        if (isChapterNav) {
          clearScrollReturn();
          clearSearchReturn();
        }
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return null;
}

export function saveScrollBeforeNavigate(): void {
  clearScrollReturn();
}
