"use client";

import Link from "next/link";
import { isSafeCourseReturnPath } from "@/lib/worksheet-return";
import { clearScrollReturn } from "@/lib/scroll-return";
import { clearSearchReturn } from "@/lib/search-return";

export function WorksheetPrintBackLink({
  returnTo,
}: {
  returnTo: string | undefined;
}) {
  const backHref = isSafeCourseReturnPath(returnTo) ? returnTo : "/worksheets";
  const backLabel = isSafeCourseReturnPath(returnTo)
    ? "← Back to course"
    : "← Back to worksheets";

  return (
    <Link
      href={backHref}
      onClick={() => {
        clearScrollReturn();
        clearSearchReturn();
      }}
      className="mt-2 inline-block font-sans text-sm font-medium text-[var(--slj-text-muted)] hover:text-[var(--slj-text)]"
    >
      {backLabel}
    </Link>
  );
}
