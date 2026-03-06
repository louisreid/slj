import { createClient } from "@/lib/supabase/server";
import { AppNav } from "@/components/AppNav";

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
    <div className="flex min-h-screen bg-white text-black">
      <AppNav userEmail={user?.email} />
      <main className="min-w-0 flex-1 px-4 pb-6 pt-16 md:px-8 md:py-8 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  );
}
