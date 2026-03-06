import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="slj-shell p-6 md:p-10">
      <div className="font-serif max-w-3xl">
        <p className="slj-faint text-xs uppercase tracking-[0.16em] font-sans">
          Discussion Course
        </p>
        <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-[#fff] leading-tight">
          Simplicity, Love & Justice
        </h1>
        <p className="mt-4 text-lg slj-muted">
          A guided reading experience for conversation, reflection, and shared
          practice.
        </p>
        <p className="mt-8">
          <Link
            href={user ? "/course" : "/auth/sign-in"}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white px-4 py-2 text-black font-semibold hover:bg-white/90 transition-colors"
          >
            {user ? "Go to course" : "Create account"} <span>→</span>
          </Link>
        </p>
      </div>
      <nav className="mt-8 flex items-center gap-4 text-sm font-sans slj-muted">
        {user ? (
          <>
            <span>{user.email}</span>
            <form action="/auth/sign-out" method="post">
              <button
                type="submit"
                className="hover:text-white underline underline-offset-2"
              >
                Sign out
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/auth/sign-in"
            className="hover:text-white underline underline-offset-2"
          >
            Sign in
          </Link>
        )}
      </nav>
    </div>
  );
}
