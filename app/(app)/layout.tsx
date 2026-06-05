import { createClient } from "@/lib/supabase/server";
import { AppNav } from "@/components/AppNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ContentRevisionPoller } from "@/components/dev/ContentRevisionPoller";

export default async function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--slj-bg)] text-[var(--slj-text)]">
      {process.env.NODE_ENV === "development" ? <ContentRevisionPoller /> : null}
      <AppNav userEmail={user?.email} />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-4 pb-6 pt-16 md:px-8 md:py-8 lg:px-10 lg:py-10">
        <div className="min-h-0 flex-1">{children}</div>
        <SiteFooter className="mt-10 shrink-0" />
      </main>
    </div>
  );
}
