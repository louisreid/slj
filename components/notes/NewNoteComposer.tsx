"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

export function NewNoteComposer({
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
    <div className="slj-card mb-3 p-3" data-composer data-composer-block-id={blockId}>
      <textarea
        className="slj-input w-full font-sans text-sm p-2.5 min-h-[100px]"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a note…"
        aria-label="New note"
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
