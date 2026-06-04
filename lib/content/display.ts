import type { Chapter } from "./types";

interface LastReadPosition {
  chapterId: string;
  blockId: string;
}

function normalizeSessionTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/^session\s+/, "")
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getStaticKind(chapter: Chapter):
  | "front-matter"
  | "preface"
  | "reviews"
  | "foreword"
  | "introduction"
  | "references"
  | "further-reading"
  | null {
  const haystack = `${chapter.id} ${chapter.file} ${chapter.title}`.toLowerCase();

  if (haystack.includes("front-matter")) return "front-matter";
  if (haystack.includes("preface")) return "preface";
  if (haystack.includes("reviews")) return "reviews";
  if (haystack.includes("foreword")) return "foreword";
  if (haystack.includes("introduction")) return "introduction";
  if (haystack.includes("references") || haystack.includes("notes")) return "references";
  if (haystack.includes("further-reading")) return "further-reading";

  return null;
}

function getBaseDisplayTitle(chapter: Chapter, sessionContext: string | null): string {
  if (chapter.mode !== "static") {
    return normalizeSessionTitle(chapter.title);
  }

  const kind = getStaticKind(chapter);

  switch (kind) {
    case "front-matter":
      return "Front matter";
    case "preface":
      return "Preface";
    case "reviews":
      return "Reviews";
    case "foreword":
      return "Foreword";
    case "introduction":
      return "Introduction";
    case "references":
      return "References";
    case "further-reading":
      return "Further reading";
    default:
      return chapter.title
        .toLowerCase()
        .replace(/\b\w/g, (match) => match.toUpperCase());
  }
}

export function getFirstInteractiveChapter(chapters: Chapter[]): Chapter | undefined {
  return chapters.find((chapter) => chapter.mode !== "static") ?? chapters[0];
}

export function getChapterDisplayTitleMap(chapters: Chapter[]): Map<string, string> {
  const baseTitles = new Map<string, string>();
  let sessionContext: string | null = null;

  for (const chapter of chapters) {
    const displayTitle = getBaseDisplayTitle(chapter, sessionContext);
    baseTitles.set(chapter.id, displayTitle);

    if (chapter.mode !== "static") {
      sessionContext = displayTitle;
    }
  }

  const counts = new Map<string, number>();
  for (const title of baseTitles.values()) {
    counts.set(title, (counts.get(title) ?? 0) + 1);
  }

  const seen = new Map<string, number>();
  const displayTitles = new Map<string, string>();

  for (const chapter of chapters) {
    const title = baseTitles.get(chapter.id) ?? chapter.title;
    if ((counts.get(title) ?? 0) === 1) {
      displayTitles.set(chapter.id, title);
      continue;
    }

    const occurrence = (seen.get(title) ?? 0) + 1;
    seen.set(title, occurrence);
    displayTitles.set(chapter.id, `${title} ${occurrence}`);
  }

  return displayTitles;
}

export function getChapterDisplayTitle(
  chapters: Chapter[],
  chapter: Chapter
): string {
  return getChapterDisplayTitleMap(chapters).get(chapter.id) ?? chapter.title;
}

/**
 * Compare a markdown heading string to a chapter display title (e.g. "INTRODUCTION" vs "Introduction").
 */
export function normalizeHeadingForTitleMatch(text: string): string {
  return text
    .trim()
    .replace(/^#+\s*/u, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

export function headingTextMatchesDisplayTitle(
  headingPlainText: string,
  displayTitle: string
): boolean {
  const a = normalizeHeadingForTitleMatch(headingPlainText);
  const b = normalizeHeadingForTitleMatch(displayTitle);
  return a.length > 0 && b.length > 0 && a === b;
}

export function getResumeHref(
  chapters: Chapter[],
  lastRead: LastReadPosition | null
): string {
  if (lastRead && chapters.some((chapter) => chapter.id === lastRead.chapterId)) {
    return `/course/${lastRead.chapterId}#${lastRead.blockId}`;
  }

  const firstInteractiveChapter = getFirstInteractiveChapter(chapters);

  if (firstInteractiveChapter) {
    return `/course/${firstInteractiveChapter.id}`;
  }

  return "/course";
}
