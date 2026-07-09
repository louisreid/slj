import manifest from "@/content/manifest.json";
import { getChapterDisplayTitleMap } from "@/lib/content/display";
import { getInteractiveSessionNumberMap } from "@/lib/progress-summary";
import { formatSessionLabel } from "@/lib/session-labels";
import type { Manifest } from "@/lib/content/types";

export interface CourseSearchHit {
  chapterId: string;
  chapterTitle: string;
  chapterDisplayTitle: string;
  sessionLabel?: string;
  blockId: string;
  snippet: string;
  sectionHeading?: string;
}

const typedManifest = manifest as Manifest;

function stripMarkdown(text: string): string {
  return text
    .replace(/\[(\d+)\]/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildCourseSearchIndex(): CourseSearchHit[] {
  const hits: CourseSearchHit[] = [];
  const chapters = typedManifest.chapters;
  const displayTitles = getChapterDisplayTitleMap(chapters);
  const sessionNumbers = getInteractiveSessionNumberMap(chapters);

  for (const chapter of chapters) {
    let sectionHeading: string | undefined;
    const chapterDisplayTitle =
      displayTitles.get(chapter.id) ?? chapter.title;
    const sessionNum = sessionNumbers.get(chapter.id);
    const sessionLabel =
      sessionNum != null ? formatSessionLabel(sessionNum) : undefined;

    for (const section of chapter.sections) {
      for (const block of section.blocks) {
        if (block.type === "heading") {
          sectionHeading = block.content;
        }
        const text = stripMarkdown(block.content);
        if (text.length < 8) continue;
        if (block.type === "heading" && (block.level ?? 2) <= 2) {
          hits.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            chapterDisplayTitle,
            sessionLabel,
            blockId: block.block_id,
            snippet: text.slice(0, 140),
            sectionHeading,
          });
        } else if (block.type === "paragraph") {
          hits.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            chapterDisplayTitle,
            sessionLabel,
            blockId: block.block_id,
            snippet: text.slice(0, 200),
            sectionHeading,
          });
        }
      }
    }
  }

  return hits;
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
}

export function searchCourseIndex(
  index: CourseSearchHit[],
  query: string,
  limit = 12
): CourseSearchHit[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored = index
    .map((hit) => {
      const hay = `${hit.chapterDisplayTitle} ${hit.sessionLabel ?? ""} ${hit.sectionHeading ?? ""} ${hit.snippet}`.toLowerCase();
      let score = 0;
      for (const token of tokens) {
        if (hay.includes(token)) score += 1;
      }
      return { hit, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ hit }) => hit);
}
