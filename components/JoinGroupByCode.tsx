"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { joinGroupByCode } from "@/lib/groups";

export function JoinGroupByCode({ code }: { code: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "joining" | "done">("idle");

  useEffect(() => {
    if (!code.trim() || status !== "idle") return;
    setStatus("joining");
    const supabase = createClient();
    joinGroupByCode(supabase, code)
      .then((groupId) => {
        setStatus("done");
        router.replace(`/groups/${groupId}`);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Could not join group");
        setStatus("idle");
      });
  }, [code, router, status]);

  if (error) {
    return (
      <div className="font-sans">
        <p className="text-white">{error}</p>
        <Link href="/groups" className="mt-2 inline-block text-sm underline text-white/70 hover:text-white">
          Back to Groups
        </Link>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <p className="text-white/70">Joining group…</p>
    </div>
  );
}
