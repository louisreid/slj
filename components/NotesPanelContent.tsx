"use client";

import { Trash2, Loader2, Check } from "lucide-react";
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

type SaveStatus = "idle" | "saving" | "saved";

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
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  useEffect(() => {
    setLocalBody(note.body);
  }, [note.body]);

  const handleBlur = () => {
    if (localBody.trim() !== note.body.trim()) {
      setSaveStatus("saving");
      onUpsert(note.block_id, localBody.trim())
        .then(() => {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        })
        .catch(() => setSaveStatus("idle"));
    }
  };

  return (
    <div
      className="slj-card p-3 mb-3 last:mb-0"
      data-note-block-id={note.block_id}
    >
      <p className="font-sans text-xs text-white/55 mb-2 truncate">
        {label}
      </p>
      <textarea
        className="slj-input w-full font-sans text-sm p-2.5 min-h-[100px]"
        value={localBody}
        onChange={(e) => setLocalBody(e.target.value)}
        onBlur={handleBlur}
        aria-label={`Note for ${label}`}
      />
      <div className="mt-2 flex items-center justify-end gap-2">
        {saveStatus === "saving" && (
          <span className="flex items-center gap-1 text-xs text-white/55" role="status">
            <Loader2 size={12} className="animate-spin" aria-hidden />
            Saving…
          </span>
        )}
        {saveStatus === "saved" && (
          <span className="flex items-center gap-1 text-xs text-green-500" role="status">
            <Check size={12} aria-hidden />
            Saved
          </span>
        )}
        <button
          type="button"
          onClick={() => onDelete(note.id)}
          className="p-1 text-white/50 hover:text-white transition-colors rounded"
          aria-label="Delete note"
        >
          <Trash2 size={14} strokeWidth={2} />
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
      <p className="font-sans text-sm text-white/70">
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
      <h2 className="font-sans text-sm font-medium text-white mb-3">
        Notes for this chapter
      </h2>
      {notesInOrder.length === 0 ? (
        <p className="font-sans text-sm text-white/70">
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
