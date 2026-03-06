import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { JoinGroupByCode } from "@/components/JoinGroupByCode";
import { PageShell } from "@/components/ui/surfaces";

export default async function GroupJoinPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  if (!code?.trim()) {
    redirect("/groups");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const signInUrl = `/auth/sign-in?next=${encodeURIComponent(`/groups/join?code=${encodeURIComponent(code)}`)}`;
    return (
      <PageShell>
        <h1 className="text-3xl font-semibold text-[#fff] font-serif">Join group</h1>
        <p className="mt-2 text-white/70">
          <Link href={signInUrl} className="underline hover:text-white">
            Sign in
          </Link>{" "}
          to join this group with the invite code.
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold text-[#fff] font-serif">Join group</h1>
      <JoinGroupByCode code={code} />
    </PageShell>
  );
}
