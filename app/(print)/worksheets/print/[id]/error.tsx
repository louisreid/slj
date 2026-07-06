"use client";

export default function WorksheetPrintError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-white p-8 font-sans text-black">
      <h1 className="text-xl font-semibold">Worksheet could not load</h1>
      <p className="mt-4 text-sm text-neutral-600">
        Something went wrong opening this worksheet. You can try again or return
        to the course.
      </p>
      {process.env.NODE_ENV === "development" ? (
        <pre className="mt-4 overflow-auto rounded border p-3 text-xs">
          {error.message}
        </pre>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="mt-6 border border-black px-4 py-2 text-sm"
      >
        Try again
      </button>
    </div>
  );
}
