"use server";

import { createClient } from "@/lib/supabase/server";
import { getBlockById } from "@/lib/content/loader";

export interface LastReadPosition {
  chapterId: string;
  blockId: string;
}

/**
 * Returns the user's last-read position (chapter + block) for redirect, or null.
 */
export async function getLastReadPosition(): Promise<LastReadPosition | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data: row, error } = await supabase
    .from("progress")
    .select("section_id, last_block_id")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !row) return null;

  const resolved = getBlockById(row.section_id);
  if (!resolved) return null;
  const blockId = row.last_block_id ?? row.section_id;
  return { chapterId: resolved.chapterId, blockId };
}
