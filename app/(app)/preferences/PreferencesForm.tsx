"use client";

import { useActionState } from "react";
import { deleteAccount } from "./actions";

export function PreferencesForm({ userEmail }: { userEmail: string }) {
  const [state, formAction, isPending] = useActionState(deleteAccount, null);

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label
          htmlFor="confirm-email"
          className="block text-sm text-white/70 mb-1"
        >
          Type your email to confirm: {userEmail}
        </label>
        <input
          id="confirm-email"
          name="confirmEmail"
          type="email"
          placeholder="your@email.com"
          required
          className="slj-input w-full max-w-sm px-3 py-2.5"
          disabled={isPending}
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="slj-button px-4 py-2 text-sm bg-red-900/40 border-red-700/50 hover:bg-red-900/60"
      >
        {isPending ? "Deleting…" : "Delete my account"}
      </button>
    </form>
  );
}
