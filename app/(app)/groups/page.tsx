import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GroupsListContent } from "@/components/GroupsListContent";
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
      <div className="font-sans">
        <h1 className="text-2xl font-semibold text-[#000]">Groups</h1>
        <p className="mt-2 text-[rgba(0,0,0,0.65)]">
          <Link href="/auth/sign-in" className="underline hover:text-[#000]">
            Sign in
          </Link>{" "}
          to view and create groups.
        </p>
      </div>
    );
  }

  return <GroupsListContent groups={groups} />;
}
