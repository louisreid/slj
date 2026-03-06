import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GroupsListContent } from "@/components/GroupsListContent";
import { PageShell } from "@/components/ui/surfaces";
import type { Group } from "@/lib/groups";

export default async function GroupsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let groups: Group[] = [];
  if (user) {
    const { data: memberships, error: memError } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", user.id);
    if (!memError && memberships?.length) {
      const groupIds = memberships.map((m) => m.group_id);
      const { data: groupRows, error: groupsError } = await supabase
        .from("groups")
        .select("*")
        .in("id", groupIds)
        .order("name");
      if (!groupsError) groups = (groupRows ?? []) as Group[];
    }
  }

  if (!user) {
    return (
      <PageShell>
        <h1 className="text-3xl font-semibold text-[#fff] font-serif">Groups</h1>
        <p className="mt-2 text-white/70">
          <Link href="/auth/sign-in" className="underline hover:text-white">
            Sign in
          </Link>{" "}
          to view and create groups.
        </p>
      </PageShell>
    );
  }

  return <GroupsListContent groups={groups} />;
}
