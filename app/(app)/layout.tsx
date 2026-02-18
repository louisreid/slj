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
    <div className="flex min-h-screen bg-[#fff]">
      <AppNav userEmail={user?.email} />
      <main className="flex-1 min-w-0 pt-14 md:pt-0 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
