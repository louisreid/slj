"use client";

import { useEffect, useRef, useState } from "react";
import type { Note } from "@/lib/notes";

export interface NotesPanelContentProps {
  blockIds: string[];
  blockIdToLabel: Record<string, string>;
  notes: Note[];
  onUpsert: (block_id: string, body: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  scrollToBlockId: string | null;
  onScrolledToBlock?: () => void;
  isSignedIn: boolean;
}

function NoteCard({
  note,
  label,
  onUpsert,
  onDelete,
}: {
  note: Note;
  label: string;
  onUpsert: (block_id: string, body: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [localBody, setLocalBody] = useState(note.body);
  useEffect(() => {
    setLocalBody(note.body);
  }, [note.body]);

  const handleBlur = () => {
    if (localBody.trim() !== note.body.trim()) {
      onUpsert(note.block_id, localBody.trim()).catch(() => {});
    }
  };

  return (
    <div
      className="border-b border-[#E5E7EB] pb-4 mb-4 last:border-b-0 last:mb-0"
      data-note-block-id={note.block_id}
    >
      <p className="font-sans text-xs text-[rgba(0,0,0,0.45)] mb-1 truncate">
        {label}
      </p>
      <textarea
        className="w-full font-sans text-sm text-[#000] border border-[#E5E7EB] rounded p-2 min-h-[80px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.30)]"
        value={localBody}
        onChange={(e) => setLocalBody(e.target.value)}
        onBlur={handleBlur}
        aria-label={`Note for ${label}`}
      />
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={() => onDelete(note.id)}
          className="font-sans text-xs text-[rgba(0,0,0,0.65)] hover:text-[#000] underline"
        >
          Delete note
        </button>
      </div>
    </div>
  );
}

export function NotesPanelContent({
  blockIds,
  blockIdToLabel,
  notes,
  onUpsert,
  onDelete,
  scrollToBlockId,
  onScrolledToBlock,
  isSignedIn,
}: NotesPanelContentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollToBlockId || !scrollRef.current) return;
    const el = scrollRef.current.querySelector(
      `[data-note-block-id="${scrollToBlockId}"]`
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      onScrolledToBlock?.();
    }
  }, [scrollToBlockId, onScrolledToBlock]);

  if (!isSignedIn) {
    return (
      <p className="font-sans text-sm text-[rgba(0,0,0,0.65)]">
        Sign in to add notes.
      </p>
    );
  }

  const notesByBlock = new Map(notes.map((n) => [n.block_id, n]));
  const notesInOrder = blockIds
    .map((id) => notesByBlock.get(id))
    .filter((n): n is Note => n != null);

  return (
    <div ref={scrollRef}>
      <h2 className="font-sans text-sm font-medium text-[#000] mb-3">
        Notes for this chapter
      </h2>
      {notesInOrder.length === 0 ? (
        <p className="font-sans text-sm text-[rgba(0,0,0,0.65)]">
          No notes yet. Use “Add note” next to a paragraph to add one.
        </p>
      ) : (
        <ul className="list-none p-0 m-0">
          {notesInOrder.map((note) => (
            <li key={note.id}>
              <NoteCard
                note={note}
                label={blockIdToLabel[note.block_id] ?? note.block_id}
                onUpsert={onUpsert}
                onDelete={onDelete}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
