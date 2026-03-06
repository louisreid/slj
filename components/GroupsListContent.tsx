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
import { CardSection, PageShell } from "@/components/ui/surfaces";

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
        const message =
          process.env.NODE_ENV === "development" && err instanceof Error
            ? err.message
            : "Could not create group";
        setCreateError(message);
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
        const message =
          process.env.NODE_ENV === "development" && err instanceof Error
            ? err.message
            : "Could not join group";
        setJoinError(message);
      } finally {
        setJoinLoading(false);
      }
    },
    [joinCode, router]
  );

  return (
    <PageShell className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-white/55">Community</p>
        <h1 className="mt-2 text-3xl font-semibold text-white font-serif">Groups</h1>
      </div>

      {groups.length > 0 && (
        <CardSection title="Your groups">
          <ul className="space-y-2">
            {groups.map((g) => (
              <li key={g.id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <Link
                  href={`/groups/${g.id}`}
                  className="text-white/80 hover:text-white underline underline-offset-2"
                >
                  {g.name}
                </Link>
                <span className="ml-2 text-sm text-white/50">
                  Start: {formatStartDate(g.start_date)}
                </span>
              </li>
            ))}
          </ul>
        </CardSection>
      )}

      <CardSection title="Create a group">
        <form onSubmit={handleCreate} className="space-y-3 max-w-sm">
          <div>
            <label htmlFor="group-name" className="block text-sm text-white/70 mb-1">
              Name
            </label>
            <input
              id="group-name"
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              required
              maxLength={200}
              className="slj-input w-full px-3 py-2.5"
              placeholder="Group name"
            />
          </div>
          <div>
            <label htmlFor="group-start-date" className="block text-sm text-white/70 mb-1">
              Start date (optional)
            </label>
            <input
              id="group-start-date"
              type="date"
              value={createStartDate}
              onChange={(e) => setCreateStartDate(e.target.value)}
              className="slj-input w-full px-3 py-2.5"
            />
          </div>
          {createError && (
            <p className="text-sm text-white">{createError}</p>
          )}
          <button
            type="submit"
            disabled={createLoading}
            className="slj-button px-4 py-2 text-sm"
          >
            {createLoading ? "Creating…" : "Create group"}
          </button>
        </form>
      </CardSection>

      <CardSection title="Join a group">
        <p className="text-sm text-white/70 mb-3">
          Enter the invite code or use an invite link.
        </p>
        <form onSubmit={handleJoin} className="space-y-3 max-w-sm">
          <div>
            <label htmlFor="invite-code" className="block text-sm text-white/70 mb-1">
              Invite code
            </label>
            <input
              id="invite-code"
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.trim())}
              required
              className="slj-input w-full px-3 py-2.5"
              placeholder="e.g. Ab12Cd34"
            />
          </div>
          {joinError && (
            <p className="text-sm text-white">{joinError}</p>
          )}
          <button
            type="submit"
            disabled={joinLoading}
            className="slj-button px-4 py-2 text-sm"
          >
            {joinLoading ? "Joining…" : "Join group"}
          </button>
        </form>
      </CardSection>
    </PageShell>
  );
}
