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

const CHOICE_COLUMNS = [
  "I DO IT",
  "I THINK ABOUT IT",
  "IT DOESN'T CROSS MY MIND",
] as const;

const DEFINITIONS = [
  {
    term: "FAIR TRADE",
    text: "is a process which pays producers a good price for their labour, instead of a price which they are forced to accept just to stay in business. As a by-product, the goods are often produced in a more environmentally-friendly manner. It does, however, still perpetuate, very often, local economies that are dependent on Western appetites.",
  },
  {
    term: "ENVIRONMENTALLY FRIENDLY",
    text: "means being sensitive to the need to reduce the use of natural resources, considering pollution and the amount of energy used by producing or using a product.",
  },
  {
    term: "FREE RANGE",
    text: "is a term applied to livestock which have continuous day time access to open air. The ground is mainly covered with vegetation, there is a maximum density of livestock per acre, and the feed must be free of animal products. Free range must not be confused with 'Farm Fresh' or 'Country Fresh' which could still involve factory-farming methods.",
  },
  {
    term: "TRANSPORT MILES",
    text: "refers to the mileage covered by an item from the producer of the raw ingredients to the shop floor. For example, a locally-grown potato may travel to a washing centre, then to a distribution centre before it reaches your local superstore. The local market will sell it dirty direct from the farm! More transport is used and therefore more congestion and pollution is produced by shopping at superstores.",
  },
  {
    term: "RECYCLING",
    text: "is the idea of using materials again. If an item cannot be re-used in its present form, it can be broken down and the materials used again. This process uses far less energy and natural resources than using raw materials each time.",
  },
  {
    term: "A WORMERY",
    text: "is a plastic bin with a sealed lid, a sump and a tap to drain off collected liquid. Tiger worms will eat degradable kitchen waste, turning it into a rich compost. The liquid forms an excellent plant feed – home-made Baby Bio!",
  },
  {
    term: "MULTINATIONALS",
    text: "are huge global companies which provide jobs in many nations but which don't necessarily consider the environmental and local economic impact of their business.",
  },
  {
    term: "CAR SHARING",
    text: "makes use of spare places in cars when two or more people are travelling to the same destination at the same time. The pollution caused by car fumes damages the ozone layer (which protects us from harmful sun rays) as well as contributing to diseases such as asthma.",
  },
  {
    term: "FARMERS' MARKETS",
    text: "are markets where local producers can sell their goods direct to the customer. They must come from a thirty-mile radius and the stall has to be staffed by the actual producer. The produce is not only fresher but often contains few chemicals. Less packaging and transportation is required which means there is less waste and fewer road journeys. Farmers' Markets also encourage people to try home-produced, regional, specialities.",
  },
  {
    term: "BICYCLING",
    text: "is a far more environmentally-friendly means of transportation than driving. For example, a bicycle can travel up to 1,037km on the energy equivalent of one litre of petrol (nearly 300mpg).",
  },
] as const;

const SCORE_BANDS = [
  {
    range: "0 - 20",
    text: "Being a Christ follower doesn't impact upon your lifestyle or thinking much. Choose an issue which interests you and discover how you can make a difference",
  },
  {
    range: "21 - 40",
    text: "You're thinking about making a difference, but getting around to it remains a challenge! It's time to do those things you've been putting off!",
  },
  {
    range: "41 - 62",
    text: "Your lifestyle reflects that you've made changes. Challenge yourself to find out more and keep going!",
  },
] as const;

function TickMatrix({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mb-8 break-inside-avoid">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <table className="worksheet-tick-table w-full border border-black/30 border-collapse text-sm">
        <thead>
          <tr className="border-b border-black/30">
            <th className="border-r border-black/30 text-left font-semibold w-[42%]" />
            {CHOICE_COLUMNS.map((col) => (
              <th
                key={col}
                className="border-r border-black/30 text-left font-semibold last:border-r-0"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((label) => (
            <tr key={label} className="border-b border-black/20">
              <td className="item-cell border-r border-black/20">{label}</td>
              {CHOICE_COLUMNS.map((col) => (
                <td
                  key={`${label}-${col}`}
                  className="tick-cell border-r border-black/20 last:border-r-0"
                >
                  <div className="mx-auto h-5 w-5 border border-black/50" />
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
      <p className="text-sm text-black/70 mb-3">
        Being a Christ follower should challenge us to face the issues of our world
        around us and do something about them.
      </p>
      <p className="text-sm text-black/70 mb-3">
        These questions provide a measure of checking out your lifestyle and thinking
        with reference to the environment. Your answers and scores should be a stimulus
        for discussion and action – mark yourself as honestly as you can! Use the
        definitions overleaf to clarify the questions.
      </p>
      <p className="text-sm text-black/70 mb-6">
        Please tick a box for each question.
      </p>

      <TickMatrix title="I BUY" items={I_BUY} />
      <TickMatrix title="I RECYCLE" items={I_RECYCLE} />

      <div className="print:break-before-page" />

      <TickMatrix title="I MAKE A POINT OF USING" items={I_MAKE_A_POINT_OF_USING} />
      <TickMatrix title="I SUPPORT" items={I_SUPPORT} />

      <section className="break-inside-avoid">
        <table className="worksheet-write-table worksheet-write-table--writable w-full border border-black/30 border-collapse text-sm mb-3">
          <tbody>
            <tr className="score-legend-row border-b border-black/20">
              <td className="border-r border-black/20 font-semibold w-[42%]">
                Each point is worth
              </td>
              <td className="border-r border-black/20 text-center font-semibold w-[18%]">
                2
              </td>
              <td className="border-r border-black/20 text-center font-semibold w-[18%]">
                1
              </td>
              <td className="text-center font-semibold w-[18%]">0</td>
            </tr>
            <tr className="border-b border-black/20">
              <td className="border-r border-black/20 font-semibold">GRAND TOTAL</td>
              <td colSpan={3} />
            </tr>
          </tbody>
        </table>
        <p className="text-sm mb-6">
          Count one point for each tick: <span className="font-semibold">I DO IT</span> = 2,{" "}
          <span className="font-semibold">I THINK ABOUT IT</span> = 1,{" "}
          <span className="font-semibold">IT DOESN&apos;T CROSS MY MIND</span> = 0. Add your
          totals and write the sum in GRAND TOTAL.
        </p>

        <h2 className="text-sm font-semibold mb-3">SCORES &amp; DEFINITIONS</h2>
        <table className="w-full border border-black/30 border-collapse text-sm mb-8">
          <tbody>
            {SCORE_BANDS.map((band) => (
              <tr key={band.range} className="border-b border-black/20 align-top">
                <td className="border-r border-black/20 p-2 font-semibold whitespace-nowrap w-20">
                  {band.range}
                </td>
                <td className="p-2">{band.text}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="space-y-4 text-sm">
          {DEFINITIONS.map((item) => (
            <div key={item.term} className="break-inside-avoid">
              <dt className="font-semibold">{item.term}</dt>
              <dd className="mt-1">{item.text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
