import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="font-sans">
      <h1 className="text-2xl font-semibold text-[#000]">
        Simplicity, Love & Justice
      </h1>
      <p className="mt-2 text-[rgba(0,0,0,0.65)]">A discussion course.</p>
      <p className="mt-4">
        <Link
          href="/course"
          className="text-[#000] underline hover:no-underline font-medium"
        >
          Start course
        </Link>
      </p>
      <nav className="mt-6 flex items-center gap-4 text-sm">
        {user ? (
          <>
            <span className="text-[rgba(0,0,0,0.65)]">{user.email}</span>
            <form action="/auth/sign-out" method="post">
              <button
                type="submit"
                className="text-[rgba(0,0,0,0.65)] hover:text-[#000] underline"
              >
                Sign out
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/auth/sign-in"
            className="text-[rgba(0,0,0,0.65)] hover:text-[#000] underline"
          >
            Sign in
          </Link>
        )}
      </nav>
    </div>
  );
}
