type CircleSpec = {
  labelLeft: string;
  labelRight?: string;
};

const CIRCLES: CircleSpec[] = [
  { labelLeft: "MONDAY", labelRight: "SUNDAY" },
  { labelLeft: "TUESDAY", labelRight: "SATURDAY" },
  { labelLeft: "WEDNESDAY", labelRight: "FRIDAY" },
  { labelLeft: "THURSDAY" },
];

function BlankCircle({ label }: { label: string }) {
  return (
    <div className="break-inside-avoid">
      <div className="mb-2 font-semibold tracking-wide">{label}</div>
      <svg
        viewBox="0 0 200 200"
        className="w-full max-w-[260px]"
        aria-hidden="true"
      >
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="black"
          strokeOpacity="0.5"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export function TimeCirclesWorksheet() {
  return (
    <article className="worksheet-content font-serif text-black">
      <h1 className="text-2xl font-semibold mb-6">TIME CIRCLES</h1>

      <div className="grid grid-cols-2 gap-10">
        {CIRCLES.flatMap((pair) => {
          const items = [pair.labelLeft, pair.labelRight].filter(
            (x): x is string => Boolean(x),
          );
          return items.map((label) => <BlankCircle key={label} label={label} />);
        })}
      </div>
    </article>
  );
}
