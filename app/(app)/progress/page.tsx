import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { buildSignInHref } from "@/lib/navigation";

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(buildSignInHref("/progress"));
  }

  return <ProgressDashboard variant="progress" />;
}
