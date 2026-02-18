import { getChapter, getChapters, getBlocks, getSections } from "@/lib/content";
import { CourseReader } from "@/components/CourseReader";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  const chapter = getChapter(chapterId);
  if (!chapter) {
    return (
      <div className="font-sans text-[#000]">
        <p>Chapter not found.</p>
      </div>
    );
  }

  const sections = getSections(chapter);
  const blocks = getBlocks(chapter);
  const blockIds = blocks.map((b) => b.block_id);
  const blockIdToLabel = Object.fromEntries(
    blocks.map((b) => [b.block_id, b.content.slice(0, 40)])
  );

  const chapters = getChapters();
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
      sections={sections}
      blockIds={blockIds}
      blockIdToLabel={blockIdToLabel}
      prevChapter={prevChapter ? { id: prevChapter.id, title: prevChapter.title } : null}
      nextChapter={nextChapter ? { id: nextChapter.id, title: nextChapter.title } : null}
    />
  );
}
