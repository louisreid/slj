import { createClient } from "@/lib/supabase/server";
import { AppNav } from "@/components/AppNav";
import { ContentRevisionPoller } from "@/components/dev/ContentRevisionPoller";
import { ReturnToReadingButton } from "@/components/ReturnToReadingButton";
import { ScrollReturnManager } from "@/components/ScrollReturnManager";
import { buildNavChapters } from "@/lib/nav-chapters";

export default async function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const navChapters = buildNavChapters();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--slj-bg)] text-[var(--slj-text)]">
      {process.env.NODE_ENV === "development" ? <ContentRevisionPoller /> : null}
      <ScrollReturnManager />
      <ReturnToReadingButton />
      <AppNav userEmail={user?.email} chapters={navChapters} />
      <main
        id="app-main-scroll"
        className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 pb-6 pt-16 md:px-8 md:py-8 lg:px-10 lg:py-10"
      >
        {children}
      </main>
    </div>
  );
}
