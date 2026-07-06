import {
  getChapterDisplayTitleMap,
  getChapters,
} from "@/lib/content";
import { getInteractiveSessionNumberMap } from "@/lib/progress-summary";
import { formatSessionLabel } from "@/lib/session-labels";

export type NavChapter = {
  id: string;
  title: string;
  sessionLabel?: string;
  isSession: boolean;
};

export function buildNavChapters(): NavChapter[] {
  const chapters = getChapters();
  const titles = getChapterDisplayTitleMap(chapters);
  const sessionNumbers = getInteractiveSessionNumberMap(chapters);

  return chapters.map((ch) => {
    const sessionNum = sessionNumbers.get(ch.id);
    return {
      id: ch.id,
      title: titles.get(ch.id) ?? ch.title,
      sessionLabel:
        sessionNum != null ? formatSessionLabel(sessionNum) : undefined,
      isSession: ch.mode !== "static",
    };
  });
}
