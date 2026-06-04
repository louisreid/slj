/** TIME SHEET grid (PDF Session Three) — includes duplicate afternoon hour columns. */

const HOUR_COLUMNS = [
  "7-8",
  "8-9",
  "9-10",
  "10-11",
  "11-12",
  "12-1",
  "1-2",
  "2-3",
  "3-4",
  "4-5",
  "5-6",
  "6-7",
  "7-8",
  "8-9",
  "9-10",
  "10-11",
  "11-12",
  "sleep",
] as const;

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export function TimeSheetWorksheet() {
  return (
    <article className="worksheet-content font-serif text-black">
      <h1 className="text-2xl font-semibold mb-6">TIME SHEET</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-black/30 border-collapse text-[10px] leading-tight">
          <thead>
            <tr className="border-b border-black/30">
              <th className="border-r border-black/30 p-1.5 text-left font-semibold">
                Time
              </th>
              {HOUR_COLUMNS.map((hour, index) => (
                <th
                  key={`${hour}-${index}`}
                  className="border-r border-black/30 p-1.5 text-left font-semibold last:border-r-0 whitespace-nowrap"
                >
                  {hour}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day} className="border-b border-black/20">
                <td className="border-r border-black/20 p-1.5 font-semibold whitespace-nowrap">
                  {day}
                </td>
                {HOUR_COLUMNS.map((hour, index) => (
                  <td
                    key={`${day}-${hour}-${index}`}
                    className="border-r border-black/20 p-1.5 min-h-[1.4rem] last:border-r-0"
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
