"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateGroupSharedNotes } from "@/lib/groups";

const DEBOUNCE_MS = 600;

export function GroupSharedNotesEditor({
  groupId,
  initialValue,
}: {
  groupId: string;
  initialValue: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef(initialValue);

  useEffect(() => {
    setValue(initialValue);
    lastSavedRef.current = initialValue;
  }, [initialValue]);

  const persist = useCallback(
    (text: string) => {
      if (text === lastSavedRef.current) return;
      setSaveStatus("saving");
      setErrorMessage(null);
      const supabase = createClient();
      updateGroupSharedNotes(supabase, groupId, text)
        .then(() => {
          lastSavedRef.current = text;
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        })
        .catch((err) => {
          setSaveStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Failed to save");
        });
    },
    [groupId]
  );

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      persist(value);
    }, DEBOUNCE_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, persist]);

  return (
    <div className="space-y-2">
      <label htmlFor="shared-notes" className="block text-sm font-medium text-white">
        Group notes (shared with all members)
      </label>
      <textarea
        id="shared-notes"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={12}
        className="slj-input w-full px-3 py-2.5 font-sans text-sm"
        placeholder="Add notes your group can see…"
      />
      <div className="flex items-center gap-2 text-sm">
        {saveStatus === "saving" && (
          <span className="text-white/45">Saving…</span>
        )}
        {saveStatus === "saved" && (
          <span className="text-white/45">Saved</span>
        )}
        {saveStatus === "error" && errorMessage && (
          <span className="text-white" role="alert">
            {errorMessage}
          </span>
        )}
      </div>
    </div>
  );
}
