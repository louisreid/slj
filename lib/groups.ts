/**
 * Client-side groups API: create, join by code, fetch, update shared notes.
 * RLS: only members can read/update groups; join via RPC.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export interface Group {
  id: string;
  name: string;
  invite_code: string;
  start_date: string | null;
  shared_notes: string;
  created_by: string;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: "member" | "owner";
  joined_at: string;
}

const INVITE_CODE_LENGTH = 8;
const INVITE_CODE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const NAME_MAX_LENGTH = 200;
const SHARED_NOTES_MAX_LENGTH = 50_000;

function generateInviteCode(): string {
  const bytes = new Uint8Array(INVITE_CODE_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => INVITE_CODE_CHARS[b % INVITE_CODE_CHARS.length])
    .join("");
}

export async function createGroup(
  supabase: SupabaseClient,
  name: string,
  start_date: string | null
): Promise<Group> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error("Must be signed in to create a group");

  const trimmedName = name.trim().slice(0, NAME_MAX_LENGTH);
  if (!trimmedName) throw new Error("Group name is required");

  const dateValue =
    start_date && start_date.trim() ? start_date.trim() : null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const invite_code = generateInviteCode();
    const { data: group, error: insertError } = await supabase
      .from("groups")
      .insert({
        name: trimmedName,
        invite_code,
        start_date: dateValue,
        shared_notes: "",
        created_by: user.id,
      })
      .select("id, name, invite_code, start_date, shared_notes, created_by, created_at")
      .single();

    if (insertError) {
      if (insertError.code === "23505" && attempt === 0) {
        continue;
      }
      throw insertError;
    }

    const { error: memberError } = await supabase.from("group_members").insert({
      group_id: (group as Group).id,
      user_id: user.id,
      role: "owner",
    });
    if (memberError) {
      await supabase.from("groups").delete().eq("id", (group as Group).id);
      throw memberError;
    }

    return group as Group;
  }

  throw new Error("Could not generate unique invite code");
}

export async function joinGroupByCode(
  supabase: SupabaseClient,
  code: string
): Promise<string> {
  const trimmed = code.trim();
  if (!trimmed) throw new Error("Invite code is required");

  const { data, error } = await supabase.rpc("join_group_by_invite_code", {
    p_invite_code: trimmed,
  });
  if (error) throw error;
  if (data == null) throw new Error("Invalid or expired invite code");
  return data as string;
}

export async function fetchUserGroups(
  supabase: SupabaseClient
): Promise<Group[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) return [];

  const { data: memberships, error: memError } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", user.id);
  if (memError) throw memError;
  if (!memberships?.length) return [];

  const groupIds = memberships.map((m) => m.group_id);
  const { data: groups, error: groupsError } = await supabase
    .from("groups")
    .select("*")
    .in("id", groupIds)
    .order("name");
  if (groupsError) throw groupsError;
  return (groups ?? []) as Group[];
}

export async function fetchGroup(
  supabase: SupabaseClient,
  groupId: string
): Promise<Group | null> {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Group;
}

export async function updateGroupSharedNotes(
  supabase: SupabaseClient,
  groupId: string,
  shared_notes: string
): Promise<void> {
  const trimmed = shared_notes.slice(0, SHARED_NOTES_MAX_LENGTH);
  const { error } = await supabase
    .from("groups")
    .update({ shared_notes: trimmed })
    .eq("id", groupId);
  if (error) throw error;
}
