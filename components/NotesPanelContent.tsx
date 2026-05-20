"use client";

/**
 * Legacy sidebar notes list. Chapter and full-book readers use MarginNoteRow instead.
 * Kept for reference or future sidebar-only views.
 */

import { useEffect, useRef } from "react";
import type { Note } from "@/lib/notes";
import { NoteCard } from "@/components/notes/NoteCard";
import { NewNoteComposer } from "@/components/notes/NewNoteComposer";

export interface NotesPanelContentProps {
  blockIds: string[];
  blockIdToLabel: Record<string, string>;
  notes: Note[];
  onInsert: (block_id: string, body: string) => Promise<void>;
  onUpdate: (id: string, body: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCancelNewNote?: () => void;
  scrollToBlockId: string | null;
  onScrolledToBlock?: () => void;
  isSignedIn: boolean;
  title?: string;
  emptyMessage?: string;
  activeBlockId?: string | null;
  onActivateBlock?: (blockId: string) => void;
  noteCountsByBlockId?: Map<string, number>;
}

export function NotesPanelContent({
  blockIds,
  blockIdToLabel,
  notes,
  onInsert,
  onUpdate,
  onDelete,
  onCancelNewNote,
  scrollToBlockId,
  onScrolledToBlock,
  isSignedIn,
  title = "Notes",
  emptyMessage = "No notes yet. Use the notes icon next to a paragraph to add one.",
  activeBlockId,
  onActivateBlock,
  noteCountsByBlockId,
}: NotesPanelContentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const notesByBlockId = new Map<string, Note[]>();
  for (const note of notes) {
    const arr = notesByBlockId.get(note.block_id) ?? [];
    arr.push(note);
    notesByBlockId.set(note.block_id, arr);
  }

  useEffect(() => {
    if (!scrollRef.current) return;
    let target: Element | null = null;
    if (activeBlockId) {
      target =
        scrollRef.current.querySelector(
          `[data-composer-block-id="${activeBlockId}"]`
        ) ?? scrollRef.current.querySelector("[data-composer]");
    } else if (scrollToBlockId) {
      const matches = scrollRef.current.querySelectorAll(
        `[data-note-block-id="${scrollToBlockId}"]`
      );
      target = matches.length ? matches[matches.length - 1]! : null;
    }
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      onScrolledToBlock?.();
    }
  }, [scrollToBlockId, activeBlockId, onScrolledToBlock, notes]);

  if (!isSignedIn) {
    return (
      <p className="slj-muted font-sans text-sm">Sign in to add notes.</p>
    );
  }

  const hasComposer = !!activeBlockId;
  const hasAnyNotes = notes.length > 0;

  return (
    <div ref={scrollRef}>
      <h2 className="mb-3 font-sans text-sm font-medium text-[var(--slj-text)]">
        {title}
      </h2>
      {!hasComposer && !hasAnyNotes ? (
        <p className="slj-muted font-sans text-sm leading-6">{emptyMessage}</p>
      ) : (
        <>
          <ul className="m-0 list-none p-0">
            {blockIds.map((blockId) => {
              const blockNotes = notesByBlockId.get(blockId);
              const isComposerBlock = hasComposer && activeBlockId === blockId;
              if (!blockNotes?.length && !isComposerBlock) return null;
              const labelBase = blockIdToLabel[blockId] ?? "Paragraph";
              const noteCount =
                noteCountsByBlockId?.get(blockId) ?? blockNotes?.length ?? 0;
              const labelForBlock =
                noteCount > 1 ? `${labelBase} (${noteCount} notes)` : labelBase;
              return (
                <li key={blockId}>
                  {isComposerBlock ? (
                    <NewNoteComposer
                      blockId={blockId}
                      onSave={onInsert}
                      onCancel={onCancelNewNote ?? (() => {})}
                    />
                  ) : null}
                  {(blockNotes ?? []).map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      label={labelForBlock}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      isActive={note.block_id === activeBlockId}
                      onActivateBlock={onActivateBlock}
                    />
                  ))}
                </li>
              );
            })}
          </ul>
          {hasComposer &&
          activeBlockId &&
          !blockIds.includes(activeBlockId) ? (
            <NewNoteComposer
              blockId={activeBlockId}
              onSave={onInsert}
              onCancel={onCancelNewNote ?? (() => {})}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
