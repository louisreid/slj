import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getChapters, getSections } from "@/lib/content";
import { getLastReadPosition } from "@/lib/progress-actions";
import type { Section } from "@/lib/content";

function getSectionId(section: Section): string | undefined {
  return section.blocks[0]?.block_id;
}

function firstHeadingContent(section: Section): string {
  const heading = section.blocks.find((b) => b.type === "heading");
  return heading?.content ?? "Section";
}

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="font-sans">
        <h1 className="text-2xl font-semibold text-[#000]">Progress</h1>
        <p className="mt-2 text-[rgba(0,0,0,0.65)]">
          Sign in to view your progress.
        </p>
      </div>
    );
  }

  const { data: progressRows } = await supabase
    .from("progress")
    .select("section_id, completed_at")
    .eq("user_id", user.id);

  const completedBySection = new Map<string, boolean>();
  for (const row of progressRows ?? []) {
    if (row.completed_at != null) {
      completedBySection.set(row.section_id, true);
    }
  }

  const lastRead = await getLastReadPosition();
  const chapters = getChapters();

  return (
    <div className="font-sans">
      <h1 className="text-2xl font-semibold text-[#000]">Progress</h1>

      {lastRead && (
        <p className="mt-4">
          <Link
            href={`/course/${lastRead.chapterId}#${lastRead.blockId}`}
            className="text-[rgba(0,0,0,0.65)] hover:text-[#000] underline"
          >
            Resume reading
          </Link>
        </p>
      )}

      <div className="mt-8 space-y-6">
        {chapters.map((chapter) => {
          const sections = getSections(chapter);
          return (
            <section key={chapter.id}>
              <h2 className="font-serif text-xl font-semibold text-[#000]">
                {chapter.title}
              </h2>
              <ul className="mt-2 space-y-1 text-sm">
                {sections.map((section) => {
                  const sectionId = getSectionId(section);
                  if (!sectionId) return null;
                  const completed = completedBySection.get(sectionId);
                  return (
                    <li
                      key={sectionId}
                      className="flex items-center gap-2 text-[rgba(0,0,0,0.65)]"
                    >
                      <span
                        className={
                          completed
                            ? "text-[#000]"
                            : "text-[rgba(0,0,0,0.65)]"
                        }
                      >
                        {firstHeadingContent(section)}
                      </span>
                      {completed && (
                        <span className="text-[rgba(0,0,0,0.45)]">
                          Complete
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
