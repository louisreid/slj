import { redirect } from "next/navigation";
import { getLastReadPosition } from "@/lib/progress-actions";
import { getChapters, getChapter } from "@/lib/content";

export default async function CoursePage() {
  const position = await getLastReadPosition();
  const chapters = getChapters();
  const firstChapterId = chapters[0]?.id;

  if (!firstChapterId) redirect("/");

  // Only use saved position if that chapter still exists (handles content reorg)
  if (position && getChapter(position.chapterId)) {
    redirect(`/course/${position.chapterId}#${position.blockId}`);
  }
  redirect(`/course/${firstChapterId}`);
}
