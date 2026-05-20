"use client";

import { Trash2, Loader2, Check, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import type { Note } from "@/lib/notes";

type SaveStatus = "idle" | "saving" | "saved";

export function NoteCard({
  note,
  label,
  onUpdate,
  onDelete,
  isActive,
  onActivateBlock,
}: {
  note: Note;
  label: string;
  onUpdate: (id: string, body: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isActive?: boolean;
  onActivateBlock?: (blockId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [localBody, setLocalBody] = useState(note.body);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    setLocalBody(note.body);
  }, [note.body]);

  const handleBlur = () => {
    if (!editing) return;
    if (localBody.trim() !== note.body.trim()) {
      setSaveStatus("saving");
      onUpdate(note.id, localBody.trim())
        .then(() => {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
          setEditing(false);
        })
        .catch(() => setSaveStatus("idle"));
    } else {
      setEditing(false);
    }
  };

  return (
    <div
      className={`slj-card mb-3 p-3 last:mb-0 ${
        isActive ? "border-[var(--slj-text)] bg-[var(--slj-active)]" : ""
      }`}
      data-note-block-id={note.block_id}
      onFocusCapture={() => onActivateBlock?.(note.block_id)}
    >
      {editing ? (
        <>
          <p className="slj-faint mb-1 truncate font-sans text-[11px]">{label}</p>
          <textarea
            className="slj-input w-full font-sans text-sm p-2.5 min-h-[100px]"
            value={localBody}
            onChange={(e) => setLocalBody(e.target.value)}
            onBlur={handleBlur}
            aria-label={`Edit note for ${label}`}
            autoFocus
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            {saveStatus === "saving" && (
              <span className="slj-faint flex items-center gap-1 text-xs" role="status">
                <Loader2 size={12} className="animate-spin" aria-hidden />
                Saving…
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="slj-faint flex items-center gap-1 text-xs" role="status">
                <Check size={12} aria-hidden />
                Saved
              </span>
            )}
            <button
              type="button"
              onClick={() => onDelete(note.id)}
              className="slj-faint rounded p-1 transition-colors hover:text-[var(--slj-text)]"
              aria-label="Delete note"
            >
              <Trash2 size={14} strokeWidth={2} />
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="slj-faint mb-1 truncate font-sans text-[11px]">{label}</p>
          <p className="font-sans text-sm leading-6 text-[var(--slj-text)] whitespace-pre-wrap">
            {note.body || "\u00a0"}
          </p>
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onActivateBlock?.(note.block_id);
                setEditing(true);
              }}
              className="slj-faint rounded p-1 transition-colors hover:text-[var(--slj-text)]"
              aria-label="Edit note"
            >
              <Pencil size={14} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(note.id)}
              className="slj-faint rounded p-1 transition-colors hover:text-[var(--slj-text)]"
              aria-label="Delete note"
            >
              <Trash2 size={14} strokeWidth={2} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
