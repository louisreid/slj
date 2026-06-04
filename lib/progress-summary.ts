import type { Chapter } from "@/lib/content/types";

/** Chapters that count toward course completion (interactive sessions only). */
export function getProgressCountableChapters(chapters: Chapter[]): Chapter[] {
  return chapters.filter((ch) => ch.mode !== "static");
}

/** 1-based session index for each interactive chapter (manifest order). */
export function getInteractiveSessionNumberMap(
  chapters: Chapter[]
): Map<string, number> {
  const map = new Map<string, number>();
  let n = 0;
  for (const chapter of chapters) {
    if (chapter.mode !== "static") {
      n += 1;
      map.set(chapter.id, n);
    }
  }
  return map;
}

export interface ChapterCompletionStats {
  total: number;
  completed: number;
  percent: number;
}

export function getChapterCompletionStats(
  chapters: Chapter[],
  completedByChapter: Map<string, boolean>
): ChapterCompletionStats {
  const countable = getProgressCountableChapters(chapters);
  const total = countable.length;
  const completed = countable.filter((ch) =>
    completedByChapter.get(ch.id)
  ).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percent };
}
