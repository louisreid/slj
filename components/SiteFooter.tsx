import {
  COURSE_TITLE,
  DIGITAL_EDITION_NOTICE,
  SITE_COPYRIGHT_LINES,
} from "@/lib/site-branding";

export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`border-t border-[var(--slj-border)] px-4 py-8 md:px-8 ${className}`}
    >
      <div className="mx-auto max-w-3xl space-y-4 font-sans text-xs leading-relaxed text-[var(--slj-text-muted)]">
        <p className="slj-faint font-medium uppercase tracking-[0.14em]">
          {COURSE_TITLE}
        </p>
        {SITE_COPYRIGHT_LINES.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p>{DIGITAL_EDITION_NOTICE}</p>
      </div>
    </footer>
  );
}
