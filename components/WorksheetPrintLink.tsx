"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import {
  useWorksheetReturnTo,
  worksheetHrefWithReturn,
} from "@/components/ReaderLocationContext";

const PRINT_PATH_RE = /^\/worksheets\/print\/([^/?#]+)/;

export function isWorksheetPrintHref(href: string): boolean {
  return PRINT_PATH_RE.test(href);
}

function worksheetTitleFromHref(href: string): string {
  const m = href.match(PRINT_PATH_RE);
  if (!m) return "worksheet";
  return m[1]
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

type WorksheetPrintLinkProps = {
  href: string;
  /** Visible label; omit for icon-only inline link. */
  label?: string;
};

export function WorksheetPrintLink({ href, label }: WorksheetPrintLinkProps) {
  const returnTo = useWorksheetReturnTo();
  const linkHref = worksheetHrefWithReturn(href, returnTo);
  const title = worksheetTitleFromHref(href);
  const ariaLabel = label?.trim()
    ? label
    : `Print ${title} worksheet`;
  const openInNewTab = returnTo == null;

  if (label?.trim()) {
    return (
      <Link
        href={linkHref}
        className="inline-flex items-center gap-1.5 underline decoration-1 underline-offset-[0.15em] hover:text-[var(--slj-text-muted)]"
      >
        <Printer size={15} className="shrink-0" aria-hidden />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={linkHref}
      {...(openInNewTab
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="mx-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center align-[-0.2em] border border-[var(--slj-border)] bg-[var(--slj-hover)] text-[var(--slj-text-muted)] transition-colors hover:border-[var(--slj-text-muted)] hover:text-[var(--slj-text)]"
    >
      <Printer size={16} strokeWidth={1.75} aria-hidden />
    </Link>
  );
}
