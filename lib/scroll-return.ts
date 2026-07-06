export const SCROLL_RETURN_KEY = "slj-scroll-return";

export interface ScrollReturnState {
  path: string;
  hash: string;
  scrollTop: number;
  savedAt: number;
}

export function saveScrollReturn(
  scrollParent: HTMLElement | null,
  path: string,
  hash = ""
): void {
  if (typeof window === "undefined") return;
  const scrollTop = scrollParent?.scrollTop ?? window.scrollY;
  const state: ScrollReturnState = {
    path,
    hash,
    scrollTop,
    savedAt: Date.now(),
  };
  sessionStorage.setItem(SCROLL_RETURN_KEY, JSON.stringify(state));
}

export function loadScrollReturn(): ScrollReturnState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SCROLL_RETURN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ScrollReturnState;
  } catch {
    return null;
  }
}

export function clearScrollReturn(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SCROLL_RETURN_KEY);
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
        el.scrollIntoView({ block: "start" });
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
