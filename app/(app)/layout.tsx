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
    <div className="flex min-h-screen bg-[#0B0B0B] text-[#fff]">
      <AppNav userEmail={user?.email} />
      <main className="flex-1 min-w-0 pt-16 md:pt-0 p-4 md:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
