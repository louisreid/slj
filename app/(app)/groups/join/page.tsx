import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { JoinGroupByCode } from "@/components/JoinGroupByCode";

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
      <div className="font-sans">
        <h1 className="text-2xl font-semibold text-[#000]">Join group</h1>
        <p className="mt-2 text-[rgba(0,0,0,0.65)]">
          <Link href={signInUrl} className="underline hover:text-[#000]">
            Sign in
          </Link>{" "}
          to join this group with the invite code.
        </p>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <h1 className="text-2xl font-semibold text-[#000]">Join group</h1>
      <JoinGroupByCode code={code} />
    </div>
  );
}
