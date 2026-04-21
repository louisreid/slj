"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { sanitizeReturnTo } from "@/lib/navigation";

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
  const router = useRouter();
  const safeReturnTo = sanitizeReturnTo(returnTo);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  async function sendLink() {
    setError(null);
    setSending(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: buildMagicLinkRedirect(safeReturnTo),
      },
    });

    setSending(false);

    if (authError) {
      setError(
        "We could not send the sign-in email right now. Please check your email address and try again."
      );
      return;
    }

    setOtp("");
    setSent(true);
  }

  async function verifyCode() {
    const trimmedEmail = email.trim();
    const digits = otp.replace(/\D/g, "");
    if (digits.length < 6) {
      setError("Enter the full code from your email (usually 6–8 digits).");
      return;
    }

    setError(null);
    setVerifying(true);
    const supabase = createClient();

    const tryTypes = ["email", "magiclink", "signup"] as const;
    let lastError: { message: string } | null = null;

    for (const type of tryTypes) {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: trimmedEmail,
        token: digits,
        type,
      });
      if (!verifyError) {
        router.push(safeReturnTo);
        router.refresh();
        setVerifying(false);
        return;
      }
      lastError = verifyError;
    }

    setVerifying(false);
    setError(
      lastError?.message ??
        "That code did not work. It may have expired — request a new email and try again."
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sent) {
      await verifyCode();
    } else {
      await sendLink();
    }
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

      {error && !sent ? (
        <div className="space-y-2" role="alert">
          <p className="font-sans text-sm text-[var(--slj-text)]">{error}</p>
          <button
            type="button"
            onClick={sendLink}
            disabled={sending || !email.trim()}
            className="slj-muted font-sans text-sm underline underline-offset-4 hover:text-[var(--slj-text)] disabled:opacity-50"
          >
            {sending ? "Sending..." : "Resend email"}
          </button>
        </div>
      ) : null}

      {sent ? (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="font-sans text-base font-medium text-[var(--slj-text)]">
              Check your email
            </p>
            <p className="slj-muted font-sans text-sm leading-6">
              We emailed{" "}
              <span className="font-medium text-[var(--slj-text)]">{email}</span>. Open the message
              and either click the sign-in link or enter the one-time code below.
            </p>
          </div>

          <div className="space-y-3 border-t border-[var(--slj-border)] pt-5">
            <label htmlFor="otp" className="slj-muted mb-1.5 block font-sans text-sm">
              One-time code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 12))}
              placeholder="Digits from your email"
              disabled={verifying}
              className="slj-input w-full px-3 py-2.5 font-mono text-sm tracking-widest"
            />
            {error && sent ? (
              <p className="font-sans text-sm text-[var(--slj-text)]" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              className="slj-button w-full px-3 py-2.5 text-sm"
              disabled={verifying || otp.replace(/\D/g, "").length < 6}
            >
              {verifying ? "Signing in..." : "Sign in with code"}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setOtp("");
                setError(null);
              }}
              disabled={verifying}
              className="slj-muted font-sans text-sm underline underline-offset-4 hover:text-[var(--slj-text)] disabled:opacity-50"
            >
              Use a different email
            </button>
            <button
              type="button"
              onClick={sendLink}
              disabled={sending || verifying}
              className="slj-muted font-sans text-sm underline underline-offset-4 hover:text-[var(--slj-text)] disabled:opacity-50"
            >
              {sending ? "Sending..." : "Resend email"}
            </button>
          </div>
        </div>
      ) : (
        <button type="submit" className="slj-button w-full px-3 py-2.5 text-sm" disabled={sending}>
          {sending ? "Sending..." : "Send sign-in email"}
        </button>
      )}
    </form>
  );
}
