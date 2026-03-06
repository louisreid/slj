import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchGroup } from "@/lib/groups";
import { CopyInviteLinkClient } from "@/components/CopyInviteLinkClient";
import { GroupSharedNotesEditor } from "@/components/GroupSharedNotesEditor";
import { CardSection, PageShell } from "@/components/ui/surfaces";
import { buildSignInHref } from "@/lib/navigation";

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
    redirect(buildSignInHref(`/groups/${groupId}`));
  }

  const group = await fetchGroup(supabase, groupId);
  if (!group) {
    redirect("/groups");
  }

  return (
    <PageShell className="space-y-6">
      <p className="font-sans text-sm text-black/65">
        <Link href="/groups" className="underline underline-offset-4 hover:text-black">
          ← Groups
        </Link>
      </p>
      <h1 className="font-serif text-4xl font-semibold leading-none text-black">
        {group.name}
      </h1>
      <p className="font-sans text-sm leading-6 text-black/65">
        <span className="font-medium text-black">Start date:</span>{" "}
        {formatStartDate(group.start_date)}
      </p>
      <p className="font-sans text-sm leading-6 text-black/65">
        Invite link:{" "}
        <Link
          href={`/groups/join?code=${encodeURIComponent(group.invite_code)}`}
          className="break-all underline underline-offset-4 hover:text-black"
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
