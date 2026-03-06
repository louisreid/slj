import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GroupsListContent } from "@/components/GroupsListContent";
import type { Group } from "@/lib/groups";
import { buildSignInHref } from "@/lib/navigation";

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
    redirect(buildSignInHref("/groups"));
  }

  return <GroupsListContent groups={groups} />;
}
