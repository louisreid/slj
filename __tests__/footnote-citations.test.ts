import { buildFootnoteCitationIndex } from "@/lib/footnote-citations";

describe("footnote citations", () => {
  it("note 2 cites Introduction with display title", () => {
    const index = buildFootnoteCitationIndex();
    const citations = index.get(2) ?? [];
    expect(citations.length).toBeGreaterThan(0);
    const intro = citations.find((c) => c.chapterId === "07-introduction");
    expect(intro).toBeDefined();
    expect(intro?.chapterTitle).toBe("Introduction");
    expect(intro?.blockId).toMatch(/^07-introduction-/);
  });
});
