import { isMissingChapterProgressTable, progressErrorMessage } from "@/lib/progress-errors";

describe("isMissingChapterProgressTable", () => {
  it("detects PGRST205", () => {
    expect(
      isMissingChapterProgressTable({
        code: "PGRST205",
        message: "Could not find the table 'public.chapter_progress' in the schema cache",
      })
    ).toBe(true);
  });

  it("returns false for other errors", () => {
    expect(isMissingChapterProgressTable({ code: "42501", message: "permission denied" })).toBe(
      false
    );
  });
});

describe("progressErrorMessage", () => {
  it("explains missing table", () => {
    expect(
      progressErrorMessage({
        code: "PGRST205",
        message: "Could not find the table 'public.chapter_progress' in the schema cache",
      })
    ).toContain("chapter_progress");
  });
});
