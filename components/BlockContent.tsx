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
    const headingClassName =
      level <= 1
        ? "mt-10 text-4xl leading-none first:mt-0 md:text-5xl"
        : level === 2
          ? "mt-10 text-3xl leading-tight first:mt-0"
          : "mt-8 text-2xl leading-tight first:mt-0";

    return (
      <Tag
        className={`font-serif font-semibold text-[var(--slj-text)] ${headingClassName}`}
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
        className="mt-5 font-serif text-lg leading-[1.85] text-[var(--slj-text)]"
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
  isActive,
}: {
  block: Block;
  hasNote: boolean;
  onAddOrEditNote: (block_id: string) => void;
  isActive?: boolean;
}) {
  return (
    <div
      className={`group/block relative -mx-2 flex items-center gap-2 rounded px-2 py-1 transition-colors ${
        isActive ? "bg-[var(--slj-active)]" : "hover:bg-[var(--slj-hover)] focus-within:bg-[var(--slj-hover)]"
      }`}
    >
      <div className="min-w-0 flex-1">
        <BlockNode block={block} />
      </div>
      <button
        type="button"
        onClick={() => onAddOrEditNote(block.block_id)}
        className="slj-faint shrink-0 self-center rounded p-1 transition-colors hover:text-[var(--slj-text)] md:opacity-0 md:group-hover/block:opacity-100 md:focus-visible:opacity-100"
        aria-label={hasNote ? "Edit note" : "Add note for this paragraph"}
      >
        <MessageSquare size={14} strokeWidth={2} />
      </button>
    </div>
  );
}
