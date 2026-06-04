const WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4"] as const;

type WeekRow = {
  label: string;
  weeks?: readonly [string, string, string, string];
  total?: string;
};

type WeekMoneyTableProps = {
  rows: readonly WeekRow[];
  totalRowLabel?: string;
  showTotalColumn?: boolean;
};

export function WeekMoneyTable({
  rows,
  totalRowLabel,
  showTotalColumn = true,
}: WeekMoneyTableProps) {
  return (
    <table className="w-full border border-black/30 border-collapse text-sm">
      <thead>
        <tr className="border-b border-black/30">
          <th className="border-r border-black/30 p-2 text-left font-semibold">
            &nbsp;
          </th>
          {WEEKS.map((week) => (
            <th
              key={week}
              className="border-r border-black/30 p-2 text-left font-semibold last:border-r-0"
            >
              {week}
            </th>
          ))}
          {showTotalColumn ? (
            <th className="p-2 text-left font-semibold">Total</th>
          ) : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-black/20">
            <td className="border-r border-black/20 p-2 font-semibold align-top">
              {row.label}
            </td>
            {WEEKS.map((week, index) => (
              <td
                key={`${row.label}-${week}`}
                className="border-r border-black/20 p-2 min-h-[2rem] last:border-r-0"
              >
                {row.weeks?.[index] ?? ""}
              </td>
            ))}
            {showTotalColumn ? (
              <td className="p-2 min-h-[2rem]">{row.total ?? ""}</td>
            ) : null}
          </tr>
        ))}
        {totalRowLabel ? (
          <tr className="border-b border-black/30 font-semibold">
            <td className="border-r border-black/30 p-2">{totalRowLabel}</td>
            {WEEKS.map((week) => (
              <td
                key={`${totalRowLabel}-${week}`}
                className="border-r border-black/30 p-2 last:border-r-0"
              />
            ))}
            {showTotalColumn ? <td className="p-2" /> : null}
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}

export function blankWeekRows(labels: readonly string[]): WeekRow[] {
  return labels.map((label) => ({ label }));
}
