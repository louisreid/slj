import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AppNav } from "@/components/AppNav";
import { ProgressDashboard } from "@/app/(app)/progress/page";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <div className="flex min-h-screen bg-white text-black">
        <AppNav userEmail={user.email} />
        <main className="min-w-0 flex-1 px-4 pb-6 pt-16 md:px-8 md:py-8 lg:px-10 lg:py-10">
          {/* Authenticated home: progress dashboard */}
          <ProgressDashboard />
        </main>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black md:px-10 md:py-14">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center">
        <section className="w-full max-w-2xl border border-[#E5E7EB] bg-white p-8 md:p-12">
          <p className="font-sans text-xs uppercase tracking-[0.18em] text-black/45">
            A Discussion Course
          </p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-none text-black md:text-7xl">
            Simplicity, Love & Justice
          </h1>
          <p className="mt-6 max-w-xl font-serif text-2xl leading-tight text-black/65 md:text-3xl">
            Read slowly, reflect honestly, and keep your notes close at hand.
          </p>
          <p className="mt-3 max-w-lg font-sans text-sm leading-6 text-black/65">
            A quiet reading space for the course, your private notes, and the
            shared rhythm of group conversation.
          </p>
          <div className="mt-8">
            <Link href="/auth/sign-in" className="slj-button inline-flex px-5 py-3 text-sm">
              Sign in
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
