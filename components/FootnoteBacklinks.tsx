"use client";

import Link from "next/link";
import type { FootnoteCitation } from "@/lib/footnote-citations";

export function FootnoteBacklinks({
  citations,
}: {
  citations: FootnoteCitation[];
}) {
  if (citations.length === 0) return null;

  return (
    <p className="slj-muted mt-2 font-sans text-xs leading-relaxed">
      Cited in:{" "}
      {citations.map((citation, index) => (
        <span key={`${citation.chapterId}-${citation.blockId}`}>
          {index > 0 ? ", " : null}
          <Link
            href={`/course/${citation.chapterId}#${citation.blockId}`}
            className="underline underline-offset-4 hover:text-[var(--slj-text)]"
          >
            {citation.chapterTitle}
          </Link>
        </span>
      ))}
    </p>
  );
}
