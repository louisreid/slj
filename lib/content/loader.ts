/**
 * Content loader: reads manifest and returns chapters / sections / blocks.
 * Use for server-side or static loading. Blocks are renderable with data-block-id.
 */

import * as fs from "fs";
import * as path from "path";
import type { Chapter, Manifest, Section, Block } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const MANIFEST_PATH = path.join(CONTENT_DIR, "manifest.json");

let cachedManifest: Manifest | null = null;
let cachedManifestMtimeMs: number | null = null;

function loadManifest(): Manifest {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev && fs.existsSync(MANIFEST_PATH)) {
    const mtimeMs = fs.statSync(MANIFEST_PATH).mtimeMs;
    if (cachedManifest && cachedManifestMtimeMs === mtimeMs) {
      return cachedManifest;
    }
    const raw = fs.readFileSync(MANIFEST_PATH, "utf-8");
    cachedManifest = JSON.parse(raw) as Manifest;
    cachedManifestMtimeMs = mtimeMs;
    return cachedManifest;
  }

  if (cachedManifest) return cachedManifest;
  const raw = fs.readFileSync(MANIFEST_PATH, "utf-8");
  cachedManifest = JSON.parse(raw) as Manifest;
  if (fs.existsSync(MANIFEST_PATH)) {
    cachedManifestMtimeMs = fs.statSync(MANIFEST_PATH).mtimeMs;
  }
  return cachedManifest;
}

/**
 * All chapters in order.
 */
export function getChapters(): Chapter[] {
  return loadManifest().chapters;
}

/**
 * Single chapter by id (e.g. "01-intro"), or undefined.
 */
export function getChapter(id: string): Chapter | undefined {
  return loadManifest().chapters.find((ch) => ch.id === id);
}

/**
 * All sections for a chapter (in order).
 */
export function getSections(chapter: Chapter): Section[] {
  return chapter.sections;
}

/**
 * All blocks for a chapter (flattened, in order). List items expand to pseudo-paragraphs for notes/progress.
 */
export function getBlocks(chapter: Chapter): Block[] {
  const result: Block[] = [];
  for (const section of chapter.sections) {
    for (const block of section.blocks) {
      if (block.type === "list" && block.items?.length) {
        for (const item of block.items) {
          result.push({
            block_id: item.block_id,
            type: "paragraph",
            content: item.content,
          });
        }
      } else {
        result.push(block);
      }
    }
  }
  return result;
}

/**
 * Find a block by block_id across all chapters. Returns the block and its chapter id.
 */
export function getBlockById(blockId: string): { block: Block; chapterId: string } | undefined {
  const manifest = loadManifest();
  for (const chapter of manifest.chapters) {
    for (const section of chapter.sections) {
      for (const block of section.blocks) {
        if (block.block_id === blockId) return { block, chapterId: chapter.id };
        if (block.type === "list" && block.items) {
          const item = block.items.find((li) => li.block_id === blockId);
          if (item) {
            return {
              block: { block_id: item.block_id, type: "paragraph", content: item.content },
              chapterId: chapter.id,
            };
          }
        }
      }
    }
  }
  return undefined;
}

export type { Chapter, Section, Block, Manifest } from "./types";
