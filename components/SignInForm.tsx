 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignInForm({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode() {
    setError(null);
    setSending(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
    });

    setSending(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSent(true);
  }

  async function verifyCode() {
    setError(null);
    setVerifying(true);

    const trimmedCode = code.trim();

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: trimmedCode,
      type: "email",
    });

    setVerifying(false);

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    router.replace(returnTo);
    router.refresh();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!sent) {
      await sendCode();
      return;
    }

    await verifyCode();
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
          disabled={sending || sent || verifying}
          className="slj-input w-full px-3 py-2.5 text-sm"
        />
      </div>

      {error ? (
        <p className="font-sans text-sm text-[var(--slj-text)]" role="alert">
          {error}
        </p>
      ) : null}

      {sent ? (
        <div className="space-y-3">
          <div>
            <label htmlFor="code" className="slj-muted mb-1.5 block font-sans text-sm">
              Sign-in code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => {
                const digitsOnly = event.target.value.replace(/\D/g, "");
                setCode(digitsOnly);
              }}
              required
              disabled={verifying}
              className="slj-input w-full px-3 py-2.5 text-sm"
            />
          </div>

          <p className="slj-muted font-sans text-sm leading-6">
            Check <span className="font-medium text-[var(--slj-text)]">{email}</span> for a sign-in code
            to continue.
          </p>

          <button
            type="submit"
            className="slj-button w-full px-3 py-2.5 text-sm"
            disabled={verifying || sending}
          >
            {verifying ? "Verifying..." : "Continue"}
          </button>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setCode("");
                setError(null);
              }}
              className="slj-muted font-sans text-sm underline underline-offset-4 hover:text-[var(--slj-text)]"
            >
              Use a different email
            </button>
            <button
              type="button"
              onClick={sendCode}
              disabled={sending || verifying}
              className="slj-muted font-sans text-sm underline underline-offset-4 hover:text-[var(--slj-text)]"
            >
              {sending ? "Sending sign-in code..." : "Send again"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="submit"
          className="slj-button w-full px-3 py-2.5 text-sm"
          disabled={sending}
        >
          {sending ? "Sending sign-in code..." : "Send sign-in code"}
        </button>
      )}
    </form>
  );
}
