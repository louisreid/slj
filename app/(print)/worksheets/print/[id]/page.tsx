import { notFound } from "next/navigation";
import Link from "next/link";
import { getWorksheet } from "@/lib/worksheets";
import { ThingsToChangeWorksheet } from "@/components/worksheets/ThingsToChangeWorksheet";
import { BudgetingMoneyAuditWorksheet } from "@/components/worksheets/BudgetingMoneyAuditWorksheet";

const WORKSHEET_IDS = ["things-to-change", "budgeting-money-audit"] as const;

export default async function WorksheetPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meta = getWorksheet(id);
  if (!meta || !WORKSHEET_IDS.includes(id as (typeof WORKSHEET_IDS)[number])) {
    notFound();
  }

  return (
    <div className="worksheet-print-view min-h-screen bg-white text-black">
      <div className="no-print border-b border-[#E5E7EB] bg-[#fff] px-6 py-4">
        <Link
          href="/worksheets"
          className="font-sans text-sm font-medium text-black/70 hover:text-black"
        >
          ← Back to Worksheets
        </Link>
      </div>
      <div className="mx-auto max-w-3xl px-6 py-10 print:py-6">
        {id === "things-to-change" && <ThingsToChangeWorksheet />}
        {id === "budgeting-money-audit" && <BudgetingMoneyAuditWorksheet />}
      </div>
    </div>
  );
}
