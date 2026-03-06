import { getChapters, getBlocks } from "@/lib/content";
import { FullBookReader } from "@/components/FullBookReader";

export default function AllChaptersPage() {
  const chapters = getChapters();
  const blockIds: string[] = [];
  const blockIdToLabel: Record<string, string> = {};

  for (const chapter of chapters) {
    const blocks = getBlocks(chapter);
    for (const b of blocks) {
      blockIds.push(b.block_id);
      blockIdToLabel[b.block_id] = b.content.slice(0, 40);
    }
  }

  return (
    <FullBookReader
      chapters={chapters}
      blockIds={blockIds}
      blockIdToLabel={blockIdToLabel}
    />
  );
}
