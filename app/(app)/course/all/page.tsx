import { getChapterDisplayTitleMap, getChapters, getBlocks } from "@/lib/content";
import { FullBookReader } from "@/components/FullBookReader";

export default function AllChaptersPage() {
  const chapters = getChapters();
  const chapterTitles = Object.fromEntries(getChapterDisplayTitleMap(chapters));
  const blockIds: string[] = [];
  const blockIdToLabel: Record<string, string> = {};

  for (const chapter of chapters) {
    if (chapter.mode === "static") continue;
    const blocks = getBlocks(chapter);
    for (const b of blocks) {
      blockIds.push(b.block_id);
      blockIdToLabel[b.block_id] = b.content.slice(0, 40);
    }
  }

  return (
    <FullBookReader
      chapters={chapters}
      chapterTitles={chapterTitles}
      blockIds={blockIds}
      blockIdToLabel={blockIdToLabel}
    />
  );
}
