import {
  getChapterCompletionStats,
  getInteractiveSessionNumberMap,
  getProgressCountableChapters,
} from "@/lib/progress-summary";
import type { Chapter } from "@/lib/content/types";

function chapter(id: string, mode: Chapter["mode"] = "interactive"): Chapter {
  return {
    id,
    file: `${id}.md`,
    title: id,
    mode,
    sections: [{ blocks: [{ block_id: `${id}-b1`, type: "paragraph", content: "x" }] }],
  };
}

describe("getProgressCountableChapters", () => {
  it("excludes static chapters", () => {
    const chapters = [
      chapter("01-static", "static"),
      chapter("02-session"),
      chapter("03-static", "static"),
    ];
    expect(getProgressCountableChapters(chapters).map((c) => c.id)).toEqual([
      "02-session",
    ]);
  });
});

describe("getInteractiveSessionNumberMap", () => {
  it("numbers interactive chapters 1..n in manifest order", () => {
    const chapters = [
      chapter("01-static", "static"),
      chapter("02-a"),
      chapter("03-b"),
    ];
    const map = getInteractiveSessionNumberMap(chapters);
    expect(map.get("02-a")).toBe(1);
    expect(map.get("03-b")).toBe(2);
    expect(map.has("01-static")).toBe(false);
  });
});

describe("getChapterCompletionStats", () => {
  it("computes percent from interactive chapters only", () => {
    const chapters = [
      chapter("01-static", "static"),
      chapter("02-a"),
      chapter("03-b"),
      chapter("04-c"),
    ];
    const completed = new Map([
      ["02-a", true],
      ["01-static", true],
    ]);
    const stats = getChapterCompletionStats(chapters, completed);
    expect(stats).toEqual({ total: 3, completed: 1, percent: 33 });
  });

  it("returns zero percent when there are no countable chapters", () => {
    const chapters = [chapter("01-static", "static")];
    const stats = getChapterCompletionStats(chapters, new Map());
    expect(stats).toEqual({ total: 0, completed: 0, percent: 0 });
  });
});
