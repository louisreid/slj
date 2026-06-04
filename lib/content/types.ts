/**
 * Content pipeline types: chapters → sections → blocks.
 * Blocks have stable block_id for data-block-id and #block-id linking.
 */

export type BlockType = "heading" | "paragraph" | "list" | "verse";

export interface ListItem {
  block_id: string;
  content: string;
}

export interface Block {
  block_id: string;
  type: BlockType;
  content: string;
  level?: number;
  /** When true, paragraph is body text even if it starts with a quote character. Set via `^` line prefix in markdown. */
  forceBody?: boolean;
  /** Explicit scripture reference from `@Matthew 6:25-33` (or `@scripture` prefix on the paragraph). */
  scriptureRef?: string;
  /** When true, render as a scripture quote block. Set via `@scripture` line prefix. */
  forceScripture?: boolean;
  /** When true, render as a centered headline quote. Set via `!!` line prefix. */
  headlineQuote?: boolean;
  /** Present when `type` is `"list"`. */
  items?: ListItem[];
  /** Present when `type` is `"verse"`. Multi-line poetry or lyrics. */
  lines?: ListItem[];
  /** Verse layout: `>>` = right column (default), `::` = centered. */
  verseAlign?: "right" | "center";
}

export interface Section {
  blocks: Block[];
}

export type ChapterMode = "interactive" | "static";

export interface Chapter {
  id: string;
  file: string;
  title: string;
  /** Default "interactive". Static = no note affordances or progress UI. */
  mode?: ChapterMode;
  sections: Section[];
}

export interface Manifest {
  chapters: Chapter[];
}
