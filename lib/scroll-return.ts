export const SCROLL_RETURN_KEY = "slj-scroll-return";
export const PENDING_SCROLL_RESTORE_KEY = "slj-pending-scroll-restore";

export type ScrollReturnSource = "footnote";

export interface ScrollReturnState {
  path: string;
  hash: string;
  scrollTop: number;
  savedAt: number;
  source: ScrollReturnSource;
}

export function saveScrollReturn(
  scrollParent: HTMLElement | null,
  path: string,
  hash = "",
  source: ScrollReturnSource = "footnote"
): void {
  if (typeof window === "undefined") return;
  const scrollTop = scrollParent?.scrollTop ?? window.scrollY;
  const state: ScrollReturnState = {
    path,
    hash,
    scrollTop,
    savedAt: Date.now(),
    source,
  };
  sessionStorage.setItem(SCROLL_RETURN_KEY, JSON.stringify(state));
}

export function saveFootnoteScrollReturn(): void {
  if (typeof window === "undefined") return;
  const scrollParent = getAppScrollParent();
  const hash = window.location.hash.slice(1);
  const blockInView = findNearestBlockId(scrollParent);
  saveScrollReturn(
    scrollParent,
    window.location.pathname,
    blockInView ?? hash,
    "footnote"
  );
}

function findNearestBlockId(scrollParent: HTMLElement | null): string | undefined {
  if (!scrollParent) return undefined;
  const viewportTop = scrollParent.scrollTop + 80;
  const blocks = scrollParent.querySelectorAll<HTMLElement>("[data-block-id]");
  let best: { id: string; distance: number } | null = null;
  for (const el of blocks) {
    const id = el.dataset.blockId;
    if (!id) continue;
    const top = el.offsetTop;
    const distance = Math.abs(top - viewportTop);
    if (!best || distance < best.distance) {
      best = { id, distance };
    }
  }
  return best?.id;
}

export function loadScrollReturn(): ScrollReturnState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SCROLL_RETURN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ScrollReturnState;
    if (parsed.source !== "footnote") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearScrollReturn(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SCROLL_RETURN_KEY);
  sessionStorage.removeItem(PENDING_SCROLL_RESTORE_KEY);
}

export function markPendingScrollRestore(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_SCROLL_RESTORE_KEY, "1");
}

export function consumePendingScrollRestore(): boolean {
  if (typeof window === "undefined") return false;
  const pending = sessionStorage.getItem(PENDING_SCROLL_RESTORE_KEY) === "1";
  if (pending) sessionStorage.removeItem(PENDING_SCROLL_RESTORE_KEY);
  return pending;
}

export function getAppScrollParent(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.getElementById("app-main-scroll");
}

export function restoreScrollPosition(
  scrollParent: HTMLElement | null,
  scrollTop: number,
  hash?: string
): void {
  const apply = () => {
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ block: "start", behavior: "instant" in window ? "instant" : "auto" });
        return;
      }
    }
    if (scrollParent) {
      scrollParent.scrollTop = scrollTop;
    } else {
      window.scrollTo(0, scrollTop);
    }
  };
  requestAnimationFrame(() => {
    requestAnimationFrame(apply);
  });
}
