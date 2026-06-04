import { extractWorksheetLinks } from "@/lib/worksheet-links";

describe("extractWorksheetLinks", () => {
  it("extracts icon link with trailing label", () => {
    const { prose, worksheets } = extractWorksheetLinks(
      "Write this section on paper. Open the printable form [](/worksheets/print/things-to-change) (Things to Change)."
    );
    expect(worksheets).toHaveLength(1);
    expect(worksheets[0].label).toBe("Things to Change");
    expect(prose).toMatch(/Write this section/i);
    expect(prose).not.toContain("Things to Change");
  });

  it("extracts multiple worksheets", () => {
    const { worksheets } = extractWorksheetLinks(
      "Forms [](/worksheets/print/time-sheet) (Time Sheet) and [](/worksheets/print/time-circles) (Time Circles)."
    );
    expect(worksheets).toHaveLength(2);
    expect(worksheets[0].id).toBe("time-sheet");
    expect(worksheets[1].id).toBe("time-circles");
  });
});
