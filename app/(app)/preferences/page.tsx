import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { buildSignInHref } from "@/lib/navigation";
import { PreferencesForm } from "./PreferencesForm";
import { EmailChangeForm } from "./EmailChangeForm";
import { PageShell } from "@/components/ui/surfaces";
import { ThemeToggle } from "./ThemeToggle";

export default async function PreferencesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(buildSignInHref("/preferences"));
  }

  return (
    <PageShell className="space-y-8 max-w-xl">
      <div>
        <p className="slj-faint font-sans text-xs uppercase tracking-[0.18em]">
          Account
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-none text-[var(--slj-text)]">
          Account
        </h1>
        <p className="slj-muted mt-3 font-sans text-sm leading-6">
          Manage your account and preferences.
        </p>
      </div>

      <section className="slj-card p-4">
        <h2 className="mb-2 font-sans text-sm font-medium text-[var(--slj-text)]">
          Appearance
        </h2>
        <p className="slj-muted mb-4 font-sans text-sm leading-6">
          Choose between light and dark mode. This applies to this device only.
        </p>
        <ThemeToggle />
      </section>

      <section className="slj-card p-4">
        <h2 className="mb-2 font-sans text-sm font-medium text-[var(--slj-text)]">
          Email
        </h2>
        <p className="slj-muted mb-4 font-sans text-sm">{user.email}</p>
        <EmailChangeForm />
      </section>

      <section className="slj-card p-4">
        <h2 className="mb-2 font-sans text-sm font-medium text-[var(--slj-text)]">
          Delete account
        </h2>
        <p className="slj-muted mb-4 font-sans text-sm leading-6">
          Permanently delete your account and all associated data (notes,
          progress, group memberships). This cannot be undone.
        </p>
        <PreferencesForm userEmail={user.email ?? ""} />
      </section>
    </PageShell>
  );
}
