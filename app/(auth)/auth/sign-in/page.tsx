import { redirect } from "next/navigation";
import { SignInForm } from "@/components/SignInForm";
import { sanitizeReturnTo } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{
    returnTo?: string | string[];
    error?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const returnTo = sanitizeReturnTo(params.returnTo);
  const authError =
    params.error === "auth"
      ? "That sign-in link was invalid or expired. Enter your email below and we will send a fresh magic link."
      : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(returnTo);
  }

  return (
    <main className="min-h-screen bg-[var(--slj-bg)] px-6 py-10 text-[var(--slj-text)] md:px-10 md:py-14">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-md border border-[var(--slj-border)] bg-[var(--slj-surface)] p-8 md:p-10">
          <p className="slj-faint font-sans text-xs uppercase tracking-[0.18em]">
            Sign in
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-none">
            Simplicity, Love & Justice
          </h1>
          <p className="slj-muted mt-4 font-sans text-sm leading-6">
            Enter your email. We&apos;ll send a sign-in link and a one-time code you can paste here if
            the link does not open.
          </p>
          <div className="mt-6">
            <SignInForm returnTo={returnTo} initialError={authError} />
          </div>
        </div>
      </div>
    </main>
  );
}
