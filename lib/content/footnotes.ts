/** End-of-book notes chapter used for `[n]` footnote links in the reader. */
export const NOTES_CHAPTER_ID = "29-references";

export function noteAnchorId(noteNumber: number): string {
  return `note-${noteNumber}`;
}

export function noteChapterHref(noteNumber: number): string {
  return `/course/${NOTES_CHAPTER_ID}#${noteAnchorId(noteNumber)}`;
}

/** Headings in the notes chapter use content like `[38]`. */
export function parseNoteHeadingNumber(content: string): number | null {
  const match = content.trim().match(/^\[(\d{1,3})\]$/);
  if (!match) return null;
  const n = Number.parseInt(match[1], 10);
  return Number.isFinite(n) ? n : null;
}

/** In-course reference `[38]` (not markdown link syntax `[text](url)`). */
export const INLINE_FOOTNOTE_RE = /\[(\d{1,3})\](?!\()/g;
