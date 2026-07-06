"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  getAppScrollParent,
  restoreScrollPosition,
  saveScrollReturn,
} from "@/lib/scroll-return";

/** Saves scroll position when leaving course pages; restores hash/scroll on return. */
export function ScrollReturnManager() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollParent = getAppScrollParent();
    const hash = window.location.hash.slice(1);
    const savedScroll = scrollParent?.dataset.restoreScroll;
    if (savedScroll) {
      const top = Number(savedScroll);
      delete scrollParent.dataset.restoreScroll;
      restoreScrollPosition(scrollParent, top, hash || undefined);
      return;
    }
    if (hash) {
      restoreScrollPosition(scrollParent, 0, hash);
    }
  }, [pathname]);

  useEffect(() => {
    const scrollParent = getAppScrollParent();

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor || !anchor.href) return;
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      const leavingCourse = window.location.pathname.startsWith("/course/");
      const sameChapter =
        url.pathname === window.location.pathname &&
        !url.pathname.startsWith("/worksheets/");
      if (leavingCourse && !sameChapter) {
        saveScrollReturn(
          scrollParent,
          window.location.pathname,
          window.location.hash.slice(1)
        );
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

export function saveScrollBeforeNavigate(): void {
  const scrollParent = getAppScrollParent();
  saveScrollReturn(
    scrollParent,
    window.location.pathname,
    window.location.hash.slice(1)
  );
}
