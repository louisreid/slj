"use client";

import { Trash2, Loader2, Check, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Note } from "@/lib/notes";

export interface NotesPanelContentProps {
  blockIds: string[];
  blockIdToLabel: Record<string, string>;
  notes: Note[];
  onInsert: (block_id: string, body: string) => Promise<void>;
  onUpdate: (id: string, body: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCancelNewComment?: () => void;
  scrollToBlockId: string | null;
  onScrolledToBlock?: () => void;
  isSignedIn: boolean;
  title?: string;
  emptyMessage?: string;
  activeBlockId?: string | null;
}

type SaveStatus = "idle" | "saving" | "saved";

function NoteCard({
  note,
  label,
  onUpdate,
  onDelete,
  isActive,
}: {
  note: Note;
  label: string;
  onUpdate: (id: string, body: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isActive?: boolean;
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
    >
      {editing ? (
        <>
          <p className="slj-faint mb-1 truncate font-sans text-[11px]">
            {label}
          </p>
          <textarea
            className="slj-input w-full font-sans text-sm p-2.5 min-h-[100px]"
            value={localBody}
            onChange={(e) => setLocalBody(e.target.value)}
            onBlur={handleBlur}
            aria-label={`Edit comment for ${label}`}
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
          <p className="slj-faint mb-1 truncate font-sans text-[11px]">
            {label}
          </p>
          <p className="font-sans text-sm leading-6 text-[var(--slj-text)] whitespace-pre-wrap">
            {note.body || "\u00a0"}
          </p>
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
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

function NewCommentComposer({
  blockId,
  onSave,
  onCancel,
}: {
  blockId: string;
  onSave: (block_id: string, body: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = body.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    try {
      await onSave(blockId, trimmed);
      setBody("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="slj-card mb-3 p-3" data-note-block-id={blockId} data-composer>
      <textarea
        className="slj-input w-full font-sans text-sm p-2.5 min-h-[100px]"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a comment…"
        aria-label="New comment"
      />
      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="slj-faint rounded p-1 transition-colors hover:text-[var(--slj-text)]"
          aria-label="Cancel"
        >
          <Trash2 size={14} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!body.trim() || saving}
          className="slj-button rounded px-3 py-1.5 font-sans text-sm disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

export function NotesPanelContent({
  blockIds,
  blockIdToLabel,
  notes,
  onInsert,
  onUpdate,
  onDelete,
  onCancelNewComment,
  scrollToBlockId,
  onScrolledToBlock,
  isSignedIn,
  title = "Notes",
  emptyMessage = "No notes yet. Use the comment icon next to a paragraph to add one.",
  activeBlockId,
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
    const target =
      activeBlockId
        ? scrollRef.current.querySelector("[data-composer]")
        : scrollToBlockId
          ? scrollRef.current.querySelector(
              `[data-note-block-id="${scrollToBlockId}"]`
            )
          : null;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      onScrolledToBlock?.();
    }
  }, [scrollToBlockId, activeBlockId, onScrolledToBlock]);

  if (!isSignedIn) {
    return (
      <p className="slj-muted font-sans text-sm">
        Sign in to add notes.
      </p>
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
        <p className="slj-muted font-sans text-sm leading-6">
          {emptyMessage}
        </p>
      ) : (
        <>
          {hasComposer && activeBlockId && (
            <NewCommentComposer
              blockId={activeBlockId}
              onSave={onInsert}
              onCancel={onCancelNewComment ?? (() => {})}
            />
          )}
          <ul className="m-0 list-none p-0">
            {blockIds.map((blockId) => {
              const blockNotes = notesByBlockId.get(blockId);
              if (!blockNotes?.length) return null;
              const labelForBlock =
                blockIdToLabel[blockId] ?? "Comment";
              return (
                <li key={blockId}>
                  {blockNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      label={labelForBlock}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      isActive={note.block_id === activeBlockId}
                    />
                  ))}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
