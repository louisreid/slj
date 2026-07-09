"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function NavCourseSearch({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const goToSearch = useCallback(
    (value = "") => {
      onNavigate?.();
      const href = value
        ? `/search?q=${encodeURIComponent(value)}`
        : "/search";
      if (pathname === "/search" && !value) return;
      router.push(href);
    },
    [onNavigate, pathname, router]
  );

  const handleFocus = useCallback(() => {
    goToSearch();
  }, [goToSearch]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      goToSearch(e.target.value);
    },
    [goToSearch]
  );

  return (
    <div className="border-b border-[var(--slj-border)] p-4">
      <input
        type="search"
        onFocus={handleFocus}
        onChange={handleChange}
        placeholder="Search all chapters…"
        className="slj-input w-full px-3 py-2 font-sans text-sm"
        aria-label="Search all chapters"
      />
    </div>
  );
}
