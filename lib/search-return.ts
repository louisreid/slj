export const SEARCH_RETURN_KEY = "slj-search-return";
export const SEARCH_VISITED_KEY = "slj-search-visited";

export interface SearchReturnState {
  href: string;
  query: string;
  blockId: string;
}

export function searchResultKey(chapterId: string, blockId: string): string {
  return `${chapterId}:${blockId}`;
}

export function saveSearchReturn(query: string, blockId: string): void {
  if (typeof window === "undefined") return;
  const trimmed = query.trim();
  if (!trimmed || !blockId) return;
  const state: SearchReturnState = {
    href: `/search?q=${encodeURIComponent(trimmed)}&r=${encodeURIComponent(blockId)}`,
    query: trimmed,
    blockId,
  };
  sessionStorage.setItem(SEARCH_RETURN_KEY, JSON.stringify(state));
}

export function loadSearchReturn(): SearchReturnState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SEARCH_RETURN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SearchReturnState;
    if (!parsed.query || !parsed.blockId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSearchReturn(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SEARCH_RETURN_KEY);
}

export function loadVisitedSearchResults(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(SEARCH_VISITED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function markSearchResultVisited(chapterId: string, blockId: string): void {
  if (typeof window === "undefined") return;
  const key = searchResultKey(chapterId, blockId);
  const visited = loadVisitedSearchResults();
  if (visited.has(key)) return;
  visited.add(key);
  sessionStorage.setItem(SEARCH_VISITED_KEY, JSON.stringify([...visited]));
}

export function isSearchResultVisited(chapterId: string, blockId: string): boolean {
  return loadVisitedSearchResults().has(searchResultKey(chapterId, blockId));
}
