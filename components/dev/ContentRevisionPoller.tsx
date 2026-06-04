"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const POLL_MS = 1500;

/**
 * In development, refreshes server-rendered course content when manifest.json changes
 * (e.g. after pnpm watch:content). No-op in production builds.
 */
export function ContentRevisionPoller() {
  const router = useRouter();
  const revisionRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    const poll = async () => {
      try {
        const res = await fetch("/api/dev/content-revision", { cache: "no-store" });
        if (!res.ok || !active) return;
        const data = (await res.json()) as { revision: number };
        if (revisionRef.current != null && data.revision !== revisionRef.current) {
          router.refresh();
        }
        revisionRef.current = data.revision;
      } catch {
        // dev helper — ignore transient errors
      }
    };

    void poll();
    const id = setInterval(() => void poll(), POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [router]);

  return null;
}
