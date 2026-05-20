"use client";

import type { Block, Section } from "@/lib/content";
import type { Note } from "@/lib/notes";
import { MarginNoteRow } from "@/components/MarginNoteRow";
import { BlockNode, isDuplicateAdjacentQuote } from "@/components/BlockContent";

export interface ReaderBlockHandlers {
  isInteractive: boolean;
  blockIdsWithNotes: Set<string>;
  notesByBlockId: Map<string, Note[]>;
  blockIdToLabel: Record<string, string>;
  activeBlockId: string | null;
  isSignedIn: boolean;
  onAddOrEditNote: (block_id: string) => void;
  onInsert: (block_id: string, body: string) => Promise<void>;
  onUpdate: (id: string, body: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCancelComposer: () => void;
  onActivateBlock: (blockId: string) => void;
}

export function buildReaderBlockNodes(
  sections: Section[],
  handlers: ReaderBlockHandlers
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let previousBlock: Block | null = null;

  for (const section of sections) {
    for (const block of section.blocks) {
      if (isDuplicateAdjacentQuote(block, previousBlock)) {
        previousBlock = block;
        continue;
      }

      if (handlers.isInteractive && block.type === "paragraph") {
        const blockNotes = handlers.notesByBlockId.get(block.block_id) ?? [];
        const labelBase = handlers.blockIdToLabel[block.block_id] ?? "Paragraph";
        const label =
          blockNotes.length > 1
            ? `${labelBase} (${blockNotes.length} notes)`
            : labelBase;

        nodes.push(
          <MarginNoteRow
            key={block.block_id}
            block={block}
            notes={blockNotes}
            label={label}
            hasNote={handlers.blockIdsWithNotes.has(block.block_id)}
            activeBlockId={handlers.activeBlockId}
            isSignedIn={handlers.isSignedIn}
            onAddOrEditNote={handlers.onAddOrEditNote}
            onInsert={handlers.onInsert}
            onUpdate={handlers.onUpdate}
            onDelete={handlers.onDelete}
            onCancelComposer={handlers.onCancelComposer}
            onActivateBlock={handlers.onActivateBlock}
          />
        );
      } else {
        nodes.push(<BlockNode key={block.block_id} block={block} />);
      }

      previousBlock = block;
    }
  }

  return nodes;
}
