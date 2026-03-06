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
      <h1 className="text-2xl font-semibold mb-8">Things to Change</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 uppercase tracking-wide">
          Things to Change
        </h2>
        <ul className="space-y-4 list-none pl-0">
          <li>
            <span className="font-medium">Daily practice or habit</span>
            <p className="text-sm mt-1 text-black/70">
              Could be spiritual (e.g. prayer) or physical (e.g. daily exercise).
            </p>
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
        <h2 className="text-lg font-semibold mb-3">Time horizons</h2>
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

      <section>
        <h2 className="text-lg font-semibold mb-4">Reflection and action</h2>
        <table className="w-full border-collapse">
          <tbody>
            {writingSections.map((label) => (
              <tr key={label} className="border-b border-black/20">
                <td className="py-2 pr-4 font-medium align-top w-1/3">
                  {label}
                </td>
                <td className="py-2 border-b border-black/15 min-h-[2rem]" />
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </article>
  );
}
