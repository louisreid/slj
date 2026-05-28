const I_BUY = [
  "Fair Trade coffee",
  "Fair Trade tea",
  "Environmentally friendly washing powder/liquid",
  "Free range eggs",
  "Milk from a milkman",
  "Items with less packaging (where possible)",
  "Items with less transport miles (when aware)",
  "Clothes / shoes from shops with an ethical policy",
];

const I_RECYCLE = [
  "Newspapers / Waste Paper",
  "Glass",
  "Aluminium or steel cans & plastic",
  "Garden waste on a compost heap",
  "Kitchen waste on a compost heap or wormery",
  "Clothes/books",
];

const I_MAKE_A_POINT_OF_USING = [
  "Local shops instead of supermarkets",
  "Local businesses instead of multinational",
  "Local farmers market and farm shops",
  "Public transport / car sharing",
  "A bike instead of a car",
  "A car with a small engine",
  "Energy saving light bulbs & sava-plugs on my fridge/freezer",
  "Lights / electrical equipment & turn off when finished (not on standby)",
  "Produce which I have grown/made myself",
  "Recycled paper/envelopes/toilet and kitchen paper",
  "Gas and electricity from green tariff",
];

const I_SUPPORT = [
  "Local conservation groups",
  "National environmental organisations",
  "Birds, by providing food in my garden and putting bells on cats I own",
  "Local wildlife by gardening organically",
  "Banks with an ethical policy/ethical investments",
];

type ChoiceKey = "I_DO_IT" | "I_THINK_ABOUT_IT" | "IT_DOESNT_CROSS_MY_MIND";

const CHOICES: { key: ChoiceKey; label: string }[] = [
  { key: "I_DO_IT", label: "I DO IT" },
  { key: "I_THINK_ABOUT_IT", label: "I THINK ABOUT IT" },
  { key: "IT_DOESNT_CROSS_MY_MIND", label: "IT DOESN’T CROSS MY MIND" },
];

function Matrix({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <section className="mb-10 break-inside-avoid">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <table className="w-full border border-black/30 border-collapse text-sm">
        <thead>
          <tr className="border-b border-black/30">
            <th className="border-r border-black/30 p-2 text-left font-semibold">
              &nbsp;
            </th>
            {CHOICES.map((c) => (
              <th
                key={c.key}
                className="border-r border-black/30 p-2 text-left font-semibold last:border-r-0"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((label) => (
            <tr key={label} className="border-b border-black/20">
              <td className="border-r border-black/20 p-2">{label}</td>
              {CHOICES.map((c) => (
                <td
                  key={c.key}
                  className="border-r border-black/20 p-2 last:border-r-0"
                >
                  <div className="h-5 w-5 border border-black/50" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function WhatOnEarthWorksheet() {
  return (
    <article className="worksheet-content font-serif text-black">
      <h1 className="text-2xl font-semibold mb-4">WHAT ON EARTH AM I DOING?</h1>
      <p className="text-sm text-black/70 mb-6">
        Please tick a box for each question.
      </p>

      <Matrix title="I BUY" items={I_BUY} />
      <Matrix title="I RECYCLE" items={I_RECYCLE} />

      <div className="print:break-before-page" />

      <Matrix title="I MAKE A POINT OF USING" items={I_MAKE_A_POINT_OF_USING} />
      <Matrix title="I SUPPORT" items={I_SUPPORT} />

      <section className="break-inside-avoid">
        <div className="mb-2 font-semibold">Each point is worth</div>
        <div className="mb-4 font-semibold">GRAND TOTAL</div>
        <div className="flex items-center gap-4 mb-4">
          <div className="border border-black/30 px-3 py-2 font-semibold">2</div>
          <div className="border border-black/30 px-3 py-2 font-semibold">1</div>
          <div className="border border-black/30 px-3 py-2 font-semibold">0</div>
        </div>
        <div className="space-y-2 text-sm">
          <div>0 - 20</div>
          <div>21 - 40</div>
          <div>41 - 62</div>
        </div>
        <div className="mt-6 space-y-3 text-sm">
          <p>
            Being a Christ follower doesn’t impact upon your lifestyle or thinking
            much. Choose an issue which interests you and discover how you can make
            a difference
          </p>
          <p>
            You’re thinking about making a difference, but getting around to it
            remains a challenge! It’s time to do those things you’ve been putting
            off!
          </p>
          <p>
            Your lifestyle reflects that you’ve made changes. Challenge yourself to
            find out more and keep going!
          </p>
        </div>
        <div className="mt-6 text-sm font-semibold">SCORES &amp; DEFINITIONS</div>
      </section>
    </article>
  );
}
