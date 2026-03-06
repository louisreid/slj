import { redirect } from "next/navigation";
import {
  getChapter,
  getChapterDisplayTitleMap,
  getChapters,
  getBlocks,
  getSections,
} from "@/lib/content";
import { CourseReader } from "@/components/CourseReader";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  const chapter = getChapter(chapterId);
  if (!chapter) {
    // Old or invalid chapter (e.g. 01-intro after reorg) → send to course start
    redirect("/course");
  }

  const sections = getSections(chapter);
  const blocks = getBlocks(chapter);
  const blockIds = blocks.map((b) => b.block_id);
  const blockIdToLabel = Object.fromEntries(
    blocks.map((b) => [b.block_id, b.content.slice(0, 40)])
  );

  const chapters = getChapters();
  const chapterTitles = getChapterDisplayTitleMap(chapters);
  const currentIndex = chapters.findIndex((ch) => ch.id === chapter.id);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex >= 0 && currentIndex < chapters.length - 1
      ? chapters[currentIndex + 1]
      : null;

  return (
    <CourseReader
      chapterId={chapter.id}
      chapter={chapter}
      displayTitle={chapterTitles.get(chapter.id) ?? chapter.title}
      sections={sections}
      blockIds={blockIds}
      blockIdToLabel={blockIdToLabel}
      prevChapter={
        prevChapter
          ? {
              id: prevChapter.id,
              title: chapterTitles.get(prevChapter.id) ?? prevChapter.title,
            }
          : null
      }
      nextChapter={
        nextChapter
          ? {
              id: nextChapter.id,
              title: chapterTitles.get(nextChapter.id) ?? nextChapter.title,
            }
          : null
      }
    />
  );
}
