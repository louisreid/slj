import manifest from "@/content/manifest.json";
import type { Manifest } from "@/lib/content/types";

export interface CourseSearchHit {
  chapterId: string;
  chapterTitle: string;
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

  for (const chapter of typedManifest.chapters) {
    let sectionHeading: string | undefined;

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
            blockId: block.block_id,
            snippet: text.slice(0, 120),
            sectionHeading,
          });
        } else if (block.type === "paragraph") {
          hits.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            blockId: block.block_id,
            snippet: text.slice(0, 160),
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
      const hay = `${hit.chapterTitle} ${hit.sectionHeading ?? ""} ${hit.snippet}`.toLowerCase();
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
