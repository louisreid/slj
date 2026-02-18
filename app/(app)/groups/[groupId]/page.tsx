import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchGroup } from "@/lib/groups";
import { CopyInviteLinkClient } from "@/components/CopyInviteLinkClient";
import { GroupSharedNotesEditor } from "@/components/GroupSharedNotesEditor";

function formatStartDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr + "Z");
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const group = await fetchGroup(supabase, groupId);
  if (!group) {
    redirect("/groups");
  }

  return (
    <div className="font-sans space-y-6">
      <p className="text-sm text-[rgba(0,0,0,0.65)]">
        <Link href="/groups" className="underline hover:text-[#000]">
          ← Groups
        </Link>
      </p>
      <h1 className="text-2xl font-semibold text-[#000]">{group.name}</h1>
      <p className="text-[rgba(0,0,0,0.65)]">
        <span className="font-medium text-[#000]">Start date:</span>{" "}
        {formatStartDate(group.start_date)}
      </p>
      <p className="text-sm text-[rgba(0,0,0,0.65)]">
        Invite link:{" "}
        <Link
          href={`/groups/join?code=${encodeURIComponent(group.invite_code)}`}
          className="underline break-all"
        >
          /groups/join?code={group.invite_code}
        </Link>
        {" — "}
        <CopyInviteLinkClient code={group.invite_code} />
      </p>
      <GroupSharedNotesEditor
        groupId={group.id}
        initialValue={group.shared_notes}
      />
    </div>
  );
}
