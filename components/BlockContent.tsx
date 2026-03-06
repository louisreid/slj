"use client";

import { MessageSquare } from "lucide-react";
import type { Block, Section } from "@/lib/content";

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

export function getSectionId(section: Section): string | undefined {
  return section.blocks[0]?.block_id;
}

export function firstHeadingBlock(section: Section): Block | undefined {
  return section.blocks.find((b) => b.type === "heading");
}

export function BlockNode({ block }: { block: Block }) {
  if (block.type === "heading") {
    const level = Math.min(Math.max(block.level ?? 1, 1), 6);
    const Tag = HEADING_TAGS[level - 1];
    return (
      <Tag
        className="font-serif font-semibold text-[#fff] mt-10 first:mt-0 text-3xl leading-tight"
        data-block-id={block.block_id}
        id={block.block_id}
      >
        {block.content}
      </Tag>
    );
  }
  if (block.type === "paragraph") {
    return (
      <p
        className="font-serif text-white/85 leading-[1.85] mt-5 text-lg"
        data-block-id={block.block_id}
        id={block.block_id}
      >
        {block.content}
      </p>
    );
  }
  return null;
}

export function BlockWithNoteAction({
  block,
  hasNote,
  onAddOrEditNote,
}: {
  block: Block;
  hasNote: boolean;
  onAddOrEditNote: (block_id: string) => void;
}) {
  return (
    <div className="group/block relative flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <BlockNode block={block} />
      </div>
      <button
        type="button"
        onClick={() => onAddOrEditNote(block.block_id)}
        className="shrink-0 mt-1 p-1 text-white/45 hover:text-white transition-colors rounded"
        aria-label={hasNote ? "Edit note" : "Add note for this paragraph"}
      >
        <MessageSquare size={14} strokeWidth={2} />
      </button>
    </div>
  );
}
