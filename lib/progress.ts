/**
 * Client-side progress API: upsert section progress, fetch all for user.
 * Uses browser Supabase client; RLS enforces user_id = auth.uid().
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export interface ProgressRow {
  id: string;
  user_id: string;
  section_id: string;
  completed_at: string | null;
  last_block_id: string | null;
  updated_at: string;
}

export interface UpsertProgressOptions {
  last_block_id?: string;
  completed_at?: string;
}

export async function upsertProgress(
  supabase: SupabaseClient,
  section_id: string,
  options: UpsertProgressOptions = {}
): Promise<void> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) return;

  const updated_at = new Date().toISOString();
  const payload: {
    user_id: string;
    section_id: string;
    updated_at: string;
    last_block_id?: string;
    completed_at?: string;
  } = {
    user_id: user.id,
    section_id,
    updated_at,
  };
  if (options.last_block_id !== undefined) payload.last_block_id = options.last_block_id;
  if (options.completed_at !== undefined) payload.completed_at = options.completed_at;

  const { error } = await supabase.from("progress").upsert(payload, {
    onConflict: "user_id,section_id",
  });
  if (error) throw error;
}

export async function getProgressForUser(
  supabase: SupabaseClient
): Promise<ProgressRow[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) return [];

  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProgressRow[];
}
