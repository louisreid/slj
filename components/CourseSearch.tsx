"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  buildCourseSearchIndex,
  searchCourseIndex,
  type CourseSearchHit,
} from "@/lib/course-search-index";

export function CourseSearch({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState("");
  const index = useMemo(() => buildCourseSearchIndex(), []);
  const results = useMemo(
    () => searchCourseIndex(index, query),
    [index, query]
  );

  return (
    <div className="mt-4 border-t border-[var(--slj-border)] pt-3">
      <label className="slj-faint mb-2 block font-sans text-[11px] uppercase tracking-[0.16em]">
        Search course
      </label>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search all chapters…"
        className="slj-input w-full px-3 py-2 font-sans text-sm"
        aria-label="Search course"
      />
      {query.trim().length > 1 && results.length > 0 ? (
        <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto">
          {results.map((hit) => (
            <li key={`${hit.chapterId}-${hit.blockId}`}>
              <SearchResultLink hit={hit} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      ) : null}
      {query.trim().length > 1 && results.length === 0 ? (
        <p className="slj-muted mt-2 font-sans text-xs">No matches.</p>
      ) : null}
    </div>
  );
}

function SearchResultLink({
  hit,
  onNavigate,
}: {
  hit: CourseSearchHit;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={`/course/${hit.chapterId}#${hit.blockId}`}
      onClick={onNavigate}
      className="block border-l-2 border-transparent px-2 py-1.5 text-xs leading-snug text-[var(--slj-text-muted)] hover:border-[var(--slj-text)] hover:text-[var(--slj-text)]"
    >
      <span className="slj-faint block text-[10px] uppercase tracking-[0.14em]">
        {hit.chapterTitle}
      </span>
      <span className="line-clamp-2">{hit.snippet}</span>
    </Link>
  );
}
