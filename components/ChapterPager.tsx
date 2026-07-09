"use client";

import Link from "next/link";
import { clearScrollReturn } from "@/lib/scroll-return";

export function ChapterPager({
  prevChapter,
  nextChapter,
  className = "",
}: {
  prevChapter: { id: string; title: string } | null;
  nextChapter: { id: string; title: string } | null;
  className?: string;
}) {
  const handleChapterNav = () => clearScrollReturn();

  return (
    <nav
      className={`flex justify-between border-[var(--slj-border)] font-sans text-sm ${className}`}
      aria-label="Chapter navigation"
    >
      <span>
        {prevChapter ? (
          <Link
            href={`/course/${prevChapter.id}`}
            prefetch
            onClick={handleChapterNav}
            className="slj-muted underline underline-offset-4 hover:text-[var(--slj-text)]"
          >
            ← Previous: {prevChapter.title}
          </Link>
        ) : (
          <span className="slj-faint">Previous</span>
        )}
      </span>
      <span>
        {nextChapter ? (
          <Link
            href={`/course/${nextChapter.id}`}
            prefetch
            onClick={handleChapterNav}
            className="slj-muted underline underline-offset-4 hover:text-[var(--slj-text)]"
          >
            Next: {nextChapter.title} →
          </Link>
        ) : (
          <span className="slj-faint">Next</span>
        )}
      </span>
    </nav>
  );
}
