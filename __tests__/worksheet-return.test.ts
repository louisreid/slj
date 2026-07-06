import {
  isSafeCourseReturnPath,
  worksheetHrefWithReturn,
} from "@/lib/worksheet-return";

describe("worksheet return navigation", () => {
  it("accepts course paths with block anchors", () => {
    expect(isSafeCourseReturnPath("/course/09-session-one#09-session-one-abc")).toBe(
      true
    );
  });

  it("rejects external URLs", () => {
    expect(isSafeCourseReturnPath("https://evil.example/course/x")).toBe(false);
  });

  it("appends returnTo query param", () => {
    expect(
      worksheetHrefWithReturn(
        "/worksheets/print/things-to-change",
        "/course/09-session-one#block-1"
      )
    ).toBe(
      "/worksheets/print/things-to-change?returnTo=%2Fcourse%2F09-session-one%23block-1"
    );
  });
});
