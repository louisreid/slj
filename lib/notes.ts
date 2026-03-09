/**
 * Client-side notes API: fetch, insert, update, delete.
 * Uses browser Supabase client; RLS enforces user_id = auth.uid().
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export interface Note {
  id: string;
  user_id: string;
  block_id: string;
  body: string;
  created_at: string;
  updated_at: string;
}

const BODY_MAX_LENGTH = 10_000;

export async function fetchNotesForBlocks(
  supabase: SupabaseClient,
  blockIds: string[]
): Promise<Note[]> {
  if (blockIds.length === 0) return [];
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .in("block_id", blockIds)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Note[];
}

export async function insertNote(
  supabase: SupabaseClient,
  block_id: string,
  body: string
): Promise<Note> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error("Must be signed in to save notes");

  const trimmed = body.slice(0, BODY_MAX_LENGTH);
  const updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: user.id,
      block_id,
      body: trimmed,
      updated_at,
    })
    .select("id, user_id, block_id, body, created_at, updated_at")
    .single();

  if (error) throw error;
  return data as Note;
}

export async function updateNote(
  supabase: SupabaseClient,
  id: string,
  body: string
): Promise<Note> {
  const trimmed = body.slice(0, BODY_MAX_LENGTH);
  const updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("notes")
    .update({ body: trimmed, updated_at })
    .eq("id", id)
    .select("id, user_id, block_id, body, created_at, updated_at")
    .single();

  if (error) throw error;
  return data as Note;
}

export async function deleteNote(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
}
