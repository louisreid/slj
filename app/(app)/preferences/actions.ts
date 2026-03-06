"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function deleteAccount(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const confirmEmail = formData.get("confirmEmail");
  if (typeof confirmEmail !== "string") {
    return { error: "Email confirmation is required." };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to delete your account." };
  }

  if (confirmEmail.trim().toLowerCase() !== (user.email ?? "").toLowerCase()) {
    return {
      error: "Email does not match. Type your email exactly to confirm.",
    };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return {
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Could not delete account. Please try again.",
    };
  }

  await supabase.auth.signOut();
  redirect("/");
}
