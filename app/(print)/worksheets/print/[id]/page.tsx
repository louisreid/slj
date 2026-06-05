import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { getWorksheet } from "@/lib/worksheets";
import { WorksheetPrintBackLink } from "@/components/WorksheetPrintBackLink";
import { WorksheetAutoPrint } from "@/components/WorksheetAutoPrint";
import { isSafeCourseReturnPath } from "@/components/ReaderLocationContext";
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
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string; autoprint?: string }>;
}) {
  const { id } = await params;
  const { returnTo, autoprint } = await searchParams;
  const meta = getWorksheet(id);
  const component = WORKSHEET_COMPONENTS[id];
  if (!meta || !component) {
    notFound();
  }

  const showAutoprint = autoprint === "1";
  const hasCourseReturn = isSafeCourseReturnPath(returnTo);

  return (
    <div className="worksheet-print-view min-h-screen bg-white text-black">
      <WorksheetAutoPrint enabled={showAutoprint} />
      <div className="no-print border-b border-[var(--slj-border)] bg-[var(--slj-bg)] px-6 py-4">
        <p className="slj-faint font-sans text-xs uppercase tracking-[0.18em]">
          {meta.session}
        </p>
        <WorksheetPrintBackLink returnTo={returnTo} />
        {hasCourseReturn ? (
          <p className="slj-muted mt-2 max-w-xl font-sans text-xs leading-relaxed">
            After printing, use Back to course to return to where you were reading.
          </p>
        ) : null}
      </div>
      <div className="max-w-3xl px-6 py-10 print:py-6">
        {component}
      </div>
    </div>
  );
}
