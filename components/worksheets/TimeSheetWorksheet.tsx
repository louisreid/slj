/** TIME SHEET grid (PDF Session Three) — time down the left, days across the top. */

const HOUR_ROWS = [
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
        <table className="worksheet-time-grid w-full border border-black/30 border-collapse text-xs leading-tight">
          <thead>
            <tr className="border-b border-black/30">
              <th className="time-label border-r border-black/30 text-left font-semibold whitespace-nowrap">
                Time
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="border-r border-black/30 text-left font-semibold last:border-r-0 whitespace-nowrap"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOUR_ROWS.map((hour, index) => (
              <tr key={`${hour}-${index}`} className="border-b border-black/20">
                <td className="time-label border-r border-black/20 font-semibold whitespace-nowrap">
                  {hour}
                </td>
                {DAYS.map((day) => (
                  <td
                    key={`${hour}-${day}-${index}`}
                    className="slot-cell border-r border-black/20 last:border-r-0"
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
