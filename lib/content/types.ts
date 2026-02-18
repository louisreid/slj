/**
 * Content pipeline types: chapters → sections → blocks.
 * Blocks have stable block_id for data-block-id and #block-id linking.
 */

export type BlockType = "heading" | "paragraph";

export interface Block {
  block_id: string;
  type: BlockType;
  content: string;
  level?: number;
}

export interface Section {
  blocks: Block[];
}

export interface Chapter {
  id: string;
  file: string;
  title: string;
  sections: Section[];
}

export interface Manifest {
  chapters: Chapter[];
}
