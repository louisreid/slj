const WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4"] as const;

type WeekRow = {
  label: string;
  weeks?: readonly [string, string, string, string];
  total?: string;
};

type WeekMoneyTableProps = {
  rows: readonly WeekRow[];
  totalRowLabel?: string;
  totalRowWeeks?: readonly [string, string, string, string];
  totalRowTotal?: string;
  showTotalColumn?: boolean;
  /** Blank form rows with space to write amounts by hand. */
  writable?: boolean;
};

const tableClass = (writable: boolean) =>
  [
    "w-full border border-black/30 border-collapse text-sm worksheet-write-table",
    writable ? "worksheet-write-table--writable" : "worksheet-write-table--example",
  ].join(" ");

export function WeekMoneyTable({
  rows,
  totalRowLabel,
  totalRowWeeks,
  totalRowTotal,
  showTotalColumn = true,
  writable = false,
}: WeekMoneyTableProps) {
  return (
    <table className={tableClass(writable)}>
      <thead>
        <tr className="border-b border-black/30">
          <th className="border-r border-black/30 text-left font-semibold">&nbsp;</th>
          {WEEKS.map((week) => (
            <th
              key={week}
              className="border-r border-black/30 text-left font-semibold last:border-r-0"
            >
              {week}
            </th>
          ))}
          {showTotalColumn ? (
            <th className="text-left font-semibold">Total</th>
          ) : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row.label}-${index}`} className="border-b border-black/20">
            <td className="border-r border-black/20 font-semibold align-top">
              {row.label}
            </td>
            {WEEKS.map((week, weekIndex) => (
              <td
                key={`${row.label}-${week}`}
                className="border-r border-black/20 last:border-r-0"
              >
                {row.weeks?.[weekIndex] ?? ""}
              </td>
            ))}
            {showTotalColumn ? <td>{row.total ?? ""}</td> : null}
          </tr>
        ))}
        {totalRowLabel ? (
          <tr className="border-b border-black/30 font-semibold">
            <td className="border-r border-black/30">{totalRowLabel}</td>
            {WEEKS.map((week, index) => (
              <td
                key={`${totalRowLabel}-${week}`}
                className="border-r border-black/30 last:border-r-0"
              >
                {totalRowWeeks?.[index] ?? ""}
              </td>
            ))}
            {showTotalColumn ? <td>{totalRowTotal ?? ""}</td> : null}
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}

export function blankWeekRows(labels: readonly string[]): WeekRow[] {
  return labels.map((label) => ({ label }));
}
