"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import {
  buildCourseSearchIndex,
  searchCourseIndex,
  type CourseSearchHit,
} from "@/lib/course-search-index";
import {
  isSearchResultVisited,
  markSearchResultVisited,
  saveSearchReturn,
} from "@/lib/search-return";

export function CourseSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") ?? "";
  const highlightBlockId = searchParams?.get("r") ?? null;
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useMemo(() => buildCourseSearchIndex(), []);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
      const len = inputRef.current?.value.length ?? 0;
      inputRef.current?.setSelectionRange(len, len);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const syncQueryToUrl = useCallback(
    (value: string) => {
      const href = value.trim()
        ? `/search?q=${encodeURIComponent(value.trim())}`
        : "/search";
      router.replace(href, { scroll: false });
    },
    [router]
  );

  const results = useMemo(
    () => searchCourseIndex(index, query, 50),
    [index, query]
  );

  useEffect(() => {
    if (!highlightBlockId || results.length === 0) return;
    const id = requestAnimationFrame(() => {
      const el = document.getElementById(`search-result-${highlightBlockId}`);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [highlightBlockId, results]);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="slj-faint font-sans text-xs uppercase tracking-[0.18em]">
        Search
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-[var(--slj-text)]">
        Search the course
      </h1>
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          syncQueryToUrl(e.target.value);
        }}
        placeholder="Search all chapters…"
        className="slj-input mt-8 w-full px-4 py-3 font-sans text-base"
        aria-label="Search all chapters"
      />
      {query.trim().length > 1 && results.length === 0 ? (
        <p className="slj-muted mt-8 font-sans text-sm">No matches for “{query}”.</p>
      ) : null}
      {results.length > 0 ? (
        <ul className="mt-8 space-y-3">
          {results.map((hit) => (
            <li
              key={`${hit.chapterId}-${hit.blockId}`}
              id={`search-result-${hit.blockId}`}
              className={
                highlightBlockId === hit.blockId
                  ? "scroll-mt-24 ring-2 ring-[var(--slj-focus)]"
                  : "scroll-mt-24"
              }
            >
              <SearchResultCard hit={hit} query={query} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function SearchResultCard({ hit, query }: { hit: CourseSearchHit; query: string }) {
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    setVisited(isSearchResultVisited(hit.chapterId, hit.blockId));
  }, [hit.chapterId, hit.blockId]);

  const handleClick = useCallback(() => {
    markSearchResultVisited(hit.chapterId, hit.blockId);
    saveSearchReturn(query, hit.blockId);
    setVisited(true);
  }, [hit.chapterId, hit.blockId, query]);

  return (
    <Link
      href={`/course/${hit.chapterId}#${hit.blockId}`}
      onClick={handleClick}
      className={`slj-search-result block border border-[var(--slj-border)] bg-[var(--slj-surface)] p-5 transition-colors hover:bg-[var(--slj-hover)] ${
        visited ? "slj-search-result--visited" : ""
      }`}
    >
      <div className="space-y-1 font-sans text-sm leading-snug">
        {hit.sessionLabel ? (
          <p className="slj-faint text-[11px] uppercase tracking-[0.16em]">
            {hit.sessionLabel}
          </p>
        ) : null}
        <p className="font-medium text-[var(--slj-text)]">{hit.chapterDisplayTitle}</p>
        {hit.sectionHeading ? (
          <p className="slj-muted text-xs">
            Under <span className="text-[var(--slj-text)]">{hit.sectionHeading}</span>
          </p>
        ) : null}
      </div>
      <p className="slj-search-result__snippet mt-3 font-serif text-lg leading-relaxed">
        {highlightQuery(hit.snippet, query)}
      </p>
    </Link>
  );
}

function highlightQuery(text: string, query: string): React.ReactNode {
  const tokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  if (tokens.length === 0) return text;
  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    tokens.some((token) => part.toLowerCase() === token) ? (
      <mark key={i} className="bg-[var(--slj-hover)] font-medium text-[var(--slj-text)]">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
