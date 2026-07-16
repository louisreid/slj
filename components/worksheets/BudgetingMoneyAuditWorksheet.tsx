/**
 * Worksheet: PERSONAL MONEY FORM — blank form, Mrs R. E. Joyce example, reflection (PDF Session 5).
 */

import Link from "next/link";
import {
  WeekMoneyTable,
  blankWeekRows,
} from "@/components/worksheets/worksheetTable";
import { noteChapterHref } from "@/lib/content/footnotes";

function FootnoteRef({ n }: { n: number }) {
  return (
    <Link
      href={noteChapterHref(n)}
      className="underline decoration-black/50 print:no-underline"
    >
      [{n}]
    </Link>
  );
}

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

const SPENT_CATEGORIES = [
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
  "Laundry/Cleaning",
  "Insurance",
  "Transport",
  "Clothing/Shoes",
  "School expenses",
  "Child care",
  "Eating out",
  "",
  "",
  "",
  "",
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
    weeks: ["", "", "50.00", ""] as const,
    total: "50.00",
  },
] as const;

const EXAMPLE_INCOME_TOTAL = {
  weeks: ["205.06", "180.72", "230.72", "180.72"] as const,
  total: "797.22",
};

const EXAMPLE_SPENT_ROWS = [
  { label: "Giving", weeks: ["10.00", "10.00", "10.00", "10.00"], total: "40.00" },
  { label: "Saving", weeks: ["10.00", "10.00", "10.00", "10.00"], total: "40.00" },
  { label: "Rent / Mortgage", weeks: ["-", "-", "-", "-"], total: "-" },
  { label: "Council Tax", weeks: ["-", "17.00", "-", "-"], total: "17.00" },
  { label: "Gas", weeks: ["21.65", "21.65", "21.65", "21.65"], total: "86.60" },
  { label: "Electricity", weeks: ["21.65", "21.65", "21.65", "21.65"], total: "86.60" },
  { label: "Water", weeks: ["-", "-", "-", "30.00"], total: "30.00" },
  { label: "Telephone", weeks: ["-", "-", "-", "-"], total: "-" },
  { label: "Food & Drink", weeks: ["42.50", "42.50", "42.50", "42.50"], total: "170.00" },
  { label: "Toiletries", weeks: ["15.00", "-", "12.50", "-"], total: "27.50" },
  { label: "Laundry/Cleaning", weeks: ["-", "10.00", "-", "10.00"], total: "20.00" },
  { label: "Insurance", weeks: ["-", "-", "-", "-"], total: "-" },
  { label: "Transport", weeks: ["10.00", "10.00", "10.00", "10.00"], total: "40.00" },
  { label: "Clothing / Shoes", weeks: ["-", "-", "34.00", "-"], total: "34.00" },
  { label: "School Expenses", weeks: ["10.00", "", "", ""], total: "10.00" },
  { label: "Child care", weeks: ["", "", "", ""], total: "" },
  { label: "Eating out", weeks: ["20.00", "", "20.00", "20.00"], total: "60.00" },
  { label: "TV Licence", weeks: ["", "", "13.67", ""], total: "13.67" },
  { label: "Clubs, Gym, Activities", weeks: ["10.00", "10.00", "10.00", "10.00"], total: "40.00" },
  { label: "Presents", weeks: ["", "14.57", "", "4.36"], total: "18.93" },
  { label: "Hope's pocket money", weeks: ["5.00", "5.00", "5.00", "5.00"], total: "20.00" },
  { label: "", weeks: ["", "", "", ""], total: "" },
  { label: "", weeks: ["", "", "", ""], total: "" },
  { label: "", weeks: ["", "", "", ""], total: "" },
  { label: "", weeks: ["", "", "", ""], total: "" },
] as const;

const EXAMPLE_SPENT_TOTAL = {
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

function PersonalMoneyInstructions() {
  return (
    <section className="mb-10 text-sm leading-relaxed">
      <h2 className="text-lg font-semibold mb-4">Looking after your personal money</h2>

      <div className="space-y-5">
        <div>
          <p className="font-semibold mb-2">1. What money do you have coming in?</p>
          <ol className="list-[lower-alpha] list-inside space-y-1 pl-1">
            <li>
              After reading the example below, use the blank Personal Money form and go to the first table (with{" "}
              <span className="font-semibold">TOTAL COMING IN</span> at the bottom). In the
              first column list all the sources of money you have coming in, including money
              coming in from your family, or anyone else with whom you share living costs (e.g.
              wages, IS, JSA, Family or Universal Credit and other benefits, maintenance,
              interest etc). There is a filled-in example attached to help you.
            </li>
            <li>In the weekly columns, record the amount you receive from each source.</li>
            <li>
              At the end of each week add up the different sources to work out your total weekly
              amount coming in.
            </li>
            <li>
              At the end of the month, work out how much you received from each source over the
              whole month and add them together. This figure is your{" "}
              <span className="font-semibold">TOTAL COMING IN</span> this month.
            </li>
          </ol>
        </div>

        <div>
          <p className="font-semibold mb-2">2. What do you spend each day?</p>
          <ol className="list-[lower-alpha] list-inside space-y-1 pl-1">
            <li>
              In a notebook, record the details of everything you buy (record it on the day you
              pay, regardless of how you pay). Include: rent, mortgage, childcare, appliance
              rental, hire purchase, mail order, credit cards, pension, travel expenses, food and
              drink, school, household bills, phone, wifi, electricity, gas, water, clothes, tax,
              national insurance, other insurance, leisure activities, giving etc.
            </li>
            <li>
              Record the date, what you bought and the price. If you have a receipt, you may want
              to keep it as a back-up record of the purchase.
            </li>
          </ol>
        </div>

        <div>
          <p className="font-semibold mb-2">3. What is your total monthly spending?</p>
          <ol className="list-[lower-alpha] list-inside space-y-1 pl-1">
            <li>
              In the second table (with <span className="font-semibold">TOTAL SPENT</span> at the
              bottom) fill in the details of all your expenses this month (e.g. presents, online
              purchases, children&apos;s pocket money).
            </li>
            <li>
              Using what you have written in your notebook, fill in the amount spent each week on
              each item.
            </li>
            <li>
              By adding up the total at the bottom of each weekly column you can see how you spend
              your money each week.
            </li>
            <li>
              At the end of the month, calculate the total amount spent on each item by adding
              across the page. To work out how much you spend monthly add up the Total column. The
              number in the bottom right-hand box is the total amount you have spent during the
              month.
            </li>
          </ol>
        </div>

        <div>
          <p className="font-semibold mb-2">4. How are you doing?</p>
          <ol className="list-[lower-alpha] list-inside space-y-1 pl-1">
            <li>
              To calculate your money left over, use the third table, at the bottom of the page.
              First copy the <span className="font-semibold">TOTAL COMING IN</span> line as
              indicated by the arrow. Next, do the same with the{" "}
              <span className="font-semibold">TOTAL SPENT</span> line. Your Money left over is{" "}
              <span className="font-semibold">TOTAL COMING IN</span> minus{" "}
              <span className="font-semibold">TOTAL SPENT</span>. Simple!
            </li>
            <li>
              You can also keep a running total of how much you have left over after each week.
              Hopefully you will have some spare money left over at the end of the month. If the
              number is negative, then you have spent more than you have had coming in for this
              month. If this happens, you should look at what you spent to see how to reduce it
              next month. The amount left over is the amount you have to go towards next
              month&apos;s budget.
            </li>
          </ol>
        </div>

        <div>
          <p className="font-semibold mb-2">5. Try an example.</p>
          <p>
            Look at the example of Mrs R. E. Joyce. See if you can understand how she keeps track
            of her personal money. Then try and do it for yourself!
          </p>
          <p className="mt-2">
            Mrs Joyce, a single mother aged 29 with a daughter of 8 (Hope), has kept her accounts
            for August as follows:
          </p>
        </div>
      </div>
    </section>
  );
}

export function BudgetingMoneyAuditWorksheet() {
  return (
    <article className="worksheet-content font-serif text-black">
      <PersonalMoneyInstructions />

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Example: Mrs R. E. Joyce</h2>
        <p className="text-sm text-black/70 mb-4">
          A worked example for August (single mother, daughter Hope, aged 8).
        </p>
        <p className="text-sm font-semibold mb-2">Month: August</p>
        <h3 className="text-sm font-semibold mb-3">WHAT CAME IN:</h3>
        <WeekMoneyTable
          rows={EXAMPLE_INCOME_ROWS}
          totalRowLabel="Total coming in:"
          totalRowWeeks={EXAMPLE_INCOME_TOTAL.weeks}
          totalRowTotal={EXAMPLE_INCOME_TOTAL.total}
        />
      </section>

      <section className="mb-8">
        <h3 className="text-sm font-semibold mb-3">WHAT WAS SPENT:</h3>
        <WeekMoneyTable
          rows={EXAMPLE_SPENT_ROWS}
          totalRowLabel="Total Spent:"
          totalRowWeeks={EXAMPLE_SPENT_TOTAL.weeks}
          totalRowTotal={EXAMPLE_SPENT_TOTAL.total}
        />
      </section>

      <section className="mb-10">
        <p className="text-sm text-black/70 mb-2">Personal money —</p>
        <p className="text-sm font-semibold mb-3">How are you doing?</p>
        <WeekMoneyTable rows={EXAMPLE_SUMMARY_ROWS} />
      </section>

      <div className="print:break-before-page" />

      <h1 className="text-2xl font-semibold mb-8">PERSONAL MONEY FORM</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">WHAT CAME IN:</h2>
        <p className="text-sm text-black/70 mb-3">Month: _____________</p>
        <WeekMoneyTable
          rows={blankWeekRows(["", "", "", "", ""])}
          totalRowLabel="Total Coming in:"
          writable
        />
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">WHAT YOU SPENT:</h2>
        <WeekMoneyTable
          rows={blankWeekRows(SPENT_CATEGORIES)}
          totalRowLabel="Total Spent:"
          writable
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
          writable
        />
      </section>

      <div className="print:break-before-page" />

      <section>
        <p className="text-sm text-black/70 mb-4">
          Draw up for yourself an account of what you spent your income on over the past year. Try
          to account for as much as possible, including major purchases in the past twelve months
          — if you do not have a good record system go through your bank statements. Then ask
          yourself:
        </p>
        <ul className="space-y-4 list-none pl-0">
          {REFLECTION_PROMPTS.map((prompt, i) => (
            <li key={i} className="break-inside-avoid">
              <p className="text-sm font-medium mb-2">{prompt}</p>
              <div className="worksheet-ruled-line border-b border-black/30" />
            </li>
          ))}
        </ul>
        <p className="text-sm font-medium mt-6 mb-2">
          Now make a budgeting plan that would allow you to live on 90% of your present income or
          make only 90% of your present expenditures, reducing to 80% after three months and 50%
          after six months. What changes would you have to make? Try to devise a workable plan and
          think about the shifts in lifestyle that would be required. Consider both the
          disadvantages and advantages of such changes. What would you gain? What would you lose?
          What would be the opportunities in such a situation? Which, if any, of these changes are
          you going to make? <FootnoteRef n={51} />
        </p>
        <div className="worksheet-ruled-line border-b border-black/30 min-h-[6rem]" />
      </section>
    </article>
  );
}
