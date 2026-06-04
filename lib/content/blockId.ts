import { createHash } from "crypto";

/** Stable block id from chapter + content (used by manifest generation and list items). */
export function stableBlockId(chapterId: string, content: string): string {
  const hash = createHash("sha256")
    .update(chapterId + "\n" + content)
    .digest("hex")
    .slice(0, 12);
  return `${chapterId}-${hash}`;
}
