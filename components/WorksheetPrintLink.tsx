"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import type { ReactNode } from "react";
import {
  useWorksheetReturnTo,
  worksheetHrefWithReturn,
} from "@/components/ReaderLocationContext";
import {
  extractWorksheetLinks,
  type WorksheetLinkRef,
} from "@/lib/worksheet-links";

const PRINT_PATH_RE = /^\/worksheets\/print\/([^/?#]+)/;

export function isWorksheetPrintHref(href: string): boolean {
  return PRINT_PATH_RE.test(href);
}

type WorksheetCalloutProps = {
  worksheet: WorksheetLinkRef;
};

export function WorksheetCallout({ worksheet }: WorksheetCalloutProps) {
  const returnTo = useWorksheetReturnTo();
  const openHref = worksheetHrefWithReturn(worksheet.href, returnTo);

  return (
    <div
      className="slj-worksheet-callout my-4 border border-[var(--slj-border)] bg-[var(--slj-hover)] px-5 py-4"
      role="region"
      aria-label={`${worksheet.label} worksheet`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--slj-border)] bg-[var(--slj-bg)]">
            <Printer size={20} className="slj-faint" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="font-serif text-xl font-medium tracking-wide text-[var(--slj-text)] md:text-2xl">
              {worksheet.label}
            </p>
            <p className="slj-muted mt-1 font-sans text-sm">Print-ready worksheet</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-3">
          <Link
            href={openHref}
            className="slj-button inline-flex h-10 min-w-[5.5rem] items-center justify-center px-5 text-xs uppercase tracking-[0.18em]"
          >
            Open
          </Link>
          <Link
            href={openHref}
            target="_blank"
            rel="noopener noreferrer"
            className="slj-button-secondary inline-flex h-10 min-w-[5.5rem] items-center justify-center px-5 text-xs uppercase tracking-[0.18em]"
          >
            Print
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Paragraph or list text with prominent worksheet callouts (Open / Print). */
export function renderContentWithWorksheetCallouts(
  text: string,
  renderProse: (prose: string) => ReactNode
): ReactNode {
  const { prose, worksheets } = extractWorksheetLinks(text);
  if (worksheets.length === 0) {
    return renderProse(text);
  }

  return (
    <>
      {prose ? renderProse(prose) : null}
      {worksheets.map((ws) => (
        <WorksheetCallout key={ws.id} worksheet={ws} />
      ))}
    </>
  );
}
