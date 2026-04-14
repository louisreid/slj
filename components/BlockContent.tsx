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

const SCRIPTURE_REF_REGEX =
  /(?:^|\(|\s)(?:[1-3]\s*)?[A-Za-z]+(?:\s+[A-Za-z]+)*\s+\d{1,3}:\d{1,3}(?:[–-]\d{1,3})?(?:\)|[.,”'"])?/u;

function normalizeParagraphForCompare(content: string): string {
  return content
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[“”‘’'"`]/g, "");
}

export function isQuoteLikeParagraph(content: string): boolean {
  const trimmed = content.trim();
  return /^([>"“”‘’']|\u2014)/u.test(trimmed);
}

export function isScriptureParagraph(content: string): boolean {
  return SCRIPTURE_REF_REGEX.test(content.trim());
}

export function isDuplicateAdjacentQuote(current: Block, previous: Block | null): boolean {
  if (!previous) return false;
  if (current.type !== "paragraph" || previous.type !== "paragraph") return false;
  if (!isQuoteLikeParagraph(current.content) || !isQuoteLikeParagraph(previous.content)) return false;
  return normalizeParagraphForCompare(current.content) === normalizeParagraphForCompare(previous.content);
}

export function BlockNode({ block }: { block: Block }) {
  if (block.type === "heading") {
    const level = Math.min(Math.max(block.level ?? 1, 1), 6);
    const Tag = HEADING_TAGS[level - 1];
    const headingClassName =
      level <= 1
        ? "mt-10 text-4xl font-semibold leading-tight first:mt-0 md:text-5xl"
        : level === 2
          ? "mt-10 text-3xl font-semibold leading-tight first:mt-0"
          : "mt-8 text-2xl font-semibold leading-tight first:mt-0";

    return (
      <Tag
        className={`font-serif text-[var(--slj-text)] ${headingClassName}`}
        data-block-id={block.block_id}
        id={block.block_id}
      >
        {block.content}
      </Tag>
    );
  }
  if (block.type === "paragraph") {
    const quoteLike = isQuoteLikeParagraph(block.content);
    const scripture = isScriptureParagraph(block.content);
    if (quoteLike) {
      return (
        <blockquote
          className={`mt-6 border-l-4 border-[var(--slj-border)] pl-5 pr-2 ${
            scripture
              ? "font-serif text-[18px] font-semibold leading-[1.72] text-[var(--slj-text)] md:text-[19px]"
              : "font-serif text-[17px] italic leading-[1.75] text-[var(--slj-text)] md:text-[18px]"
          }`}
          data-block-id={block.block_id}
          id={block.block_id}
        >
          {!scripture ? (
            <p className="slj-faint mb-1 font-sans text-[11px] uppercase tracking-[0.16em]">Quote</p>
          ) : null}
          <p>{block.content}</p>
        </blockquote>
      );
    }

    return (
      <p
        className="mt-5 font-serif text-[18px] font-medium leading-[1.72] text-[var(--slj-text)] md:text-[19px]"
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
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onAddOrEditNote(block.block_id);
        }
      }}
      className={`group/block relative -mx-2 flex items-center rounded px-2 py-1 transition-colors ${
        isActive ? "bg-[var(--slj-active)]" : "hover:bg-[var(--slj-hover)] focus-within:bg-[var(--slj-hover)]"
      }`}
    >
      <div className="min-w-0 flex-1 pr-12">
        <BlockNode block={block} />
      </div>
      <button
        type="button"
        onClick={() => onAddOrEditNote(block.block_id)}
        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded border border-transparent bg-transparent text-[var(--slj-text-muted)] transition-colors hover:border-[var(--slj-border)] hover:text-[var(--slj-text)] focus-visible:border-[var(--slj-border)] focus-visible:text-[var(--slj-text)] md:opacity-0 md:group-hover/block:opacity-100 md:group-focus-within/block:opacity-100"
        aria-label={hasNote ? "Edit note" : "Add note for this paragraph"}
      >
        <MessageSquare size={16} strokeWidth={2.1} />
      </button>
    </div>
  );
}
