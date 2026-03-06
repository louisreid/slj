"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams?.get("next") ?? "/";
  const authError =
    searchParams?.get("error") === "auth"
      ? "That sign-in link could not be used. Request a fresh sign-in code below."
      : null;
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendCode() {
    setError(null);
    setSending(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
    });
    setSending(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setVerifying(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: "email",
    });
    setVerifying(false);
    if (err) {
      setError(err.message);
      return;
    }

    router.replace(next);
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#0B0B0B]">
      <div className="slj-shell w-full max-w-md p-8">
        <p className="text-xs uppercase tracking-[0.16em] slj-faint">Welcome</p>
        <h1 className="mt-3 text-3xl font-semibold text-white font-serif">Sign in</h1>
        <p className="mt-2 slj-muted text-sm">
          Enter your email and we’ll send you a sign-in code.
        </p>
        <form
          onSubmit={sent ? handleVerifyCode : (e) => {
            e.preventDefault();
            void handleSendCode();
          }}
          className="mt-6 space-y-4"
        >
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="slj-input w-full px-3 py-2.5 text-sm"
              disabled={sent}
            />
          </div>
          {sent && (
            <div>
              <label htmlFor="code" className="sr-only">
                Sign-in code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your code"
                required
                autoComplete="one-time-code"
                className="slj-input w-full px-3 py-2.5 text-sm"
              />
              <p className="mt-2 text-sm slj-muted">
                We sent a one-time code to <strong>{email}</strong>.
              </p>
            </div>
          )}
          {error && (
            <p className="text-sm text-white" role="alert">
              {error}
            </p>
          )}
          {!error && authError && (
            <p className="text-sm text-white" role="alert">
              {authError}
            </p>
          )}
          <button
            type="submit"
            className="slj-button w-full px-3 py-2.5 text-sm"
            disabled={sending || verifying}
          >
            {sent ? (verifying ? "Signing in..." : "Sign in") : sending ? "Sending code..." : "Send sign-in code"}
          </button>
          {sent && (
            <div className="flex items-center justify-between gap-3 text-sm">
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setCode("");
                  setError(null);
                }}
                className="slj-muted hover:text-white underline underline-offset-2"
              >
                Use a different email
              </button>
              <button
                type="button"
                onClick={() => void handleSendCode()}
                className="slj-muted hover:text-white underline underline-offset-2"
                disabled={sending || verifying}
              >
                Resend code
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center p-4">
          <p className="slj-muted">Loading…</p>
        </main>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
