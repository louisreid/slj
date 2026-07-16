import manifest from "@/content/manifest.json";
import { getChapterDisplayTitleMap } from "@/lib/content/display";
import type { Manifest } from "@/lib/content/types";
import { INLINE_FOOTNOTE_RE } from "@/lib/content/footnotes";

export interface FootnoteCitation {
  noteNumber: number;
  chapterId: string;
  chapterTitle: string;
  blockId: string;
}

const typedManifest = manifest as Manifest;

export function buildFootnoteCitationIndex(): Map<number, FootnoteCitation[]> {
  const index = new Map<number, FootnoteCitation[]>();
  const re = new RegExp(INLINE_FOOTNOTE_RE.source, INLINE_FOOTNOTE_RE.flags);
  const displayTitles = getChapterDisplayTitleMap(typedManifest.chapters);

  for (const chapter of typedManifest.chapters) {
    if (chapter.id === "29-references") continue;
    const chapterTitle = displayTitles.get(chapter.id) ?? chapter.title;
    for (const section of chapter.sections) {
      for (const block of section.blocks) {
        const texts: string[] = [block.content];
        if (block.items) {
          for (const item of block.items) texts.push(item.content);
        }
        if (block.lines) {
          for (const line of block.lines) texts.push(line.content);
        }
        for (const text of texts) {
          let match: RegExpExecArray | null;
          re.lastIndex = 0;
          while ((match = re.exec(text)) !== null) {
            const noteNumber = Number.parseInt(match[1], 10);
            const list = index.get(noteNumber) ?? [];
            if (!list.some((c) => c.blockId === block.block_id)) {
              list.push({
                noteNumber,
                chapterId: chapter.id,
                chapterTitle,
                blockId: block.block_id,
              });
            }
            index.set(noteNumber, list);
          }
        }
      }
    }
  }

  return index;
}
