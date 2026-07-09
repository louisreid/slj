"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  buildCourseSearchIndex,
  searchCourseIndex,
  type CourseSearchHit,
} from "@/lib/course-search-index";

export function CourseSearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const index = useMemo(() => buildCourseSearchIndex(), []);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const results = useMemo(
    () => searchCourseIndex(index, query, 50),
    [index, query]
  );

  return (
    <div className="mx-auto max-w-3xl">
      <p className="slj-faint font-sans text-xs uppercase tracking-[0.18em]">
        Search
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-[var(--slj-text)]">
        Search the course
      </h1>
      <p className="slj-muted mt-3 font-sans text-sm leading-6">
        Find a phrase across all chapters. Results link to the matching passage.
      </p>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search…"
        autoFocus
        className="slj-input mt-8 w-full px-4 py-3 font-sans text-base"
        aria-label="Search course"
      />
      {query.trim().length > 1 && results.length === 0 ? (
        <p className="slj-muted mt-8 font-sans text-sm">No matches for “{query}”.</p>
      ) : null}
      {results.length > 0 ? (
        <ul className="mt-8 space-y-3">
          {results.map((hit) => (
            <li key={`${hit.chapterId}-${hit.blockId}`}>
              <SearchResultCard hit={hit} query={query} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function SearchResultCard({ hit, query }: { hit: CourseSearchHit; query: string }) {
  return (
    <Link
      href={`/course/${hit.chapterId}#${hit.blockId}`}
      className="block border border-[var(--slj-border)] bg-[var(--slj-surface)] p-5 transition-colors hover:bg-[var(--slj-hover)]"
    >
      <p className="slj-faint font-sans text-[11px] uppercase tracking-[0.16em]">
        {hit.chapterTitle}
        {hit.sectionHeading ? ` · ${hit.sectionHeading}` : ""}
      </p>
      <p className="mt-2 font-serif text-lg leading-relaxed text-[var(--slj-text)]">
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
    pattern.test(part) ? (
      <mark key={i} className="bg-[var(--slj-hover)] font-medium">
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
