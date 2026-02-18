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

function loadManifest(): Manifest {
  if (cachedManifest) return cachedManifest;
  const raw = fs.readFileSync(MANIFEST_PATH, "utf-8");
  cachedManifest = JSON.parse(raw) as Manifest;
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
 * All blocks for a chapter (flattened, in order). Useful for rendering with data-block-id.
 */
export function getBlocks(chapter: Chapter): Block[] {
  return chapter.sections.flatMap((s) => s.blocks);
}

/**
 * Find a block by block_id across all chapters. Returns the block and its chapter id.
 */
export function getBlockById(blockId: string): { block: Block; chapterId: string } | undefined {
  const manifest = loadManifest();
  for (const chapter of manifest.chapters) {
    for (const section of chapter.sections) {
      const block = section.blocks.find((b) => b.block_id === blockId);
      if (block) return { block, chapterId: chapter.id };
    }
  }
  return undefined;
}

export type { Chapter, Section, Block, Manifest } from "./types";
