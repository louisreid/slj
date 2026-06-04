/**
 * Worksheet: Things to Change — print-only layout (PDF pages 18–19).
 */

import type { ReactNode } from "react";

type ChangeRow = {
  label: string;
  hint?: ReactNode;
  pageBreakBefore?: boolean;
};

export function ThingsToChangeWorksheet() {
  const rows: ChangeRow[] = [
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
    { label: "Use of Money", pageBreakBefore: true },
    { label: "Work" },
    { label: "Use of Time" },
    { label: "Shopping Habits" },
    { label: "Use of Social Media" },
    { label: "Habits that affect the environment negatively" },
    { label: "Building my community" },
    { label: "Other" },
  ];

  return (
    <article className="worksheet-content font-serif text-black">
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">
          Steps I can take to move toward simplicity:
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="worksheet-ruled-line border-b border-black/30" />
          ))}
        </div>
      </section>

      <table className="worksheet-grid-table worksheet-write-table worksheet-write-table--writable w-full text-sm">
        <thead>
          <tr>
            <th className="w-[42%]">THINGS TO CHANGE</th>
            <th>IMMEDIATELY</th>
            <th>WITHIN SIX MONTHS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className={row.pageBreakBefore ? "print:break-before-page" : undefined}
            >
              <td className="font-medium">
                {row.label}
                {row.hint ? (
                  <div className="mt-1 text-sm font-normal text-black/80">
                    {row.hint}
                  </div>
                ) : null}
              </td>
              <td className="write-cell" aria-label={`${row.label} — immediately`} />
              <td className="write-cell" aria-label={`${row.label} — within six months`} />
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
