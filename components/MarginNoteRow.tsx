"use client";

import type { Block } from "@/lib/content";
import type { Note } from "@/lib/notes";
import { BlockWithNoteAction } from "@/components/BlockContent";
import { NoteCard } from "@/components/notes/NoteCard";
import { NewNoteComposer } from "@/components/notes/NewNoteComposer";

export interface MarginNoteRowProps {
  block: Block;
  notes: Note[];
  label: string;
  hasNote: boolean;
  activeBlockId: string | null;
  isSignedIn: boolean;
  onAddOrEditNote: (block_id: string) => void;
  onInsert: (block_id: string, body: string) => Promise<void>;
  onUpdate: (id: string, body: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCancelComposer: () => void;
  onActivateBlock: (blockId: string) => void;
}

export function MarginNoteRow({
  block,
  notes,
  label,
  hasNote,
  activeBlockId,
  isSignedIn,
  onAddOrEditNote,
  onInsert,
  onUpdate,
  onDelete,
  onCancelComposer,
  onActivateBlock,
}: MarginNoteRowProps) {
  const isActive = activeBlockId === block.block_id;
  const showComposer = isSignedIn && isActive;
  const showMarginColumn = isSignedIn && (notes.length > 0 || showComposer);

  return (
    <div
      data-block-row={block.block_id}
      className={`grid grid-cols-1 gap-x-4 gap-y-3 items-start py-1 ${
        showMarginColumn
          ? "md:grid-cols-[minmax(0,1fr)_min(256px,28vw)]"
          : ""
      } ${isActive ? "rounded bg-[var(--slj-active)]" : ""}`}
    >
      <div className="min-w-0">
        <BlockWithNoteAction
          block={block}
          hasNote={hasNote}
          onAddOrEditNote={onAddOrEditNote}
          isActive={false}
          showNoteAction={isSignedIn}
        />
      </div>
      {showMarginColumn ? (
        <div
          className="margin-notes-column min-w-0 md:max-h-[50vh] md:overflow-y-auto"
          aria-label="Notes for this paragraph"
        >
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              label={label}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isActive={note.block_id === activeBlockId}
              onActivateBlock={onActivateBlock}
            />
          ))}
          {showComposer ? (
            <NewNoteComposer
              blockId={block.block_id}
              onSave={onInsert}
              onCancel={onCancelComposer}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
