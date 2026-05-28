/**
 * Worksheet 1: Things to Change — print-only layout.
 * Serif for content; labeled sections with writing space.
 */

export function ThingsToChangeWorksheet() {
  const writingSections = [
    "Use of Money",
    "Work",
    "Use of Time",
    "Shopping Habits",
    "Use of Social Media",
    "Habits that affect the environment negatively",
    "Building my community",
    "Other",
  ];

  return (
    <article className="worksheet-content font-serif text-black">
      <h1 className="text-2xl font-semibold mb-8">THINGS TO CHANGE</h1>

      <section className="mb-8">
        <ul className="space-y-4 list-none pl-0">
          <li>
            <span className="font-medium">Daily practice or habit</span>
            <p className="text-sm mt-1 text-black/70">Could be spiritual, like</p>
            <p className="text-sm text-black/70">prayer, or physical,</p>
            <p className="text-sm text-black/70">like daily exercise.</p>
            <div className="mt-2 border-b border-black/30 min-h-[2.5rem]" />
          </li>
          <li>
            <span className="font-medium">Possessions</span>
            <div className="mt-2 border-b border-black/30 min-h-[2.5rem]" />
          </li>
          <li>
            <span className="font-medium">Non-material attachments</span>
            <div className="mt-2 border-b border-black/30 min-h-[2.5rem]" />
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-black/30">
              <th className="text-left py-2 pr-4 font-semibold">IMMEDIATELY</th>
              <th className="text-left py-2 font-semibold">WITHIN SIX MONTHS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="align-top py-4 pr-4 border-b border-black/20 min-h-[4rem]" />
              <td className="align-top py-4 border-b border-black/20 min-h-[4rem]" />
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-sm text-black/70">
          Which ones strike you as particularly interesting or challenging?
        </p>
      </section>

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

      <div className="print:break-before-page" />

      <section className="space-y-3">
        {writingSections.map((label) => (
          <div key={label} className="flex items-start justify-between gap-6">
            <div className="w-1/2 text-sm">{label}</div>
            <div className="w-1/2 border-b border-black/30 min-h-[2rem]" />
          </div>
        ))}
      </section>
    </article>
  );
}
