"use client";

import { useActionState } from "react";
import { updateEmail } from "./actions";

export function EmailChangeForm() {
  const [state, formAction, isPending] = useActionState(updateEmail, null);

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label
          htmlFor="newEmail"
          className="block text-sm text-white/70 mb-1"
        >
          Change email address
        </label>
        <input
          id="newEmail"
          name="newEmail"
          type="email"
          placeholder="new@email.com"
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
      {state?.success && (
        <p className="text-sm text-green-400" role="status">
          {state.success}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="slj-button px-4 py-2 text-sm"
      >
        {isPending ? "Sending…" : "Send confirmation email"}
      </button>
    </form>
  );
}
