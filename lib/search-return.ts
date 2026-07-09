export const SEARCH_RETURN_KEY = "slj-search-return";

export interface SearchReturnState {
  href: string;
  query: string;
}

export function saveSearchReturn(query: string): void {
  if (typeof window === "undefined") return;
  const trimmed = query.trim();
  if (!trimmed) return;
  const state: SearchReturnState = {
    href: `/search?q=${encodeURIComponent(trimmed)}`,
    query: trimmed,
  };
  sessionStorage.setItem(SEARCH_RETURN_KEY, JSON.stringify(state));
}

export function loadSearchReturn(): SearchReturnState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SEARCH_RETURN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SearchReturnState;
  } catch {
    return null;
  }
}

export function clearSearchReturn(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SEARCH_RETURN_KEY);
}
