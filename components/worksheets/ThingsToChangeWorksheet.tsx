/**
 * Worksheet: Things to Change — print-only layout (PDF pages 18–19).
 */

export function ThingsToChangeWorksheet() {
  const reflectionLabels = [
    "Use of Money",
    "Work",
    "Use of Time",
    "Shopping Habits",
    "Use of Social Media",
    "Habits that affect the environment negatively",
    "Building my community",
    "Other",
  ];

  const changeRows = [
    {
      label: "Daily practice or habit",
      hint: (
        <>
          Could be spiritual, like
          <br />
          prayer, or physical,
          <br />
          like daily exercise.
        </>
      ),
    },
    { label: "Possessions" },
    { label: "Non-material attachments" },
  ];

  return (
    <article className="worksheet-content font-serif text-black">
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">
          Steps I can take to move toward simplicity:
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-b border-black/30 min-h-[2.5rem]"
            />
          ))}
        </div>
      </section>

      <h1 className="text-2xl font-semibold mb-8">THINGS TO CHANGE</h1>

      <section className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-black/30">
              <th className="text-left py-2 pr-4 font-semibold w-1/2" />
              <th className="text-left py-2 pr-4 font-semibold">IMMEDIATELY</th>
              <th className="text-left py-2 font-semibold">WITHIN SIX MONTHS</th>
            </tr>
          </thead>
          <tbody>
            {changeRows.map((row) => (
              <tr key={row.label} className="border-b border-black/20 align-top">
                <td className="py-3 pr-4 font-medium">
                  {row.label}
                  {row.hint ? (
                    <div className="text-sm mt-1 text-black/70 font-normal">
                      {row.hint}
                    </div>
                  ) : null}
                </td>
                <td className="py-3 pr-4 border-b border-black/15 min-h-[3rem]" />
                <td className="py-3 border-b border-black/15 min-h-[3rem]" />
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="print:break-before-page" />

      <section className="space-y-4">
        {reflectionLabels.map((label) => (
          <div key={label} className="flex items-start gap-6">
            <div className="w-[42%] shrink-0 text-sm leading-snug">{label}</div>
            <div className="flex-1 border-b border-black/30 min-h-[2rem]" />
          </div>
        ))}
      </section>
    </article>
  );
}
