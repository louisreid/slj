import { CardSection, PageShell } from "@/components/ui/surfaces";

export default function WorksheetsPage() {
  return (
    <PageShell>
      <p className="text-xs uppercase tracking-[0.16em] text-white/55">Printable</p>
      <h1 className="mt-2 text-3xl font-semibold text-white font-serif">Worksheets</h1>
      <p className="mt-2 text-white/70">
        Print-only worksheets for in-person writing and discussion.
      </p>
      <CardSection className="mt-6">
        <p className="text-sm text-white/70">
          Worksheet files are prepared for print output only and intentionally
          avoid app navigation chrome.
        </p>
      </CardSection>
    </PageShell>
  );
}
