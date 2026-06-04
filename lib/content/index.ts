/**
 * Content loader: manifest + chapters/sections/blocks.
 * Re-export types and loader APIs.
 */

export {
  getChapters,
  getChapter,
  getSections,
  getBlocks,
  getBlockById,
} from "./loader";
export {
  getChapterDisplayTitle,
  getChapterDisplayTitleMap,
  getFirstInteractiveChapter,
  getResumeHref,
  headingTextMatchesDisplayTitle,
  normalizeHeadingForTitleMatch,
} from "./display";
export type {
  Chapter,
  Section,
  Block,
  ListItem,
  Manifest,
  BlockType,
  ChapterMode,
} from "./types";
export { stableBlockId } from "./blockId";
