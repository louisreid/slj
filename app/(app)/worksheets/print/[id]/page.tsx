import { PageShell } from "@/components/ui/surfaces";

const PLACEHOLDER_TITLES: Record<string, string> = {
  "practicing-presence": "Practicing Presence",
  "justice-everyday": "Justice in the Everyday",
  "architecture-of-love": "The Architecture of Love",
  "minimalist-stewardship": "Minimalist Stewardship",
  "morning-contemplation": "Morning Contemplation Guide",
};

export default async function WorksheetPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const title = PLACEHOLDER_TITLES[id] ?? "Worksheet";

  return (
    <PageShell className="max-w-2xl mx-auto">
      <div className="py-12">
        <h1 className="font-serif text-3xl font-semibold text-white">{title}</h1>
        <p className="mt-6 text-white/70">
          Print view will be available when worksheet content is added (T6).
          Use the browser&apos;s Print to save as PDF in the meantime.
        </p>
      </div>
    </PageShell>
  );
}
