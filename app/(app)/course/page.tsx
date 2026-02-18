import { redirect } from "next/navigation";
import { getLastReadPosition } from "@/lib/progress-actions";
import { getChapters } from "@/lib/content";

export default async function CoursePage() {
  const position = await getLastReadPosition();
  const chapters = getChapters();
  const firstChapterId = chapters[0]?.id ?? "01-intro";

  if (position) {
    redirect(`/course/${position.chapterId}#${position.blockId}`);
  }
  redirect(`/course/${firstChapterId}`);
}
