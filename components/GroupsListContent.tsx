"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  createGroup,
  joinGroupByCode,
  type Group,
} from "@/lib/groups";

function formatStartDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr + "Z");
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function GroupsListContent({
  groups: initialGroups,
}: {
  groups: Group[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledCode = searchParams.get("code") ?? "";

  const [groups] = useState<Group[]>(initialGroups);
  const [createName, setCreateName] = useState("");
  const [createStartDate, setCreateStartDate] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);

  const [joinCode, setJoinCode] = useState(prefilledCode);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);

  const handleCreate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setCreateError(null);
      setCreateLoading(true);
      try {
        const supabase = createClient();
        const group = await createGroup(
          supabase,
          createName,
          createStartDate || null
        );
        router.push(`/groups/${group.id}`);
      } catch (err) {
        setCreateError(err instanceof Error ? err.message : "Could not create group");
      } finally {
        setCreateLoading(false);
      }
    },
    [createName, createStartDate, router]
  );

  const handleJoin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setJoinError(null);
      setJoinLoading(true);
      try {
        const supabase = createClient();
        const groupId = await joinGroupByCode(supabase, joinCode);
        router.push(`/groups/${groupId}`);
      } catch (err) {
        setJoinError(err instanceof Error ? err.message : "Could not join group");
      } finally {
        setJoinLoading(false);
      }
    },
    [joinCode, router]
  );

  return (
    <div className="font-sans space-y-8">
      <h1 className="text-2xl font-semibold text-[#000]">Groups</h1>

      {groups.length > 0 && (
        <section>
          <h2 className="text-lg font-medium text-[#000] mb-2">Your groups</h2>
          <ul className="space-y-2">
            {groups.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/groups/${g.id}`}
                  className="text-[rgba(0,0,0,0.65)] hover:text-[#000] underline"
                >
                  {g.name}
                </Link>
                <span className="ml-2 text-sm text-[rgba(0,0,0,0.45)]">
                  Start: {formatStartDate(g.start_date)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-lg font-medium text-[#000] mb-2">Create a group</h2>
        <form onSubmit={handleCreate} className="space-y-3 max-w-sm">
          <div>
            <label htmlFor="group-name" className="block text-sm text-[rgba(0,0,0,0.65)] mb-1">
              Name
            </label>
            <input
              id="group-name"
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              required
              maxLength={200}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded text-[#000] focus:outline focus:ring-2 focus:ring-[rgba(0,0,0,0.30)]"
              placeholder="Group name"
            />
          </div>
          <div>
            <label htmlFor="group-start-date" className="block text-sm text-[rgba(0,0,0,0.65)] mb-1">
              Start date (optional)
            </label>
            <input
              id="group-start-date"
              type="date"
              value={createStartDate}
              onChange={(e) => setCreateStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded text-[#000] focus:outline focus:ring-2 focus:ring-[rgba(0,0,0,0.30)]"
            />
          </div>
          {createError && (
            <p className="text-sm text-[#000]">{createError}</p>
          )}
          <button
            type="submit"
            disabled={createLoading}
            className="px-4 py-2 bg-[#000] text-white text-sm font-medium rounded hover:bg-[rgba(0,0,0,0.85)] disabled:opacity-50"
          >
            {createLoading ? "Creating…" : "Create group"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-medium text-[#000] mb-2">Join a group</h2>
        <p className="text-sm text-[rgba(0,0,0,0.65)] mb-2">
          Enter the invite code or use an invite link.
        </p>
        <form onSubmit={handleJoin} className="space-y-3 max-w-sm">
          <div>
            <label htmlFor="invite-code" className="block text-sm text-[rgba(0,0,0,0.65)] mb-1">
              Invite code
            </label>
            <input
              id="invite-code"
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.trim())}
              required
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded text-[#000] focus:outline focus:ring-2 focus:ring-[rgba(0,0,0,0.30)]"
              placeholder="e.g. Ab12Cd34"
            />
          </div>
          {joinError && (
            <p className="text-sm text-[#000]">{joinError}</p>
          )}
          <button
            type="submit"
            disabled={joinLoading}
            className="px-4 py-2 bg-[#000] text-white text-sm font-medium rounded hover:bg-[rgba(0,0,0,0.85)] disabled:opacity-50"
          >
            {joinLoading ? "Joining…" : "Join group"}
          </button>
        </form>
      </section>
    </div>
  );
}
