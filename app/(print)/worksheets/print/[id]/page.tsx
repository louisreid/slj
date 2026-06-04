import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReactElement } from "react";
import { getWorksheet } from "@/lib/worksheets";
import { ThingsToChangeWorksheet } from "@/components/worksheets/ThingsToChangeWorksheet";
import { BudgetingMoneyAuditWorksheet } from "@/components/worksheets/BudgetingMoneyAuditWorksheet";
import { TimeSheetWorksheet } from "@/components/worksheets/TimeSheetWorksheet";
import { TimeCirclesWorksheet } from "@/components/worksheets/TimeCirclesWorksheet";
import { WhatOnEarthWorksheet } from "@/components/worksheets/WhatOnEarthWorksheet";

const WORKSHEET_COMPONENTS: Record<string, ReactElement> = {
  "things-to-change": <ThingsToChangeWorksheet />,
  "budgeting-money-audit": <BudgetingMoneyAuditWorksheet />,
  "time-sheet": <TimeSheetWorksheet />,
  "time-circles": <TimeCirclesWorksheet />,
  "what-on-earth-am-i-doing": <WhatOnEarthWorksheet />,
};

export default async function WorksheetPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meta = getWorksheet(id);
  const component = WORKSHEET_COMPONENTS[id];
  if (!meta || !component) {
    notFound();
  }

  return (
    <div className="worksheet-print-view min-h-screen bg-white text-black">
      <div className="no-print border-b border-[var(--slj-border)] bg-[var(--slj-bg)] px-6 py-4">
        <Link
          href="/"
          className="font-sans text-sm font-medium text-[var(--slj-text-muted)] hover:text-[var(--slj-text)]"
        >
          ← Back to Course index
        </Link>
      </div>
      <div className="max-w-3xl px-6 py-10 print:py-6">
        {component}
      </div>
    </div>
  );
}
