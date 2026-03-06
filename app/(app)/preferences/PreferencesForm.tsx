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
          className="mb-1 block text-sm text-black/65"
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
        <p className="text-sm text-black" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="slj-button-secondary px-4 py-2 text-sm"
      >
        {isPending ? "Deleting…" : "Delete my account"}
      </button>
    </form>
  );
}
