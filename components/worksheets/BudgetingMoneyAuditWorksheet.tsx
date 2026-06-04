/**
 * Worksheet: PERSONAL MONEY FORM — blank form, Mrs R. E. Joyce example, reflection (PDF Session 5).
 */

import {
  WeekMoneyTable,
  blankWeekRows,
} from "@/components/worksheets/worksheetTable";

const REFLECTION_PROMPTS = [
  "Am I happy with where my income came from?",
  "Does my financial life function separately from the rest of my life?",
  "Have I spent more than I received? If so, what immediate changes are necessary in my expenditure choices so that I can live within my income?",
  "Does what I spend my money on please God?",
  "Does what I spend my money on help me to be active in my community (for example, sport) or do I spend it in a way which keeps me isolated (for example, watching TV or playing computer games)?",
  "How tied am I to my regular debt repayments and instalment payments? What changes can I make (a) to leave behind past choices which I am still paying for and (b) so that I live only within my current income and savings?",
  "Do I save up for expensive items or do I buy them on credit? Am I happy with this method of shopping?",
  "Do I need to make changes to my lifestyle to facilitate some of the above?",
];

const BUDGETING_PLAN_PROMPT =
  "Now make a budgeting plan that would allow you to live on 90% of your present income or make only 90% of your present expenditures, reducing to 80% after three months and 50% after six months. What changes would you have to make? Try to devise a workable plan and think about the shifts in lifestyle that would be required. Consider both the disadvantages and advantages of such changes. What would you gain? What would you lose? What would be the opportunities in such a situation? Which, if any, of these changes are you going to make? [41]";

const SPENT_CATEGORIES_PAGE_1 = [
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
] as const;

const SPENT_CATEGORIES_PAGE_2 = [
  "Laundry/Cleaning",
  "Insurance",
  "Transport",
  "Clothing/Shoes",
  "School expenses",
  "Child care",
  "Eating out",
] as const;

const EXAMPLE_INCOME_ROWS = [
  {
    label: "Amount left over from last month",
    weeks: ["24.34", "", "", ""] as const,
    total: "24.34",
  },
  {
    label: "Income support",
    weeks: ["77.00", "77.00", "77.00", "77.00"] as const,
    total: "308.00",
  },
  {
    label: "Dependent Child Benefit",
    weeks: ["21.80", "21.80", "21.80", "21.80"] as const,
    total: "87.20",
  },
  {
    label: "Dependent Child Tax Credit",
    weeks: ["66.92", "66.92", "66.92", "66.92"] as const,
    total: "267.68",
  },
  {
    label: "Money earned by ironing",
    weeks: ["15.00", "15.00", "15.00", "15.00"] as const,
    total: "60.00",
  },
  {
    label: "Gift from sister",
    weeks: ["", "", "", ""] as const,
    total: "50.00",
  },
] as const;

const EXAMPLE_SPENT_UTILITIES_ROWS = [
  { label: "Giving", weeks: ["10.00", "10.00", "10.00", "10.00"], total: "40.00" },
  { label: "Saving", weeks: ["10.00", "10.00", "10.00", "10.00"], total: "40.00" },
  { label: "Rent / Mortgage", weeks: ["-", "-", "-", "-"], total: "-" },
  { label: "Council Tax", weeks: ["-", "17.00", "-", "-"], total: "17.00" },
  { label: "Gas", weeks: ["21.65", "21.65", "21.65", "21.65"], total: "86.60" },
  { label: "Electricity", weeks: ["21.65", "21.65", "21.65", "21.65"], total: "86.60" },
  { label: "Water", weeks: ["-", "-", "-", "30.00"], total: "30.00" },
  { label: "Internet", weeks: ["42.50", "42.50", "42.50", "42.50"], total: "170.00" },
  { label: "Food & Drink", weeks: ["-", "-", "-", "-"], total: "0.00" },
  { label: "Newsagent", weeks: ["15.00", "-", "12.50", "-"], total: "27.50" },
  { label: "Toiletries", weeks: ["-", "10.00", "-", "10.00"], total: "20.00" },
  { label: "Laundry / Cleaning", weeks: ["-", "-", "-", "10.00"], total: "10.00" },
  { label: "Insurance", weeks: ["-", "-", "-", "10.00"], total: "10.00" },
  { label: "Transport", weeks: ["10.00", "10.00", "10.00", "10.00"], total: "40.00" },
  { label: "Clothing / Shoes", weeks: ["-", "-", "-", "-"], total: "-" },
] as const;

const EXAMPLE_SPENT_HOUSEHOLD_ROWS = [
  {
    label: "School Expenses",
    weeks: ["10.00", "10.00", "", ""] as const,
    total: "",
  },
  { label: "Childcare", weeks: ["20.00", "20.00", "", ""] as const, total: "" },
  {
    label: "Eating out / Social",
    weeks: ["", "", "13.67", ""] as const,
    total: "",
  },
  {
    label: "TV Licence",
    weeks: ["5.00", "5.00", "5.00", "5.00"] as const,
    total: "20.00",
  },
  {
    label: "Clubs, Gym, Activities",
    weeks: ["20.00", "10.00", "", ""] as const,
    total: "",
  },
  {
    label: "Presents",
    weeks: ["10.00", "10.00", "14.57", "60.00"] as const,
    total: "",
  },
  {
    label: "Hope's pocket money",
    weeks: ["5.00", "5.00", "5.00", "5.00"] as const,
    total: "20.00",
  },
] as const;

const EXAMPLE_SPENT_HOUSEHOLD_TOTAL_ROW = {
  label: "Total Spent",
  weeks: ["175.80", "172.37", "210.97", "235.16"] as const,
  total: "794.30",
};

const EXAMPLE_SUMMARY_ROWS = [
  {
    label: "Total Coming in",
    weeks: ["205.06", "180.72", "230.72", "180.72"] as const,
    total: "797.22",
  },
  {
    label: "Total Spent",
    weeks: ["175.80", "172.37", "210.97", "235.16"] as const,
    total: "794.30",
  },
  {
    label: "Money Left over",
    weeks: ["29.26", "8.35", "19.75", "-54.44"] as const,
    total: "2.92",
  },
] as const;

export function BudgetingMoneyAuditWorksheet() {
  return (
    <article className="worksheet-content font-serif text-black">
      <h1 className="text-2xl font-semibold mb-8">PERSONAL MONEY FORM</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">WHAT CAME IN:</h2>
        <p className="text-sm text-black/70 mb-3">Month: _____________</p>
        <WeekMoneyTable
          rows={blankWeekRows(["", "", "", "", ""])}
          totalRowLabel="Total Coming in:"
        />
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">WHAT YOU SPENT:</h2>
        <WeekMoneyTable
          rows={blankWeekRows(SPENT_CATEGORIES_PAGE_1)}
        />
      </section>

      <div className="print:break-before-page" />

      <section className="mb-8">
        <WeekMoneyTable
          rows={blankWeekRows(SPENT_CATEGORIES_PAGE_2)}
          totalRowLabel="Total Spent:"
        />
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">HOW ARE YOU DOING?</h2>
        <WeekMoneyTable
          rows={blankWeekRows([
            "Total coming in",
            "Total spent",
            "Money left over",
            "Running total",
          ])}
        />
      </section>

      <div className="print:break-before-page" />

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Example: Mrs R. E. Joyce</h2>
        <p className="text-sm text-black/70 mb-4">
          A worked example for August (single mother, daughter Hope, aged 8).
        </p>
        <p className="text-sm font-semibold mb-2">Month: August</p>
        <p className="text-sm text-black/70 mb-4">Total coming in:</p>
        <WeekMoneyTable
          rows={EXAMPLE_INCOME_ROWS}
          totalRowLabel="Total coming in:"
        />
      </section>

      <section className="mb-8">
        <p className="text-sm font-semibold mb-3">WHAT WAS SPENT:</p>
        <WeekMoneyTable rows={EXAMPLE_SPENT_UTILITIES_ROWS} />
      </section>

      <section className="mb-8">
        <WeekMoneyTable
          rows={[...EXAMPLE_SPENT_HOUSEHOLD_ROWS, EXAMPLE_SPENT_HOUSEHOLD_TOTAL_ROW]}
        />
      </section>

      <section className="mb-10">
        <p className="text-sm text-black/70 mb-2">Personal money -</p>
        <p className="text-sm text-black/70 mb-3">How are you doing?</p>
        <WeekMoneyTable rows={EXAMPLE_SUMMARY_ROWS} />
      </section>

      <div className="print:break-before-page" />

      <section>
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
        <p className="text-sm font-medium mt-6 mb-2">{BUDGETING_PLAN_PROMPT}</p>
        <div className="border-b border-black/30 min-h-[6rem]" />
      </section>
    </article>
  );
}
