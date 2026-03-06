import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sanitizeReturnTo } from "@/lib/navigation";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const returnTo = sanitizeReturnTo(searchParams.get("returnTo"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${returnTo}`);
    }
  }

  const redirectUrl = new URL("/auth/sign-in", origin);
  redirectUrl.searchParams.set("error", "auth");
  redirectUrl.searchParams.set("returnTo", returnTo);
  return NextResponse.redirect(redirectUrl);
}
