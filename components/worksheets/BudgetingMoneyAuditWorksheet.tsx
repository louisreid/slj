/**
 * Worksheet 2: Budgeting / Money Audit — print-only layout.
 * Based on Session 5 "Looking after your Personal Money" / PERSONAL MONEY FORM.
 */

const REFLECTION_PROMPTS = [
  "Am I happy with where my income came from?",
  "Does my financial life function separately from the rest of my life?",
  "Have I spent more than I received? If so, what immediate changes are necessary in my expenditure choices so that I can live within my income?",
  "Does what I spend my money on please God?",
  "Does what I spend my money on help me to be active in my community (for example, sport) or do I spend it in a way which keeps me isolated (for example, watching TV or playing computer games)?",
  "How tied am I to my regular debt repayments and instalment payments? What changes can I make (a) to leave behind past choices which I am still paying for and (b) so that I live only within my current income and savings?",
  "Do I save up for expensive items or do I buy them on credit? Am I happy with this method of shopping?",
  "Do I need to make changes to my lifestyle to facilitate some of the above?",
  "Now make a budgeting plan that would allow you to live on 90% of your present income or make only 90% of your present expenditures, reducing to 80% after three months and 50% after six months. What changes would you have to make? Try to devise a workable plan and think about the shifts in lifestyle that would be required. Consider both the disadvantages and advantages of such changes. What would you gain? What would you lose? What would be the opportunities in such a situation? Which, if any, of these changes are you going to make?",
];

export function BudgetingMoneyAuditWorksheet() {
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

  return (
    <article className="worksheet-content font-serif text-black">
      <h1 className="text-2xl font-semibold mb-8">PERSONAL MONEY FORM</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">WHAT CAME IN:</h2>
        <p className="text-sm text-black/70 mb-3">
          Month: _____________
        </p>
        <table className="w-full border border-black/30 border-collapse">
          <thead>
            <tr className="border-b border-black/30">
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Source
              </th>
              {weeks.map((w) => (
                <th
                  key={w}
                  className="border-r border-black/30 p-2 text-left font-semibold last:border-r-0"
                >
                  {w}
                </th>
              ))}
              <th className="p-2 text-left font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row} className="border-b border-black/20">
                <td className="border-r border-black/20 p-2 min-h-[2rem]" />
                {weeks.map((w) => (
                  <td
                    key={w}
                    className="border-r border-black/20 p-2 min-h-[2rem] last:border-r-0"
                  />
                ))}
                <td className="p-2 min-h-[2rem]" />
              </tr>
            ))}
            <tr className="border-b border-black/30 font-semibold">
              <td className="border-r border-black/30 p-2">Total Coming in:</td>
              {weeks.map((w) => (
                <td
                  key={w}
                  className="border-r border-black/30 p-2 last:border-r-0"
                />
              ))}
              <td className="p-2" />
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">WHAT YOU SPENT:</h2>
        <p className="text-sm text-black/70 mb-3">Month: _____________</p>
        <table className="w-full border border-black/30 border-collapse">
          <thead>
            <tr className="border-b border-black/30">
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Category
              </th>
              {weeks.map((w) => (
                <th
                  key={w}
                  className="border-r border-black/30 p-2 text-left font-semibold last:border-r-0"
                >
                  {w}
                </th>
              ))}
              <th className="p-2 text-left font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6].map((row) => (
              <tr key={row} className="border-b border-black/20">
                <td className="border-r border-black/20 p-2 min-h-[2rem]" />
                {weeks.map((w) => (
                  <td
                    key={w}
                    className="border-r border-black/20 p-2 min-h-[2rem] last:border-r-0"
                  />
                ))}
                <td className="p-2 min-h-[2rem]" />
              </tr>
            ))}
            <tr className="border-b border-black/30 font-semibold">
              <td className="border-r border-black/30 p-2">Total Spent:</td>
              {weeks.map((w) => (
                <td
                  key={w}
                  className="border-r border-black/30 p-2 last:border-r-0"
                />
              ))}
              <td className="p-2" />
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">HOW ARE YOU DOING?</h2>
        <table className="w-full border border-black/30 border-collapse">
          <thead>
            <tr className="border-b border-black/30">
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                &nbsp;
              </th>
              {weeks.map((w) => (
                <th
                  key={w}
                  className="border-r border-black/30 p-2 text-left font-semibold last:border-r-0"
                >
                  {w}
                </th>
              ))}
              <th className="p-2 text-left font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {["Total coming in", "Total spent", "Money left over", "Running total"].map(
              (label) => (
                <tr key={label} className="border-b border-black/20">
                  <td className="border-r border-black/20 p-2 font-semibold">
                    {label}
                  </td>
                  {weeks.map((w) => (
                    <td
                      key={w}
                      className="border-r border-black/20 p-2 min-h-[2rem] last:border-r-0"
                    />
                  ))}
                  <td className="p-2 min-h-[2rem]" />
                </tr>
              ),
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Reflection</h2>
        <p className="text-sm text-black/70 mb-4">
          Draw up for yourself an account of what you spent your income on over the
          past year. Try to account for as much as possible, including major purchases
          in the past twelve months – if you do not have a good record system go
          through your bank statements. Then ask yourself:
        </p>
        <ul className="space-y-4 list-none pl-0">
          {REFLECTION_PROMPTS.map((prompt, i) => (
            <li key={i} className="break-inside-avoid">
              <p className="text-sm font-medium mb-2">{prompt}</p>
              <div className="border-b border-black/30 min-h-[2.5rem]" />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
