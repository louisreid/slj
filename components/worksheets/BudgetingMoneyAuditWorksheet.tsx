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
  const spendingCategoriesPage1 = [
    "Giving",
    "Saving",
    "Rent / Mortgage",
    "Council Tax",
    "Gas",
    "Electricity",
    "Water",
    "Telephone",
    "Food & Drink",
    "Toiletries",
  ];
  const spendingCategoriesPage2 = [
    "Laundry/Cleaning",
    "Insurance",
    "Transport",
    "Clothing/Shoes",
    "School expenses",
    "Child care",
    "Eating out",
  ];

  const exampleSpendRows = [
    { category: "Giving", w1: "10.00", w2: "10.00", w3: "10.00", w4: "10.00", total: "40.00" },
    { category: "Saving", w1: "10.00", w2: "10.00", w3: "10.00", w4: "10.00", total: "40.00" },
    { category: "Rent / Mortgage", w1: "-", w2: "-", w3: "-", w4: "-", total: "-" },
    { category: "Council Tax", w1: "-", w2: "17.00", w3: "-", w4: "-", total: "17.00" },
    { category: "Gas", w1: "21.65", w2: "21.65", w3: "21.65", w4: "21.65", total: "86.60" },
    { category: "Electricity", w1: "21.65", w2: "21.65", w3: "21.65", w4: "21.65", total: "86.60" },
    { category: "Water", w1: "-", w2: "-", w3: "-", w4: "30.00", total: "30.00" },
    { category: "Internet", w1: "42.50", w2: "42.50", w3: "42.50", w4: "42.50", total: "170.00" },
    { category: "Food & Drink", w1: "-", w2: "-", w3: "-", w4: "-", total: "0.00" },
    { category: "Newsagent", w1: "15.00", w2: "-", w3: "12.50", w4: "-", total: "27.50" },
    { category: "Toiletries", w1: "-", w2: "10.00", w3: "-", w4: "10.00", total: "20.00" },
    { category: "Laundry / Cleaning", w1: "-", w2: "-", w3: "-", w4: "10.00", total: "10.00" },
    { category: "Insurance", w1: "10.00", w2: "10.00", w3: "10.00", w4: "10.00", total: "40.00" },
    { category: "Transport", w1: "-", w2: "-", w3: "34.00", w4: "-", total: "34.00" },
  ] as const;

  const exampleIncomeRows = [
    { source: "Amount left over from last month", total: "24.34" },
    { source: "Income support", total: "308.00" },
    { source: "Dependent Child Benefit", total: "87.20" },
    { source: "Dependent Child Tax Credit", total: "267.68" },
    { source: "Money earned by ironing", total: "60.00" },
    { source: "Gift from sister", total: "50.00" },
  ] as const;

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
        <table className="w-full border border-black/30 border-collapse">
          <thead>
            <tr className="border-b border-black/30">
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Week 1
              </th>
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Week 2
              </th>
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Week 3
              </th>
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Week 4
              </th>
              <th className="p-2 text-left font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {spendingCategoriesPage1.map((category) => (
              <tr key={category} className="border-b border-black/20">
                <td className="border-r border-black/20 p-2 font-semibold">
                  {category}
                </td>
                {weeks.map((w) => (
                  <td
                    key={`${category}-${w}`}
                    className="border-r border-black/20 p-2 min-h-[2rem] last:border-r-0"
                  />
                ))}
                <td className="p-2 min-h-[2rem]" />
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="print:break-before-page" />

      <section className="mb-8">
        <table className="w-full border border-black/30 border-collapse">
          <thead>
            <tr className="border-b border-black/30">
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Week 1
              </th>
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Week 2
              </th>
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Week 3
              </th>
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Week 4
              </th>
              <th className="p-2 text-left font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {spendingCategoriesPage2.map((category) => (
              <tr key={category} className="border-b border-black/20">
                <td className="border-r border-black/20 p-2 font-semibold">
                  {category}
                </td>
                {weeks.map((w) => (
                  <td
                    key={`${category}-${w}`}
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

      <div className="print:break-before-page" />

      <section className="mb-8">
        <p className="text-sm text-black/70 mb-2">Month: August</p>
        <p className="text-sm text-black/70 mb-4">Total coming in:</p>

        <table className="w-full border border-black/30 border-collapse text-sm">
          <thead>
            <tr className="border-b border-black/30">
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                &nbsp;
              </th>
              <th className="p-2 text-left font-semibold">Total£</th>
            </tr>
          </thead>
          <tbody>
            {exampleIncomeRows.map((row) => (
              <tr key={row.source} className="border-b border-black/20">
                <td className="border-r border-black/20 p-2">{row.source}</td>
                <td className="p-2">{row.total}</td>
              </tr>
            ))}
            <tr className="border-b border-black/30 font-semibold">
              <td className="border-r border-black/30 p-2">Total coming in:</td>
              <td className="p-2">797.22</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <p className="text-sm text-black/70 mb-3">WHAT WAS SPENT:</p>
        <table className="w-full border border-black/30 border-collapse text-sm">
          <thead>
            <tr className="border-b border-black/30">
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                &nbsp;
              </th>
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Week 1
              </th>
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Week 2
              </th>
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Week 3
              </th>
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Week 4
              </th>
              <th className="p-2 text-left font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {exampleSpendRows.map((row) => (
              <tr key={row.category} className="border-b border-black/20">
                <td className="border-r border-black/20 p-2">{row.category}</td>
                <td className="border-r border-black/20 p-2">{row.w1}</td>
                <td className="border-r border-black/20 p-2">{row.w2}</td>
                <td className="border-r border-black/20 p-2">{row.w3}</td>
                <td className="border-r border-black/20 p-2">{row.w4}</td>
                <td className="p-2">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <p className="text-sm text-black/70 mb-2">Personal money -</p>
        <p className="text-sm text-black/70 mb-3">How are you doing?</p>
        <table className="w-full border border-black/30 border-collapse text-sm">
          <thead>
            <tr className="border-b border-black/30">
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                &nbsp;
              </th>
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Total Coming in
              </th>
              <th className="border-r border-black/30 p-2 text-left font-semibold">
                Total Spent
              </th>
              <th className="p-2 text-left font-semibold">Money Left over</th>
            </tr>
          </thead>
          <tbody>
            {[
              { week: "Week 1", in: "205.06", spent: "175.80", left: "29.26" },
              { week: "Week 2", in: "180.72", spent: "172.37", left: "8.35" },
              { week: "Week 3", in: "230.72", spent: "210.97", left: "19.75" },
              { week: "Week 4", in: "180.72", spent: "235.16", left: "-54.44" },
              { week: "Total", in: "797.22", spent: "794.30", left: "2.92" },
            ].map((row) => (
              <tr key={row.week} className="border-b border-black/20">
                <td className="border-r border-black/20 p-2 font-semibold">
                  {row.week}
                </td>
                <td className="border-r border-black/20 p-2">{row.in}</td>
                <td className="border-r border-black/20 p-2">{row.spent}</td>
                <td className="p-2">{row.left}</td>
              </tr>
            ))}
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
