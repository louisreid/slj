/** PostgREST: relation not in schema cache (table missing or not exposed). */
export function isMissingChapterProgressTable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: string; message?: string };
  return (
    e.code === "PGRST205" ||
    (typeof e.message === "string" &&
      e.message.includes("chapter_progress") &&
      e.message.includes("schema cache"))
  );
}

export function progressErrorMessage(error: unknown): string {
  if (isMissingChapterProgressTable(error)) {
    return "Progress tracking is not set up on the database yet (missing chapter_progress table).";
  }
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message?: string }).message;
    if (typeof msg === "string" && msg.length > 0) return msg;
  }
  return "Could not save completion. Try again.";
}
