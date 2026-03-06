import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PreferencesForm } from "./PreferencesForm";
import { EmailChangeForm } from "./EmailChangeForm";
import { PageShell } from "@/components/ui/surfaces";

export default async function PreferencesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?next=/preferences");
  }

  return (
    <PageShell className="space-y-8 max-w-xl">
      <div>
        <h1 className="font-sans text-xl font-semibold text-white">
          Account
        </h1>
        <p className="mt-1 font-sans text-sm text-white/60">
          Manage your account and preferences.
        </p>
      </div>

      <section className="slj-card p-4">
        <h2 className="font-sans text-sm font-medium text-white mb-2">
          Email
        </h2>
        <p className="font-sans text-sm text-white/80 mb-4">{user.email}</p>
        <EmailChangeForm />
      </section>

      <section className="slj-card p-4 border-red-900/30">
        <h2 className="font-sans text-sm font-medium text-white mb-2">
          Delete account
        </h2>
        <p className="font-sans text-sm text-white/70 mb-4">
          Permanently delete your account and all associated data (notes,
          progress, group memberships). This cannot be undone.
        </p>
        <PreferencesForm userEmail={user.email ?? ""} />
      </section>
    </PageShell>
  );
}
