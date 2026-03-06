import Link from "next/link";
import { Printer } from "lucide-react";
import { PageShell } from "@/components/ui/surfaces";
import { getWorksheets } from "@/lib/worksheets";

export default async function WorksheetsPage() {
  const worksheets = getWorksheets();

  return (
    <PageShell className="max-w-4xl mx-auto">
      <div className="mb-12 border-b border-[#E5E7EB] pb-8">
        <p className="font-sans text-xs uppercase tracking-[0.18em] text-black/45">
          Worksheets
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-none text-black md:text-5xl">
          Worksheets
        </h1>
        <p className="mt-4 max-w-2xl font-sans text-sm leading-6 text-black/65">
          Print-ready pages for reflection, discussion, and handwritten work
          away from the screen.
        </p>
      </div>

      <div className="overflow-hidden border border-[#E5E7EB]">
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <span className="font-sans text-xs uppercase tracking-[0.18em] text-black/45">
            All worksheets
          </span>
        </div>

        <div className="divide-y divide-[#E5E7EB]">
          {worksheets.map((ws) => (
            <div
              key={ws.id}
              className="group flex flex-col items-start justify-between gap-4 p-6 transition-colors hover:bg-black/5 sm:flex-row sm:items-center"
            >
              <div className="flex-1 space-y-1">
                <h2 className="font-serif text-2xl font-medium tracking-wide text-black">
                  {ws.title}
                </h2>
                <p className="font-sans text-sm leading-6 text-black/65">
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

      <div className="no-print mt-12 flex items-center gap-6 border border-[#E5E7EB] p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#E5E7EB]">
          <Printer size={24} className="text-black/45" aria-hidden />
        </div>
        <div>
          <h3 className="font-sans text-sm uppercase tracking-[0.18em] text-black/45">
            Optimized for Paper
          </h3>
          <p className="mt-2 font-sans text-sm leading-6 text-black/65">
            Each worksheet opens in a print view with generous margins and
            writing space.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
