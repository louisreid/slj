export function TimeSheetWorksheet() {
  const hours = [
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
    "sleep",
  ];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <article className="worksheet-content font-serif text-black">
      <h1 className="text-2xl font-semibold mb-6">TIME SHEET</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-black/30 border-collapse text-[11px] leading-tight">
          <thead>
            <tr className="border-b border-black/30">
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Time
              </th>
              {hours.map((h) => (
                <th
                  key={h}
                  className="border-r border-black/30 p-2 text-left font-semibold last:border-r-0 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day} className="border-b border-black/20">
                <td className="border-r border-black/20 p-2 font-semibold whitespace-nowrap">
                  {day}
                </td>
                {hours.map((h) => (
                  <td
                    key={`${day}-${h}`}
                    className="border-r border-black/20 p-2 min-h-[1.6rem] last:border-r-0"
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
