 "use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface SignInFormProps {
  returnTo: string;
  initialError?: string | null;
}

function buildMagicLinkRedirect(returnTo: string): string {
  if (typeof window === "undefined") {
    return `/auth/callback?returnTo=${encodeURIComponent(returnTo)}`;
  }

  const callbackUrl = new URL("/auth/callback", window.location.origin);
  callbackUrl.searchParams.set("returnTo", returnTo);
  return callbackUrl.toString();
}

export function SignInForm({ returnTo, initialError = null }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  async function sendLink() {
    setError(null);
    setSending(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: buildMagicLinkRedirect(returnTo),
      },
    });

    setSending(false);

    if (authError) {
      setError(
        "We could not send the magic link right now. Please check your email address and try again."
      );
      return;
    }

    setSent(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendLink();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="slj-muted mb-1.5 block font-sans text-sm">
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
        <div className="space-y-2" role="alert">
          <p className="font-sans text-sm text-[var(--slj-text)]">{error}</p>
          <button
            type="button"
            onClick={sendLink}
            disabled={sending || !email.trim()}
            className="slj-muted font-sans text-sm underline underline-offset-4 hover:text-[var(--slj-text)] disabled:opacity-50"
          >
            {sending ? "Sending magic link..." : "Resend link"}
          </button>
        </div>
      ) : null}

      {sent ? (
        <div className="space-y-3">
          <p className="font-sans text-base font-medium text-[var(--slj-text)]">
            Check your email
          </p>
          <p className="slj-muted font-sans text-sm leading-6">
            We sent a magic link to{" "}
            <span className="font-medium text-[var(--slj-text)]">{email}</span>. Open the email and
            use the link to sign in.
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setError(null);
              }}
              className="slj-muted font-sans text-sm underline underline-offset-4 hover:text-[var(--slj-text)]"
            >
              Use a different email
            </button>
            <button
              type="button"
              onClick={sendLink}
              disabled={sending}
              className="slj-muted font-sans text-sm underline underline-offset-4 hover:text-[var(--slj-text)]"
            >
              {sending ? "Sending magic link..." : "Resend link"}
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
