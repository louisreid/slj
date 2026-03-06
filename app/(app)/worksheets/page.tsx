import Link from "next/link";
import { Printer } from "lucide-react";
import { PageShell } from "@/components/ui/surfaces";

const PLACEHOLDER_WORKSHEETS = [
  {
    id: "practicing-presence",
    title: "Practicing Presence",
    description: "Exploring the architecture of mindfulness in daily life.",
  },
  {
    id: "justice-everyday",
    title: "Justice in the Everyday",
    description:
      "A guide to ethical living and community responsibility.",
  },
  {
    id: "architecture-of-love",
    title: "The Architecture of Love",
    description:
      "Reframing relationships through the lens of radical kindness.",
  },
  {
    id: "minimalist-stewardship",
    title: "Minimalist Stewardship",
    description: "Lessons on owning less and being more.",
  },
  {
    id: "morning-contemplation",
    title: "Morning Contemplation Guide",
    description: "Rhythms for beginning the day with intention.",
  },
];

export default function WorksheetsPage() {
  return (
    <PageShell className="max-w-4xl mx-auto">
      {/* Page header — Stitch-style */}
      <div className="mb-12 text-center md:text-left">
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Worksheets
        </h2>
        <p className="mt-4 text-lg text-white/55 max-w-2xl font-light leading-relaxed">
          A collection of contemplative resources designed for quiet
          reflection, ethical living, and simple printing.
        </p>
      </div>

      {/* Surface container with list — Stitch-style */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-sm">
        {/* Category tab (single for now) */}
        <div className="flex border-b border-white/10 px-6">
          <span className="border-b-2 border-white py-4 px-4 text-sm font-bold tracking-wide text-white">
            All Resources
          </span>
        </div>

        {/* Worksheet list */}
        <div className="divide-y divide-white/10">
          {PLACEHOLDER_WORKSHEETS.map((ws) => (
            <div
              key={ws.id}
              className="group flex flex-col items-start justify-between gap-4 p-6 transition-colors hover:bg-white/5 sm:flex-row sm:items-center"
            >
              <div className="flex-1 space-y-1">
                <h3 className="font-serif text-xl font-medium tracking-wide text-white">
                  {ws.title}
                </h3>
                <p className="font-sans text-sm text-white/55">{ws.description}</p>
              </div>
              <div className="flex shrink-0 gap-3">
                <Link
                  href={`/worksheets/print/${ws.id}`}
                  className="font-sans inline-flex h-10 items-center justify-center rounded bg-white px-5 text-xs font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-90"
                >
                  View / Print
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Print hint — Stitch-style */}
      <div className="no-print mt-12 flex items-center gap-6 rounded-lg bg-white/5 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
          <Printer size={24} className="text-white/70" aria-hidden />
        </div>
        <div>
          <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-white">
            Optimized for Paper
          </h4>
          <p className="mt-1 text-sm text-white/55 leading-relaxed">
            All worksheets automatically switch to a high-contrast,
            ink-saving print view when you select Print or View PDF.
            Designed for quiet reading away from screens.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
