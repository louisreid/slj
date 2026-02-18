"use client";

import { useState } from "react";

export function CopyInviteLinkClient({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/groups/join?code=${encodeURIComponent(code)}`
        : "";
    navigator.clipboard.writeText(url).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {}
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-sm underline hover:text-[#000] text-[rgba(0,0,0,0.65)]"
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
