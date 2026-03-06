"use client";

import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SignInForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-[#0B0B0B]">
        <div className="slj-shell w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-semibold text-white">Check your email</h1>
          <p className="mt-3 slj-muted">
            We sent a sign-in link to <strong>{email}</strong>. Click the link to
            sign in.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#0B0B0B]">
      <div className="slj-shell w-full max-w-md p-8">
        <p className="text-xs uppercase tracking-[0.16em] slj-faint">Welcome</p>
        <h1 className="mt-3 text-3xl font-semibold text-white font-serif">Sign in</h1>
        <p className="mt-2 slj-muted text-sm">
          Enter your email and we’ll send you a magic link.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            />
          </div>
          {error && (
            <p className="text-sm text-white" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="slj-button w-full px-3 py-2.5 text-sm"
          >
            Send magic link
          </button>
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
