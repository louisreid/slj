import Link from "next/link";
import { Printer } from "lucide-react";
import { PageShell } from "@/components/ui/surfaces";
import { getWorksheets } from "@/lib/worksheets";

export default async function WorksheetsPage() {
  const worksheets = getWorksheets();

  return (
    <PageShell className="max-w-4xl mx-auto">
      <div className="mb-12 border-b border-[var(--slj-border)] pb-8">
        <p className="slj-faint font-sans text-xs uppercase tracking-[0.18em]">
          Worksheets
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-none text-[var(--slj-text)] md:text-5xl">
          Worksheets
        </h1>
        <p className="slj-muted mt-4 max-w-2xl font-sans text-sm leading-6">
          Print-ready pages for reflection, discussion, and handwritten work
          away from the screen.
        </p>
      </div>

      <div className="overflow-hidden border border-[var(--slj-border)]">
        <div className="border-b border-[var(--slj-border)] px-6 py-4">
          <span className="slj-faint font-sans text-xs uppercase tracking-[0.18em]">
            All worksheets
          </span>
        </div>

        <div className="divide-y divide-[var(--slj-border)]">
          {worksheets.map((ws) => (
            <div
              key={ws.id}
              className="group flex flex-col items-start justify-between gap-4 p-6 transition-colors hover:bg-[var(--slj-hover)] sm:flex-row sm:items-center"
            >
              <div className="flex-1 space-y-1">
                <h2 className="font-serif text-2xl font-medium tracking-wide text-[var(--slj-text)]">
                  {ws.title}
                </h2>
                <p className="slj-muted font-sans text-sm leading-6">
                  {ws.description}
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <Link
                  href={`/worksheets/print/${ws.id}`}
                  className="slj-button inline-flex h-10 items-center justify-center px-5 text-xs uppercase tracking-[0.18em]"
                >
                  Open
                </Link>
                <Link
                  href={`/worksheets/print/${ws.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="slj-button-secondary inline-flex h-10 items-center justify-center px-5 text-xs uppercase tracking-[0.18em]"
                >
                  Print
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="no-print mt-12 flex items-center gap-6 border border-[var(--slj-border)] p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[var(--slj-border)]">
          <Printer size={24} className="slj-faint" aria-hidden />
        </div>
        <div>
          <h3 className="slj-faint font-sans text-sm uppercase tracking-[0.18em]">
            Optimized for Paper
          </h3>
          <p className="slj-muted mt-2 font-sans text-sm leading-6">
            Each worksheet opens in a print view with generous margins and
            writing space.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
