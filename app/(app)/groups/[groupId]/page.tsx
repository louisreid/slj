import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchGroup } from "@/lib/groups";
import { CopyInviteLinkClient } from "@/components/CopyInviteLinkClient";
import { GroupSharedNotesEditor } from "@/components/GroupSharedNotesEditor";
import { CardSection, PageShell } from "@/components/ui/surfaces";

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
    <PageShell className="space-y-6">
      <p className="text-sm text-white/70">
        <Link href="/groups" className="underline hover:text-white">
          ← Groups
        </Link>
      </p>
      <h1 className="text-3xl font-semibold text-white font-serif">{group.name}</h1>
      <p className="text-white/70">
        <span className="font-medium text-white">Start date:</span>{" "}
        {formatStartDate(group.start_date)}
      </p>
      <p className="text-sm text-white/70">
        Invite link:{" "}
        <Link
          href={`/groups/join?code=${encodeURIComponent(group.invite_code)}`}
          className="underline break-all hover:text-white"
        >
          /groups/join?code={group.invite_code}
        </Link>
        {" — "}
        <CopyInviteLinkClient code={group.invite_code} />
      </p>
      <CardSection>
        <GroupSharedNotesEditor
          groupId={group.id}
          initialValue={group.shared_notes}
        />
      </CardSection>
    </PageShell>
  );
}
