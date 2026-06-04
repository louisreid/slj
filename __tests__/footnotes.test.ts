import {
  INLINE_FOOTNOTE_RE,
  NOTES_CHAPTER_ID,
  noteAnchorId,
  noteChapterHref,
  parseNoteHeadingNumber,
} from "@/lib/content/footnotes";

describe("footnotes", () => {
  it("builds stable note anchors and hrefs", () => {
    expect(NOTES_CHAPTER_ID).toBe("29-references");
    expect(noteAnchorId(38)).toBe("note-38");
    expect(noteChapterHref(38)).toBe("/course/29-references#note-38");
  });

  it("parses note heading numbers", () => {
    expect(parseNoteHeadingNumber("[38]")).toBe(38);
    expect(parseNoteHeadingNumber(" [5] ")).toBe(5);
    expect(parseNoteHeadingNumber("Note 5")).toBeNull();
  });

  it("matches inline footnotes but not markdown links", () => {
    const re = /\[(\d{1,3})\](?!\()/;
    expect(re.exec("poverty [35].")?.[1]).toBe("35");
    expect(re.exec("[label](url)")).toBeNull();
  });
});
