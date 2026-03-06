"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignInForm({ returnTo }: { returnTo: string }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSending(true);

    const redirectUrl = new URL("/auth/callback", window.location.origin);
    redirectUrl.searchParams.set("returnTo", returnTo);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectUrl.toString(),
      },
    });

    setSending(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSent(true);
  }

  return (
    <form onSubmit={handleSendMagicLink} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block font-sans text-sm text-black/65">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          disabled={sending || sent}
          className="slj-input w-full px-3 py-2.5 text-sm"
        />
      </div>

      {error ? (
        <p className="font-sans text-sm text-black" role="alert">
          {error}
        </p>
      ) : null}

      {sent ? (
        <div className="space-y-3">
          <p className="font-sans text-sm leading-6 text-black/65">
            Check <span className="font-medium text-black">{email}</span> for a
            magic link to continue.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setError(null);
              }}
              className="font-sans text-sm text-black/65 underline underline-offset-4 hover:text-black"
            >
              Use a different email
            </button>
            <button
              type="submit"
              disabled={sending}
              className="font-sans text-sm text-black/65 underline underline-offset-4 hover:text-black"
            >
              {sending ? "Sending..." : "Send again"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="submit"
          className="slj-button w-full px-3 py-2.5 text-sm"
          disabled={sending}
        >
          {sending ? "Sending magic link..." : "Send magic link"}
        </button>
      )}
    </form>
  );
}
