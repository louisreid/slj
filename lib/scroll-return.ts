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

export function saveFootnoteScrollReturn(anchorBlockId?: string): void {
  if (typeof window === "undefined") return;
  const scrollParent = getAppScrollParent();
  saveScrollReturn(
    scrollParent,
    window.location.pathname,
    anchorBlockId ?? "",
    "footnote"
  );
}

export function resolveFootnoteAnchorBlockId(target: EventTarget | null): string | undefined {
  if (!(target instanceof HTMLElement)) return undefined;
  const row = target.closest("[data-block-row]");
  if (row instanceof HTMLElement && row.dataset.blockRow) {
    return row.dataset.blockRow;
  }
  const block = target.closest("[data-block-id]");
  if (block instanceof HTMLElement && block.dataset.blockId) {
    return block.dataset.blockId;
  }
  const byId = target.closest("[id]");
  if (byId?.id) return byId.id;
  return undefined;
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

export function scrollBlockInContainer(
  scrollParent: HTMLElement | null,
  blockId: string,
  offsetFromTop = 96
): boolean {
  if (!scrollParent || !blockId) return false;
  const el = document.getElementById(blockId);
  if (!el) return false;
  const parentRect = scrollParent.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  scrollParent.scrollTop += elRect.top - parentRect.top - offsetFromTop;
  return true;
}

export function restoreScrollPosition(
  scrollParent: HTMLElement | null,
  scrollTop: number,
  hash?: string
): void {
  const applyScrollTop = () => {
    if (scrollParent) {
      scrollParent.scrollTop = scrollTop;
    } else {
      window.scrollTo(0, scrollTop);
    }
  };

  const tryRestore = (attemptsLeft: number) => {
    if (hash && scrollParent && scrollBlockInContainer(scrollParent, hash)) {
      return;
    }
    if (hash && attemptsLeft > 0) {
      setTimeout(() => tryRestore(attemptsLeft - 1), 50);
      return;
    }
    applyScrollTop();
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => tryRestore(12));
  });
}
